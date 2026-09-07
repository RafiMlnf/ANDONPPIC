'use client';

import React, { useState, useMemo } from 'react';
import { LineCardData } from '@/types/line';
import { LineCard } from './LineCard';

interface LineGridProps {
  lines: LineCardData[];
  onEdit?: (data: LineCardData) => void;
  clickable?: boolean;
}

export const LineGrid: React.FC<LineGridProps> = ({ lines, onEdit, clickable = false }) => {
  const [selectedArea, setSelectedArea] = useState<string>('ALL');

  // Extract unique areas
  const areas = useMemo(() => {
    const set = new Set<string>();
    lines.forEach((l) => {
      if (l.area) set.add(l.area);
    });
    return Array.from(set);
  }, [lines]);

  // Filter lines by area
  const filteredLines = useMemo(() => {
    if (selectedArea === 'ALL') return lines;
    return lines.filter((l) => l.area === selectedArea);
  }, [lines, selectedArea]);

  if (!lines || lines.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 border border-neutral-800 rounded-lg bg-neutral-950 text-neutral-400">
        <p className="text-sm font-semibold">No station lines configured.</p>
        <p className="text-xs text-neutral-500 mt-1">
          Add lines from the Lines Management page or click Reset to Default.
        </p>
      </div>
    );
  }

  // Determine grid layout based on item count:
  // 34 cards: 7 columns x 5 rows on desktop, 5 cols x 7 rows on mid screens
  const count = filteredLines.length;
  let gridClass = 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 grid-rows-5';

  if (count <= 12) {
    gridClass = 'grid-cols-3 sm:grid-cols-4 grid-rows-3';
  } else if (count <= 20) {
    gridClass = 'grid-cols-4 sm:grid-cols-5 grid-rows-4';
  } else if (count <= 28) {
    gridClass = 'grid-cols-4 sm:grid-cols-6 grid-rows-5';
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden space-y-1.5">
      {/* Top Filter Bar (Area filter tabs) */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-0.5 text-xs select-none">
        <div className="flex items-center gap-1 bg-neutral-900/90 p-0.5 rounded-lg border border-neutral-800">
          <button
            onClick={() => setSelectedArea('ALL')}
            className={`px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-colors ${
              selectedArea === 'ALL'
                ? 'bg-orange-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ALL ({lines.length})
          </button>
          {areas.map((area) => {
            const areaCount = lines.filter((l) => l.area === area).length;
            return (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-colors ${
                  selectedArea === area
                    ? 'bg-orange-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {area} ({areaCount})
              </button>
            );
          })}
        </div>

        <span className="text-[10px] text-neutral-500 font-semibold hidden sm:inline">
          Showing all {filteredLines.length} cards simultaneously
        </span>
      </div>

      {/* Cards Grid Container (100% visible on 1 screen without scrolling) */}
      <div className={`flex-1 min-h-0 grid ${gridClass} gap-1.5 sm:gap-2 h-full overflow-hidden`}>
        {filteredLines.map((line) => (
          <div key={line.id} className="min-h-0 h-full">
            <LineCard
              data={line}
              onEdit={onEdit}
              clickable={clickable}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
