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
  const [statusFilter, setStatusFilter] = useState('all');

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
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
              Gemini GenAI Studio
            </span>
            <span className="text-[11px] text-[#8A8882]">
              {pendingCount} Pending Review &bull; {approvedCount} Approved
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-1.5">
            AI Question Generation & Review
          </h1>
          <p className="text-xs sm:text-sm text-[#62615D] mt-0.5">
            Synthesize 4-option MCQs from approved training documents using Gemini AI. Human review approves items into the active question bank.
          </p>
        </div>

        <GlassButton
          variant="secondary"
          size="sm"
          icon={FiRefreshCw}
          loading={loading}
          onClick={loadData}
        >
          Refresh Studio
        </GlassButton>
      </div>

      {/* GENERATOR CONTROL PANEL */}
      <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-[#DDD9CF]">
          <div className="w-7 h-7 rounded bg-[#111111] text-[#FFFDF8] flex items-center justify-center font-bold text-xs">
            <FiZap />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              Generate Questions from Official Documents
            </h3>
            <p className="text-[11px] text-[#8A8882]">
              Select source text, competency rubric, and target difficulty level
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#111111] uppercase">Source Document</label>
              <select
                value={genForm.documentId}
                onChange={(e) => setGenForm({ ...genForm, documentId: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none"
              >
                {documents.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.fileName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#111111] uppercase">Target Competency</label>
              <select
                value={genForm.competencyId}
                onChange={(e) => setGenForm({ ...genForm, competencyId: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none"
              >
                {competencies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#111111] uppercase">Difficulty Level</label>
              <select
                value={genForm.difficulty}
                onChange={(e) => setGenForm({ ...genForm, difficulty: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none"
              >
                <option value="1">L1 - Basic</option>
                <option value="2">L2 - Working</option>
                <option value="3">L3 - Proficient</option>
                <option value="4">L4 - Advanced</option>
                <option value="5">L5 - Expert</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#111111] uppercase">Count</label>
              <input
                type="number"
                min="1"
                max="5"
                value={genForm.numQuestions}
                onChange={(e) => setGenForm({ ...genForm, numQuestions: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#DDD9CF]">
            <span className="text-[11px] text-[#8A8882] flex items-center gap-1">
              <FiShield className="text-[#3348A8]" />
              Strict 4-option validation enforced by questionValidationService
            </span>

            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              loading={generating}
              icon={FiZap}
            >
              {generating ? 'Synthesizing with Gemini...' : 'Generate Questions via AI'}
            </GlassButton>
          </div>
        </form>
      </div>

      {/* HUMAN-IN-THE-LOOP REVIEW QUEUE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
            <FiHelpCircle className="text-[#3348A8]" />
            AI Question Review Queue ({filteredQuestions.length})
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                  : 'bg-[#FFFDF8] text-[#62615D] border border-[#DDD9CF]'
              }`}
            >
              All ({generatedQuestions.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                  : 'bg-[#FFFDF8] text-[#62615D] border border-[#DDD9CF]'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'approved'
                  ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                  : 'bg-[#FFFDF8] text-[#62615D] border border-[#DDD9CF]'
              }`}
            >
              Approved ({approvedCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-[#8A8882] space-y-2">
            <FiRefreshCw className="animate-spin text-[#111111] text-xl mx-auto" />
            <p>Loading AI question review queue...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 text-center text-xs text-[#8A8882]">
            No generated questions match this filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.map((item) => {
              const status = item.validation?.status || 'pending';
              const isPending = status === 'pending';
              const isApproved = status === 'approved';
              const isRejected = status === 'rejected';

              return (
                <div
                  key={item._id}
                  className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isApproved ? (
                          <GlassBadge variant="success" size="xs">
                            Approved &bull; Active in Bank
                          </GlassBadge>
                        ) : isPending ? (
                          <GlassBadge variant="warning" size="xs">
                            Pending Review
                          </GlassBadge>
                        ) : (
                          <GlassBadge variant="critical" size="xs">
                            Rejected
                          </GlassBadge>
                        )}

                        <span className="text-[10px] font-semibold text-[#111111] bg-[#F8F6F0] px-1.5 py-0.5 rounded border border-[#DDD9CF]">
                          Level {item.difficulty || 3}
                        </span>

                        {item.aiConfidence && (
                          <span className="text-[10px] text-[#52745D] font-semibold">
                            {Math.round(item.aiConfidence * 100)}% Confidence
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-[#111111] leading-snug pt-0.5">
                        {item.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleReview(item._id, 'approved')}
                            disabled={reviewingId === item._id}
                            className="px-2.5 py-1 rounded bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <FiCheck className="text-xs" /> Approve
                          </button>
                          <button
                            onClick={() => handleReview(item._id, 'rejected')}
                            disabled={reviewingId === item._id}
                            className="px-2.5 py-1 rounded bg-[#F8E9E7] hover:bg-[#F2D7D4] text-[#A54C45] border border-[#E8C2BF] text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <FiX className="text-xs" /> Reject
                          </button>
                        </>
                      )}
                      {isApproved && (
                        <span className="text-xs font-semibold text-[#52745D] flex items-center gap-1">
                          <FiCheckCircle /> Active
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-xs font-semibold text-[#A54C45] flex items-center gap-1">
                          <FiXCircle /> Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {(item.options || []).map((opt) => {
                      const isCorrect = opt.id === item.correctAnswer;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                            isCorrect
                              ? 'bg-[#EAF2EC] border-[#C5DDCB] text-[#111111] font-semibold'
                              : 'bg-[#F8F6F0] border-[#DDD9CF] text-[#62615D]'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                              isCorrect ? 'bg-[#52745D] text-white' : 'bg-[#DDD9CF] text-[#111111]'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="leading-snug pt-0.5">{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {item.rationale && (
                    <div className="p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#62615D]">
                      <span className="font-semibold text-[#111111] block mb-0.5 text-[10px] uppercase tracking-wider">
                        AI Rationale:
                      </span>
                      <p className="text-[11px] leading-relaxed">{item.rationale}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
