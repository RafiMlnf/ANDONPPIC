'use client';

import React from 'react';

interface MetricItemProps {
  label: string;
  value: string;
  subText?: string;
}

export const MetricItem: React.FC<MetricItemProps> = ({ label, value, subText }) => {
  return (
    <div className="text-right">
      <div className="text-[10px] md:text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
        {label}
      </div>
      <div className="text-2xl md:text-3xl lg:text-[28px] font-black tracking-tight text-white leading-none">
        {value}
      </div>
      {subText && (
        <div className="text-xs text-neutral-500 font-medium mt-1">
          {subText}
        </div>
      )}
    </div>
  );
};
