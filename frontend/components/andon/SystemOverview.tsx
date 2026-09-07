'use client';

import React from 'react';
import Link from 'next/link';
import { Settings2, ExternalLink } from 'lucide-react';
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

        {/* System Overview label & Overall Quality composite card */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-neutral-300 uppercase">
              SYSTEM OVERVIEW
            </span>
            {totalLines !== undefined && (
              <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-semibold">
                {totalLines} Stations
              </span>
            )}
          </div>

          <CompositeCard
            label={overview?.overallQuality.label || 'Composite'}
            changePercent={overview?.overallQuality.changePercent || '-0.05%'}
            changeAbsolute={overview?.overallQuality.changeAbsolute || '-3.14'}
            trend={overview?.overallQuality.trend || 'down'}
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-800/80 w-full shrink-0" />

        {/* Metrics List */}
        <div className="space-y-2 sm:space-y-3 xl:space-y-4">
          <MetricItem
            label="TOTAL LINE"
            value={overview?.metrics.totalLines || (totalLines !== undefined ? `${totalLines} LINES` : '34 LINES')}
          />
          <MetricItem
            label="TOTAL PART PRODUCED"
            value={overview?.metrics.totalProducedParts || '17,239 Pcs'}
          />
          <MetricItem
            label="OVERALL ACHIEVEMENT"
            value={overview?.metrics.overallAchievement || '96.4%'}
          />
        </div>
      </div>

      {/* Bottom Link to Manage Lines Page */}
      <div className="pt-2 sm:pt-3 border-t border-neutral-800/80 shrink-0">
        <Link
          href="/lines"
          className="flex items-center justify-between px-2.5 py-1.5 sm:py-2 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-[11px] sm:text-xs font-semibold text-neutral-300 hover:text-white transition-colors border border-neutral-800 group"
        >
          <div className="flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-orange-500 group-hover:rotate-45 transition-transform" />
            <span>Manage Lines (CRUD)</span>
          </div>
          <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
        </Link>
      </div>
    </aside>
  );
};
