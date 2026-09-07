'use client';

import React from 'react';
import { Header } from './Header';
import { CompositeCard } from './CompositeCard';
import { MetricItem } from './MetricItem';
import { SystemOverviewData } from '@/types/line';

interface SystemOverviewProps {
  overview?: SystemOverviewData;
  totalLines?: number;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ overview, totalLines }) => {
  return (
    <aside className="w-full lg:w-[260px] xl:w-[300px] shrink-0 flex flex-col justify-between h-full min-h-0 py-1 px-1 text-white select-none overflow-hidden">
      {/* Top branding & Clock */}
      <div className="flex-1 flex flex-col justify-between min-h-0 space-y-2 sm:space-y-3 xl:space-y-4">
        <Header
          title={overview?.title || 'ANDON'}
          subtitle={overview?.subtitle || 'PPIC'}
          dashboardName={overview?.dashboardName || 'Production Planning and Inventory Control'}
          customShift={overview?.shift}
        />

        {/* Overall Quality / Composite Card */}
        <div className="my-auto">
          <CompositeCard
            label={overview?.overallQuality.label || 'Composite'}
            changePercent={overview?.overallQuality.changePercent || '-0.05%'}
            changeAbsolute={overview?.overallQuality.changeAbsolute || '-3.14'}
            trend={overview?.overallQuality.trend || 'down'}
          />
        </div>

        {/* Key Summary Metrics Stack */}
        <div className="space-y-1.5 sm:space-y-2">
          <MetricItem
            label="TOTAL LINES"
            value={totalLines ? `${totalLines} LINES` : overview?.metrics.totalLines || '34 LINES'}
          />
          <MetricItem
            label="TOTAL PRODUCED PARTS"
            value={overview?.metrics.totalProducedParts || '17,239 Pcs'}
          />
          <MetricItem
            label="OVERALL ACHIEVEMENT"
            value={overview?.metrics.overallAchievement || '96.4%'}
          />
        </div>
      </div>
    </aside>
  );
};
