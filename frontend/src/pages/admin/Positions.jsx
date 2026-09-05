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
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-2 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <GlassBadge variant="purple" size="xs">
                Master Data
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                {positions.length} Active Positions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Positions & Cadres
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Official civil service designations, hierarchical cadres, and department assignments.
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
              Add Position
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

      {/* Search Toolbar */}
      <GlassCard className="p-4 flex items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by position title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
        </div>
      </GlassCard>

      {/* Positions Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-indigo-600 text-2xl mx-auto" />
          <p>Loading positions from database...</p>
        </div>
      ) : filteredPositions.length === 0 ? (
        <GlassCard className="p-8 text-center text-xs text-slate-500">
          No positions found. Click "+ Add Position" to configure one.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPositions.map((pos) => (
            <GlassCard key={pos._id} className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GlassBadge variant="primary" size="xs">
                        {pos.departmentId?.shortName || 'Ministry Cadre'}
                      </GlassBadge>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Level {pos.level || 3} Cadre
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {pos.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(pos)}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      title="Edit"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(pos._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  {pos.description || 'Civil service administrative designation mapped to standard competency rubrics.'}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Assigned Department:</span>
                  <span className="font-bold text-slate-800">
                    {pos.departmentId?.name || 'MoSPI'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500">
                <span>Mission Karmayogi Aligned</span>
                <span className="text-indigo-700 font-semibold">Active Position</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 p-6 shadow-glass-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingPos ? 'Edit Position' : 'Create Position'}
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
                <label className="text-xs font-bold text-slate-700 uppercase">Position Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Statistical Officer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.shortName || d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Pay/Cadre Level</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Description</label>
                <textarea
                  rows="3"
                  placeholder="Responsibilities and domain scope..."
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
                  {editingPos ? 'Update Position' : 'Create Position'}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
