'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Maximize, Minimize, RefreshCw } from 'lucide-react';

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

  const isCrud = pathname.startsWith('/lines');

  return (
    <header className="w-full bg-[#0a0c10] border-b border-neutral-800/80 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs select-none">
      {/* Left: Brand logo & title */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-extrabold tracking-wider text-xs uppercase text-neutral-200">
            ANDON PPIC
          </span>
        </Link>
      </div>

      {/* Right side: Action icons (Refresh, Fullscreen, & Small Settings Icon for Manage Lines) */}
      <div className="flex items-center gap-1.5">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Small Settings Gear Icon for Manage Lines */}
        <Link
          href={isCrud ? '/' : '/lines'}
          className={`p-1.5 rounded-lg border transition-colors ${
            isCrud
              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
          title={isCrud ? 'Return to Live Display' : 'Manage Station Lines (Settings)'}
        >
          <Settings className={`w-4 h-4 ${isCrud ? 'rotate-90 text-white' : ''} transition-transform`} />
        </Link>
      </div>
    </header>
  );
};
