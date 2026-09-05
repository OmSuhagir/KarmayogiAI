import React, { useEffect, useState } from 'react';
import {
  FiGrid,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiBriefcase,
  FiX,
  FiCheckCircle,
} from 'react-icons/fi';
import { RiBuildingLine } from 'react-icons/ri';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function Departments() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    code: '',
    description: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getDepartments();
      const list = res?.data || res;
      if (Array.isArray(list)) {
        setDepartments(list);
      }
    } catch (err) {
      console.warn('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setFormData({ name: '', shortName: '', code: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name || '',
      shortName: dept.shortName || '',
      code: dept.code || '',
      description: dept.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingDept) {
        await updateDepartment(editingDept._id, formData);
      } else {
        await createDepartment(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save department.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await deleteDepartment(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete department.');
    }
  };

  const filteredDepts = departments.filter((d) =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.shortName?.toLowerCase().includes(searchTerm.toLowerCase())
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
                {departments.length} Ministries & Departments
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Departments & Ministries
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Administrative structures, ministries, and autonomous division hierarchy participating in civil services capacity building.
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
              Add Department
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
            placeholder="Search by department name or acronym..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
        </div>
      </GlassCard>

      {/* Departments Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-indigo-600 text-2xl mx-auto" />
          <p>Loading departments from database...</p>
        </div>
      ) : filteredDepts.length === 0 ? (
        <GlassCard className="p-8 text-center text-xs text-slate-500">
          No departments found. Click "+ Add Department" to create one.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDepts.map((dept) => (
            <GlassCard key={dept._id} className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GlassBadge variant="primary" size="xs">
                        {dept.shortName || 'Govt Body'}
                      </GlassBadge>
                      {dept.code && (
                        <span className="text-[11px] font-mono text-slate-400">
                          {dept.code}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {dept.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(dept)}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      title="Edit"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  {dept.description || 'Ministry unit participating in Mission Karmayogi workforce intelligence.'}
                </p>

                {/* Counts Pill */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Enrolled Officers</span>
                    <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <FiUsers className="text-xs text-indigo-600" /> {dept.officerCount || 0}
                    </span>
                  </div>
                  <div className="border-l border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Positions</span>
                    <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <FiBriefcase className="text-xs text-indigo-600" /> {dept.positionCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500">
                <span>Status: Active Ministry</span>
                <span className="text-indigo-700 font-semibold">Mission Karmayogi Active</span>
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
                {editingDept ? 'Edit Department' : 'Create Department'}
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
                <label className="text-xs font-bold text-slate-700 uppercase">Department Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ministry of Statistics and Programme Implementation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Acronym / Short</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MoSPI"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Code</label>
                  <input
                    type="text"
                    placeholder="e.g. MOSPI-01"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of ministry mandate..."
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
                  {editingDept ? 'Update Department' : 'Create Department'}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
