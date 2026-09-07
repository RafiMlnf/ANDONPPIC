'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, SlidersHorizontal, Maximize, Minimize, RefreshCw } from 'lucide-react';

interface NavigationBarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ onRefresh, isRefreshing = false }) => {
  const pathname = usePathname();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const isLive = pathname === '/';
  const isCrud = pathname.startsWith('/lines');

  return (
    <header className="w-full bg-[#0a0c10] border-b border-neutral-800/80 px-4 py-2 flex items-center justify-between text-xs select-none">
      {/* Brand / Mode tabs */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-lg border border-neutral-800">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              isLive
                ? 'bg-[#ff5f00] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Live Display</span>
          </Link>

          <Link
            href="/lines"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              isCrud
                ? 'bg-[#ff5f00] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Manage Lines (CRUD)</span>
          </Link>
        </div>
      </div>

      {/* Action buttons (Refresh & Fullscreen) */}
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <>
              <Minimize className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fullscreen</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
