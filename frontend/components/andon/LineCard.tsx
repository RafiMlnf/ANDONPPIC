'use client';

import React from 'react';
import { LineCardData } from '@/types/line';

interface LineCardProps {
  data: LineCardData;
  onEdit?: (data: LineCardData) => void;
  clickable?: boolean;
}

// Distinct solid text colors per Area on solid black background
const getAreaTextColor = (area?: string, code?: string) => {
  const upperArea = (area || '').toUpperCase().trim();
  if (upperArea === 'ASSY') return 'text-[#fbbf24]'; // Amber Gold
  if (upperArea === 'MACHINING') return 'text-[#38bdf8]'; // Electric Sky Cyan
  if (upperArea === 'FORGING') return 'text-[#f97316]'; // Vivid Orange
  if (upperArea === 'PPIC' || upperArea === 'QC') return 'text-[#34d399]'; // Luminous Emerald

  // Dynamic fallback palette for other line areas
  const colors = [
    'text-[#fbbf24]',
    'text-[#38bdf8]',
    'text-[#f97316]',
    'text-[#34d399]',
    'text-[#c084fc]',
    'text-[#f472b6]',
  ];
  let hash = 0;
  const str = upperArea || code || 'DEFAULT';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const LineCard: React.FC<LineCardProps> = ({
  data,
  onEdit,
  clickable = false,
}) => {
  const isRed = data.status === 'RED';
  const isYellow = data.status === 'YELLOW';
  const isGray = data.status === 'GRAY';

  // Card color styling with +20 hue shift gradient towards bottom-right (135deg)
  // RED: Base Hue 356° -> +20° Hue 16° (Vivid Orange-Red)
  // YELLOW: Base Hue 48° -> +20° Hue 68° (Radiant Chartreuse-Gold)
  // GREEN: Base Hue 148° -> +20° Hue 168° (Luminous Teal-Emerald)
  // GRAY: Neutral Dark Slate (Line Off / No Production / Error)
  const bgStyle = isRed
    ? 'bg-[linear-gradient(135deg,hsl(356,85%,44%)_0%,hsl(16,95%,48%)_100%)] text-white shadow-red-950/30'
    : isYellow
    ? 'bg-[linear-gradient(135deg,hsl(48,100%,46%)_0%,hsl(68,96%,45%)_100%)] text-black shadow-yellow-950/30'
    : isGray
    ? 'bg-[linear-gradient(135deg,hsl(220,10%,16%)_0%,hsl(220,10%,11%)_100%)] text-neutral-400 border border-neutral-800/80 shadow-neutral-950/60'
    : 'bg-[linear-gradient(135deg,hsl(148,100%,33%)_0%,hsl(168,100%,33%)_100%)] text-white shadow-green-950/30';

  const labelColor = isYellow ? 'text-black/80' : isGray ? 'text-neutral-500' : 'text-white/80';
  const subValueColor = isYellow ? 'text-black/75' : isGray ? 'text-neutral-500/70' : 'text-white/75';
  const borderColor = isYellow ? 'border-black/15' : isGray ? 'border-neutral-800/80' : 'border-white/15';

  return (
    <div
      onClick={() => clickable && onEdit?.(data)}
      className={`relative flex flex-col justify-between h-full w-full rounded-md shadow p-1.5 sm:p-2 select-none transition-all duration-150 overflow-hidden ${bgStyle} ${
        clickable ? 'cursor-pointer hover:brightness-105 active:scale-[0.99]' : ''
      }`}
    >
      {/* Solid Black Badge aligned top-right (inset top-1.5 right-1.5, not touching edge) */}
      {data.area && (
        <span
          className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-black border border-black shadow-md z-10 select-none ${
            isGray ? 'opacity-50' : ''
          } ${getAreaTextColor(
            data.area,
            data.code
          )}`}
        >
          {data.area}
        </span>
      )}

      {/* Top section: Station Code (Nama Line Singkatan) */}
      <div className="flex items-start justify-between min-w-0 leading-none pr-14">
        <h2 className={`text-xs sm:text-sm lg:text-base xl:text-lg font-black tracking-tight uppercase truncate ${isGray ? 'text-neutral-400/90' : ''}`} title={data.code}>
          {data.code}
        </h2>
      </div>

      {/* Subtitle Line Name */}
      {data.name && (
        <p className={`text-[10px] sm:text-xs font-semibold truncate leading-tight mt-0.5 ${labelColor}`}>
          {data.name}
        </p>
      )}

      {/* Main Metric Value & Change (Redup jika GRAY / Off / Eror) */}
      <div className="text-right my-auto py-0.5">
        <div className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl tracking-tighter leading-none truncate ${
          isGray ? 'font-extrabold text-neutral-400/75' : 'font-black'
        }`}>
          {data.value}
        </div>
        <div className={`text-[10px] sm:text-xs font-semibold mt-1 leading-none ${
          isGray ? 'text-neutral-500/80 font-normal tracking-wide' : subValueColor
        }`}>
          {data.change}
        </div>
      </div>

    </div>
  );
};
