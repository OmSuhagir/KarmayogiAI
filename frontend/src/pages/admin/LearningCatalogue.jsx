import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiPlus,
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiClock,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiZap,
  FiX,
  FiExternalLink,
  FiAward,
} from 'react-icons/fi';
import {
  getLearningResources,
  getCompetencies,
  uploadLearningResource,
  updateLearningResourceStatus,
  deleteLearningResource,
} from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function LearningCatalogue() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [competencyFilter, setCompetencyFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Upload Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    provider: 'iGOT Karmayogi',
    source: 'internal',
    competencyId: '',
    level: 3,
    durationMinutes: 120,
    fileType: 'application/pdf',
    fileName: '',
    extractedText: '',
    status: 'approved',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [lrRes, compRes] = await Promise.all([
        getLearningResources(),
        getCompetencies(),
      ]);

      const lrList = lrRes?.data || lrRes;
      const compList = compRes?.data || compRes;

      if (lrList) {
        setResources(lrList.resources || (Array.isArray(lrList) ? lrList : []));
        setDocuments(lrList.documents || []);
      }
      if (Array.isArray(compList)) {
        setCompetencies(compList);
      }
    } catch (err) {
      console.warn('Failed to load learning resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenUpload = () => {
    setFormData({
      title: '',
      description: '',
      provider: 'iGOT Karmayogi',
      source: 'internal',
      competencyId: competencies[0]?._id || '',
      level: 4,
      durationMinutes: 150,
      fileType: 'application/pdf',
      fileName: 'Sampling_Techniques_and_Survey_Design.pdf',
      extractedText:
        'Official Survey Methodology & Sampling Framework: Covers probability sampling, stratified random sampling, sample size estimation, sampling error formula, and survey data validation procedures for official statistical reporting.',
      status: 'approved',
    });
    setModalOpen(true);
  };

  // Mock file selector that reads filename and sets mock extracted text
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await uploadLearningResource(formData);
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to upload and map learning resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (resourceId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'approved';
      await updateLearningResourceStatus(resourceId, newStatus);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update resource status.');
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this learning resource?')) return;
    try {
      await deleteLearningResource(resourceId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete resource.');
    }
  };

  // Filter resources
  const filteredResources = resources.filter((res) => {
    const matchSearch =
      res.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.provider?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchComp =
      competencyFilter === 'all' ||
      (res.competencies || []).some(
        (c) => String(c.competencyId?._id || c.competencyId) === competencyFilter
      );

    return matchSearch && matchComp;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                Capacity Building Hub
              </span>
              <span className="text-xs text-[#8A8882] font-medium">
                {resources.length} Official Learning Modules
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Learning Resources & Document Upload
            </h1>
            <p className="text-xs sm:text-sm text-[#62615D] max-w-2xl font-normal leading-relaxed">
              Upload official manuals and training material. Mapped to competencies and target proficiency levels, approved resources immediately feed AI question generation and employee learning recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] text-xs font-semibold shadow-xs transition-colors"
            >
              <FiUploadCloud className="text-sm" />
              <span>Upload Learning Resource</span>
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

      {/* Search & Competency Filter Toolbar */}
      <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-[#8A8882] text-sm" />
          <input
            type="text"
            placeholder="Search by course title or provider..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] placeholder:text-[#8A8882] focus:outline-none focus:border-[#111111] font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={competencyFilter}
            onChange={(e) => setCompetencyFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
          >
            <option value="all">All Competencies</option>
            {competencies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Table / List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-3">
          <FiRefreshCw className="animate-spin text-[#111111] text-2xl mx-auto" />
          <p>Loading learning resources from database...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 text-center text-xs text-[#62615D] shadow-xs">
          No learning resources found. Click "+ Upload Learning Resource" to add one.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResources.map((res) => {
            const isApproved = res.status === 'active';
            const mappedComps = res.competencies || [];

            return (
              <div
                key={res._id}
                className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xs hover:border-[#C9C4B8] transition-all"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] text-[#111111] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <FiBookOpen className="text-lg" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-[#111111] leading-snug">
                        {res.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                        {res.provider || 'iGOT'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                        isApproved
                          ? 'bg-[#EAF2EC] text-[#52745D] border-[#C5DDCB]'
                          : 'bg-[#F7EEDC] text-[#A8752E] border-[#ECD9BA]'
                      }`}>
                        &bull; {isApproved ? 'Approved for iGOT Hub' : 'Inactive / Draft'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#62615D] flex-wrap">
                      <span className="flex items-center gap-1">
                        <FiClock className="text-xs" /> {res.durationMinutes || 120} mins
                      </span>
                      <span>&bull;</span>
                      <span className="font-semibold text-[#111111]">
                        Target Proficiency: Level {res.level || 3}
                      </span>
                      {res.externalId && (
                        <>
                          <span>&bull;</span>
                          <span className="font-mono text-[10px] text-[#8A8882]">
                            {res.externalId}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Mapped Competencies */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {mappedComps.map((c, cIdx) => (
                        <span
                          key={c.competencyId?._id || cIdx}
                          className="px-2 py-0.5 rounded bg-[#F8F6F0] border border-[#DDD9CF] text-[10px] font-semibold text-[#111111]"
                        >
                          {c.competencyId?.name || 'Competency'} (Target: L{res.level || 3})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-[#DDD9CF]">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/ai-question-review')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFDF8] hover:bg-[#F8F6F0] border border-[#DDD9CF] text-xs font-medium text-[#111111] transition-colors"
                    title="Generate Assessment Questions from this Material"
                  >
                    <FiZap className="text-[#3348A8] text-xs" />
                    <span>AI Questions</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(res._id, res.status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isApproved
                        ? 'bg-[#EAF2EC] text-[#52745D] border-[#C5DDCB] hover:bg-[#DCECE0]'
                        : 'bg-[#111111] text-[#FFFDF8] hover:bg-[#222222] border-[#111111]'
                    }`}
                  >
                    {isApproved ? 'Approved' : 'Approve Resource'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(res._id)}
                    className="p-2 rounded-lg text-[#8A8882] hover:text-[#A54C45] hover:bg-[#F8E9E7] transition-colors"
                    title="Delete Resource"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* UPLOAD LEARNING RESOURCE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FFFDF8] rounded-2xl border border-[#DDD9CF] p-6 shadow-2xl space-y-4 overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-[#DDD9CF] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#FFFDF8] flex items-center justify-center font-bold">
                  <FiUploadCloud className="text-base" />
                </div>
                <h3 className="text-base font-bold text-[#111111]">
                  Upload & Map Learning Resource
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A8882] hover:text-[#111111]"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Drag & Drop Simulation */}
              <div className="p-4 rounded-xl border-2 border-dashed border-[#DDD9CF] bg-[#F8F6F0] text-center space-y-2">
                <FiUploadCloud className="text-2xl text-[#111111] mx-auto" />
                <div className="text-xs text-[#111111]">
                  <label className="font-bold text-[#3348A8] hover:underline cursor-pointer">
                    <span>Choose Official Document (PDF, DOCX, TXT)</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,.pptx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-[#8A8882] mt-0.5">
                    Selected file: <strong className="text-[#111111]">{formData.fileName || 'None'}</strong>
                  </p>
                </div>
              </div>

              {/* Title & Provider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Resource Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sampling Techniques & Survey Design"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Issuing Authority / Provider</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. iGOT Karmayogi / MoSPI"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              {/* Competency Mapping & Target Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Target Competency</label>
                  <select
                    value={formData.competencyId}
                    onChange={(e) => setFormData({ ...formData, competencyId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  >
                    {competencies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Target Proficiency Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  >
                    <option value="1">Level 1 - Basic</option>
                    <option value="2">Level 2 - Working</option>
                    <option value="3">Level 3 - Proficient</option>
                    <option value="4">Level 4 - Advanced</option>
                    <option value="5">Level 5 - Expert</option>
                  </select>
                </div>
              </div>

              {/* Duration & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Approval Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  >
                    <option value="approved">Approved & Publish to iGOT Hub</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Extracted Text Preview (Knowledge Source for Gemini AI) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider flex items-center justify-between">
                  <span>Document Text Content (AI Question Knowledge Source)</span>
                  <span className="text-[10px] text-[#3348A8] font-semibold">Gemini Ingestion Ready</span>
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Paste or preview official extracted document text..."
                  value={formData.extractedText}
                  onChange={(e) => setFormData({ ...formData, extractedText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#DDD9CF] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
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
                  Save & Map to Framework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
