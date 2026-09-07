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
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                Competency Architecture
              </span>
              <span className="text-xs text-[#8A8882] font-medium">
                {competencies.length} Official Competencies
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Competencies & 5-Level Rubrics
            </h1>
            <p className="text-xs sm:text-sm text-[#62615D] max-w-2xl font-normal leading-relaxed">
              Standardized civil services competency rubrics defining proficiency scales (Level 1–5), sub-competencies, and behavioral indicators.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] text-xs font-semibold shadow-xs transition-colors"
            >
              <FiPlus className="text-sm" />
              <span>Add Competency</span>
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

      {/* Search & Category Filter Toolbar */}
      <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-[#8A8882] text-sm" />
          <input
            type="text"
            placeholder="Search by competency title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] placeholder:text-[#8A8882] focus:outline-none focus:border-[#111111] font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center overflow-x-auto pb-1 sm:pb-0">
          {['all', 'functional', 'domain', 'behavioral'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#111111] text-[#FFFDF8] shadow-xs'
                  : 'bg-[#FFFDF8] text-[#62615D] hover:bg-[#F8F6F0] hover:text-[#111111] border border-[#DDD9CF]'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Competencies Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-3">
          <FiRefreshCw className="animate-spin text-[#111111] text-2xl mx-auto" />
          <p>Loading competencies from database...</p>
        </div>
      ) : filteredComps.length === 0 ? (
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 text-center text-xs text-[#62615D] shadow-xs">
          No competencies match your filter. Click "+ Add Competency" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComps.map((comp) => {
            const isExpanded = expandedId === comp._id;
            return (
              <div key={comp._id} className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 space-y-4 shadow-xs hover:border-[#C9C4B8] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide uppercase bg-[#F4F1E9] text-[#111111] border border-[#DDD9CF]">
                        {comp.category || 'Functional'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium text-[#62615D] bg-[#F8F6F0] border border-[#DDD9CF]">
                        {(comp.subCompetencies || []).length} Sub-Competencies &bull; 5 Proficiency Levels
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#111111] leading-snug">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-[#62615D] max-w-3xl leading-relaxed">
                      {comp.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : comp._id)}
                      className="px-3 py-1.5 rounded-xl bg-[#F8F6F0] hover:bg-[#EAE6DB] border border-[#DDD9CF] text-xs font-semibold text-[#111111] flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      {isExpanded ? 'Hide Rubric' : 'View 5-Level Rubric'}
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(comp)}
                      className="p-1.5 rounded-lg text-[#62615D] hover:text-[#111111] hover:bg-[#F4F1E9] border border-[#DDD9CF] transition-colors"
                      title="Edit Competency"
                    >
                      <FiEdit2 className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(comp._id)}
                      className="p-1.5 rounded-lg text-[#8A8882] hover:text-[#A54C45] hover:bg-[#FDF2F2] border border-[#DDD9CF] hover:border-[#F5C2C0] transition-colors"
                      title="Delete Competency"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Sub-competencies Pills */}
                {(comp.subCompetencies || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {comp.subCompetencies.map((sc, scIdx) => (
                      <span
                        key={scIdx}
                        className="px-3 py-1 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs font-medium text-[#111111]"
                      >
                        {sc.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expandable 5-Level Rubric Breakdown */}
                {isExpanded && (
                  <div className="pt-4 border-t border-[#DDD9CF] space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8882]">
                      Standardized Proficiency Scale (Level 1–5):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {(comp.proficiencyLevels || []).map((pl) => (
                        <div
                          key={pl.level}
                          className="p-3.5 rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] space-y-1.5 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#111111] text-[#FFFDF8]">
                              L{pl.level}
                            </span>
                            <span className="text-xs font-bold text-[#111111]">
                              {pl.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#62615D] leading-relaxed">
                            {pl.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FFFDF8] rounded-2xl border border-[#DDD9CF] p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#DDD9CF] pb-3">
              <h3 className="text-base font-bold text-[#111111]">
                {editingComp ? 'Edit Competency' : 'Add Competency'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A8882] hover:text-[#111111]"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Competency Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Statistical Analysis"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111] capitalize"
                >
                  <option value="functional">Functional</option>
                  <option value="domain">Domain</option>
                  <option value="behavioral">Behavioral</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed description of competency scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
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
                  {submitting ? 'Saving...' : editingComp ? 'Update Competency' : 'Create Competency'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
