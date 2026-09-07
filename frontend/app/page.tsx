'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchLines } from '@/lib/api';
import { LineCardData } from '@/types/line';
import { INITIAL_OVERVIEW } from '@/lib/initialData';
import { NavigationBar } from '@/components/ui/NavigationBar';
import { SystemOverview } from '@/components/andon/SystemOverview';
import { LineGrid } from '@/components/andon/LineGrid';

export default function AndonDashboardPage() {
  const [lines, setLines] = useState<LineCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchLines();
      setLines(data);
    } catch (err) {
      console.error('Failed to load lines', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Re-fetch when lines are edited or synced
    const handleUpdate = () => loadData();
    window.addEventListener('andon-lines-updated', handleUpdate);
    return () => window.removeEventListener('andon-lines-updated', handleUpdate);
  }, [loadData]);

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-black text-white flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Navigation Bar (Toggle Live vs CRUD & Fullscreen) */}
      <div className="shrink-0">
        <NavigationBar onRefresh={loadData} isRefreshing={isLoading} />
      </div>

      {/* Main Andon Board Content - Perfectly fills 100% of remaining screen height without scrolling */}
      <div className="flex-1 min-h-0 w-full p-2 sm:p-3 lg:p-4 flex flex-col lg:flex-row gap-3 lg:gap-5 items-stretch overflow-hidden">
        {/* Left Side: System Overview Panel */}
        <SystemOverview
          overview={INITIAL_OVERVIEW}
          totalLines={lines.length}
        />

        {/* Right Side: Stations / Lines 3-Column Grid */}
        <main className="flex-1 min-h-0 flex flex-col min-w-0 overflow-hidden">
          <LineGrid lines={lines} />
        </main>
      </div>
    </div>
  );
}
