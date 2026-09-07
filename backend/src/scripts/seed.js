import mongoose from "mongoose";
import dotenv from "dotenv";

import Department from "../models/Department.js";
import Position from "../models/Position.js";
import Role from "../models/Role.js";
import Competency from "../models/Competency.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
import Assessment from "../models/Assessment.js";
import LearningResource from "../models/LearningResource.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import CompetencyHistory from "../models/CompetencyHistory.js";
import SkillGap from "../models/SkillGap.js";
import Recommendation from "../models/Recommendation.js";
import LearningProgress from "../models/LearningProgress.js";
import Document from "../models/Document.js";
import GeneratedQuestion from "../models/GeneratedQuestion.js";
import ActivityLog from "../models/ActivityLog.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/karmayogi";

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear all existing collections for clean state
    await Promise.all([
      Department.deleteMany({}),
      Position.deleteMany({}),
      Role.deleteMany({}),
      Competency.deleteMany({}),
      User.deleteMany({}),
      Question.deleteMany({}),
      Assessment.deleteMany({}),
      LearningResource.deleteMany({}),
      AssessmentAttempt.deleteMany({}),
      CompetencyHistory.deleteMany({}),
      SkillGap.deleteMany({}),
      Recommendation.deleteMany({}),
      LearningProgress.deleteMany({}),
      Document.deleteMany({}),
      GeneratedQuestion.deleteMany({}),
      ActivityLog.deleteMany({}),
    ]);

    console.log("Existing collections cleared.");

    // =====================================================
    // 1. DEPARTMENTS & MINISTRIES
    // =====================================================
    const deptMoSPI = await Department.create({
      _id: new mongoose.Types.ObjectId("65e000000000000000000010"),
      name: "Ministry of Statistics and Programme Implementation",
      shortName: "MoSPI",
      code: "MOSPI-01",
      description: "Government ministry responsible for official national statistics, sample surveys, and programme implementation oversight.",
      status: "active",
    });

    const deptDoPT = await Department.create({
      _id: new mongoose.Types.ObjectId("65e000000000000000000011"),
      name: "Department of Personnel and Training",
      shortName: "DoPT",
      code: "DOPT-02",
      description: "Central personnel agency responsible for public administration policy, civil service capacity building, and administrative reforms.",
      status: "active",
    });

    const deptNITI = await Department.create({
      _id: new mongoose.Types.ObjectId("65e000000000000000000012"),
      name: "NITI Aayog",
      shortName: "NITI",
      code: "NITI-03",
      description: "Premier policy think tank of the Government of India providing directional and policy inputs across ministries.",
      status: "active",
    });

    console.log("Departments seeded (MoSPI, DoPT, NITI Aayog).");

    // =====================================================
    // 2. POSITIONS & CADRES
    // =====================================================
    const posStatisticalOfficer = await Position.create({
      _id: new mongoose.Types.ObjectId("65e000000000000000000020"),
      departmentId: deptMoSPI._id,
      title: "Statistical Officer",
      level: 7,
      description: "Responsible for dataset processing, sample survey field oversight, inferential data reporting, and national statistical dissemination.",
      status: "active",
    });

    const posSeniorStatisticalOfficer = await Position.create({
      _id: new mongoose.Types.ObjectId("65e000000000000000000021"),
      departmentId: deptMoSPI._id,
      title: "Senior Statistical Officer",
      level: 8,
      description: "Leads national survey methodology design, cross-sectoral economic statistics compilation, and inter-ministry data harmonization.",
      status: "active",
    });

    const posDataAnalyst = await Position.create({
      _id: new mongoose.Types.ObjectId("65e000000000000000000022"),
      departmentId: deptDoPT._id,
      title: "Data Analyst & Reporting Officer",
      level: 7,
      description: "Analyzes civil service workforce readiness, capacity development metrics, and administrative performance indicators.",
      status: "active",
    });

    console.log("Positions seeded.");

    // =====================================================
    // 3. OFFICIAL COMPETENCY REPOSITORY & 5-LEVEL RUBRICS
    // =====================================================
    const compStatAnalysis = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c55"),
      name: "Statistical Analysis",
      category: "functional",
      description: "Ability to apply statistical theory, descriptive measures, hypothesis testing, and econometric inference to official government datasets.",
      subCompetencies: [
        { name: "Descriptive Statistics", description: "Compute and interpret central tendency, variance, and distributions." },
        { name: "Inferential Statistics", description: "Apply probability distributions and confidence intervals." },
        { name: "Hypothesis Testing", description: "Conduct t-tests, ANOVA, and chi-square significance testing." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Understands fundamental statistical concepts and terminology." },
        { level: 2, name: "Basic", description: "Applies basic descriptive calculations and frequency distributions." },
        { level: 3, name: "Intermediate", description: "Independently performs standard inferential tests and regression models." },
        { level: 4, name: "Advanced", description: "Executes multivariate analysis, time-series forecasting, and econometric models." },
        { level: 5, name: "Expert", description: "Leads national statistical framework design and methodological peer review." },
      ],
    });

    const compSamplingDesign = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c56"),
      name: "Sampling Design",
      category: "functional",
      description: "Expertise in probability sampling frameworks, stratification strategies, sample size estimation, and non-sampling error control.",
      subCompetencies: [
        { name: "Probability Sampling", description: "Apply simple random, systematic, and cluster sampling." },
        { name: "Stratified Sampling", description: "Construct strata based on demographic and economic auxiliary variables." },
        { name: "Sample Size Determination", description: "Compute sample sizes considering precision margins and power." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Distinguishes probability from non-probability sampling." },
        { level: 2, name: "Basic", description: "Implements standard simple random and systematic sampling routines." },
        { level: 3, name: "Intermediate", description: "Designs stratified multi-stage cluster sampling schemes for field surveys." },
        { level: 4, name: "Advanced", description: "Calculates complex design effects, sampling weights, and post-stratification adjustments." },
        { level: 5, name: "Expert", description: "Formulates national master sampling frames for large-scale socio-economic surveys." },
      ],
    });

    const compPythonData = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c57"),
      name: "Python for Data Analysis",
      category: "functional",
      description: "Proficiency in utilizing Python (Pandas, NumPy, SciPy) for automated data cleaning, statistical modeling, and analytical workflows.",
      subCompetencies: [
        { name: "Data Manipulation with Pandas", description: "Filter, merge, aggregate, and reshape tabular datasets." },
        { name: "Vectorized Computing", description: "Utilize NumPy for efficient numerical operations." },
        { name: "Automated Reporting Scripts", description: "Build reproducible analytical pipelines." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Understands Python syntax, data types, and basic control flow." },
        { level: 2, name: "Basic", description: "Loads tabular files and performs simple Pandas filtering and summaries." },
        { level: 3, name: "Intermediate", description: "Builds comprehensive data cleaning, grouping, and statistical pipelines." },
        { level: 4, name: "Advanced", description: "Develops optimized analytical modules, custom functions, and pipeline automation." },
        { level: 5, name: "Expert", description: "Architects scalable data engineering pipelines and statistical computing packages." },
      ],
    });

    const compSQL = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c58"),
      name: "SQL and Database Management",
      category: "functional",
      description: "Ability to write optimized SQL queries, perform multi-table joins, aggregations, window functions, and extract data from enterprise RDBMS.",
      subCompetencies: [
        { name: "Complex Querying", description: "Execute multi-table joins, subqueries, and CTEs." },
        { name: "Window Functions", description: "Apply RANK, ROW_NUMBER, and partition-based running totals." },
        { name: "Data Integrity & Schema", description: "Understand relational constraints and indexing strategies." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Understands basic SELECT queries, WHERE filters, and ORDER BY." },
        { level: 2, name: "Basic", description: "Performs standard INNER and LEFT JOINs with GROUP BY aggregations." },
        { level: 3, name: "Intermediate", description: "Writes complex multi-table queries with window functions and subqueries." },
        { level: 4, name: "Advanced", description: "Optimizes slow queries using query execution plans, indexes, and materialized views." },
        { level: 5, name: "Expert", description: "Designs enterprise relational schemas and distributed database storage architectures." },
      ],
    });

    const compDataViz = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c59"),
      name: "Data Visualization",
      category: "functional",
      description: "Skill in creating clear, informative statistical dashboards, geospatial maps, and publication-grade charts for executive decision-makers.",
      subCompetencies: [
        { name: "Exploratory Visualizations", description: "Create histograms, scatter plots, and box plots to uncover patterns." },
        { name: "Executive Dashboards", description: "Design KPI dashboards highlighting key government trends." },
        { name: "Visual Ethics & Standards", description: "Adhere to accessible, unbiased charting standards." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Creates standard bar and line charts in spreadsheet tools." },
        { level: 2, name: "Basic", description: "Generates custom charts using Matplotlib or Seaborn." },
        { level: 3, name: "Intermediate", description: "Builds interactive multi-dimensional visual dashboards and heatmaps." },
        { level: 4, name: "Advanced", description: "Integrates geospatial mapping, choropleths, and real-time streaming charts." },
        { level: 5, name: "Expert", description: "Establishes national visual communication standards and executive portals." },
      ],
    });

    const compDataQuality = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c60"),
      name: "Data Quality Management",
      category: "functional",
      description: "Ability to audit data pipelines, detect anomalies, resolve outliers, enforce validation rules, and comply with the Data Quality Assurance Framework (DQAF).",
      subCompetencies: [
        { name: "Outlier Detection", description: "Identify anomalies using Z-scores, IQR, and domain boundary checks." },
        { name: "Validation Protocols", description: "Implement programmatic input validation rules." },
        { name: "DQAF Compliance", description: "Audit datasets against national accuracy, timeliness, and consistency criteria." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Identifies basic missing values and duplicate records." },
        { level: 2, name: "Basic", description: "Executes standard range checks and data validation scripts." },
        { level: 3, name: "Intermediate", description: "Conducts statistical outlier audits and implements automated validation rules." },
        { level: 4, name: "Advanced", description: "Establishes end-to-end data quality monitoring frameworks across survey rounds." },
        { level: 5, name: "Expert", description: "Drafts national data governance policies and institutional quality standards." },
      ],
    });

    const compPublicPolicy = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c61"),
      name: "Public Policy Formulation",
      category: "domain",
      description: "Understanding of government policy lifecycles, regulatory impact assessments, stakeholder consultation processes, and outcome monitoring.",
      subCompetencies: [
        { name: "Policy Evaluation", description: "Measure socio-economic outcomes against scheme targets." },
        { name: "Evidence-Based Policy", description: "Integrate empirical statistics into cabinet notes and policy drafts." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Understands policy cycle stages and scheme guidelines." },
        { level: 2, name: "Basic", description: "Summarizes policy briefs and monitors implementation progress." },
        { level: 3, name: "Intermediate", description: "Conducts evidence-based policy evaluation using survey findings." },
        { level: 4, name: "Advanced", description: "Drafts comprehensive policy proposals and regulatory impact assessments." },
        { level: 5, name: "Expert", description: "Leads national strategic policy formulation and inter-ministerial consensus." },
      ],
    });

    // =====================================================
    // BEHAVIOURAL & MANAGERIAL COMPETENCIES (MISSION KARMAYOGI)
    // 1. Leadership
    // 2. Communication
    // 3. Project Management
    // 4. Ethics
    // 5. Decision Making
    // 6. Change Management
    // =====================================================
    const compLeadership = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c65"),
      name: "Leadership",
      category: "behavioral",
      description: "Ability to inspire, empower, and guide civil service teams toward institutional objectives, providing strategic direction, fostering accountability, and mentoring officers.",
      subCompetencies: [
        { name: "Strategic Direction & Vision", description: "Articulate clear operational goals aligned with national governance priorities." },
        { name: "Team Motivation & Empowerment", description: "Foster high morale, delegate effectively, and support staff developmental growth." },
        { name: "Accountability & Mentorship", description: "Maintain rigorous administrative standards and mentor next-generation civil servants." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Demonstrates personal dependability and sets a positive work example for team peers." },
        { level: 2, name: "Basic", description: "Guides junior staff in daily operational duties and facilitates constructive team discussions." },
        { level: 3, name: "Intermediate", description: "Leads cross-functional task forces, delegates ownership, and resolves intra-team operational friction." },
        { level: 4, name: "Advanced", description: "Builds high-performing institutional teams, mentors emerging leaders, and champions strategic capacity building." },
        { level: 5, name: "Expert", description: "Exemplifies transformational civil service leadership across ministries, shaping whole-of-government leadership culture." },
      ],
    });

    const compCommunication = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c64"),
      name: "Communication",
      category: "behavioral",
      description: "Skill in conveying complex public policy, empirical data, and administrative decisions clearly, persuasively, and empathetically across diverse government and public audiences.",
      subCompetencies: [
        { name: "Executive Briefings & Policy Articulation", description: "Synthesize intricate technical and statistical findings for cabinet notes and executive leadership." },
        { name: "Active Listening & Stakeholder Consultation", description: "Engage diverse citizen and administrative stakeholders through respectful dialogue and consultation." },
        { name: "Public & Crisis Communication", description: "Articulate government decisions with clarity, transparency, and public empathy during critical situations." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Drafts clear routine departmental notes and listens attentively in official meetings." },
        { level: 2, name: "Basic", description: "Presents statistical and administrative updates clearly to departmental colleagues and committees." },
        { level: 3, name: "Intermediate", description: "Authors high-impact policy briefs and communicates complex empirical findings to non-technical leaders." },
        { level: 4, name: "Advanced", description: "Conducts high-stakes inter-ministerial negotiations and articulates public policy persuasively to external stakeholders." },
        { level: 5, name: "Expert", description: "Champions national administrative communications strategy and serves as trusted spokesperson on institutional mandates." },
      ],
    });

    const compProjectManagement = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c66"),
      name: "Project Management",
      category: "behavioral",
      description: "Capability to plan, execute, monitor, and deliver mission-critical government programs within scope, schedule, budget, and quality standards.",
      subCompetencies: [
        { name: "Project Planning & Milestone Tracking", description: "Structure multi-phase public initiatives with realistic work breakdown structures and deadlines." },
        { name: "Resource & Budget Allocation", description: "Optimize personnel deployment, procurement timelines, and fiscal expenditure oversight." },
        { name: "Risk Management & Quality Assurance", description: "Proactively identify bottlenecks, establish mitigation reserves, and ensure deliverable quality." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Tracks assigned tasks against established deadlines and reports progress to supervisors." },
        { level: 2, name: "Basic", description: "Coordinates milestone schedules and operational deliverables for sectional work plans." },
        { level: 3, name: "Intermediate", description: "Manages complex multi-month departmental projects, controlling timelines, budgets, and deliverable quality." },
        { level: 4, name: "Advanced", description: "Oversees large-scale multi-stakeholder government schemes, managing comprehensive risk registers and steering committees." },
        { level: 5, name: "Expert", description: "Directs national mega-programs and mission-mode governance projects, setting project governance standards." },
      ],
    });

    const compEthics = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c63"),
      name: "Ethics",
      category: "behavioral",
      description: "Adherence to constitutional values, administrative integrity, impartiality, public trust, and ethical resolution of conflicts of interest in public governance.",
      subCompetencies: [
        { name: "Integrity & Code of Conduct", description: "Rigorous compliance with CCS Conduct Rules, honesty, and anti-corruption principles." },
        { name: "Impartiality & Conflict of Interest", description: "Objective, unbiased administrative decision-making and mandatory disclosure of personal interests." },
        { name: "Transparency & Whistleblower Protection", description: "Commitment to public interest transparency, ethical data disclosure, and institutional integrity." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Understands Central Civil Services (Conduct) Rules and foundational administrative ethics." },
        { level: 2, name: "Basic", description: "Identifies ethical dilemmas in daily work and adheres strictly to official disclosure rules." },
        { level: 3, name: "Intermediate", description: "Maintains steadfast impartiality under administrative pressure and resolves conflicts of interest with sound judgement." },
        { level: 4, name: "Advanced", description: "Fosters an ethical departmental climate, mentors junior officers, and enforces zero tolerance for misconduct." },
        { level: 5, name: "Expert", description: "Champions national civil service integrity frameworks, anti-corruption architecture, and ethical institutional policies." },
      ],
    });

    const compDecisionMaking = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c67"),
      name: "Decision Making",
      category: "behavioral",
      description: "Capacity to analyze complex evidence, evaluate tradeoffs, anticipate unintended consequences, and make sound, timely administrative decisions under uncertainty.",
      subCompetencies: [
        { name: "Evidence-Based Judgment", description: "Critically synthesize empirical data, legal precedents, and policy frameworks to ground decisions." },
        { name: "Risk Analysis & Trade-off Assessment", description: "Weigh competing priorities, fiscal impacts, and public welfare outcomes systematically." },
        { name: "High-Stakes & Crisis Problem Solving", description: "Decisively navigate volatile, uncertain situations with composure and administrative prudence." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Applies standard operating procedures (SOPs) consistently to make routine operational decisions." },
        { level: 2, name: "Basic", description: "Evaluates standard options using available data before presenting recommendations to superiors." },
        { level: 3, name: "Intermediate", description: "Makes timely, balanced administrative decisions in non-routine cases, analyzing tradeoffs and legal implications." },
        { level: 4, name: "Advanced", description: "Executes strategic decisions under ambiguous, high-pressure circumstances with comprehensive risk mitigation." },
        { level: 5, name: "Expert", description: "Formulates landmark policy decisions with nationwide impact, balancing constitutional, economic, and social equities." },
      ],
    });

    const compChangeManagement = await Competency.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c68"),
      name: "Change Management",
      category: "behavioral",
      description: "Skill in guiding civil service organizations through administrative modernization, digital transitions, regulatory shifts, and public sector reforms.",
      subCompetencies: [
        { name: "Change Readiness & Stakeholder Buy-in", description: "Assess organizational readiness, communicate the rationale for reform, and address employee concerns." },
        { name: "Process Re-engineering & Digital Adoption", description: "Modernize legacy bureaucratic workflows into agile, digital-first administrative processes." },
        { name: "Institutional Resilience & Transition Leadership", description: "Sustain momentum during lengthy administrative transitions and embed enduring cultural improvements." },
      ],
      proficiencyLevels: [
        { level: 1, name: "Beginner", description: "Adapts positively to routine departmental procedure updates and digital tool upgrades." },
        { level: 2, name: "Basic", description: "Supports peers during departmental process transitions and helps colleagues adopt new digital systems." },
        { level: 3, name: "Intermediate", description: "Champions administrative modernization initiatives, proactively addressing staff resistance and workflow friction." },
        { level: 4, name: "Advanced", description: "Designs and leads departmental change strategies, restructuring operational workflows with measurable performance gains." },
        { level: 5, name: "Expert", description: "Spearheads whole-of-government reform initiatives and administrative culture transformation under Mission Karmayogi." },
      ],
    });

    console.log("Competencies seeded (6 Functional + 6 Official Behavioural Competencies).");

    // =====================================================
    // 4. ROLES & ROLE-COMPETENCY BENCHMARKS
    // =====================================================
    const roleStatisticalOfficer = await Role.create({
      _id: new mongoose.Types.ObjectId("65e000000000000000000030"),
      positionId: posStatisticalOfficer._id,
      name: "Statistical Analysis and Reporting",
      description: "Official competency profile for Statistical Officers conducting survey analysis, sampling verification, and report authoring in MoSPI.",
      competencies: [
        // Technical / Functional Competencies
        { competencyId: compStatAnalysis._id, expectedLevel: 4 },
        { competencyId: compSamplingDesign._id, expectedLevel: 4 },
        { competencyId: compPythonData._id, expectedLevel: 3 },
        { competencyId: compSQL._id, expectedLevel: 3 },
        { competencyId: compDataViz._id, expectedLevel: 3 },
        { competencyId: compDataQuality._id, expectedLevel: 4 },
        // Behavioural Competencies
        { competencyId: compLeadership._id, expectedLevel: 3 },
        { competencyId: compCommunication._id, expectedLevel: 4 },
        { competencyId: compProjectManagement._id, expectedLevel: 3 },
        { competencyId: compEthics._id, expectedLevel: 4 },
        { competencyId: compDecisionMaking._id, expectedLevel: 3 },
        { competencyId: compChangeManagement._id, expectedLevel: 3 },
      ],
      status: "active",
    });

    const roleSeniorStatisticalOfficer = await Role.create({
      _id: new mongoose.Types.ObjectId("65e000000000000000000031"),
      positionId: posSeniorStatisticalOfficer._id,
      name: "Advanced Survey & National Data Operations",
      description: "Senior role responsible for large-scale survey design, econometric modeling, and executive statistical dissemination.",
      competencies: [
        // Technical / Functional Competencies
        { competencyId: compStatAnalysis._id, expectedLevel: 5 },
        { competencyId: compSamplingDesign._id, expectedLevel: 5 },
        { competencyId: compPythonData._id, expectedLevel: 4 },
        { competencyId: compSQL._id, expectedLevel: 4 },
        { competencyId: compDataViz._id, expectedLevel: 4 },
        { competencyId: compDataQuality._id, expectedLevel: 5 },
        // Behavioural Competencies
        { competencyId: compLeadership._id, expectedLevel: 4 },
        { competencyId: compCommunication._id, expectedLevel: 5 },
        { competencyId: compProjectManagement._id, expectedLevel: 4 },
        { competencyId: compEthics._id, expectedLevel: 5 },
        { competencyId: compDecisionMaking._id, expectedLevel: 4 },
        { competencyId: compChangeManagement._id, expectedLevel: 4 },
      ],
      status: "active",
    });

    const roleGovernanceAnalyst = await Role.create({
      _id: new mongoose.Types.ObjectId("65e000000000000000000032"),
      positionId: posDataAnalyst._id,
      name: "Administrative Capacity & Governance Analytics",
      description: "Focuses on civil services workforce metrics, capacity-building intelligence, and policy evaluation.",
      competencies: [
        // Domain & Functional Competencies
        { competencyId: compPublicPolicy._id, expectedLevel: 4 },
        { competencyId: compStatAnalysis._id, expectedLevel: 3 },
        { competencyId: compDataViz._id, expectedLevel: 3 },
        // Behavioural Competencies
        { competencyId: compLeadership._id, expectedLevel: 3 },
        { competencyId: compCommunication._id, expectedLevel: 4 },
        { competencyId: compProjectManagement._id, expectedLevel: 4 },
        { competencyId: compEthics._id, expectedLevel: 4 },
        { competencyId: compDecisionMaking._id, expectedLevel: 4 },
        { competencyId: compChangeManagement._id, expectedLevel: 3 },
      ],
      status: "active",
    });

    console.log("Roles seeded with benchmark expected competency levels (Functional & Behavioural).");

    // =====================================================
    // 5. USERS & PROFILES (EMPLOYEES & ADMINS)
    // =====================================================
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

    // 1. Primary Demo Employee: Rahul Sharma (Statistical Officer)
    const empRahul = await User.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c77"),
      name: "Rahul Sharma",
      email: "rahul@example.com",
      password: "password123",
      role: "employee",
      departmentId: deptMoSPI._id,
      positionId: posStatisticalOfficer._id,
      roleId: roleStatisticalOfficer._id,
      competencyProfile: [
        { competencyId: compStatAnalysis._id, currentLevel: 3, lastAssessedAt: fifteenDaysAgo }, // Required: 4 -> Gap: 1
        { competencyId: compSamplingDesign._id, currentLevel: 2, lastAssessedAt: fifteenDaysAgo }, // Required: 4 -> Gap: 2 (Critical)
        { competencyId: compPythonData._id, currentLevel: 3, lastAssessedAt: fifteenDaysAgo }, // Required: 3 -> Met
        { competencyId: compSQL._id, currentLevel: 3, lastAssessedAt: fifteenDaysAgo }, // Required: 3 -> Met
        { competencyId: compDataViz._id, currentLevel: 2, lastAssessedAt: fifteenDaysAgo }, // Required: 3 -> Gap: 1
        { competencyId: compDataQuality._id, currentLevel: 4, lastAssessedAt: fifteenDaysAgo }, // Required: 4 -> Met
        // Behavioural Competencies
        { competencyId: compLeadership._id, currentLevel: 2, lastAssessedAt: fifteenDaysAgo }, // Required: 3 -> Gap: 1 (Medium)
        { competencyId: compCommunication._id, currentLevel: 3, lastAssessedAt: fifteenDaysAgo }, // Required: 4 -> Gap: 1 (High)
        { competencyId: compProjectManagement._id, currentLevel: 3, lastAssessedAt: fifteenDaysAgo }, // Required: 3 -> Met
        { competencyId: compEthics._id, currentLevel: 3, lastAssessedAt: fifteenDaysAgo }, // Required: 4 -> Gap: 1 (High)
        { competencyId: compDecisionMaking._id, currentLevel: 3, lastAssessedAt: fifteenDaysAgo }, // Required: 3 -> Met
        { competencyId: compChangeManagement._id, currentLevel: 2, lastAssessedAt: fifteenDaysAgo }, // Required: 3 -> Gap: 1 (Medium)
      ],
      status: "active",
    });

    // 2. Senior Officer: Priyanka Verma (Senior Statistical Officer)
    const empPriyanka = await User.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c78"),
      name: "Priyanka Verma",
      email: "priyanka@example.com",
      password: "password123",
      role: "employee",
      departmentId: deptMoSPI._id,
      positionId: posSeniorStatisticalOfficer._id,
      roleId: roleSeniorStatisticalOfficer._id,
      competencyProfile: [
        { competencyId: compStatAnalysis._id, currentLevel: 5, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compSamplingDesign._id, currentLevel: 4, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compPythonData._id, currentLevel: 4, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compSQL._id, currentLevel: 4, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compDataViz._id, currentLevel: 4, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compDataQuality._id, currentLevel: 5, lastAssessedAt: thirtyDaysAgo },
        // Behavioural Competencies
        { competencyId: compLeadership._id, currentLevel: 4, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compCommunication._id, currentLevel: 5, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compProjectManagement._id, currentLevel: 4, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compEthics._id, currentLevel: 5, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compDecisionMaking._id, currentLevel: 4, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compChangeManagement._id, currentLevel: 4, lastAssessedAt: thirtyDaysAgo },
      ],
      status: "active",
    });

    // 3. Cadre Recruit: Amitabh Sen (Data Analyst)
    const empAmitabh = await User.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c79"),
      name: "Amitabh Sen",
      email: "amitabh@example.com",
      password: "password123",
      role: "employee",
      departmentId: deptDoPT._id,
      positionId: posDataAnalyst._id,
      roleId: roleGovernanceAnalyst._id,
      competencyProfile: [
        { competencyId: compPublicPolicy._id, currentLevel: 2, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compStatAnalysis._id, currentLevel: 2, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compDataViz._id, currentLevel: 1, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compLeadership._id, currentLevel: 2, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compCommunication._id, currentLevel: 3, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compProjectManagement._id, currentLevel: 2, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compEthics._id, currentLevel: 3, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compDecisionMaking._id, currentLevel: 2, lastAssessedAt: thirtyDaysAgo },
        { competencyId: compChangeManagement._id, currentLevel: 2, lastAssessedAt: thirtyDaysAgo },
      ],
      status: "active",
    });

    // 4. System Administrator: Dr. Arvind Mehta
    const adminUser = await User.create({
      _id: new mongoose.Types.ObjectId("65e000000000000000000001"),
      name: "Dr. Arvind Mehta",
      email: "admin@karmayogi.gov.in",
      password: "admin123",
      role: "admin",
      departmentId: deptMoSPI._id,
      status: "active",
    });

    console.log("Users seeded (3 Employees + 1 Demo System Administrator).");

    // =====================================================
    // 6. QUESTION BANK (APPROVED PRODUCTION ITEMS)
    // =====================================================
    const questions = await Question.insertMany([
      // Statistical Analysis Questions
      {
        competencyId: compStatAnalysis._id,
        difficulty: 3,
        question: "In inferential statistics, what does a p-value of 0.03 indicate when testing at an alpha significance level of 0.05?",
        options: [
          { id: "A", text: "There is strong evidence to accept the null hypothesis." },
          { id: "B", text: "There is statistically significant evidence to reject the null hypothesis in favor of the alternative." },
          { id: "C", text: "The test is inconclusive and requires a larger sample size." },
          { id: "D", text: "The probability of a Type II error is exactly 3%." },
        ],
        correctAnswer: "B",
        status: "approved",
      },
      {
        competencyId: compStatAnalysis._id,
        difficulty: 4,
        question: "When evaluating linear regression models on economic survey data, which metric best accounts for model complexity and the number of explanatory variables?",
        options: [
          { id: "A", text: "Unadjusted R-squared" },
          { id: "B", text: "Adjusted R-squared" },
          { id: "C", text: "Pearson correlation coefficient" },
          { id: "D", text: "Variance Inflation Factor (VIF)" },
        ],
        correctAnswer: "B",
        status: "approved",
      },

      // Sampling Design Questions
      {
        competencyId: compSamplingDesign._id,
        difficulty: 3,
        question: "In stratified random sampling, why is the population divided into distinct homogeneous strata before drawing samples?",
        options: [
          { id: "A", text: "To eliminate the requirement of probability sampling." },
          { id: "B", text: "To reduce overall sampling error and ensure adequate representation of all sub-populations." },
          { id: "C", text: "To maximize non-response rates across urban clusters." },
          { id: "D", text: "To prevent post-stratification calculations." },
        ],
        correctAnswer: "B",
        status: "approved",
      },
      {
        competencyId: compSamplingDesign._id,
        difficulty: 4,
        question: "In large-scale national sample surveys, what is the 'Design Effect' (Deff) used to measure?",
        options: [
          { id: "A", text: "The ratio of the variance of an estimate under complex cluster sampling to the variance under simple random sampling." },
          { id: "B", text: "The cost efficiency of enumerator field visits." },
          { id: "C", text: "The percentage of questionnaires with missing entries." },
          { id: "D", text: "The correlation between interviewer age and response accuracy." },
        ],
        correctAnswer: "A",
        status: "approved",
      },

      // Python for Data Analysis Questions
      {
        competencyId: compPythonData._id,
        difficulty: 3,
        question: "In Python Pandas, which method is most effective for grouping a survey DataFrame by state and computing the average household income?",
        options: [
          { id: "A", text: "df.pivot_table(index='state', values='income', aggfunc='mean')" },
          { id: "B", text: "df.sort_values('state').mean('income')" },
          { id: "C", text: "df.filter('state').sum('income')" },
          { id: "D", text: "df.map(lambda s: s['income'])" },
        ],
        correctAnswer: "A",
        status: "approved",
      },
      {
        competencyId: compPythonData._id,
        difficulty: 4,
        question: "When processing large government census files in Pandas that exceed memory limits, which technique is recommended?",
        options: [
          { id: "A", text: "Reading the dataset in chunks using pd.read_csv(..., chunksize=N) and optimizing data types to category/int32." },
          { id: "B", text: "Converting all columns to float64 strings." },
          { id: "C", text: "Disabling garbage collection in Python." },
          { id: "D", text: "Loading the entire file into a Python list of dictionaries." },
        ],
        correctAnswer: "A",
        status: "approved",
      },

      // SQL & Database Management Questions
      {
        competencyId: compSQL._id,
        difficulty: 3,
        question: "Which SQL window function assigns consecutive integer ranks to rows within each partition without leaving gaps in ranking values for tied scores?",
        options: [
          { id: "A", text: "RANK()" },
          { id: "B", text: "DENSE_RANK()" },
          { id: "C", text: "ROW_NUMBER()" },
          { id: "D", text: "NTILE()" },
        ],
        correctAnswer: "B",
        status: "approved",
      },
      {
        competencyId: compSQL._id,
        difficulty: 4,
        question: "In relational database design for administrative registries, what is the primary purpose of a Common Table Expression (WITH clause)?",
        options: [
          { id: "A", text: "To permanently create a physical database table." },
          { id: "B", text: "To create temporary named result sets that enhance query readability and support recursive queries." },
          { id: "C", text: "To encrypt confidential citizen identifiers on disk." },
          { id: "D", text: "To bypass foreign key constraint validation." },
        ],
        correctAnswer: "B",
        status: "approved",
      },

      // Data Visualization Questions
      {
        competencyId: compDataViz._id,
        difficulty: 3,
        question: "Which type of chart is most suitable for visualizing the distribution, median, interquartile range (IQR), and outliers of state-level crop yields?",
        options: [
          { id: "A", text: "Pie Chart" },
          { id: "B", text: "Box and Whisker Plot (Boxplot)" },
          { id: "C", text: "Radar Chart" },
          { id: "D", text: "Stacked Area Chart" },
        ],
        correctAnswer: "B",
        status: "approved",
      },
      {
        competencyId: compDataViz._id,
        difficulty: 4,
        question: "When designing executive dashboards for ministerial monitoring, what is the primary objective of using Small Multiples (facet grids)?",
        options: [
          { id: "A", text: "To allow rapid visual comparison of identical scale charts across multiple departments or regions." },
          { id: "B", text: "To increase 3D visual effects and animate pie slices." },
          { id: "C", text: "To hide regional variations in data." },
          { id: "D", text: "To compress file size by deleting axis labels." },
        ],
        correctAnswer: "A",
        status: "approved",
      },

      // Data Quality Management Questions
      {
        competencyId: compDataQuality._id,
        difficulty: 3,
        question: "Under the Data Quality Assurance Framework (DQAF), what does the 'Consistency' dimension evaluate?",
        options: [
          { id: "A", text: "Whether data remains coherent and logically aligned across different survey sources and time periods." },
          { id: "B", text: "The speed at which data is uploaded to cloud servers." },
          { id: "C", text: "The total number of rows in the database table." },
          { id: "D", text: "The color palette used in public reports." },
        ],
        correctAnswer: "A",
        status: "approved",
      },
      {
        competencyId: compDataQuality._id,
        difficulty: 4,
        question: "Which statistical method is commonly applied during survey data cleaning to identify extreme outlier entries in skewed income distributions?",
        options: [
          { id: "A", text: "Tukey's Fences method (Q3 + 1.5 * IQR or Q3 + 3 * IQR)" },
          { id: "B", text: "Calculating the mean plus or minus one standard deviation only" },
          { id: "C", text: "Sorting rows alphabetically" },
          { id: "D", text: "Assuming all entries ending in zero are correct" },
        ],
        correctAnswer: "A",
        status: "approved",
      },

      // =====================================================
      // BEHAVIOURAL COMPETENCIES: SITUATIONAL JUDGMENT ITEMS
      // =====================================================
      // 1. Leadership
      {
        competencyId: compLeadership._id,
        difficulty: 3,
        question: "A multi-disciplinary field survey team is experiencing low morale and conflicting priorities between permanent statistical officers and contractual enumerators under strict census deadlines. As the survey leader, what is your most effective action?",
        options: [
          { id: "A", text: "Reprimand the contractual staff publicly to enforce disciplinary compliance." },
          { id: "B", text: "Convene an alignment briefing to clarify shared mission goals, establish transparent milestone ownership, and implement peer mentorship between senior and junior staff." },
          { id: "C", text: "Transfer all difficult field blocks exclusively to contractual staff to protect permanent staff." },
          { id: "D", text: "Ignore interpersonal conflict and focus strictly on daily questionnaire counts." },
        ],
        correctAnswer: "B",
        status: "approved",
      },
      {
        competencyId: compLeadership._id,
        difficulty: 4,
        question: "During a critical national economic census rollout, two senior field supervisors resign abruptly. What strategic leadership approach maintains team momentum and delivery integrity?",
        options: [
          { id: "A", text: "Temporarily halt survey operations indefinitely until central recruitment completes." },
          { id: "B", text: "Empower high-potential junior statistical officers with acting supervisor responsibilities, provide accelerated operational coaching, and redistribute supervisory workloads with clear accountability." },
          { id: "C", text: "Falsify supervisory inspection sign-offs to keep the official project tracker green." },
          { id: "D", text: "Demand that remaining enumerators work double shifts without additional administrative support." },
        ],
        correctAnswer: "B",
        status: "approved",
      },

      // 2. Communication
      {
        competencyId: compCommunication._id,
        difficulty: 3,
        question: "You are tasked with presenting a quarterly inflation and consumer expenditure report to a parliamentary consultative committee comprised of non-technical members. How should you structure your communication?",
        options: [
          { id: "A", text: "Present only raw mathematical regression formulas and econometric matrices to prove technical rigor." },
          { id: "B", text: "Translate complex statistical indices into clear policy implications, plain-language visual summaries, and transparent confidence caveats." },
          { id: "C", text: "Distribute an unedited 500-page annexure and decline to summarize key findings verbally." },
          { id: "D", text: "Omit volatile price trends to avoid parliamentary inquiry." },
        ],
        correctAnswer: "B",
        status: "approved",
      },
      {
        competencyId: compCommunication._id,
        difficulty: 4,
        question: "A major media outlet misinterprets an interim employment survey release, generating widespread public confusion regarding national jobless trends. As departmental communications lead, what is your immediate response?",
        options: [
          { id: "A", text: "Issue an aggressive legal notice without clarifying the underlying data." },
          { id: "B", text: "Issue a concise, authoritative press clarification and visual explainer detailing the statistical methodology, definitions, and accurate interpretations." },
          { id: "C", text: "Delete the official report from the ministry portal to prevent further discussion." },
          { id: "D", text: "Remain silent and allow public speculation to run its course." },
        ],
        correctAnswer: "B",
        status: "approved",
      },

      // 3. Project Management
      {
        competencyId: compProjectManagement._id,
        difficulty: 3,
        question: "Midway through a 12-month nationwide agricultural survey project, hardware vendor delays in delivering survey tablets threaten your fieldwork launch. What project management step should you take?",
        options: [
          { id: "A", text: "Wait passively until the vendor delivers before planning any alternative schedules." },
          { id: "B", text: "Perform critical path impact analysis, activate contingent hybrid enumeration protocols (paper-assisted where feasible), and implement weekly vendor escalation checkpoints." },
          { id: "C", text: "Cancel the agricultural survey for the current fiscal quarter." },
          { id: "D", text: "Reduce sample size by 75% without statistical justification to recover lost calendar time." },
        ],
        correctAnswer: "B",
        status: "approved",
      },
      {
        competencyId: compProjectManagement._id,
        difficulty: 4,
        question: "An inter-state statistical compilation project has experienced 15% scope creep from participating agencies and risks exceeding its sanctioned budgetary grant. How should the project director resolve this?",
        options: [
          { id: "A", text: "Accept all new scope requests without reviewing budgetary authorization." },
          { id: "B", text: "Convene the project steering committee, present a variance assessment, and formally baseline the core deliverables while phasing non-critical requests into future project cycles." },
          { id: "C", text: "Divert funds from staff training without statutory financial approval." },
          { id: "D", text: "Abandon milestone reporting to conceal the cost overrun." },
        ],
        correctAnswer: "B",
        status: "approved",
      },

      // 4. Ethics
      {
        competencyId: compEthics._id,
        difficulty: 3,
        question: "A senior administrative official verbally instructs you to exclude a rural sampling block showing declining nutritional indicators from an interim press release. According to civil service ethics, what is the most appropriate course of action?",
        options: [
          { id: "A", text: "Immediately delete the sampling block as requested by the senior official." },
          { id: "B", text: "Respectfully document the complete empirical dataset in writing, cite official data integrity guidelines, and escalate through appropriate institutional reporting channels." },
          { id: "C", text: "Leak the preliminary findings anonymously to external media outlets." },
          { id: "D", text: "Falsify the sample figures to match previous quarterly benchmarks." },
        ],
        correctAnswer: "B",
        status: "approved",
      },
      {
        competencyId: compEthics._id,
        difficulty: 4,
        question: "During a procurement evaluation for digital survey handheld devices, you discover that a close family member is a major shareholder in the lowest-bidding firm. What is your ethical obligation under the Central Civil Services (Conduct) Rules?",
        options: [
          { id: "A", text: "Continue evaluating the tender without disclosure, provided your scoring is objective." },
          { id: "B", text: "Immediately submit a formal written declaration of conflict of interest and recuse yourself entirely from the evaluation committee." },
          { id: "C", text: "Inform the bidder privately to withdraw their commercial quote." },
          { id: "D", text: "Award the contract and donate personal proceeds to an administrative charity." },
        ],
        correctAnswer: "B",
        status: "approved",
      },

      // 5. Decision Making
      {
        competencyId: compDecisionMaking._id,
        difficulty: 3,
        question: "Two days prior to an official statistical release, your audit team discovers an inconsistency in 2% of sample weights from a remote district. Recalculation will delay the cabinet briefing by 48 hours. What is the soundest administrative decision?",
        options: [
          { id: "A", text: "Publish the flawed figures on schedule to avoid an awkward administrative delay." },
          { id: "B", text: "Inform the leadership immediately of the technical anomaly, request a 48-hour briefing deferral, and release verified, defensible data." },
          { id: "C", text: "Arbitrarily overwrite the remote district weights with national averages." },
          { id: "D", text: "Delete all records from that remote district from the master dataset permanently." },
        ],
        correctAnswer: "B",
        status: "approved",
      },
      {
        competencyId: compDecisionMaking._id,
        difficulty: 4,
        question: "Facing tight budgetary caps, you must choose between a smaller high-precision probability sample vs a larger non-probability digital web survey for an urgent economic assessment. How do you decide?",
        options: [
          { id: "A", text: "Default to the web survey simply because it generates a larger sample size regardless of selection bias." },
          { id: "B", text: "Rigorously evaluate representativeness, non-response bias, and statutory policy requirements, choosing probability sampling to ensure defensible, unbiased statistical inferences." },
          { id: "C", text: "Toss a coin to avoid taking personal responsibility for the decision." },
          { id: "D", text: "Outsource the decision to an unvetted vendor without ministerial sign-off." },
        ],
        correctAnswer: "B",
        status: "approved",
      },

      // 6. Change Management
      {
        competencyId: compChangeManagement._id,
        difficulty: 3,
        question: "Your department is transitioning from legacy paper survey schedules to tablet-based Computer Assisted Personal Interviewing (CAPI). Senior enumerators express resistance and anxiety regarding digital devices. How should you lead this change?",
        options: [
          { id: "A", text: "Threaten resistant staff with immediate disciplinary transfer." },
          { id: "B", text: "Conduct empathetic hands-on workshops, pair tech-proficient peers with senior staff, listen to user interface feedback, and celebrate early milestones." },
          { id: "C", text: "Revert entirely to paper schedules to prevent administrative discomfort." },
          { id: "D", text: "Implement the software overnight without any training or technical support hotline." },
        ],
        correctAnswer: "B",
        status: "approved",
      },
      {
        competencyId: compChangeManagement._id,
        difficulty: 4,
        question: "A newly mandated whole-of-government digital metadata standard requires all regional offices to migrate their legacy filing workflows. How do you ensure sustainable, long-term adoption across departments?",
        options: [
          { id: "A", text: "Issue a one-time generic circular and take no further follow-up actions." },
          { id: "B", text: "Design a phased transition plan with designated departmental change champions, continuous user feedback loops, and measurable transition milestones." },
          { id: "C", text: "Disable all regional server access until all offices comply instantly." },
          { id: "D", text: "Permit regional offices to ignore the mandate indefinitely if they prefer old workflows." },
        ],
        correctAnswer: "B",
        status: "approved",
      },
    ]);

    console.log(`Question Bank seeded (${questions.length} production items, including 6 Behavioural Competency items).`);

    // =====================================================
    // 7. ROLE ASSESSMENT BLUEPRINTS
    // =====================================================
    const assessmentBaseline = await Assessment.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c89"),
      positionId: posStatisticalOfficer._id,
      title: "Statistical Officer Baseline Competency Assessment",
      description: "Comprehensive dual-domain evaluation measuring both technical competencies and behavioral situational judgment for Statistical Officers under Mission Karmayogi.",
      durationMinutes: 45,
      competencies: [
        // Technical Competencies
        { competencyId: compStatAnalysis._id, requiredLevel: 4, questionCount: 1 },
        { competencyId: compSamplingDesign._id, requiredLevel: 4, questionCount: 1 },
        { competencyId: compPythonData._id, requiredLevel: 3, questionCount: 1 },
        { competencyId: compSQL._id, requiredLevel: 3, questionCount: 1 },
        { competencyId: compDataViz._id, requiredLevel: 3, questionCount: 1 },
        { competencyId: compDataQuality._id, requiredLevel: 4, questionCount: 1 },
        // Behavioural Competencies
        { competencyId: compLeadership._id, requiredLevel: 3, questionCount: 1 },
        { competencyId: compCommunication._id, requiredLevel: 4, questionCount: 1 },
        { competencyId: compProjectManagement._id, requiredLevel: 3, questionCount: 1 },
        { competencyId: compEthics._id, requiredLevel: 4, questionCount: 1 },
        { competencyId: compDecisionMaking._id, requiredLevel: 3, questionCount: 1 },
        { competencyId: compChangeManagement._id, requiredLevel: 3, questionCount: 1 },
      ],
      status: "active",
    });

    const assessmentBehavioral = await Assessment.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c8b"),
      positionId: posStatisticalOfficer._id,
      title: "Civil Services Behavioural & Managerial Assessment",
      description: "Dedicated behavioral evaluation assessing Leadership, Communication, Project Management, Ethics, Decision Making, and Change Management under administrative scenarios.",
      durationMinutes: 30,
      competencies: [
        { competencyId: compLeadership._id, requiredLevel: 3, questionCount: 1 },
        { competencyId: compCommunication._id, requiredLevel: 4, questionCount: 1 },
        { competencyId: compProjectManagement._id, requiredLevel: 3, questionCount: 1 },
        { competencyId: compEthics._id, requiredLevel: 4, questionCount: 1 },
        { competencyId: compDecisionMaking._id, requiredLevel: 3, questionCount: 1 },
        { competencyId: compChangeManagement._id, requiredLevel: 3, questionCount: 1 },
      ],
      status: "active",
    });

    const assessmentSampling = await Assessment.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c8a"),
      positionId: posStatisticalOfficer._id,
      title: "Survey Design & National Sampling Specialization",
      description: "Specialized assessment on multi-stage cluster sampling, sample size estimation, and design effect calculations.",
      durationMinutes: 30,
      competencies: [
        { competencyId: compSamplingDesign._id, requiredLevel: 4, questionCount: 2 },
        { competencyId: compDataQuality._id, requiredLevel: 4, questionCount: 2 },
      ],
      status: "active",
    });

    console.log("Assessments seeded (Comprehensive Baseline, Behavioral Assessment, and Technical Specialization).");

    // =====================================================
    // 8. OFFICIAL LEARNING RESOURCES & DOCUMENTS
    // =====================================================
    const docSampling = await Document.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c90"),
      uploadedBy: adminUser._id,
      fileName: "Sampling_Techniques_and_Survey_Design_Manual.pdf",
      fileType: "application/pdf",
      extractedText: "Official Ministry manual for probability sampling and stratified survey design. Details formulas for sample size determination: n = (Z^2 * p * (1-p)) / e^2, where Z is standard score, p is estimated proportion, and e is desired margin of error. Explains stratified multi-stage cluster designs and non-sampling error audit protocols.",
      competencyIds: [compSamplingDesign._id],
      status: "processed",
    });

    const docPython = await Document.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c91"),
      uploadedBy: adminUser._id,
      fileName: "Government_Data_Processing_in_Python.pdf",
      fileType: "application/pdf",
      extractedText: "Comprehensive guide to data processing using Python Pandas, NumPy, and Matplotlib. Covers structured dataset merging, group-by aggregations, missing value imputation, and automated executive reporting pipelines.",
      competencyIds: [compPythonData._id],
      status: "processed",
    });

    const resSampling = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c92"),
      title: "Advanced Sampling Techniques & Survey Methodology",
      provider: "iGOT Karmayogi",
      source: "igot",
      externalId: "IGOT-SAMP-401",
      competencies: [{ competencyId: compSamplingDesign._id }],
      level: 4,
      durationMinutes: 180,
      url: "https://igotkarmayogi.gov.in/course/sampling-techniques",
      status: "active",
    });

    const resStat = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c93"),
      title: "Inferential Statistics & Econometric Modeling in Government",
      provider: "MoSPI National Training Academy",
      source: "internal",
      externalId: "MOSPI-STAT-402",
      competencies: [{ competencyId: compStatAnalysis._id }],
      level: 4,
      durationMinutes: 240,
      url: "https://igotkarmayogi.gov.in/course/inferential-statistics",
      status: "active",
    });

    const resPython = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c94"),
      title: "Python for Official Data Processing & Statistical Automation",
      provider: "iGOT Karmayogi",
      source: "igot",
      externalId: "IGOT-PY-301",
      competencies: [{ competencyId: compPythonData._id }],
      level: 3,
      durationMinutes: 150,
      url: "https://igotkarmayogi.gov.in/course/python-data-processing",
      status: "active",
    });

    const resSQL = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c95"),
      title: "Enterprise SQL & Relational Database Architecture for Officers",
      provider: "iGOT Karmayogi",
      source: "igot",
      externalId: "IGOT-SQL-301",
      competencies: [{ competencyId: compSQL._id }],
      level: 3,
      durationMinutes: 120,
      url: "https://igotkarmayogi.gov.in/course/enterprise-sql",
      status: "active",
    });

    const resViz = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c96"),
      title: "Executive Data Visualization & Ministerial Dashboards",
      provider: "iGOT Karmayogi",
      source: "igot",
      externalId: "IGOT-VIZ-301",
      competencies: [{ competencyId: compDataViz._id }],
      level: 3,
      durationMinutes: 90,
      url: "https://igotkarmayogi.gov.in/course/data-visualization",
      status: "active",
    });

    const resQuality = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c97"),
      title: "National Data Quality Assurance Framework (DQAF) Masterclass",
      provider: "MoSPI National Training Academy",
      source: "internal",
      externalId: "MOSPI-DQAF-401",
      competencies: [{ competencyId: compDataQuality._id }],
      level: 4,
      durationMinutes: 160,
      url: "https://igotkarmayogi.gov.in/course/dqaf-masterclass",
      status: "active",
    });

    // =====================================================
    // BEHAVIOURAL COMPETENCY LEARNING RESOURCES (iGOT KARMAYOGI)
    // =====================================================
    const resLeadership = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c99"),
      title: "Mission Karmayogi: Leadership & Team Empowerment in Civil Services",
      provider: "iGOT Karmayogi",
      source: "igot",
      externalId: "IGOT-LEAD-301",
      competencies: [{ competencyId: compLeadership._id }],
      level: 3,
      durationMinutes: 120,
      url: "https://igotkarmayogi.gov.in/course/leadership-empowerment",
      status: "active",
    });

    const resCommunication = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c9a"),
      title: "Executive Communication, Policy Articulation & Media Briefing",
      provider: "iGOT Karmayogi",
      source: "igot",
      externalId: "IGOT-COMM-401",
      competencies: [{ competencyId: compCommunication._id }],
      level: 4,
      durationMinutes: 110,
      url: "https://igotkarmayogi.gov.in/course/executive-communication",
      status: "active",
    });

    const resProjectManagement = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c9b"),
      title: "Government Project Management: Agile Implementation & Milestone Oversight",
      provider: "iGOT Karmayogi",
      source: "igot",
      externalId: "IGOT-PM-301",
      competencies: [{ competencyId: compProjectManagement._id }],
      level: 3,
      durationMinutes: 140,
      url: "https://igotkarmayogi.gov.in/course/government-project-management",
      status: "active",
    });

    const resEthics = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c98"),
      title: "Mission Karmayogi: Code of Ethics and Constitutional Values in Governance",
      provider: "iGOT Karmayogi",
      source: "igot",
      externalId: "IGOT-ETH-401",
      competencies: [{ competencyId: compEthics._id }],
      level: 4,
      durationMinutes: 150,
      url: "https://igotkarmayogi.gov.in/course/code-of-ethics",
      status: "active",
    });

    const resDecisionMaking = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c9c"),
      title: "Evidence-Based Decision Making & Administrative Risk Management",
      provider: "iGOT Karmayogi",
      source: "igot",
      externalId: "IGOT-DM-301",
      competencies: [{ competencyId: compDecisionMaking._id }],
      level: 3,
      durationMinutes: 130,
      url: "https://igotkarmayogi.gov.in/course/evidence-based-decision-making",
      status: "active",
    });

    const resChangeManagement = await LearningResource.create({
      _id: new mongoose.Types.ObjectId("6a93d343d6ff1fa539394c9d"),
      title: "Leading Digital Transformation & Public Sector Change Management",
      provider: "iGOT Karmayogi",
      source: "igot",
      externalId: "IGOT-CM-301",
      competencies: [{ competencyId: compChangeManagement._id }],
      level: 3,
      durationMinutes: 120,
      url: "https://igotkarmayogi.gov.in/course/public-change-management",
      status: "active",
    });

    console.log("Learning resources & documents seeded (Technical & 6 Behavioural Competency modules).");

    // =====================================================
    // 9. AI GENERATED QUESTIONS (STUDIO REVIEW QUEUE)
    // =====================================================
    await GeneratedQuestion.insertMany([
      {
        documentId: docSampling._id,
        competencyId: compSamplingDesign._id,
        difficulty: 4,
        question: "In survey sample size estimation, if the desired margin of error is halved while keeping the confidence level constant, what happens to the required sample size?",
        options: [
          { id: "A", text: "It remains unchanged." },
          { id: "B", text: "It doubles (increases by 2x)." },
          { id: "C", text: "It quadruples (increases by 4x) because margin of error is squared in the denominator." },
          { id: "D", text: "It is halved." },
        ],
        correctAnswer: "C",
        rationale: "From the sample size formula n = (Z^2 * p * (1-p)) / e^2, because the margin of error 'e' is in the denominator squared, halving 'e' increases the required sample size by a factor of 4.",
        aiConfidence: 0.96,
        validation: {
          isValid: true,
          status: "pending",
        },
      },
      {
        documentId: docPython._id,
        competencyId: compPythonData._id,
        difficulty: 3,
        question: "Which Pandas function should be used to replace all missing NaN entries in a survey revenue column with the median value of that column?",
        options: [
          { id: "A", text: "df['revenue'].dropna()" },
          { id: "B", text: "df['revenue'].fillna(df['revenue'].median())" },
          { id: "C", text: "df['revenue'].replace(0)" },
          { id: "D", text: "df['revenue'].apply(lambda x: x == 0)" },
        ],
        correctAnswer: "B",
        rationale: "fillna() combined with .median() replaces missing NaN values with the robust statistical median of the series.",
        aiConfidence: 0.98,
        validation: {
          isValid: true,
          status: "approved",
        },
      },
    ]);

    console.log("AI Generated Questions review queue seeded.");

    // =====================================================
    // 10. SKILL GAPS & RECOMMENDATIONS FOR DEMO OFFICER
    // =====================================================
    // Open gaps for Rahul:
    // Technical:
    // 1. Sampling Design: Level 2 vs Required Level 4 -> Gap = 2 (Critical)
    // 2. Statistical Analysis: Level 3 vs Required Level 4 -> Gap = 1 (High)
    // 3. Data Visualization: Level 2 vs Required Level 3 -> Gap = 1 (Medium)
    // Behavioural:
    // 4. Leadership: Level 2 vs Required Level 3 -> Gap = 1 (Medium)
    // 5. Communication: Level 3 vs Required Level 4 -> Gap = 1 (High)
    // 6. Ethics: Level 3 vs Required Level 4 -> Gap = 1 (High)
    // 7. Change Management: Level 2 vs Required Level 3 -> Gap = 1 (Medium)

    const gapSampling = await SkillGap.create({
      userId: empRahul._id,
      competencyId: compSamplingDesign._id,
      requiredLevel: 4,
      currentLevel: 2,
      gap: 2,
      priority: "critical",
      status: "open",
    });

    const gapStat = await SkillGap.create({
      userId: empRahul._id,
      competencyId: compStatAnalysis._id,
      requiredLevel: 4,
      currentLevel: 3,
      gap: 1,
      priority: "high",
      status: "open",
    });

    const gapViz = await SkillGap.create({
      userId: empRahul._id,
      competencyId: compDataViz._id,
      requiredLevel: 3,
      currentLevel: 2,
      gap: 1,
      priority: "medium",
      status: "open",
    });

    const gapLeadership = await SkillGap.create({
      userId: empRahul._id,
      competencyId: compLeadership._id,
      requiredLevel: 3,
      currentLevel: 2,
      gap: 1,
      priority: "medium",
      status: "open",
    });

    const gapCommunication = await SkillGap.create({
      userId: empRahul._id,
      competencyId: compCommunication._id,
      requiredLevel: 4,
      currentLevel: 3,
      gap: 1,
      priority: "high",
      status: "open",
    });

    const gapEthics = await SkillGap.create({
      userId: empRahul._id,
      competencyId: compEthics._id,
      requiredLevel: 4,
      currentLevel: 3,
      gap: 1,
      priority: "high",
      status: "open",
    });

    const gapChange = await SkillGap.create({
      userId: empRahul._id,
      competencyId: compChangeManagement._id,
      requiredLevel: 3,
      currentLevel: 2,
      gap: 1,
      priority: "medium",
      status: "open",
    });

    // Resolved gaps where Rahul meets role benchmarks
    await SkillGap.create({
      userId: empRahul._id,
      competencyId: compPythonData._id,
      requiredLevel: 3,
      currentLevel: 3,
      gap: 0,
      priority: "low",
      status: "resolved",
    });

    await SkillGap.create({
      userId: empRahul._id,
      competencyId: compSQL._id,
      requiredLevel: 3,
      currentLevel: 3,
      gap: 0,
      priority: "low",
      status: "resolved",
    });

    await SkillGap.create({
      userId: empRahul._id,
      competencyId: compDataQuality._id,
      requiredLevel: 4,
      currentLevel: 4,
      gap: 0,
      priority: "low",
      status: "resolved",
    });

    await SkillGap.create({
      userId: empRahul._id,
      competencyId: compProjectManagement._id,
      requiredLevel: 3,
      currentLevel: 3,
      gap: 0,
      priority: "low",
      status: "resolved",
    });

    await SkillGap.create({
      userId: empRahul._id,
      competencyId: compDecisionMaking._id,
      requiredLevel: 3,
      currentLevel: 3,
      gap: 0,
      priority: "low",
      status: "resolved",
    });

    // Recommendations matching schema: { userId, gapId, recommendations: [{ resourceId, rank, score, reason }] }
    await Recommendation.create({
      userId: empRahul._id,
      gapId: gapSampling._id,
      recommendations: [
        {
          resourceId: resSampling._id,
          rank: 1,
          score: 95,
          reason: ["Directly addresses critical 2-level gap in Sampling Design", "Official MoSPI aligned module"],
        },
      ],
      generatedAt: now,
    });

    await Recommendation.create({
      userId: empRahul._id,
      gapId: gapStat._id,
      recommendations: [
        {
          resourceId: resStat._id,
          rank: 1,
          score: 88,
          reason: ["Targets 1-level gap in Statistical Analysis to achieve required Level 4 benchmark"],
        },
      ],
      generatedAt: now,
    });

    await Recommendation.create({
      userId: empRahul._id,
      gapId: gapEthics._id,
      recommendations: [
        {
          resourceId: resEthics._id,
          rank: 1,
          score: 92,
          reason: ["Prepares officer for Level 4 Advanced Ethics & Integrity standard in public reporting"],
        },
      ],
      generatedAt: now,
    });

    await Recommendation.create({
      userId: empRahul._id,
      gapId: gapLeadership._id,
      recommendations: [
        {
          resourceId: resLeadership._id,
          rank: 1,
          score: 90,
          reason: ["Strengthens team empowerment, operational delegation, and field leadership"],
        },
      ],
      generatedAt: now,
    });

    await Recommendation.create({
      userId: empRahul._id,
      gapId: gapCommunication._id,
      recommendations: [
        {
          resourceId: resCommunication._id,
          rank: 1,
          score: 91,
          reason: ["Builds high-impact executive policy briefing and parliamentary reporting capability"],
        },
      ],
      generatedAt: now,
    });

    await Recommendation.create({
      userId: empRahul._id,
      gapId: gapChange._id,
      recommendations: [
        {
          resourceId: resChangeManagement._id,
          rank: 1,
          score: 88,
          reason: ["Equips officer to drive digital adoption and process transitions in field survey teams"],
        },
      ],
      generatedAt: now,
    });

    await Recommendation.create({
      userId: empRahul._id,
      gapId: gapViz._id,
      recommendations: [
        {
          resourceId: resViz._id,
          rank: 1,
          score: 82,
          reason: ["Enhances data visualization skills for ministerial executive reporting"],
        },
      ],
      generatedAt: now,
    });

    // Learning Progress for Rahul (resourceId, progress, status)
    await LearningProgress.create({
      userId: empRahul._id,
      resourceId: resSampling._id,
      progress: 40,
      status: "in_progress",
      startedAt: fifteenDaysAgo,
    });

    await LearningProgress.create({
      userId: empRahul._id,
      resourceId: resPython._id,
      progress: 100,
      status: "completed",
      startedAt: thirtyDaysAgo,
      completedAt: fifteenDaysAgo,
    });

    // Historical Competency Tracking for Rahul
    await CompetencyHistory.create([
      {
        userId: empRahul._id,
        competencyId: compStatAnalysis._id,
        level: 2,
        score: 55,
        source: "assessment",
        recordedAt: thirtyDaysAgo,
      },
      {
        userId: empRahul._id,
        competencyId: compStatAnalysis._id,
        level: 3,
        score: 75,
        source: "reassessment",
        recordedAt: fifteenDaysAgo,
      },
      {
        userId: empRahul._id,
        competencyId: compSamplingDesign._id,
        level: 2,
        score: 50,
        source: "assessment",
        recordedAt: fifteenDaysAgo,
      },
      {
        userId: empRahul._id,
        competencyId: compPythonData._id,
        level: 2,
        score: 55,
        source: "assessment",
        recordedAt: thirtyDaysAgo,
      },
      {
        userId: empRahul._id,
        competencyId: compPythonData._id,
        level: 3,
        score: 85,
        source: "reassessment",
        recordedAt: fifteenDaysAgo,
      },
    ]);

    console.log("Skill Gaps, Recommendations, Learning Progress & History seeded for Demo Officer.");

    console.log("\n=======================================================");
    console.log("KARMAYOGI AI — SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=======================================================");
    console.log("Demo Accounts Ready:");
    console.log("1. Employee (Rahul Sharma):   rahul@example.com / password123");
    console.log("2. Employee (Priyanka Verma): priyanka@example.com / password123");
    console.log("3. Employee (Amitabh Sen):    amitabh@example.com / password123");
    console.log("4. Admin (Dr. Arvind Mehta):  admin@karmayogi.gov.in / admin123");
    console.log("=======================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();