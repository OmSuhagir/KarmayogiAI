import React, { useEffect, useState } from 'react';
import {
  FiHelpCircle,
  FiPlus,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiX,
  FiCheckCircle,
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
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
              {questions.length} Items in Production Bank
            </span>
            <span className="text-[11px] text-[#8A8882]">National Examination Items</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-1.5">
            Approved Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-[#62615D] mt-0.5">
            Validated 4-option MCQs across all 6 core official competencies, serving role evaluations and readiness exams.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <GlassButton
            variant="primary"
            size="sm"
            icon={FiPlus}
            onClick={handleOpenCreate}
          >
            Add Question
          </GlassButton>
          <GlassButton
            variant="secondary"
            size="sm"
            icon={FiRefreshCw}
            loading={loading}
            onClick={loadData}
          >
            Refresh
          </GlassButton>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-2.5 text-[#8A8882] text-xs" />
          <input
            type="text"
            placeholder="Search by question text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] placeholder:text-[#8A8882] focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={competencyFilter}
            onChange={(e) => setCompetencyFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] font-medium focus:outline-none"
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
            className="px-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] font-medium focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="1">L1 - Basic</option>
            <option value="2">L2 - Working</option>
            <option value="3">L3 - Proficient</option>
            <option value="4">L4 - Advanced</option>
            <option value="5">L5 - Expert</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#8A8882] space-y-2">
          <FiRefreshCw className="animate-spin text-[#111111] text-xl mx-auto" />
          <p>Loading questions from database...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 text-center text-xs text-[#8A8882]">
          No approved questions match your search or filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q._id || idx}
              className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                      {q.competencyId?.name || 'Competency'}
                    </span>
                    <span className="text-[10px] font-semibold text-[#111111] bg-[#F8F6F0] px-1.5 py-0.5 rounded border border-[#DDD9CF]">
                      Level {q.difficulty || 3}
                    </span>
                    <GlassBadge variant="success" size="xs">
                      Active
                    </GlassBadge>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#111111] leading-snug pt-0.5">
                    {q.question}
                  </h3>
                </div>

                <button
                  onClick={() => handleDelete(q._id)}
                  className="p-1.5 rounded text-[#8A8882] hover:text-[#A54C45] hover:bg-[#F8E9E7] transition-colors self-end sm:self-start"
                  title="Delete Question"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {(q.options || []).map((opt) => {
                  const isCorrect = opt.id === q.correctAnswer;
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
            </div>
          ))}
        </div>
      )}

      {/* CREATE QUESTION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[85vh] bg-[#FFFDF8] rounded-2xl border border-[#DDD9CF] p-6 shadow-xl space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDD9CF] pb-3">
              <h3 className="text-sm font-bold text-[#111111]">Add Item to Question Bank</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-[#8A8882] hover:text-[#111111]"
              >
                <FiX className="text-base" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#111111] uppercase">Competency</label>
                  <select
                    value={formData.competencyId}
                    onChange={(e) => setFormData({ ...formData, competencyId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111]"
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
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111]"
                  >
                    <option value="1">L1 - Basic</option>
                    <option value="2">L2 - Working</option>
                    <option value="3">L3 - Proficient</option>
                    <option value="4">L4 - Advanced</option>
                    <option value="5">L5 - Expert</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111111] uppercase">Question Prompt</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter the official question prompt..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111]"
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-[#DDD9CF]">
                <label className="text-[11px] font-bold text-[#111111] uppercase block">
                  4 Options (A, B, C, D)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Option A"
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Option B"
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Option C"
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Option D"
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-[#111111] uppercase">Correct Option</label>
                <select
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs font-semibold text-[#111111]"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div className="pt-2 border-t border-[#DDD9CF] flex justify-end gap-2">
                <GlassButton variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
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
