import React, { useEffect, useState } from 'react';
import {
  FiUserCheck,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiX,
  FiAward,
  FiCheckCircle,
} from 'react-icons/fi';
import {
  getRoles,
  getPositions,
  getCompetencies,
  createRole,
  updateRole,
  deleteRole,
} from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function Roles() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [positions, setPositions] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    positionId: '',
    description: '',
    competencyList: [], // [{ competencyId, expectedLevel }]
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [roleRes, posRes, compRes] = await Promise.all([
        getRoles(),
        getPositions(),
        getCompetencies(),
      ]);

      const roleList = roleRes?.data || roleRes;
      const posList = posRes?.data || posRes;
      const compList = compRes?.data || compRes;

      if (Array.isArray(roleList)) setRoles(roleList);
      if (Array.isArray(posList)) setPositions(posList);
      if (Array.isArray(compList)) setCompetencies(compList);
    } catch (err) {
      console.warn('Failed to load roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      positionId: positions[0]?._id || '',
      description: '',
      competencyList: competencies.map((c) => ({
        competencyId: c._id,
        name: c.name,
        expectedLevel: 3,
        included: true,
      })),
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (role) => {
    setEditingRole(role);
    const existingMap = new Map(
      (role.competencies || []).map((c) => [
        String(c.competencyId?._id || c.competencyId),
        c.expectedLevel,
      ])
    );

    setFormData({
      name: role.name || '',
      positionId: role.positionId?._id || role.positionId || '',
      description: role.description || '',
      competencyList: competencies.map((c) => ({
        competencyId: c._id,
        name: c.name,
        expectedLevel: existingMap.get(String(c._id)) || 3,
        included: existingMap.has(String(c._id)),
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

  const handleLevelChange = (index, level) => {
    setFormData((prev) => {
      const updated = [...prev.competencyList];
      updated[index].expectedLevel = Number(level);
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
          expectedLevel: c.expectedLevel,
        }));

      const payload = {
        name: formData.name,
        positionId: formData.positionId,
        description: formData.description,
        competencies: selectedComps,
      };

      if (editingRole) {
        await updateRole(editingRole._id, payload);
      } else {
        await createRole(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save role.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role mapping?')) return;
    try {
      await deleteRole(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete role.');
    }
  };

  const filteredRoles = roles.filter((r) =>
    r.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-2 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <GlassBadge variant="purple" size="xs">
                Role Framework
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                {roles.length} Role-Competency Maps
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Role-Competency Mappings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Define required functional, domain, and behavioral competencies and benchmark expected proficiency levels (Level 1–5).
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
              Configure Role
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
            placeholder="Search by role title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
        </div>
      </GlassCard>

      {/* Roles Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-indigo-600 text-2xl mx-auto" />
          <p>Loading role mappings from database...</p>
        </div>
      ) : filteredRoles.length === 0 ? (
        <GlassCard className="p-8 text-center text-xs text-slate-500">
          No roles found. Click "+ Configure Role" to create one.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredRoles.map((role) => (
            <GlassCard key={role._id} className="p-6 space-y-4 border-white/80">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GlassBadge variant="primary" size="xs">
                      {role.positionId?.title || 'Statistical Officer'}
                    </GlassBadge>
                    <span className="text-xs text-slate-400 font-medium">
                      {(role.competencies || []).length} Required Competencies
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {role.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {role.description || 'Mission Karmayogi official role competency framework.'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start">
                  <button
                    onClick={() => handleOpenEdit(role)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                    title="Edit Role"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(role._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete Role"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Required Competencies Badges */}
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Expected Proficiency Benchmark:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {(role.competencies || []).map((c, cIdx) => (
                    <div
                      key={c.competencyId?._id || cIdx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800 truncate pr-2">
                        {c.competencyId?.name || 'Competency'}
                      </span>
                      <GlassBadge variant="primary" size="xs">
                        Level {c.expectedLevel}
                      </GlassBadge>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* CONFIGURE ROLE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 p-6 shadow-glass-lg space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingRole ? 'Edit Role Mapping' : 'Configure Role & Competencies'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Role Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Statistical Analysis and Reporting"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Position Target</label>
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
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Description</label>
                <textarea
                  rows="2"
                  placeholder="Role mandate and expected civil service deliverables..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Competencies Selector with Level Sliders */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <label className="text-xs font-bold text-slate-700 uppercase block">
                  Select Competencies & Set Required Levels (1–5)
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
                          <span className="text-[11px] font-semibold text-slate-500">
                            Required: Level {comp.expectedLevel}
                          </span>
                          <select
                            value={comp.expectedLevel}
                            onChange={(e) => handleLevelChange(idx, e.target.value)}
                            className="px-2 py-1 rounded-lg bg-white border border-indigo-200 text-xs font-bold text-indigo-900 focus:outline-none"
                          >
                            <option value="1">L1 - Beginner</option>
                            <option value="2">L2 - Basic</option>
                            <option value="3">L3 - Intermediate</option>
                            <option value="4">L4 - Advanced</option>
                            <option value="5">L5 - Expert</option>
                          </select>
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
                  {editingRole ? 'Update Role Mapping' : 'Save Role Mapping'}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
