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
  FiHelpCircle,
  FiAward,
  FiRefreshCw,
  FiX,
  FiInfo,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
  getAssessmentById,
  getActiveAttempt,
  startAssessment,
  saveAnswer,
  submitAssessment,
} from '../../services/assessmentService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProgressBar from '../../components/common/ProgressBar';

export default function TakeAssessment() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Screen State: 'loading' | 'briefing' | 'taking' | 'submitting'
  const [screenState, setScreenState] = useState('loading');
  const [assessment, setAssessment] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }

  // Timer State
  const [remainingSeconds, setRemainingSeconds] = useState(45 * 60);
  const timerRef = useRef(null);

  // Submit Modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const activeUserId = user?._id || '6a93d343d6ff1fa539394c77';

  // 1. Check for existing active attempt or load briefing
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

        if (assRes?.data) {
          setAssessment(assRes.data);
        }

        // If an active attempt is already in progress, resume it
        if (attRes?.data?.attemptId && attRes.data.questions?.length > 0) {
          setAttemptId(attRes.data.attemptId);
          setQuestions(attRes.data.questions);

          // Restore previously saved answers
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

  // 2. Start Assessment Action
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

  // 3. Countdown Timer Hook
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

  // 4. Real-Time Answer Selection with Backend Persistence
  const handleSelectOption = (optionId) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const qId = String(currentQ._id);
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));

    // Persist to backend in background (tolerant of reloads)
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

  // 5. Final Submission Handler
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

  // Format Timer
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex] || {};
  const currentAnswer = currentQuestion._id ? answers[String(currentQuestion._id)] : null;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length || (assessment?.competencies || []).reduce((a, c) => a + (c.questionCount || 0), 0);
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // -------------------------------------------------------------
  // VIEW: LOADING
  // -------------------------------------------------------------
  if (screenState === 'loading') {
    return (
      <div className="py-24 text-center text-xs text-slate-400 space-y-3">
        <FiRefreshCw className="animate-spin text-indigo-600 text-3xl mx-auto" />
        <p className="font-semibold text-slate-600">Preparing assessment environment...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: BRIEFING & PRE-START RULES
  // -------------------------------------------------------------
  if (screenState === 'briefing') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/employee/assessments')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
        >
          <FiChevronLeft /> Return to Assessments
        </button>

        {/* Briefing Card */}
        <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-6 shadow-glass">
          
          {/* Header */}
          <div className="space-y-2 border-b border-slate-200/60 pb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <GlassBadge variant="primary" size="xs">
                {assessment?.positionId?.title || 'Statistical Officer'}
              </GlassBadge>
              <GlassBadge variant="purple" size="xs">
                National Examination
              </GlassBadge>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 ml-auto">
                <FiClock className="text-indigo-600" /> {assessment?.durationMinutes || 45} Minutes
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {assessment?.title || 'Statistical Officer Baseline Competency Assessment'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Official evaluation designed to measure operational competencies against role benchmarks under the Mission Karmayogi National Programme for Civil Services Capacity Building.
            </p>
          </div>

          {/* Competencies Evaluated */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Target Competencies Assessed in this Exam:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(assessment?.competencies || []).map((c, idx) => (
                <div
                  key={c.competencyId?._id || idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-slate-800 truncate pr-2">
                    {c.competencyId?.name || 'Competency'}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {c.questionCount} Questions
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Examination Guidelines */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 space-y-2 text-left">
            <div className="flex items-center gap-2 font-bold text-indigo-900">
              <FiShield className="text-indigo-600 text-sm" />
              <span>Standard Assessment Rules:</span>
            </div>
            <ul className="space-y-1 text-[11px] text-indigo-900/80 list-disc list-inside">
              <li>Each question has exactly 4 options with 1 correct answer.</li>
              <li>There is no negative marking for incorrect responses.</li>
              <li>Your answers are automatically saved to the database in real time.</li>
              <li>The server timer runs continuously. Unsubmitted exams auto-submit on expiry.</li>
              <li>Results directly calibrate your official competency score and training recommendations.</li>
            </ul>
          </div>

          {/* Start CTA */}
          <div className="pt-2 flex justify-end">
            <GlassButton
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-8 justify-center bg-gradient-to-r from-indigo-700 to-slate-900 hover:from-indigo-800 hover:to-black text-white shadow-md shadow-indigo-500/20"
              iconRight={FiSend}
              onClick={handleStart}
            >
              Start Assessment Now
            </GlassButton>
          </div>

        </GlassCard>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: TAKING ASSESSMENT (EXAM ENGINE)
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-left">
      
      {/* TOP BAR: TIMER & PROGRESS */}
      <GlassCard className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-white/80">
        
        {/* Title & Question Count */}
        <div className="space-y-1 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <GlassBadge variant="purple" size="xs">
              Live Examination
            </GlassBadge>
            <span className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
              {assessment?.title}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium block">
            Question {currentIndex + 1} of {questions.length} &bull; {answeredCount} Answered
          </span>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div
            className={`px-4 py-2 rounded-xl font-mono text-sm font-extrabold flex items-center gap-2 border shadow-xs transition-all ${
              remainingSeconds < 300
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}
          >
            <FiClock className={remainingSeconds < 300 ? 'text-rose-600' : 'text-indigo-600'} />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <GlassButton
            variant="primary"
            size="sm"
            className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white"
            onClick={() => setSubmitModalOpen(true)}
          >
            Submit Exam
          </GlassButton>
        </div>
      </GlassCard>

      {/* OVERALL PROGRESS BAR */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-1">
          <span>Overall Progress</span>
          <span>{progressPercent}% Complete ({answeredCount}/{questions.length})</span>
        </div>
        <ProgressBar value={progressPercent} color="indigo" size="sm" />
      </div>

      {/* MAIN QUESTION WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT / CENTER: CURRENT QUESTION & OPTIONS */}
        <div className="lg:col-span-3 space-y-5">
          <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 space-y-6 shadow-glass">
            
            {/* Question Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                  Question {currentIndex + 1}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Select 1 correct answer
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQuestion.question || 'Loading question text...'}
              </h2>
            </div>

            {/* 4 Option Radio Cards (A, B, C, D) */}
            <div className="space-y-3 pt-2">
              {(currentQuestion.options || []).map((opt) => {
                const isSelected = currentAnswer === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-500 shadow-sm text-indigo-950 ring-2 ring-indigo-500/20'
                        : 'bg-white/70 hover:bg-white border-slate-200 text-slate-700 hover:border-indigo-200'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {opt.id}
                    </div>

                    <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Question Footer Actions */}
            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
              <button
                type="button"
                onClick={handleClearOption}
                disabled={!currentAnswer}
                className="text-xs font-semibold text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
              >
                Clear Selection
              </button>

              <div className="flex items-center gap-2">
                <GlassButton
                  variant="glass"
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
                    className="bg-indigo-700 text-white"
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    iconRight={FiChevronRight}
                  >
                    Next Question
                  </GlassButton>
                ) : (
                  <GlassButton
                    variant="primary"
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white"
                    onClick={() => setSubmitModalOpen(true)}
                    iconRight={FiCheckCircle}
                  >
                    Review & Submit
                  </GlassButton>
                )}
              </div>
            </div>

          </GlassCard>
        </div>

        {/* RIGHT: QUESTION NAVIGATOR PALETTE */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Question Navigator
            </h3>

            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(answers[String(q._id)]);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q._id || idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
                      isCurrent
                        ? 'bg-indigo-700 text-white border-indigo-700 ring-2 ring-indigo-300 shadow-sm'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-200/60 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block" />
                <span>Unanswered ({questions.length - answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-indigo-700 inline-block" />
                <span>Current Question</span>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* CONFIRMATION SUBMISSION MODAL */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 p-6 shadow-glass-lg space-y-5 text-left">
            
            <div className="flex items-start justify-between border-b border-slate-200/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FiCheckCircle className="text-lg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Submit Assessment
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Official evaluation finalization
                  </span>
                </div>
              </div>

              {!submitting && (
                <button
                  onClick={() => setSubmitModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <FiX className="text-lg" />
                </button>
              )}
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <FiAlertCircle className="text-sm flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Answered Questions:</span>
                  <span className="text-emerald-700">{answeredCount} of {questions.length}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Unanswered Items:</span>
                  <span>{questions.length - answeredCount}</span>
                </div>
              </div>

              {questions.length - answeredCount > 0 ? (
                <p className="text-amber-800 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  Notice: You have {questions.length - answeredCount} unanswered items. Unanswered questions will receive 0 marks.
                </p>
              ) : (
                <p className="text-emerald-800 font-semibold">
                  You have completed all {questions.length} questions.
                </p>
              )}

              <p className="text-slate-500 text-[11px]">
                Upon submission, your answers will be authoritatively graded on the backend, updating your official competency profile and generating tailored learning recommendations.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex justify-end gap-2.5">
              <GlassButton
                variant="glass"
                size="sm"
                disabled={submitting}
                onClick={() => setSubmitModalOpen(false)}
              >
                Return to Exam
              </GlassButton>

              <GlassButton
                variant="primary"
                size="sm"
                loading={submitting}
                className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs"
                onClick={handleSubmit}
              >
                {submitting ? 'Evaluating Submission...' : 'Confirm Final Submission'}
              </GlassButton>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
