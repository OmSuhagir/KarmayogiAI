import React, { useEffect, useState } from 'react';
import {
  FiFileText,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiRefreshCw,
  FiX,
  FiAward,
  FiCheckCircle,
  FiPlay,
} from 'react-icons/fi';
import {
  getAdminAssessments,
  getPositions,
  getCompetencies,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function AdminAssessments() {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    positionId: '',
    durationMinutes: 45,
    status: 'active',
    competencyList: [], // [{ competencyId, questionCount, minScorePercent }]
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [assRes, posRes, compRes] = await Promise.all([
        getAdminAssessments(),
        getPositions(),
        getCompetencies(),
      ]);

      const assList = assRes?.data || assRes;
      const posList = posRes?.data || posRes;
      const compList = compRes?.data || compRes;

      if (Array.isArray(assList)) setAssessments(assList);
      if (Array.isArray(posList)) setPositions(posList);
      if (Array.isArray(compList)) setCompetencies(compList);
    } catch (err) {
      console.warn('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingAssessment(null);
    setFormData({
      title: 'Statistical Officer Baseline Competency Assessment',
      positionId: positions[0]?._id || '',
      durationMinutes: 45,
      status: 'active',
      competencyList: competencies.map((c) => ({
        competencyId: c._id,
        name: c.name,
        questionCount: 3,
        minScorePercent: 60,
        included: true,
      })),
    });
    setModalOpen(true);
  };

  const handleToggleCompetency = (index) => {
    setFormData((prev) => {
      const updated = [...prev.competencyList];
      updated[index].included = !updated[index].included;
      return { ...prev, competencyList: updated };
    });
  };

  const handleCountChange = (index, count) => {
    setFormData((prev) => {
      const updated = [...prev.competencyList];
      updated[index].questionCount = Number(count);
      return { ...prev, competencyList: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const selectedComps = formData.competencyList
        .filter((c) => c.included)
        .map((c) => ({
          competencyId: c.competencyId,
          questionCount: c.questionCount,
          minScorePercent: c.minScorePercent || 60,
        }));

      const payload = {
        title: formData.title,
        positionId: formData.positionId,
        durationMinutes: Number(formData.durationMinutes),
        competencies: selectedComps,
        status: formData.status,
      };

      if (editingAssessment) {
        await updateAssessment(editingAssessment._id, payload);
      } else {
        await createAssessment(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save assessment blueprint.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (assessment) => {
    try {
      const newStatus = assessment.status === 'active' ? 'draft' : 'active';
      await updateAssessment(assessment._id, { status: newStatus });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    try {
      await deleteAssessment(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete assessment.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                Evaluation Blueprints
              </span>
              <span className="text-xs text-[#8A8882] font-medium">
                {assessments.length} Active Blueprints
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Role Assessment Blueprints & Governance
            </h1>
            <p className="text-xs sm:text-sm text-[#62615D] max-w-2xl font-normal leading-relaxed">
              Configure and publish competency assessments, set question allocations per rubric, and control examination timers for civil service officers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] text-xs font-semibold shadow-xs transition-colors"
            >
              <FiPlus className="text-sm" />
              <span>Configure Assessment</span>
            </button>
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] hover:bg-[#F8F6F0] text-[#111111] border border-[#DDD9CF] text-xs font-medium transition-colors shadow-xs disabled:opacity-50"
            >
              <FiRefreshCw className={`text-xs ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Assessments Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-3">
          <FiRefreshCw className="animate-spin text-[#111111] text-2xl mx-auto" />
          <p>Loading assessment blueprints from database...</p>
        </div>
      ) : assessments.length === 0 ? (
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 text-center text-xs text-[#62615D] shadow-xs">
          No assessment blueprints configured. Click "+ Configure Assessment" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((ass) => {
            const isActive = ass.status === 'active';
            const totalQuestions = (ass.competencies || []).reduce(
              (acc, c) => acc + (c.questionCount || 0),
              0
            );

            return (
              <div key={ass._id} className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 space-y-4 shadow-xs hover:border-[#C9C4B8] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        isActive
                          ? 'bg-[#52745D]/10 text-[#52745D] border-[#52745D]/20'
                          : 'bg-[#F8F6F0] text-[#62615D] border-[#DDD9CF]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#52745D]' : 'bg-[#8A8882]'}`}></span>
                        {isActive ? 'Published & Active' : 'Draft / Unpublished'}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide uppercase bg-[#F4F1E9] text-[#111111] border border-[#DDD9CF]">
                        {ass.positionId?.title || 'Civil Service Cadre'}
                      </span>

                      <span className="px-2 py-0.5 rounded-md text-xs font-medium text-[#62615D] bg-[#F8F6F0] border border-[#DDD9CF] inline-flex items-center gap-1">
                        <FiClock className="text-xs text-[#62615D]" /> {ass.durationMinutes || 45} mins
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#111111] leading-snug pt-0.5">
                      {ass.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(ass)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isActive
                          ? 'bg-[#FFFDF8] text-[#62615D] hover:bg-[#F8F6F0] border-[#DDD9CF]'
                          : 'bg-[#111111] text-[#FFFDF8] hover:bg-[#222222] border-[#111111]'
                      }`}
                    >
                      {isActive ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(ass._id)}
                      className="p-1.5 rounded-lg text-[#8A8882] hover:text-[#A54C45] hover:bg-[#FDF2F2] border border-[#DDD9CF] hover:border-[#F5C2C0] transition-colors"
                      title="Delete Assessment"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Competency Allocation Badges */}
                <div className="pt-3 border-t border-[#DDD9CF]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8882] mb-2.5">
                    Competency Question Allocation ({totalQuestions} total items):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {(ass.competencies || []).map((c, cIdx) => (
                      <div
                        key={c.competencyId?._id || cIdx}
                        className="px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] flex items-center justify-between text-xs hover:border-[#C9C4B8] transition-colors"
                      >
                        <span className="font-semibold text-[#111111] truncate pr-2">
                          {c.competencyId?.name || 'Competency'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#FFFDF8] text-[#111111] border border-[#DDD9CF] shrink-0">
                          {c.questionCount} Questions
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONFIGURE ASSESSMENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FFFDF8] rounded-2xl border border-[#DDD9CF] p-6 shadow-2xl space-y-4 overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-[#DDD9CF] pb-3">
              <h3 className="text-base font-bold text-[#111111]">
                Configure Assessment Blueprint
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A8882] hover:text-[#111111]"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Assessment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Statistical Officer Baseline Evaluation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Target Position</label>
                  <select
                    value={formData.positionId}
                    onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  >
                    {positions.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              {/* Competency Question Allocation List */}
              <div className="space-y-2 pt-2 border-t border-[#DDD9CF]">
                <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider block">
                  Select Competencies & Allocate Item Counts
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formData.competencyList.map((comp, idx) => (
                    <div
                      key={comp.competencyId}
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 text-xs ${
                        comp.included
                          ? 'bg-[#F8F6F0] border-[#DDD9CF] text-[#111111]'
                          : 'bg-[#FFFDF8] border-[#DDD9CF]/50 text-[#8A8882]'
                      }`}
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={comp.included}
                          onChange={() => handleToggleCompetency(idx)}
                          className="w-4 h-4 rounded text-[#111111] focus:ring-[#111111]"
                        />
                        <span className="font-semibold truncate">{comp.name}</span>
                      </label>

                      {comp.included && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] font-medium text-[#62615D]">Items:</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={comp.questionCount}
                            onChange={(e) => handleCountChange(idx, e.target.value)}
                            className="w-14 px-2 py-1 rounded bg-[#FFFDF8] border border-[#DDD9CF] text-xs font-semibold text-[#111111] text-center focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#DDD9CF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[#FFFDF8] hover:bg-[#F8F6F0] text-[#111111] border border-[#DDD9CF] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  Save Blueprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
