import React, { useEffect, useState } from 'react';
import {
  FiHelpCircle,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiX,
  FiCheckCircle,
  FiAward,
  FiZap,
} from 'react-icons/fi';
import {
  getQuestionBank,
  getCompetencies,
  createQuestion,
  deleteQuestion,
} from '../../services/adminService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function AdminQuestions() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [competencyFilter, setCompetencyFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Manual Question Create Form
  const [formData, setFormData] = useState({
    competencyId: '',
    difficulty: 3,
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [qRes, compRes] = await Promise.all([
        getQuestionBank(),
        getCompetencies(),
      ]);

      const qList = qRes?.data || qRes;
      const compList = compRes?.data || compRes;

      if (Array.isArray(qList)) setQuestions(qList);
      if (Array.isArray(compList)) {
        setCompetencies(compList);
        if (compList[0] && !formData.competencyId) {
          setFormData((prev) => ({ ...prev, competencyId: compList[0]._id }));
        }
      }
    } catch (err) {
      console.warn('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      competencyId: competencies[0]?._id || '',
      difficulty: 3,
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        competencyId: formData.competencyId,
        difficulty: Number(formData.difficulty),
        question: formData.question,
        options: [
          { id: 'A', text: formData.optionA },
          { id: 'B', text: formData.optionB },
          { id: 'C', text: formData.optionC },
          { id: 'D', text: formData.optionD },
        ],
        correctAnswer: formData.correctAnswer,
        status: 'approved',
      };

      await createQuestion(payload);
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteQuestion(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete question.');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchSearch = q.question?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchComp =
      competencyFilter === 'all' ||
      String(q.competencyId?._id || q.competencyId) === competencyFilter;
    const matchDiff =
      difficultyFilter === 'all' || q.difficulty === Number(difficultyFilter);
    return matchSearch && matchComp && matchDiff;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-2 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <GlassBadge variant="purple" size="xs">
                Question Bank
              </GlassBadge>
              <span className="text-xs text-slate-400 font-medium">
                {questions.length} Production Items
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Approved Assessment Question Bank
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Live repository of validated 4-option MCQs across all 6 competencies, serving employee evaluations and role readiness exams.
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
              Add Question
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

      {/* Search & Filters */}
      <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by question text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={competencyFilter}
            onChange={(e) => setCompetencyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Competencies</option>
            {competencies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Difficulties</option>
            <option value="1">Level 1 - Beginner</option>
            <option value="2">Level 2 - Basic</option>
            <option value="3">Level 3 - Intermediate</option>
            <option value="4">Level 4 - Advanced</option>
            <option value="5">Level 5 - Expert</option>
          </select>
        </div>
      </GlassCard>

      {/* Questions Cards */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-3">
          <FiRefreshCw className="animate-spin text-indigo-600 text-2xl mx-auto" />
          <p>Loading questions from database...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <GlassCard className="p-8 text-center text-xs text-slate-500">
          No approved questions match your search or filter.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <GlassCard key={q._id || idx} className="p-6 space-y-4 border-white/80">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <GlassBadge variant="primary" size="xs">
                      {q.competencyId?.name || 'Competency'}
                    </GlassBadge>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      Level {q.difficulty || 3} Proficiency
                    </span>
                    <GlassBadge variant="success" size="xs">
                      Approved Bank Item
                    </GlassBadge>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug pt-1">
                    {q.question}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete Question"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {(q.options || []).map((opt) => {
                  const isCorrect = opt.id === q.correctAnswer;
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
            </GlassCard>
          ))}
        </div>
      )}

      {/* CREATE MANUAL QUESTION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 p-6 shadow-glass-lg space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Item to Question Bank</h3>
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
                  <label className="text-xs font-bold text-slate-700 uppercase">Competency</label>
                  <select
                    value={formData.competencyId}
                    onChange={(e) => setFormData({ ...formData, competencyId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {competencies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Difficulty Level</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="1">Level 1 - Beginner</option>
                    <option value="2">Level 2 - Basic</option>
                    <option value="3">Level 3 - Intermediate</option>
                    <option value="4">Level 4 - Advanced</option>
                    <option value="5">Level 5 - Expert</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Question Prompt</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter the official question prompt..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <label className="text-xs font-bold text-slate-700 uppercase block">
                  4 Multiple Choice Options (A, B, C, D)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600">Option A:</span>
                    <input
                      type="text"
                      required
                      value={formData.optionA}
                      onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600">Option B:</span>
                    <input
                      type="text"
                      required
                      value={formData.optionB}
                      onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600">Option C:</span>
                    <input
                      type="text"
                      required
                      value={formData.optionC}
                      onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600">Option D:</span>
                    <input
                      type="text"
                      required
                      value={formData.optionD}
                      onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Correct Answer</label>
                <select
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-emerald-800"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex justify-end gap-2">
                <GlassButton variant="glass" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </GlassButton>
                <GlassButton variant="primary" size="sm" type="submit" loading={submitting}>
                  Save to Question Bank
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
