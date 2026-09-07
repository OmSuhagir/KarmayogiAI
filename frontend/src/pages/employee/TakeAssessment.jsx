import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiShield,
  FiAward,
  FiRefreshCw,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
  getAssessmentById,
  getActiveAttempt,
  startAssessment,
  saveAnswer,
  submitAssessment,
} from '../../services/assessmentService';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProgressBar from '../../components/common/ProgressBar';

export default function TakeAssessment() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [screenState, setScreenState] = useState('loading'); // 'loading' | 'briefing' | 'taking' | 'submitting'
  const [assessment, setAssessment] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [remainingSeconds, setRemainingSeconds] = useState(45 * 60);
  const timerRef = useRef(null);

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const activeUserId = user?._id || '6a93d343d6ff1fa539394c77';

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        setScreenState('loading');
        const [assRes, attRes] = await Promise.all([
          getAssessmentById(id),
          getActiveAttempt(id, activeUserId),
        ]);

        if (!isMounted) return;

        if (assRes?.data) setAssessment(assRes.data);

        if (attRes?.data?.attemptId && attRes.data.questions?.length > 0) {
          setAttemptId(attRes.data.attemptId);
          setQuestions(attRes.data.questions);

          const savedMap = {};
          (attRes.data.savedAnswers || []).forEach((a) => {
            if (a.questionId && a.selectedAnswer) {
              savedMap[String(a.questionId)] = a.selectedAnswer;
            }
          });
          setAnswers(savedMap);
          setRemainingSeconds(attRes.data.remainingSeconds || 45 * 60);
          setScreenState('taking');
        } else {
          setScreenState('briefing');
        }
      } catch (err) {
        console.warn('Initialization error:', err);
        setScreenState('briefing');
      }
    }

    init();
    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id, activeUserId]);

  const handleStart = async () => {
    try {
      setScreenState('loading');
      const res = await startAssessment(id, activeUserId);
      if (res?.data?.attemptId && res.data.questions?.length > 0) {
        setAttemptId(res.data.attemptId);
        setQuestions(res.data.questions);

        const savedMap = {};
        (res.data.savedAnswers || []).forEach((a) => {
          if (a.questionId && a.selectedAnswer) {
            savedMap[String(a.questionId)] = a.selectedAnswer;
          }
        });
        setAnswers(savedMap);
        setRemainingSeconds(res.data.remainingSeconds || 45 * 60);
        setScreenState('taking');
      } else {
        alert('Could not start assessment. Please try again.');
        setScreenState('briefing');
      }
    } catch (err) {
      alert(err.message || 'Failed to start assessment.');
      setScreenState('briefing');
    }
  };

  useEffect(() => {
    if (screenState !== 'taking') return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screenState]);

  const handleSelectOption = (optionId) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const qId = String(currentQ._id);
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));

    if (attemptId) {
      saveAnswer(id, attemptId, activeUserId, qId, optionId).catch((err) => {
        console.warn('Background save answer notice:', err.message);
      });
    }
  };

  const handleClearOption = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    const qId = String(currentQ._id);
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }));

      const res = await submitAssessment(id, attemptId, activeUserId, formattedAnswers);

      if (res?.data) {
        navigate(`/employee/assessments/${id}/result`, {
          state: {
            resultData: res.data,
            assessmentTitle: assessment?.title || 'Competency Assessment',
          },
          replace: true,
        });
      }
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please verify your connection.');
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    alert('Time limit reached! Submitting your answered questions automatically.');
    handleSubmit();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex] || {};
  const currentAnswer = currentQuestion._id ? answers[String(currentQuestion._id)] : null;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length || 1;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  if (screenState === 'loading') {
    return (
      <div className="py-24 text-center text-xs text-[#8A8882] space-y-2">
        <FiRefreshCw className="animate-spin text-[#111111] text-2xl mx-auto" />
        <p>Loading assessment environment...</p>
      </div>
    );
  }

  if (screenState === 'briefing') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <button
          onClick={() => navigate('/employee/assessments')}
          className="text-xs font-semibold text-[#62615D] hover:text-[#111111] flex items-center gap-1.5"
        >
          <FiChevronLeft /> Return to Assessments
        </button>

        <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-2 border-b border-[#DDD9CF] pb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                {assessment?.positionId?.title || 'Statistical Officer'}
              </span>
              <span className="text-xs text-[#62615D] font-medium flex items-center gap-1 ml-auto">
                <FiClock /> {assessment?.durationMinutes || 45} Minutes
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              {assessment?.title || 'Official Role Competency Assessment'}
            </h1>

            <p className="text-xs sm:text-sm text-[#62615D] leading-relaxed">
              Standardized civil service evaluation designed to measure operational competencies against role benchmarks.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Assessed Competencies:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(assessment?.competencies || []).map((c, idx) => (
                <div
                  key={c.competencyId?._id || idx}
                  className="p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-semibold text-[#111111] truncate">
                      {c.competencyId?.name || 'Competency'}
                    </span>
                    {c.competencyId?.category && (
                      <span className="text-[10px] uppercase font-bold text-[#8A8882] shrink-0">
                        ({c.competencyId.category})
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#62615D] bg-[#FFFDF8] px-2 py-0.5 rounded border border-[#DDD9CF] font-medium shrink-0">
                    {c.questionCount} Qs
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#62615D] space-y-1.5">
            <span className="font-semibold text-[#111111] flex items-center gap-1.5">
              <FiShield /> Assessment Instructions:
            </span>
            <ul className="text-[11px] list-disc list-inside space-y-0.5">
              <li>Each question has 4 options with exactly 1 correct response.</li>
              <li>Your selections are saved to the server automatically.</li>
              <li>Timer runs continuously; incomplete tests auto-submit on expiry.</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <GlassButton
              variant="primary"
              size="md"
              iconRight={FiSend}
              onClick={handleStart}
            >
              Start Assessment Now
            </GlassButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* TOP BAR: TIMER & PROGRESS */}
      <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="space-y-0.5 w-full sm:w-auto">
          <h2 className="text-xs font-bold text-[#111111] truncate max-w-xs sm:max-w-md">
            {assessment?.title}
          </h2>
          <span className="text-[11px] text-[#8A8882]">
            Question {currentIndex + 1} of {questions.length} &bull; {answeredCount} Answered
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 border ${
              remainingSeconds < 300
                ? 'bg-[#F8E9E7] border-[#E8C2BF] text-[#A54C45]'
                : 'bg-[#F8F6F0] border-[#DDD9CF] text-[#111111]'
            }`}
          >
            <FiClock />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <GlassButton
            variant="primary"
            size="sm"
            onClick={() => setSubmitModalOpen(true)}
          >
            Submit Exam
          </GlassButton>
        </div>
      </div>

      <ProgressBar value={progressPercent} variant="primary" size="xs" />

      {/* QUESTION WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 space-y-5 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Question {currentIndex + 1}
                  </span>
                  {currentQuestion.category && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      currentQuestion.category?.toLowerCase() === 'behavioral'
                        ? 'bg-[#F4F1E9] text-[#111111] border-[#DDD9CF]'
                        : 'bg-[#F8F6F0] text-[#62615D] border-[#DDD9CF]'
                    }`}>
                      {currentQuestion.category?.toLowerCase() === 'behavioral' ? 'Behavioral • Situational Judgment' : 'Functional / Technical'}
                    </span>
                  )}
                  {currentQuestion.competencyName && (
                    <span className="text-xs font-semibold text-[#62615D]">
                      &bull; {currentQuestion.competencyName}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#8A8882]">
                  Select 1 option
                </span>
              </div>

              <h2 className="text-base font-semibold text-[#111111] leading-snug">
                {currentQuestion.question || 'Loading question...'}
              </h2>
            </div>

            <div className="space-y-2.5 pt-2">
              {(currentQuestion.options || []).map((opt) => {
                const isSelected = currentAnswer === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#111111] text-[#FFFDF8] border-[#111111] shadow-xs'
                        : 'bg-[#FFFDF8] hover:bg-[#F8F6F0] border-[#DDD9CF] text-[#171717]'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isSelected
                          ? 'bg-[#FFFDF8] text-[#111111]'
                          : 'bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]'
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="text-xs sm:text-sm font-normal pt-0.5">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#DDD9CF] flex items-center justify-between">
              <button
                type="button"
                onClick={handleClearOption}
                disabled={!currentAnswer}
                className="text-xs font-medium text-[#8A8882] hover:text-[#A54C45] disabled:opacity-30 transition-colors"
              >
                Clear Selection
              </button>

              <div className="flex items-center gap-2">
                <GlassButton
                  variant="secondary"
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  icon={FiChevronLeft}
                >
                  Previous
                </GlassButton>

                {currentIndex < questions.length - 1 ? (
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    iconRight={FiChevronRight}
                  >
                    Next
                  </GlassButton>
                ) : (
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => setSubmitModalOpen(true)}
                    iconRight={FiCheckCircle}
                  >
                    Review & Submit
                  </GlassButton>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* QUESTION NAVIGATOR PALETTE */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-4 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Question Navigator
            </h3>

            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(answers[String(q._id)]);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q._id || idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 rounded font-semibold text-xs transition-colors flex items-center justify-center border ${
                      isCurrent
                        ? 'bg-[#111111] text-[#FFFDF8] border-[#111111]'
                        : isAnswered
                        ? 'bg-[#EAF2EC] text-[#52745D] border-[#C5DDCB]'
                        : 'bg-[#F8F6F0] text-[#62615D] border-[#DDD9CF] hover:bg-[#EAE6DB]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#DDD9CF] space-y-1 text-[10px] text-[#62615D]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#EAF2EC] border border-[#C5DDCB]" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#F8F6F0] border border-[#DDD9CF]" />
                <span>Unanswered ({questions.length - answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#111111]" />
                <span>Current</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FFFDF8] rounded-2xl border border-[#DDD9CF] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDD9CF] pb-3">
              <h3 className="text-sm font-bold text-[#111111]">
                Submit Assessment
              </h3>
              {!submitting && (
                <button
                  onClick={() => setSubmitModalOpen(false)}
                  className="p-1 rounded text-[#8A8882] hover:text-[#111111]"
                >
                  <FiX className="text-base" />
                </button>
              )}
            </div>

            {submitError && (
              <div className="p-2.5 rounded bg-[#F8E9E7] border border-[#E8C2BF] text-[#A54C45] text-xs">
                {submitError}
              </div>
            )}

            <div className="space-y-2 text-xs text-[#62615D]">
              <div className="p-3 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] space-y-1">
                <div className="flex justify-between font-semibold text-[#111111]">
                  <span>Answered Questions:</span>
                  <span>{answeredCount} of {questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unanswered Questions:</span>
                  <span>{questions.length - answeredCount}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#8A8882]">
                Your responses will be graded authoritatively on the server, updating your official competency profile.
              </p>
            </div>

            <div className="pt-2 border-t border-[#DDD9CF] flex justify-end gap-2">
              <GlassButton
                variant="secondary"
                size="sm"
                disabled={submitting}
                onClick={() => setSubmitModalOpen(false)}
              >
                Return
              </GlassButton>

              <GlassButton
                variant="primary"
                size="sm"
                loading={submitting}
                onClick={handleSubmit}
              >
                {submitting ? 'Evaluating...' : 'Confirm Submission'}
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
