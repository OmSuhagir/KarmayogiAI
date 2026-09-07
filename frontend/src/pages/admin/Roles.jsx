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
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                Role Framework
              </span>
              <span className="text-xs text-[#8A8882] font-medium">
                {roles.length} Role-Competency Maps
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Role-Competency Mappings
            </h1>
            <p className="text-xs sm:text-sm text-[#62615D] max-w-2xl font-normal leading-relaxed">
              Define required functional, domain, and behavioral competencies and benchmark expected proficiency levels (Level 1–5).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] text-xs font-semibold shadow-xs transition-colors"
            >
              <FiPlus className="text-sm" />
              <span>Configure Role</span>
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
            placeholder="Search by role title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] placeholder:text-[#8A8882] focus:outline-none focus:border-[#111111] font-medium"
          />
        </div>
      </div>

      {/* Roles Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-3">
          <FiRefreshCw className="animate-spin text-[#111111] text-2xl mx-auto" />
          <p>Loading role mappings from database...</p>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 text-center text-xs text-[#62615D] shadow-xs">
          No roles found. Click "+ Configure Role" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRoles.map((role) => (
            <div key={role._id} className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 space-y-4 shadow-xs hover:border-[#C9C4B8] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide bg-[#F4F1E9] text-[#111111] border border-[#DDD9CF]">
                      {role.positionId?.title || 'Civil Service Role'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium text-[#62615D] bg-[#F8F6F0] border border-[#DDD9CF]">
                      {(role.competencies || []).length} Required Competencies
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#111111] leading-snug">
                    {role.name}
                  </h3>
                  <p className="text-xs text-[#62615D] leading-relaxed max-w-3xl">
                    {role.description || 'Mission Karmayogi official role competency framework.'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(role)}
                    className="p-1.5 rounded-lg text-[#62615D] hover:text-[#111111] hover:bg-[#F4F1E9] border border-[#DDD9CF] transition-colors"
                    title="Edit Role Mapping"
                  >
                    <FiEdit2 className="text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(role._id)}
                    className="p-1.5 rounded-lg text-[#8A8882] hover:text-[#A54C45] hover:bg-[#FDF2F2] border border-[#DDD9CF] hover:border-[#F5C2C0] transition-colors"
                    title="Delete Role Mapping"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Required Competencies Badges */}
              <div className="pt-3 border-t border-[#DDD9CF]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8882] mb-2.5">
                  Expected Proficiency Benchmark:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {(role.competencies || []).map((c, cIdx) => (
                    <div
                      key={c.competencyId?._id || cIdx}
                      className="px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] flex items-center justify-between text-xs hover:border-[#C9C4B8] transition-colors"
                    >
                      <span className="font-semibold text-[#111111] truncate pr-2">
                        {c.competencyId?.name || 'Competency'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#FFFDF8] text-[#111111] border border-[#DDD9CF] shrink-0">
                        Level {c.expectedLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIGURE ROLE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FFFDF8] rounded-2xl border border-[#DDD9CF] p-6 shadow-2xl space-y-4 overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-[#DDD9CF] pb-3">
              <h3 className="text-base font-bold text-[#111111]">
                {editingRole ? 'Edit Role Mapping' : 'Configure Role & Competencies'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Role Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Statistical Analysis and Reporting"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Position Target</label>
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
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Description</label>
                <textarea
                  rows="2"
                  placeholder="Role mandate and expected civil service deliverables..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Competencies Selector with Level Sliders */}
              <div className="space-y-2 pt-2 border-t border-[#DDD9CF]">
                <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider block">
                  Select Competencies & Set Required Levels (1–5)
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
                          <span className="text-[11px] font-medium text-[#62615D]">
                            Required:
                          </span>
                          <select
                            value={comp.expectedLevel}
                            onChange={(e) => handleLevelChange(idx, e.target.value)}
                            className="px-2 py-1 rounded bg-[#FFFDF8] border border-[#DDD9CF] text-xs font-semibold text-[#111111] focus:outline-none"
                          >
                            <option value="1">L1 - Basic</option>
                            <option value="2">L2 - Working</option>
                            <option value="3">L3 - Proficient</option>
                            <option value="4">L4 - Advanced</option>
                            <option value="5">L5 - Expert</option>
                          </select>
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
                  {submitting ? 'Saving...' : editingRole ? 'Update Role Mapping' : 'Save Role Mapping'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
