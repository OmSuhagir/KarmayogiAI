import React, { useEffect, useState } from 'react';
import {
  FiBriefcase,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiX,
  FiLayers,
  FiCheckCircle,
} from 'react-icons/fi';
import { RiBuildingLine } from 'react-icons/ri';
import {
  getPositions,
  getDepartments,
  createPosition,
  updatePosition,
  deletePosition,
} from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function Positions() {
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    departmentId: '',
    level: 3,
    description: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [posRes, deptRes] = await Promise.all([getPositions(), getDepartments()]);
      const posList = posRes?.data || posRes;
      const deptList = deptRes?.data || deptRes;

      if (Array.isArray(posList)) setPositions(posList);
      if (Array.isArray(deptList)) setDepartments(deptList);
    } catch (err) {
      console.warn('Failed to load positions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingPos(null);
    setFormData({
      title: '',
      departmentId: departments[0]?._id || '',
      level: 3,
      description: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (pos) => {
    setEditingPos(pos);
    setFormData({
      title: pos.title || '',
      departmentId: pos.departmentId?._id || pos.departmentId || '',
      level: pos.level || 3,
      description: pos.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingPos) {
        await updatePosition(editingPos._id, formData);
      } else {
        await createPosition(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save position.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;
    try {
      await deletePosition(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete position.');
    }
  };

  const filteredPositions = positions.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                Master Data
              </span>
              <span className="text-xs text-[#8A8882] font-medium">
                {positions.length} Active Positions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Positions & Cadres
            </h1>
            <p className="text-xs sm:text-sm text-[#62615D] max-w-2xl font-normal leading-relaxed">
              Official civil service designations, hierarchical cadres, and department assignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] text-xs font-semibold shadow-xs transition-colors"
            >
              <FiPlus className="text-sm" />
              <span>Add Position</span>
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

      {/* Search Toolbar */}
      <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-4 shadow-xs">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-3 text-[#8A8882] text-sm" />
          <input
            type="text"
            placeholder="Search by position title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] placeholder:text-[#8A8882] focus:outline-none focus:border-[#111111] font-medium"
          />
        </div>
      </div>

      {/* Positions Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-3">
          <FiRefreshCw className="animate-spin text-[#111111] text-2xl mx-auto" />
          <p>Loading positions from database...</p>
        </div>
      ) : filteredPositions.length === 0 ? (
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 text-center text-xs text-[#62615D] shadow-xs">
          No positions found. Click "+ Add Position" to configure one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPositions.map((pos) => (
            <div key={pos._id} className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 space-y-4 flex flex-col justify-between shadow-xs hover:border-[#C9C4B8] transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide bg-[#F4F1E9] text-[#111111] border border-[#DDD9CF]">
                        {pos.departmentId?.shortName || 'Govt Cadre'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium text-[#62615D] bg-[#F8F6F0] border border-[#DDD9CF]">
                        Level {pos.level || 3} Cadre
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#111111] leading-snug">
                      {pos.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(pos)}
                      className="p-1.5 rounded-lg text-[#62615D] hover:text-[#111111] hover:bg-[#F4F1E9] border border-[#DDD9CF] transition-colors"
                      title="Edit Position"
                    >
                      <FiEdit2 className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(pos._id)}
                      className="p-1.5 rounded-lg text-[#8A8882] hover:text-[#A54C45] hover:bg-[#FDF2F2] border border-[#DDD9CF] hover:border-[#F5C2C0] transition-colors"
                      title="Delete Position"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#62615D] leading-relaxed line-clamp-2">
                  {pos.description || 'Civil service administrative designation mapped to standard competency rubrics.'}
                </p>

                <div className="p-3.5 rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#62615D]">
                    <RiBuildingLine className="text-[#62615D] text-sm" />
                    <span className="font-medium">Assigned Department:</span>
                  </div>
                  <span className="font-bold text-[#111111]">
                    {pos.departmentId?.name || 'MoSPI'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#DDD9CF] flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#52745D]/10 text-[#52745D] border border-[#52745D]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52745D]"></span>
                  Active Position
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                  <FiCheckCircle className="text-xs text-[#52745D]" />
                  Mission Karmayogi Aligned
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FFFDF8] rounded-2xl border border-[#DDD9CF] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDD9CF] pb-3">
              <h3 className="text-base font-bold text-[#111111]">
                {editingPos ? 'Edit Position' : 'Create Position'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A8882] hover:text-[#111111]"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Position Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Statistical Officer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  >
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.shortName || d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Pay/Cadre Level</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Description</label>
                <textarea
                  rows="3"
                  placeholder="Responsibilities and domain scope..."
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
                  {submitting ? 'Saving...' : editingPos ? 'Update Position' : 'Create Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
