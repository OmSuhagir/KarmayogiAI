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
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-2 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <GlassBadge variant="purple" size="xs">
                Evaluation Blueprints
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                {assessments.length} Active Blueprints
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Role Assessment Blueprints & Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Configure and publish competency assessments, set question allocations per rubric, and control examination timers for civil service officers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <GlassButton
              variant="primary"
              size="md"
              icon={FiPlus}
              className="bg-gradient-to-r from-indigo-700 to-slate-900 text-white"
              onClick={handleOpenCreate}
            >
              Configure Assessment
            </GlassButton>
            <GlassButton
              variant="glass"
              size="md"
              icon={FiRefreshCw}
              loading={loading}
              onClick={loadData}
            >
              Refresh
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Assessments Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-indigo-600 text-2xl mx-auto" />
          <p>Loading assessment blueprints from database...</p>
        </div>
      ) : assessments.length === 0 ? (
        <GlassCard className="p-8 text-center text-xs text-slate-500">
          No assessment blueprints configured. Click "+ Configure Assessment" to create one.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {assessments.map((ass) => {
            const isActive = ass.status === 'active';
            const totalQuestions = (ass.competencies || []).reduce(
              (acc, c) => acc + (c.questionCount || 0),
              0
            );

            return (
              <GlassCard key={ass._id} className="p-6 space-y-4 border-white/80">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <GlassBadge variant={isActive ? 'success' : 'default'} size="xs" dot>
                        {isActive ? 'Published & Active' : 'Draft / Unpublished'}
                      </GlassBadge>

                      <GlassBadge variant="primary" size="xs">
                        {ass.positionId?.title || 'Statistical Officer'}
                      </GlassBadge>

                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <FiClock className="text-xs" /> {ass.durationMinutes || 45} mins
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug pt-1">
                      {ass.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <button
                      onClick={() => handleToggleStatus(ass)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isActive
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700'
                      }`}
                    >
                      {isActive ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => handleDelete(ass._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Assessment"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Competency Allocation Pills */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Competency Question Allocation ({totalQuestions} total items):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {(ass.competencies || []).map((c, cIdx) => (
                      <div
                        key={c.competencyId?._id || cIdx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-800 truncate pr-2">
                          {c.competencyId?.name || 'Competency'}
                        </span>
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {c.questionCount} Questions
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* CONFIGURE ASSESSMENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 p-6 shadow-glass-lg space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Configure Assessment Blueprint
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Assessment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Statistical Officer Baseline Evaluation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Target Position</label>
                  <select
                    value={formData.positionId}
                    onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {positions.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Competency Question Allocation List */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <label className="text-xs font-bold text-slate-700 uppercase block">
                  Select Competencies & Allocate Item Counts
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formData.competencyList.map((comp, idx) => (
                    <div
                      key={comp.competencyId}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                        comp.included
                          ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={comp.included}
                          onChange={() => handleToggleCompetency(idx)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-bold truncate">{comp.name}</span>
                      </label>

                      {comp.included && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] font-semibold text-slate-500">Items:</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={comp.questionCount}
                            onChange={(e) => handleCountChange(idx, e.target.value)}
                            className="w-14 px-2 py-1 rounded-lg bg-white border border-indigo-200 text-xs font-bold text-indigo-900 text-center"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex justify-end gap-2">
                <GlassButton variant="glass" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </GlassButton>
                <GlassButton variant="primary" size="sm" type="submit" loading={submitting}>
                  Save Blueprint
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
