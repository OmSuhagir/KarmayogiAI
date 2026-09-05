import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import User from "../models/User.js";
import SkillGap from "../models/SkillGap.js";
import Recommendation from "../models/Recommendation.js";
import LearningProgress from "../models/LearningProgress.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const API_KEY = process.env.GEMINI_API_KEY;
// gemini-3.7-flash and gemini-3.5-flash-lite are official current models
const MODEL = process.env.GEMINI_MODEL || "gemini-3.7-flash";

/**
 * Gather complete real-time competency context for an employee
 */
export const getUserCompanionContext = async (userId) => {
  try {
    if (!userId) return null;

    const user = await User.findById(userId)
      .populate("departmentId")
      .populate("positionId")
      .populate("roleId")
      .populate("competencyProfile.competencyId");

    if (!user) return null;

    const [skillGaps, recommendations, learningProgress, recentAttempts] = await Promise.all([
      SkillGap.find({ userId, status: { $ne: "resolved" } })
        .populate("competencyId")
        .sort({ gap: -1, priority: -1 })
        .limit(6),
      Recommendation.find({ userId })
        .populate("recommendations.resourceId")
        .populate({
          path: "gapId",
          populate: { path: "competencyId" }
        })
        .limit(3),
      LearningProgress.find({ userId })
        .populate("resourceId")
        .limit(5),
      AssessmentAttempt.find({ userId })
        .populate("assessmentId")
        .sort({ createdAt: -1 })
        .limit(3)
    ]);

    // Flatten recommendations
    const topRecommendations = [];
    recommendations.forEach((recDoc) => {
      if (recDoc.recommendations && Array.isArray(recDoc.recommendations)) {
        recDoc.recommendations.forEach((r) => {
          if (r.resourceId) {
            topRecommendations.push({
              title: r.resourceId.title,
              provider: r.resourceId.provider,
              type: r.resourceId.type,
              estimatedHours: r.resourceId.estimatedHours,
              forGap: recDoc.gapId?.competencyId?.name || "General Capacity"
            });
          }
        });
      }
    });

    return {
      name: user.name,
      email: user.email,
      department: user.departmentId?.name || user.departmentId?.shortName || "Government Department",
      position: user.positionId?.title || "Officer",
      role: user.roleId?.name || user.role,
      competencies: (user.competencyProfile || []).map((cp) => ({
        name: cp.competencyId?.name || "Competency",
        level: cp.currentLevel,
        lastAssessed: cp.lastAssessedAt
      })),
      skillGaps: skillGaps.map((sg) => ({
        competency: sg.competencyId?.name || "Skill",
        category: sg.competencyId?.category || "functional",
        currentLevel: sg.currentLevel,
        requiredLevel: sg.requiredLevel,
        gap: sg.gap,
        priority: sg.priority,
        status: sg.status
      })),
      topRecommendations: topRecommendations.slice(0, 5),
      learningProgress: learningProgress.map((lp) => ({
        title: lp.resourceId?.title || "Module",
        status: lp.status,
        progressPercent: lp.progressPercentage || 0
      })),
      recentAssessments: recentAttempts.map((att) => ({
        title: att.assessmentId?.title || "Role Competency Assessment",
        status: att.status,
        score: att.scorePercentage,
        passed: att.passed,
        completedAt: att.completedAt
      }))
    };
  } catch (err) {
    console.error("Error building companion context:", err.message);
    return null;
  }
};

/**
 * Intelligent local fallback responder if Gemini API key is missing or encounters issues
 */
