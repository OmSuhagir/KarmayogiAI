import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAward,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiRefreshCw,
  FiLayers,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeCompetencyAudit } from '../../services/employeeService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProficiencyScale from '../../components/common/ProficiencyScale';

export default function MyCompetencies() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [competencies, setCompetencies] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function loadData() {
      if (!user?._id) return;
      try {
        setLoading(true);
        const data = await getEmployeeCompetencyAudit(user._id);
        if (data?.competencies) {
          setCompetencies(data.competencies);
        }
      } catch (e) {
        console.warn('Failed to load competencies:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?._id]);

  const rawCategories = ['All', ...new Set(competencies.map((c) => {
    const cat = c.competency?.category || 'Functional';
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  }))];

  const filteredCompetencies = competencies.filter((item) => {
    if (activeCategory === 'All') return true;
    const cat = (item.competency?.category || 'Functional').toLowerCase();
    return cat === activeCategory.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
              {user?.position?.title || 'Statistical Officer'} &bull; {user?.department?.shortName || 'MoSPI'}
            </span>
            <span className="text-[11px] text-[#8A8882]">FRAC Level 1–5 Standard</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-1.5">
            Role Competencies
          </h1>
          <p className="text-xs sm:text-sm text-[#62615D] mt-0.5">
            Evaluated proficiency benchmarks mapped to your service role and official career ladder.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <GlassButton
            variant="primary"
            size="sm"
            iconRight={FiArrowRight}
            onClick={() => navigate('/employee/assessments')}
          >
            Take Assessment
          </GlassButton>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {rawCategories.map((cat) => {
          const count = cat === 'All'
            ? competencies.length
            : competencies.filter(
                (c) => (c.competency?.category || 'Functional').toLowerCase() === cat.toLowerCase()
              ).length;

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

      {/* Competency Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-2">
          <FiRefreshCw className="animate-spin text-[#111111] text-xl mx-auto" />
          <p>Loading competency profile...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompetencies.map((item, idx) => {
            const comp = item.competency || {};
            const current = item.currentLevel || 1;
            const expected = item.expectedLevel || 1;
            const gap = item.gap || 0;
            const subComps = comp.subCompetencies || [];
            const categoryName = comp.category
              ? comp.category.charAt(0).toUpperCase() + comp.category.slice(1).toLowerCase()
              : 'Functional';

            return (
              <div
                key={comp._id || idx}
                className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          categoryName.toLowerCase() === 'behavioral'
                            ? 'bg-[#FAF6F0] text-[#854D0E] border-[#E8DEC8]'
                            : 'bg-[#F8F6F0] text-[#62615D] border-[#DDD9CF]'
                        }`}>
                          {categoryName}
                        </span>
                        {gap > 0 ? (
                          <GlassBadge variant="carmine" size="xs">
                            Gap: +{gap} Level
                          </GlassBadge>
                        ) : (
                          <GlassBadge variant="success" size="xs">
                            Benchmark Met
                          </GlassBadge>
                        )}
                      </div>
                      <h2 className="text-sm font-bold text-[#111111] leading-snug">
                        {comp.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-xs text-[#62615D] line-clamp-2 leading-relaxed">
                    {comp.description}
                  </p>

                  {/* Flagship Proficiency Scale */}
                  <div className="pt-1">
                    <ProficiencyScale
                      currentLevel={current}
                      targetLevel={expected}
                      compact={false}
                      showLabels={true}
                    />
                  </div>

                  {/* Key Areas / Sub-competencies */}
                  {subComps.length > 0 && (
                    <div className="pt-2 border-t border-[#DDD9CF]/60 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8882]">
                        Sub-Competencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {subComps.map((sc, scIdx) => (
                          <span
                            key={sc._id || scIdx}
                            className="px-2 py-0.5 rounded bg-[#F8F6F0] border border-[#DDD9CF] text-[10px] text-[#111111]"
                          >
                            {sc.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-[#DDD9CF] flex items-center justify-between">
                  <span className="text-[11px] text-[#8A8882]">
                    Requirement: <strong>Level {expected}</strong>
                  </span>

                  {gap > 0 ? (
                    <GlassButton
                      variant="outline"
                      size="xs"
                      onClick={() => navigate('/employee/recommendations')}
                    >
                      Build Competency &rarr;
                    </GlassButton>
                  ) : (
                    <span className="text-xs text-[#52745D] font-medium flex items-center gap-1">
                      <FiCheckCircle className="text-xs" /> Certified Proficient
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
