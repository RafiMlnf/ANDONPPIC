'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchLines,
  createLine,
  updateLine,
  deleteLine,
  resetLines,
} from '@/lib/api';
import { LineCardData } from '@/types/line';
import { NavigationBar } from '@/components/ui/NavigationBar';
import { LineTable } from '@/components/crud/LineTable';
import { LineFormModal } from '@/components/crud/LineFormModal';
import { DeleteConfirmModal } from '@/components/crud/DeleteConfirmModal';
import { LineGrid } from '@/components/andon/LineGrid';
import { LayoutGrid, List, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LinesManagementPage() {
  const [lines, setLines] = useState<LineCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<LineCardData | null>(null);
  const [deletingLine, setDeletingLine] = useState<LineCardData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

    // Listen to updates from other pages / tabs
    const handleUpdate = () => loadData();
    window.addEventListener('andon-lines-updated', handleUpdate);
    return () => window.removeEventListener('andon-lines-updated', handleUpdate);
  }, [loadData]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingLine(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (line: LineCardData) => {
    setEditingLine(line);
    setIsFormOpen(true);
  };

  const handleSave = async (data: Omit<LineCardData, 'id'>, id?: string) => {
    if (id) {
      const updated = await updateLine(id, data);
      setLines((prev) => prev.map((l) => (l.id === id ? updated : l)));
      showToast(`Station ${updated.code} updated successfully`);
    } else {
      const created = await createLine(data);
      setLines((prev) => [...prev, created]);
      showToast(`Station ${created.code} added successfully`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLine) return;
    setIsDeleting(true);
    try {
      await deleteLine(deletingLine.id);
      setLines((prev) => prev.filter((l) => l.id !== deletingLine.id));
      showToast(`Station ${deletingLine.code} deleted`);
      setDeletingLine(null);
    } catch (err) {
      console.error('Failed to delete line', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all stations to default 12 stations from reference?')) {
      const reset = await resetLines();
      setLines(reset);
      showToast('Stations restored to default configuration');
    }
  };

  const redCount = lines.filter((l) => l.status === 'RED').length;
  const yellowCount = lines.filter((l) => l.status === 'YELLOW').length;
  const greenCount = lines.filter((l) => l.status === 'GREEN').length;

  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col font-sans">
      <NavigationBar onRefresh={loadData} isRefreshing={isLoading} />

      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs font-semibold shadow-2xl animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f00]" />
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                STATION LINES CONFIGURATION (CRUD)
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Manage line cards, defect rate thresholds, and alert status for the live Andon display.
            </p>
          </div>

          {/* View switcher (Table vs Interactive Grid) */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Interactive Grid</span>
            </button>
          </div>
        </div>

        {/* Quick summary status badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#111317] border border-neutral-800/80 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              Total Stations
            </span>
            <div className="text-2xl font-black text-white mt-1">{lines.length}</div>
          </div>

          <div className="bg-[#111317] border border-red-950/40 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
              High Defect (Red)
            </span>
            <div className="text-2xl font-black text-red-400 mt-1">{redCount}</div>
          </div>

          <div className="bg-[#111317] border border-yellow-950/40 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 block">
              Warning (Yellow)
            </span>
            <div className="text-2xl font-black text-yellow-400 mt-1">{yellowCount}</div>
          </div>

          <div className="bg-[#111317] border border-green-950/40 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 block">
              Normal / Yield (Green)
            </span>
            <div className="text-2xl font-black text-green-400 mt-1">{greenCount}</div>
          </div>
        </div>

        {/* Main Content View */}
        {viewMode === 'table' ? (
          <LineTable
            lines={lines}
            onAdd={handleOpenAdd}
            onEdit={handleOpenEdit}
            onDelete={(line) => setDeletingLine(line)}
            onReset={handleReset}
            isLoading={isLoading}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#111317] border border-neutral-800 p-3 rounded-lg text-xs text-neutral-400">
              <span>Click on any card to edit its parameters directly.</span>
              <button
                onClick={handleOpenAdd}
                className="px-3 py-1.5 bg-[#ff5f00] text-white font-bold rounded-md hover:bg-[#e05400] transition-colors"
              >
                + Add Station
              </button>
            </div>
            <LineGrid
              lines={lines}
              clickable={true}
              onEdit={handleOpenEdit}
            />
          </div>
        )}
      </main>

      {/* Form Modal (Add / Edit) */}
      <LineFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={editingLine}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingLine)}
        line={deletingLine}
        onClose={() => setDeletingLine(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
