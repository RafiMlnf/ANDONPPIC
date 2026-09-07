'use client';

import React from 'react';
import { TriangleAlert, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface CompositeCardProps {
  label?: string;
  changePercent?: string;
  changeAbsolute?: string;
  trend?: 'up' | 'down';
}

export const CompositeCard: React.FC<CompositeCardProps> = ({
  label = 'Composite',
  changePercent = '-0.05%',
  changeAbsolute = '-3.14',
  trend = 'down',
}) => {
  const isDown = trend === 'down';

  return (
    <div className="bg-[#111317] border border-[#222730] rounded-lg p-4 transition-colors">
      <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-3">
        OVERALL PPIC
      </span>

      <div className="flex items-center justify-between">
        {/* Left: Indicator & Title */}
        <div className="flex items-center gap-2">
          <span className="text-red-500 inline-block text-xs">▼</span>
          <span className="text-xl md:text-2xl font-black tracking-tight text-white">
            {label}
          </span>
        </div>

        {/* Right: Change values */}
        <div className="text-right">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
            CHANGE
          </span>
          <div className="text-sm md:text-base font-extrabold text-red-500 leading-tight">
            {changePercent}
          </div>
          <div className="text-xs font-semibold text-red-500/80">
            {changeAbsolute}
          </div>
        </div>
      </div>
    </div>
  );
};
