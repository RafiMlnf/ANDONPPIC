'use client';

import React, { useState, useEffect } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  dashboardName?: string;
  customShift?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'ANDON',
  subtitle = 'PPIC',
  dashboardName = 'Production Planning and Inventory Control',
  customShift,
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [shift, setShift] = useState<string>('Shift 2');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format Date: e.g. "19 Oct 2026"
      const day = now.getDate();
      const month = now.toLocaleString('en-US', { month: 'short' });
      const year = now.getFullYear();
      setDateString(`${day} ${month} ${year}`);

      // Format Time: e.g. "14:42:45"
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${hours}:${minutes}:${seconds}`);

      // Calculate shift if not customized
      if (!customShift) {
        const currentHour = now.getHours();
        if (currentHour >= 6 && currentHour < 14) {
          setShift('Shift 1');
        } else if (currentHour >= 14 && currentHour < 22) {
          setShift('Shift 2');
        } else {
          setShift('Shift 3');
        }
      } else {
        setShift(customShift);
      }
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, [customShift]);

  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-none text-white">
          {title}
        </h1>
        <div className="text-2xl lg:text-3xl font-black tracking-tight leading-none text-blue-500 mt-1">
          {subtitle}
        </div>
      </div>

      <div className="pt-2 text-xs text-neutral-400 font-medium space-y-0.5">
        <div>{dashboardName}</div>
        <div className="text-neutral-300 font-semibold tracking-wide">
          {dateString && timeString ? (
            <span>
              {dateString} | {timeString} | {shift}
            </span>
          ) : (
            <span>19 Oct 2026 | 14:42:45 | Shift 2</span>
          )}
        </div>
      </div>
    </div>
  );
};
