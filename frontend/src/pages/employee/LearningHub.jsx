import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiPlay,
  FiArrowRight,
  FiExternalLink,
} from 'react-icons/fi';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProgressBar from '../../components/common/ProgressBar';

export default function LearningHub() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([
    {
      id: 'course-1',
      title: 'Python for Data Analysis & Tabular Processing',
      provider: 'iGOT Karmayogi',
      durationMinutes: 150,
      targetCompetency: 'Python for Data Analysis (Target: Level 3)',
      progress: 60,
      status: 'in_progress',
      url: 'https://igotkarmayogi.gov.in',
    },
    {
      id: 'course-2',
      title: 'Sampling Techniques and Survey Design',
      provider: 'iGOT Karmayogi',
      durationMinutes: 180,
      targetCompetency: 'Sampling Design (Target: Level 4)',
      progress: 25,
      status: 'in_progress',
      url: 'https://igotkarmayogi.gov.in',
    },
    {
      id: 'course-3',
      title: 'Data Quality Management & Validation Procedures',
      provider: 'iGOT Karmayogi',
      durationMinutes: 140,
      targetCompetency: 'Data Quality Management (Target: Level 4)',
      progress: 100,
      status: 'completed',
      url: 'https://igotkarmayogi.gov.in',
    },
  ]);

  const handleUpdateProgress = (courseId, newProgress) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const clamped = Math.min(100, Math.max(0, newProgress));
          return {
            ...c,
            progress: clamped,
            status: clamped === 100 ? 'completed' : 'in_progress',
          };
        }
        return c;
      })
    );
  };

  const completedCount = courses.filter((c) => c.status === 'completed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Clean Page Header */}
      <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
              {completedCount} of {courses.length} Completed
            </span>
            <span className="text-[11px] text-[#8A8882]">Integrated with iGOT Karmayogi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-1.5">
            Learning Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#62615D] mt-0.5">
            Active courses assigned to close open competency gaps. Completing courses unlocks official reassessment.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="sm"
          iconRight={FiArrowRight}
          onClick={() => navigate('/employee/recommendations')}
        >
          Explore Courses
        </GlassButton>
      </div>

      {/* Courses List */}
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 space-y-3 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F8F6F0] text-[#62615D] border border-[#DDD9CF]">
                    {course.provider}
                  </span>
                  {course.status === 'completed' ? (
                    <GlassBadge variant="success" size="xs">
                      Completed
                    </GlassBadge>
                  ) : (
                    <GlassBadge variant="warning" size="xs">
                      In Progress
                    </GlassBadge>
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#111111]">
                  {course.title}
                </h2>
                <p className="text-xs text-[#62615D]">
                  {course.targetCompetency} &bull; {course.durationMinutes} mins
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {course.status !== 'completed' && (
                  <GlassButton
                    size="xs"
                    variant="secondary"
                    icon={FiCheckCircle}
                    onClick={() => handleUpdateProgress(course.id, 100)}
                  >
                    Mark Complete
                  </GlassButton>
                )}
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#111111] hover:bg-[#222222] text-[#FFFDF8] transition-colors"
                >
                  <FiPlay className="text-xs" /> Resume on iGOT <FiExternalLink className="text-xs" />
                </a>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-medium text-[#62615D] mb-1">
                <span>Progress:</span>
                <span className="text-[#111111] font-semibold">{course.progress}%</span>
              </div>
              <ProgressBar
                value={course.progress}
                variant={course.status === 'completed' ? 'emerald' : 'primary'}
                size="sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Reassessment Banner */}
      {completedCount > 0 && (
        <div className="rounded-xl bg-[#FFFDF8] border border-[#DDD9CF] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAF2EC] text-[#52745D] border border-[#C5DDCB]">
              Eligible for Reassessment
            </span>
            <h3 className="text-sm font-bold text-[#111111]">
              Ready to verify your updated competency level?
            </h3>
            <p className="text-xs text-[#62615D]">
              You have completed relevant modules. Take the role assessment to record your verified progression.
            </p>
          </div>

          <GlassButton
            variant="primary"
            size="sm"
            iconRight={FiArrowRight}
            onClick={() => navigate('/employee/assessments')}
          >
            Start Reassessment
          </GlassButton>
        </div>
      )}
    </div>
  );
}