const generateIntelligentFallback = (userMessage, context) => {
  const query = (userMessage || "").toLowerCase();
  const name = context?.name || "Officer";
  const position = context?.position || "Statistical Officer";
  const gaps = context?.skillGaps || [];
  const courses = context?.topRecommendations || [];
  const recents = context?.recentAssessments || [];

  if (query.includes("gap") || query.includes("weak") || query.includes("priority")) {
    if (gaps.length === 0) {
      return `Hello ${name}! Great news—you currently have **no open competency gaps** recorded in your profile. You meet all benchmark requirements for your role as **${position}**. I suggest taking an advanced domain assessment or enrolling in forward-looking modules to prepare for senior responsibilities!`;
    }
    const gapList = gaps
      .map(
        (g, i) =>
          `${i + 1}. **${g.competency}** (${g.priority.toUpperCase()} Priority) — Current: **Level ${g.currentLevel}**, Target: **Level ${g.requiredLevel}** (Gap: ${g.gap} level${g.gap > 1 ? "s" : ""})`
      )
      .join("\n");
    return `Hello ${name}, here is your current **Skill Gap Breakdown** as **${position}**:\n\n${gapList}\n\n💡 **Sathi's Recommendation:** Focus first on your high-priority functional gaps. Would you like me to suggest specific courses or run a quick practice quiz to help bridge them?`;
  }

  if (query.includes("course") || query.includes("recommend") || query.includes("learn") || query.includes("study") || query.includes("schedule")) {
    if (courses.length === 0) {
      return `Hello ${name}! Based on your role as **${position}**, I recommend exploring our **Learning Hub** for foundational modules in **Data Governance**, **Official Statistics**, and **Evidence-Based Policy Formulation**. If you take your pending role assessments, I will automatically match courses to your targeted gaps!`;
    }
    const courseList = courses
      .map(
        (c, i) =>
          `${i + 1}. **${c.title}** (${c.provider || "iGOT Karmayogi"}) — Target Competency: *${c.forGap}* [⏱️ ~${c.estimatedHours || 4} hrs]`
      )
      .join("\n");
    return `Here are the top AI-curated learning resources aligned with your active development needs, ${name}:\n\n${courseList}\n\n🎯 **Recommended Action:** Allocate 30–45 minutes daily to complete the first module. Consistent micro-learning produces the fastest competency upgrades under Mission Karmayogi.`;
  }

  if (query.includes("quiz") || query.includes("practice") || query.includes("question") || query.includes("test")) {
    const topComp = gaps[0]?.competency || "Official Statistics & Sampling";
    return `Here is a quick practice question to test your knowledge in **${topComp}**:\n\n**Question:** In systematic random sampling from a population of size $N=1000$ with a desired sample size $n=50$, what is the sampling interval $k$, and how is the first element selected?\n\n- **A)** $k=20$; first element chosen randomly between 1 and 20\n- **B)** $k=50$; first element is always item 1\n- **C)** $k=25$; first element chosen by senior supervisor\n- **D)** $k=10$; first element chosen by random number between 1 and 10\n\n*Reply with your answer (A, B, C, or D) to check if you got it right!*`;
  }

  if (query.includes("score") || query.includes("assessment") || query.includes("result")) {
    if (recents.length > 0) {
      const recentSummary = recents
        .map(
          (r, i) =>
            `${i + 1}. **${r.title}**: Score **${r.score != null ? r.score + "%" : "Pending"}** (${r.passed ? "Passed ✅" : "Needs Review ⚠️"})`
        )
        .join("\n");
      return `Here is a summary of your recent assessments, ${name}:\n\n${recentSummary}\n\nOur platform uses these assessment attempts to dynamically calibrate your competency profile and identify areas for targeted capacity development.`;
    }
    return `You haven't completed any recent assessments yet, ${name}. Head over to the **Assessments** tab to take your role-benchmark evaluation. Once submitted, I'll analyze your answers and generate an updated competency profile for you!`;
  }

  if (query.includes("career") || query.includes("promotion") || query.includes("next role") || query.includes("advance")) {
    return `To advance from **${position}** to senior cadre positions, you need to elevate your functional competencies to **Level 4 (Advanced)** and leadership competencies to **Level 3 (Competent)**.\n\nKey milestones:\n1. Close your critical gaps in **${gaps[0]?.competency || "Data Analytics"}**.\n2. Complete accredited courses on iGOT Karmayogi.\n3. Achieve at least 80% on periodic competency validation assessments.\n\nKeep up the steady progress! Would you like me to map out a 3-month milestone plan?`;
  }

  return `Hello ${name}! I am **Karmayogi Sathi**, your personal capacity-building and learning companion.\n\nAs a **${position}** at **${context?.department || "MoSPI"}**, you have **${gaps.length} active competency gap${gaps.length === 1 ? "" : "s"}** that we can work on together.\n\nHere are some things you can ask me:\n- *"What are my top skill gaps right now?"*\n- *"Recommend a study plan for this week"*\n- *"Quiz me with a practice question"*\n- *"What competencies do I need for promotion?"*`;
};

/**
 * Handle multi-turn conversation with Gemini using real employee context
 */
