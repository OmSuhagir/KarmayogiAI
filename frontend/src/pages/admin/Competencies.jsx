import React, { useEffect, useState } from 'react';
import {
  FiAward,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiX,
  FiLayers,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import {
  getCompetencies,
  createCompetency,
  updateCompetency,
  deleteCompetency,
} from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function Competencies() {
  const [loading, setLoading] = useState(true);
  const [competencies, setCompetencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'functional',
    description: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getCompetencies();
      const compList = res?.data || res;
      if (Array.isArray(compList)) {
        setCompetencies(compList);
      }
    } catch (err) {
      console.warn('Failed to load competencies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingComp(null);
    setFormData({ name: '', category: 'functional', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setEditingComp(comp);
    setFormData({
      name: comp.name || '',
      category: comp.category || 'functional',
      description: comp.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingComp) {
        await updateCompetency(editingComp._id, formData);
      } else {
        await createCompetency(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save competency.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this competency?')) return;
    try {
      await deleteCompetency(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete competency.');
    }
  };

  const filteredComps = competencies.filter((c) => {
    const matchSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      selectedCategory === 'all' ||
      c.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-2 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <GlassBadge variant="purple" size="xs">
                Competency Architecture
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                {competencies.length} Official Competencies
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Competencies & 5-Level Rubrics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Standardized civil services competency rubrics defining proficiency scales (Level 1–5), sub-competencies, and behavioral indicators.
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
              Add Competency
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

      {/* Search & Category Filter Toolbar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by competency title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          {['all', 'functional', 'domain', 'behavioral'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200/60'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Competencies Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-indigo-600 text-2xl mx-auto" />
          <p>Loading competencies from database...</p>
        </div>
      ) : filteredComps.length === 0 ? (
        <GlassCard className="p-8 text-center text-xs text-slate-500">
          No competencies match your filter. Click "+ Add Competency" to create one.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredComps.map((comp) => {
            const isExpanded = expandedId === comp._id;
            return (
              <GlassCard key={comp._id} className="p-6 space-y-4 border-white/80">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GlassBadge
                        variant={
                          comp.category === 'functional'
                            ? 'primary'
                            : comp.category === 'domain'
                            ? 'purple'
                            : 'success'
                        }
                        size="xs"
                      >
                        {comp.category?.toUpperCase() || 'FUNCTIONAL'}
                      </GlassBadge>
                      <span className="text-xs text-slate-400 font-medium">
                        {(comp.subCompetencies || []).length} Sub-Competencies &bull; 5 Proficiency Levels
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-3xl">
                      {comp.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : comp._id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                    >
                      {isExpanded ? 'Hide Rubric' : 'View 5-Level Rubric'}
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(comp)}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      title="Edit"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(comp._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Sub-competencies Pills */}
                {(comp.subCompetencies || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {comp.subCompetencies.map((sc, scIdx) => (
                      <span
                        key={scIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px] font-medium text-slate-700"
                      >
                        {sc.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expandable 5-Level Rubric Breakdown */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-200/70 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Standardized Proficiency Scale (Level 1–5):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                      {(comp.proficiencyLevels || []).map((pl) => (
                        <div
                          key={pl.level}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-indigo-700">
                              L{pl.level}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {pl.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            {pl.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 p-6 shadow-glass-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingComp ? 'Edit Competency' : 'Add Competency'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Competency Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Statistical Analysis"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 capitalize"
                >
                  <option value="functional">Functional</option>
                  <option value="domain">Domain</option>
                  <option value="behavioral">Behavioral</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed description of competency scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex justify-end gap-2">
                <GlassButton variant="glass" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </GlassButton>
                <GlassButton variant="primary" size="sm" type="submit" loading={submitting}>
                  {editingComp ? 'Update Competency' : 'Create Competency'}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
