import React from 'react';

/**
 * Flagship government competency proficiency scale.
 * Renders L1 through L5 with clear markers:
 *  - ● Current Level (Filled, Primary Black / Accent)
 *  - ○ Target / Required Level (Outlined Ring)
 * Displays level numbers, status labels, and gap delta.
 */
export default function ProficiencyScale({
  currentLevel = 1,
  targetLevel = 1,
  showLabels = true,
  compact = false,
  className = '',
}) {
  const levels = [
    { level: 1, name: 'L1', title: 'Basic' },
    { level: 2, name: 'L2', title: 'Working' },
    { level: 3, name: 'L3', title: 'Proficient' },
    { level: 4, name: 'L4', title: 'Advanced' },
    { level: 5, name: 'L5', title: 'Expert' },
  ];

  const current = Math.min(5, Math.max(0, Number(currentLevel) || 0));
  const target = Math.min(5, Math.max(0, Number(targetLevel) || 0));
  const gap = Math.max(0, target - current);

  return (
    <div className={`w-full ${className}`}>
      {/* Track Container */}
      <div className="relative flex items-center justify-between py-2">
        {/* Background Connecting Line */}
        <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-0.5 bg-[#DDD9CF]" />

        {/* Highlighted Progress Range (from L1 up to current level) */}
        {current > 1 && (
          <div
            className="absolute left-2 top-1/2 -translate-y-1/2 h-0.5 bg-[#111111] transition-all duration-300"
            style={{ width: `${((current - 1) / 4) * 100}%` }}
          />
        )}

        {/* Gap Highlight Range (between current and target, if gap exists) in Transparent Carmine */}
        {gap > 0 && target > current && (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-[#960018]/30 border-t border-dashed border-[#960018] transition-all duration-300"
            style={{
              left: `calc(8px + ${((current - 1) / 4) * 100}%)`,
              width: `${((target - current) / 4) * 100}%`,
            }}
          />
        )}

        {/* Level Nodes */}
        {levels.map((item) => {
          const isCurrent = current === item.level;
          const isTarget = target === item.level;
          const isPassed = current > item.level;
          const isBetweenGap = item.level > current && item.level < target;

          return (
            <div key={item.level} className="relative z-10 flex flex-col items-center">
              {/* Node Circle */}
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                  compact ? 'w-5 h-5 text-[10px]' : 'w-7 h-7 text-xs font-semibold'
                } ${
                  isCurrent && isTarget
                    ? 'bg-[#52745D] text-white border-2 border-[#52745D] shadow-xs'
                    : isCurrent
                    ? 'bg-[#111111] text-white border-2 border-[#111111] shadow-xs'
                    : isTarget
                    ? 'bg-[#960018]/10 text-[#960018] border-2 border-[#960018] shadow-xs'
                    : isPassed
                    ? 'bg-[#111111] text-white border-2 border-[#111111]'
                    : isBetweenGap
                    ? 'bg-[#960018]/5 text-[#960018] border-2 border-dashed border-[#960018]/30'
                    : 'bg-[#FFFDF8] text-[#8A8882] border-2 border-[#DDD9CF]'
                }`}
                title={`${item.title} (Level ${item.level})`}
              >
                {isCurrent && !isTarget ? (
                  <span className="w-2 h-2 rounded-full bg-white" />
                ) : isTarget && !isCurrent ? (
                  <span className="w-2 h-2 rounded-full border border-[#960018] bg-[#960018]/20" />
                ) : (
                  <span>{item.level}</span>
                )}
              </div>

              {/* Sub-label under node */}
              {showLabels && !compact && (
                <div className="mt-1.5 flex flex-col items-center text-center">
                  <span
                    className={`text-[11px] font-medium ${
                      isCurrent
                        ? 'text-[#111111] font-semibold'
                        : isTarget
                        ? 'text-[#960018] font-semibold'
                        : 'text-[#8A8882]'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="text-[9px] text-[#8A8882] hidden sm:block">
                    {item.title}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend & Summary Row */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-[#62615D]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#111111]" />
            <span>Current: <strong>L{current}</strong></span>
          </span>
          {target > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-[#960018] bg-[#960018]/20" />
              <span>Target: <strong>L{target}</strong></span>
            </span>
          )}
        </div>

        <div>
          {gap > 0 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#960018]/10 text-[#960018] border border-[#960018]/25">
              Gap: +{gap} {gap === 1 ? 'Level' : 'Levels'}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#EAF2EC] text-[#52745D] border border-[#C5DDCB]">
              Requirement Met
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
