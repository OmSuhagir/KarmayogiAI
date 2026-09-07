import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiZap,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiRefreshCw,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
  getEmployeeRecommendations,
  generateEmployeeRecommendations,
} from '../../services/employeeService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function Recommendations() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function loadRecs() {
      if (!user?._id) return;
      try {
        setLoading(true);
        const data = await getEmployeeRecommendations(user._id);
        if (Array.isArray(data)) {
          setRecommendations(data);
        }
      } catch (e) {
        console.warn('Failed to load recommendations:', e);
      } finally {
        setLoading(false);
      }
    }
    loadRecs();
  }, [user?._id]);

  const handleRegenerate = async () => {
    if (!user?._id) return;
    try {
      setGenerating(true);
      await generateEmployeeRecommendations(user._id);
      const data = await getEmployeeRecommendations(user._id);
      if (Array.isArray(data)) {
        setRecommendations(data);
      }
    } catch (e) {
      console.warn('Failed to regenerate recommendations:', e);
    } finally {
      setGenerating(false);
    }
  };

  const [activeCategory, setActiveCategory] = useState('All');

  const sampleCourses = [
    {
      title: 'Mission Karmayogi: Leadership & Team Empowerment in Civil Services',
      category: 'behavioral',
      gapDesc: 'Directly addresses evaluated Level 2 Gap in Leadership. Covers strategic vision, team delegation, accountability, and coaching next-generation civil servants.',
      targetComp: 'Leadership',
      levelInfo: 'Tailored for progression from Level 2 to Level 3',
      duration: '120 Minutes',
      matchScore: 90,
    },
    {
      title: 'Executive Communication, Policy Articulation & Media Briefing',
      category: 'behavioral',
      gapDesc: 'Directly addresses evaluated Level 3 Gap in Communication. Covers high-stakes parliamentary briefings, crisis communication, and empirical policy articulation.',
      targetComp: 'Communication',
      levelInfo: 'Designed for Level 3 to Level 4 progression',
      duration: '110 Minutes',
      matchScore: 91,
    },
    {
      title: 'Government Project Management: Agile Implementation & Oversight',
      category: 'behavioral',
      gapDesc: 'Covers public sector project breakdown structures, risk registers, budgetary milestone tracking, and cross-cadre deliverable quality assurance.',
      targetComp: 'Project Management',
      levelInfo: 'Masterclass for mission-mode program management',
      duration: '140 Minutes',
      matchScore: 86,
    },
    {
      title: 'Mission Karmayogi: Code of Ethics & Constitutional Values in Governance',
      category: 'behavioral',
      gapDesc: 'Directly addresses evaluated Level 3 Gap in Ethics. Covers CCS Conduct Rules, conflict of interest mitigation, whistleblower protection, and institutional integrity.',
      targetComp: 'Ethics',
      levelInfo: 'Tailored for progression from Level 3 to Level 4',
      duration: '150 Minutes',
      matchScore: 92,
    },
    {
      title: 'Evidence-Based Decision Making & Administrative Risk Management',
      category: 'behavioral',
      gapDesc: 'Covers empirical tradeoff analysis, legal precedent synthesis, and decisive problem solving in high-stakes public administration.',
      targetComp: 'Decision Making',
      levelInfo: 'Designed for Level 3 to Level 4 progression',
      duration: '130 Minutes',
      matchScore: 88,
    },
    {
      title: 'Leading Digital Transformation & Public Sector Change Management',
      category: 'behavioral',
      gapDesc: 'Directly addresses evaluated Level 2 Gap in Change Management. Equips officers to lead administrative modernization, overcome resistance, and embed digital adoption.',
      targetComp: 'Change Management',
      levelInfo: 'Tailored for progression from Level 2 to Level 3',
      duration: '120 Minutes',
      matchScore: 88,
    },
    {
      title: 'Python for Data Analysis & Tabular Processing',
      category: 'functional',
      gapDesc: 'Directly addresses evaluated Level 2 Gap in Python for Data Analysis. Covers Pandas data structures, data filtering, and statistical computation.',
      targetComp: 'Python Fundamentals & Pandas',
      levelInfo: 'Tailored for progression from Level 1 to Level 3',
      duration: '150 Minutes',
      matchScore: 94,
    },
    {
      title: 'Sampling Techniques and Survey Design',
      category: 'functional',
      gapDesc: 'Directly addresses evaluated Level 2 Gap in Sampling Design. Covers probability sampling, sample size estimation, and sampling error control.',
      targetComp: 'Sampling Design',
      levelInfo: 'Designed for Level 2 to Level 4 progression',
      duration: '180 Minutes',
      matchScore: 88,
    },
    {
      title: 'Data Quality Management and Validation',
      category: 'functional',
      gapDesc: 'Directly addresses evaluated Level 2 Gap in Data Quality Management. Focuses on data validation rules, inconsistency identification, and imputation.',
      targetComp: 'Data Quality Management',
      levelInfo: 'Focused module for immediate capacity building',
      duration: '140 Minutes',
      matchScore: 85,
    },
    {
      title: 'Data Visualization & Policy Storytelling',
      category: 'functional',
      gapDesc: 'Directly addresses evaluated Level 1 Gap in Data Visualization. Focuses on chart selection, dashboard design, and effective communication.',
      targetComp: 'Data Visualization',
      levelInfo: 'Fast-track 100 minute duration',
      duration: '100 Minutes',
      matchScore: 80,
    },
  ];

  const categories = ['All', 'Behavioral', 'Functional'];

  const filteredCourses = sampleCourses.filter((course) => {
    if (activeCategory === 'All') return true;
    return (course.category || 'functional').toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Clean Page Header */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
              iGOT Karmayogi
            </span>
            <span className="text-[11px] text-[#8A8882]">AI-Curated Resource Matching</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-1.5">
            Learning Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-[#62615D] mt-0.5">
            Targeted capacity-building modules ranked by relevance to your active competency gaps.
          </p>
        </div>

        <GlassButton
          variant="secondary"
          size="sm"
          icon={FiRefreshCw}
          loading={generating}
          onClick={handleRegenerate}
        >
          Refresh Matching
        </GlassButton>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const count = cat === 'All'
            ? sampleCourses.length
            : sampleCourses.filter((c) => (c.category || 'functional').toLowerCase() === cat.toLowerCase()).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 flex items-center gap-1.5 ${
                activeCategory === cat
                  ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                  : 'bg-[#FFFDF8] text-[#62615D] hover:text-[#111111] border border-[#DDD9CF]'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === cat
                    ? 'bg-[#333333] text-[#FFFDF8]'
                    : 'bg-[#F8F6F0] text-[#8A8882] border border-[#DDD9CF]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Recommendations Content */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-2">
          <FiRefreshCw className="animate-spin text-[#111111] text-xl mx-auto" />
          <p>Scoring and ranking learning resources from iGOT Karmayogi...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-3 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                      iGOT Karmayogi
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      course.category === 'behavioral'
                        ? 'bg-[#FAF6F0] text-[#854D0E] border-[#E8DEC8]'
                        : 'bg-[#F8F6F0] text-[#62615D] border-[#DDD9CF]'
                    }`}>
                      {course.category === 'behavioral' ? 'Behavioral' : 'Functional'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#52745D] bg-[#EAF2EC] px-2 py-0.5 rounded border border-[#C5DDCB]">
                    {course.matchScore}% Match
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#111111] leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#62615D] mt-1 leading-relaxed">
                    {course.gapDesc}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] space-y-1 text-xs">
                  <span className="font-semibold text-[#111111] text-[10px] uppercase tracking-wider block">
                    Why Recommended:
                  </span>
                  <ul className="space-y-0.5 text-[11px] text-[#62615D]">
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-[#52745D] text-xs flex-shrink-0" />
                      <span>Addresses target competency: {course.targetComp}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-[#52745D] text-xs flex-shrink-0" />
                      <span>{course.levelInfo}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[#DDD9CF] flex items-center justify-between">
                <span className="text-xs text-[#8A8882] flex items-center gap-1">
                  <FiClock /> {course.duration}
                </span>
                <GlassButton
                  variant="primary"
                  size="xs"
                  iconRight={FiArrowRight}
                  onClick={() => navigate('/employee/learning')}
                >
                  Start Course
                </GlassButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