export const chatWithCompanion = async ({ userId, message, history = [] }) => {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error("Message text is required");
  }

  const context = await getUserCompanionContext(userId);

  // If no Gemini API key configured, use intelligent profile-aware fallback
  if (!API_KEY) {
    const fallbackText = generateIntelligentFallback(message, context);
    return {
      reply: fallbackText,
      modelUsed: "karmayogi-sathi-offline",
      suggestions: [
        "What are my highest priority skill gaps?",
        "Recommend learning resources for this week",
        "Give me a quick practice question",
        "How can I level up my competencies?"
      ]
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Format context for system instruction
    const contextPrompt = `
You are "Karmayogi Sathi", an intelligent, empathetic, and encouraging personal AI capacity-building companion and career mentor for civil servants and government employees on the Karmayogi Competency Intelligence Platform (Government of India).

YOUR OFFICER'S PROFILE:
- Name: ${context?.name || "Officer"}
- Designation / Position: ${context?.position || "Statistical Officer"}
- Department / Ministry: ${context?.department || "Ministry of Statistics and Programme Implementation (MoSPI)"}
- Role Framework: ${context?.role || "Statistical Analysis and Reporting"}

OFFICER'S CURRENT COMPETENCIES:
${(context?.competencies || []).map((c) => `- ${c.name}: Level ${c.level}`).join("\n") || "No competencies listed"}

ACTIVE SKILL GAPS IDENTIFIED:
${(context?.skillGaps || []).map((g) => `- ${g.competency} (${g.priority} priority): Current Level ${g.currentLevel} vs Required Level ${g.requiredLevel} (Gap: ${g.gap})`).join("\n") || "No open gaps recorded"}

RECOMMENDED LEARNING RESOURCES:
${(context?.topRecommendations || []).map((r) => `- "${r.title}" (${r.provider || "iGOT"}) for ${r.forGap}`).join("\n") || "No specific recommendations"}

RECENT ASSESSMENT RESULTS:
${(context?.recentAssessments || []).map((a) => `- ${a.title}: Score ${a.score != null ? a.score + "%" : "In progress"} (${a.passed ? "Passed" : "Needs improvement"})`).join("\n") || "None"}

GUIDELINES FOR YOUR RESPONSES:
1. Address the officer respectfully and warmly by their first name (${context?.name ? context.name.split(" ")[0] : "Officer"}).
2. Always ground your advice in their actual profile data above. If they ask about skill gaps, courses, or progress, cite their real metrics and competencies.
3. Align with Mission Karmayogi principles (competency-based continuous professional development, FRAC framework, role-based capacity building).
4. Use clean Markdown formatting: bullet points, bold key terms, short paragraphs, and step-by-step roadmaps where helpful.
5. If the user asks for a quiz or practice question, provide a high-quality civil service / technical multiple-choice question relevant to their domain with 4 options (A, B, C, D) and ask them to choose.
6. Keep responses inspiring, practical, concise, and actionable.
`;

    // Construct multi-turn contents
    const contents = [];

    // Append last 6 turns of history for context continuity
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      recentHistory.forEach((h) => {
        if (h.sender === "user" || h.role === "user") {
          contents.push({ role: "user", parts: [{ text: h.text || h.content || "" }] });
        } else if (h.sender === "bot" || h.role === "model" || h.role === "assistant") {
          contents.push({ role: "model", parts: [{ text: h.text || h.content || "" }] });
        }
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    let responseText = null;
    let finalModel = MODEL;

    try {
      // Primary attempt with configured model (with 14s timeout)
      const primaryPromise = ai.models.generateContent({
        model: MODEL,
        contents,
        config: {
          systemInstruction: contextPrompt,
          temperature: 0.6
        }
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Primary model request timed out")), 14000)
      );

      const resp = await Promise.race([primaryPromise, timeoutPromise]);
      responseText = resp.text;
    } catch (primaryErr) {
      console.warn(`Primary model (${MODEL}) failed (${primaryErr.message}), trying gemini-3.5-flash-lite...`);
      try {
        const secondaryResp = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents,
          config: {
            systemInstruction: contextPrompt,
            temperature: 0.5
          }
        });
        responseText = secondaryResp.text;
        finalModel = "gemini-3.5-flash-lite";
      } catch (secErr) {
        console.warn("Secondary model also failed:", secErr.message);
        throw secErr;
      }
    }

    const reply = responseText || "I am analyzing your competency profile. How else may I assist your capacity development today?";

    // Generate dynamic suggestions based on context
    const suggestions = [
      "What are my highest priority skill gaps?",
      "Recommend learning resources for this week",
      "Give me a quick practice question",
      "How do I upgrade to the next competency level?"
    ];

    return {
      reply,
      modelUsed: finalModel,
      suggestions
    };
  } catch (err) {
    console.warn("Gemini API call encountered error, using intelligent fallback:", err.message);
    const fallbackText = generateIntelligentFallback(message, context);
    return {
      reply: fallbackText,
      modelUsed: "karmayogi-sathi-fallback",
      suggestions: [
        "What are my highest priority skill gaps?",
        "Recommend learning resources for this week",
        "Give me a quick practice question",
        "What competencies do I need for promotion?"
      ]
    };
  }
};

export default {
  getUserCompanionContext,
  chatWithCompanion
};
