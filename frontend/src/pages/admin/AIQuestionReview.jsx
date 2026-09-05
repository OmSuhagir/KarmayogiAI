import React, { useEffect, useState } from 'react';
import {
  FiZap,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiHelpCircle,
  FiShield,
  FiAward,
  FiClock,
  FiInfo,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
  getGeneratedQuestions,
  generateAIQuestions,
  reviewGeneratedQuestion,
  getLearningResources,
  getCompetencies,
} from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function AIQuestionReview() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);

  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'

  // AI Generator Form State
  const [genForm, setGenForm] = useState({
    documentId: '',
    competencyId: '',
    difficulty: 3,
    numQuestions: 2,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [gqRes, lrRes, compRes] = await Promise.all([
        getGeneratedQuestions(),
        getLearningResources(),
        getCompetencies(),
      ]);

      const gqList = gqRes?.data || gqRes;
      const lrList = lrRes?.data || lrRes;
      const compList = compRes?.data || compRes;

      if (Array.isArray(gqList)) setGeneratedQuestions(gqList);
      if (Array.isArray(lrList?.documents)) {
        setDocuments(lrList.documents);
        if (lrList.documents[0] && !genForm.documentId) {
          setGenForm((prev) => ({ ...prev, documentId: lrList.documents[0]._id }));
        }
      }
      if (Array.isArray(compList)) {
        setCompetencies(compList);
        if (compList[0] && !genForm.competencyId) {
          setGenForm((prev) => ({ ...prev, competencyId: compList[0]._id }));
        }
      }
    } catch (err) {
      console.warn('Failed to load AI question review data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!genForm.documentId || !genForm.competencyId) {
      alert('Please select a source document and target competency.');
      return;
    }

    try {
      setGenerating(true);
      const res = await generateAIQuestions({
        documentId: genForm.documentId,
        competencyId: genForm.competencyId,
        difficulty: Number(genForm.difficulty),
        numQuestions: Number(genForm.numQuestions),
      });

      await loadData();
      const list = res?.data || (Array.isArray(res) ? res : []);
      const count = list.length || Number(genForm.numQuestions) || 1;
      alert(`Success! Gemini AI synthesized ${count} MCQ(s) from document. They are now visible in the Review Queue below for your approval.`);
    } catch (err) {
      alert(err.message || 'Gemini Question Generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleReview = async (id, status) => {
    try {
      setReviewingId(id);
      await reviewGeneratedQuestion(id, status, user?._id || '65e000000000000000000001');
      await loadData();
    } catch (err) {
      alert(err.message || 'Review action failed.');
    } finally {
      setReviewingId(null);
    }
  };

  const filteredQuestions = generatedQuestions.filter((q) => {
    const st = q.validation?.status || 'pending';
    if (statusFilter === 'all') return true;
    return st === statusFilter;
  });

  const pendingCount = generatedQuestions.filter((q) => (q.validation?.status || 'pending') === 'pending').length;
  const approvedCount = generatedQuestions.filter((q) => q.validation?.status === 'approved').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-2 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <GlassBadge variant="purple" size="xs">
                Gemini GenAI Studio
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                {pendingCount} Pending Review &bull; {approvedCount} Approved
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Question Generation & Review Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Synthesize 4-option MCQs from approved training documents using Gemini AI. Human-in-the-loop review approves items directly into the production question bank.
            </p>
          </div>

          <GlassButton
            variant="glass"
            size="md"
            icon={FiRefreshCw}
            loading={loading}
            onClick={loadData}
          >
            Refresh Studio
          </GlassButton>
        </div>
      </GlassCard>

      {/* SECTION 1: GEMINI AI GENERATOR CONTROL PANEL */}
      <GlassCard className="p-6 space-y-4 border-indigo-200/80">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/60">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <FiZap className="text-base" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Generate Questions from Official Document
            </h3>
            <p className="text-[11px] text-slate-500 font-normal">
              Select source text, competency rubric, and target difficulty level
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Source Document */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Source Document</label>
              <select
                value={genForm.documentId}
                onChange={(e) => setGenForm({ ...genForm, documentId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
              >
                {documents.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.fileName}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Competency */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Target Competency</label>
              <select
                value={genForm.competencyId}
                onChange={(e) => setGenForm({ ...genForm, competencyId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
              >
                {competencies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Difficulty */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Target Difficulty</label>
              <select
                value={genForm.difficulty}
                onChange={(e) => setGenForm({ ...genForm, difficulty: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="1">Level 1 - Beginner</option>
                <option value="2">Level 2 - Basic</option>
                <option value="3">Level 3 - Intermediate</option>
                <option value="4">Level 4 - Advanced</option>
                <option value="5">Level 5 - Expert</option>
              </select>
            </div>

            {/* Number of Items */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Questions Count</label>
              <input
                type="number"
                min="1"
                max="5"
                value={genForm.numQuestions}
                onChange={(e) => setGenForm({ ...genForm, numQuestions: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <FiShield className="text-indigo-600" />
              Strict 4-option validation enforced by questionValidationService
            </span>

            <GlassButton
              type="submit"
              variant="primary"
              size="md"
              loading={generating}
              icon={FiZap}
              className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md shadow-purple-500/20"
            >
              {generating ? 'Synthesizing with Gemini...' : 'Generate Questions via AI'}
            </GlassButton>
          </div>
        </form>
      </GlassCard>

      {/* SECTION 2: HUMAN-IN-THE-LOOP REVIEW QUEUE */}
      <div className="space-y-4">
        
        {/* Filter Toolbar */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiHelpCircle className="text-indigo-600" />
            AI Question Review Queue ({filteredQuestions.length})
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                statusFilter === 'all' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-white/70 text-slate-600'
              }`}
            >
              All ({generatedQuestions.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                statusFilter === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white/70 text-slate-600'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                statusFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white/70 text-slate-600'
              }`}
            >
              Approved ({approvedCount})
            </button>
          </div>
        </div>

        {/* Questions Cards */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-3">
            <FiRefreshCw className="animate-spin text-indigo-600 text-2xl mx-auto" />
            <p>Loading AI question review queue...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <GlassCard className="p-8 text-center text-xs text-slate-500">
            No generated questions match this filter. Use the generator above to synthesize new items.
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((item) => {
              const status = item.validation?.status || 'pending';
              const isPending = status === 'pending';
              const isApproved = status === 'approved';
              const isRejected = status === 'rejected';

              return (
                <GlassCard key={item._id} className="p-6 space-y-4 border-white/80">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <GlassBadge
                          variant={isApproved ? 'success' : isPending ? 'high' : 'critical'}
                          size="xs"
                          dot
                        >
                          {status === 'approved' ? 'Approved & in Question Bank' : status === 'pending' ? 'Pending Human Review' : 'Rejected'}
                        </GlassBadge>

                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          Level {item.difficulty || 3} Difficulty
                        </span>

                        {item.aiConfidence && (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {Math.round(item.aiConfidence * 100)}% AI Confidence
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug pt-1">
                        {item.question}
                      </h3>
                    </div>

                    {/* Review Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleReview(item._id, 'approved')}
                            disabled={reviewingId === item._id}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                          >
                            <FiCheck className="text-xs" /> Approve
                          </button>
                          <button
                            onClick={() => handleReview(item._id, 'rejected')}
                            disabled={reviewingId === item._id}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <FiX className="text-xs" /> Reject
                          </button>
                        </>
                      )}
                      {isApproved && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <FiCheckCircle /> Question Bank Active
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                          <FiXCircle /> Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Options (A, B, C, D) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {(item.options || []).map((opt) => {
                      const isCorrect = opt.id === item.correctAnswer;
                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="leading-snug pt-0.5">{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Rationale */}
                  {item.rationale && (
                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-950 space-y-1">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-purple-800 block">
                        AI Rationale & Pedagogical Explanation:
                      </span>
                      <p className="text-[11px] leading-relaxed text-purple-900">{item.rationale}</p>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
