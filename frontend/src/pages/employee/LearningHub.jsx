import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiPlay,
  FiAward,
  FiArrowRight,
  FiRefreshCw,
  FiExternalLink,
} from 'react-icons/fi';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';
import ProgressBar from '../../components/common/ProgressBar';

export default function LearningHub() {
  const navigate = useNavigate();

  // Simulated state of active courses
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Learning Hub
            </h1>
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {completedCount} of {courses.length} Completed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track module completion across enrolled iGOT Karmayogi courses to prepare for reassessment.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="sm"
          iconRight={FiArrowRight}
          onClick={() => navigate('/employee/recommendations')}
        >
          Find More Courses
        </GlassButton>
      </div>

      {/* Courses List */}
      <div className="space-y-3">
        {courses.map((course) => (
          <GlassCard key={course.id} className="p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <GlassBadge variant="default" size="xs">
                    {course.provider}
                  </GlassBadge>
                  {course.status === 'completed' ? (
                    <GlassBadge variant="success" size="xs" dot>
                      Completed
                    </GlassBadge>
                  ) : (
                    <GlassBadge variant="warning" size="xs" dot>
                      In Progress
                    </GlassBadge>
                  )}
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {course.title}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {course.targetCompetency} &bull; {course.durationMinutes} mins total
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {course.status !== 'completed' && (
                  <GlassButton
                    size="sm"
                    variant="glass"
                    icon={FiCheckCircle}
                    onClick={() => handleUpdateProgress(course.id, 100)}
                  >
                    Mark 100%
                  </GlassButton>
                )}
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  <FiPlay className="text-xs" /> Resume on iGOT <FiExternalLink className="text-xs" />
                </a>
              </div>
            </div>

            {/* Interactive Progress Slider */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Learning Completion:</span>
                <span className="text-blue-700">{course.progress}%</span>
              </div>
              <ProgressBar
                value={course.progress}
                variant={course.status === 'completed' ? 'emerald' : 'blue'}
                size="md"
              />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Reassessment Banner */}
      {completedCount > 0 && (
        <GlassCard variant="tinted" className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-blue-200">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <GlassBadge variant="success" size="xs">
                Eligible for Reassessment
              </GlassBadge>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Ready to verify your updated competency level?
            </h3>
            <p className="text-xs text-slate-600">
              You have completed relevant learning modules. Take the role assessment to record your improvement.
            </p>
          </div>

          <GlassButton
            variant="primary"
            size="md"
            iconRight={FiArrowRight}
            onClick={() => navigate('/employee/assessments')}
          >
            Start Reassessment
          </GlassButton>
        </GlassCard>
      )}
    </div>
  );
}
