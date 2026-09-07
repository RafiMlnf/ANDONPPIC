'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, RotateCcw, Edit, Trash2, Filter } from 'lucide-react';
import { LineCardData, StatusColor } from '@/types/line';

interface LineTableProps {
  lines: LineCardData[];
  onAdd: () => void;
  onEdit: (line: LineCardData) => void;
  onDelete: (line: LineCardData) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const LineTable: React.FC<LineTableProps> = ({
  lines,
  onAdd,
  onEdit,
  onDelete,
  onReset,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Filter and search logic
  const filteredLines = useMemo(() => {
    return lines.filter((line) => {
      const matchSearch =
        line.code.toLowerCase().includes(search.toLowerCase()) ||
        line.metricLabel.toLowerCase().includes(search.toLowerCase()) ||
        line.value.toLowerCase().includes(search.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || line.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [lines, search, selectedStatus]);

  const redCount = lines.filter((l) => l.status === 'RED').length;
  const yellowCount = lines.filter((l) => l.status === 'YELLOW').length;
  const greenCount = lines.filter((l) => l.status === 'GREEN').length;

  return (
    <div className="space-y-4">
      {/* Top action toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111317] border border-neutral-800 p-4 rounded-xl">
        {/* Left: Search & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search station code, metric..."
              className="pl-9 pr-4 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 w-52 md:w-64"
            />
          </div>

          {/* Status Filter Badges */}
          <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                selectedStatus === 'ALL'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({lines.length})
            </button>
            <button
              onClick={() => setSelectedStatus('RED')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                selectedStatus === 'RED'
                  ? 'bg-[#d0131a] text-white shadow-sm'
                  : 'text-red-400 hover:text-red-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              Red ({redCount})
            </button>
            <button
              onClick={() => setSelectedStatus('YELLOW')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                selectedStatus === 'YELLOW'
                  ? 'bg-[#e5be00] text-black shadow-sm'
                  : 'text-yellow-400 hover:text-yellow-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
              Yellow ({yellowCount})
            </button>
            <button
              onClick={() => setSelectedStatus('GREEN')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                selectedStatus === 'GREEN'
                  ? 'bg-[#00a850] text-white shadow-sm'
                  : 'text-green-400 hover:text-green-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Green ({greenCount})
            </button>
          </div>
        </div>

        {/* Right: Add & Reset buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Reset to default 12 stations from screenshot"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Reset to Default</span>
          </button>

          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ff5f00] hover:bg-[#e05400] text-xs font-bold text-white shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Station Line</span>
          </button>
        </div>
      </div>

      {/* Table listing */}
      <div className="bg-[#111317] border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#161920] border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 w-16 text-center">Order</th>
                <th className="px-4 py-3.5">Station Line</th>
                <th className="px-4 py-3.5">Area</th>
                <th className="px-4 py-3.5">Status / Alert</th>
                <th className="px-4 py-3.5">Metric & Value</th>
                <th className="px-4 py-3.5">Change</th>
                <th className="px-4 py-3.5">Sub Metric</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                    Loading stations...
                  </td>
                </tr>
              ) : filteredLines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                    No station lines found.
                  </td>
                </tr>
              ) : (
                filteredLines.map((line) => {
                  const isRed = line.status === 'RED';
                  const isYellow = line.status === 'YELLOW';
                  const isGreen = line.status === 'GREEN';

                  const badgeClass = isRed
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : isYellow
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30';

                  return (
                    <tr
                      key={line.id}
                      className="hover:bg-neutral-800/40 transition-colors group"
                    >
                      <td className="px-4 py-3 text-center text-neutral-500 font-mono">
                        {line.order}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-sm text-white">
                          {line.code}
                        </div>
                        {line.name && (
                          <div className="text-[11px] text-neutral-400 font-normal">
                            {line.name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {line.area ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono">
                            {line.area}
                          </span>
                        ) : (
                          <span className="text-neutral-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeClass}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isRed
                                ? 'bg-red-500'
                                : isYellow
                                ? 'bg-yellow-400'
                                : 'bg-green-500'
                            }`}
                          />
                          {line.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">
                          {line.value}
                        </div>
                        <div className="text-[10px] text-neutral-400 uppercase">
                          {line.metricLabel}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            line.change.startsWith('-')
                              ? 'text-red-400'
                              : line.change.startsWith('+')
                              ? 'text-green-400'
                              : 'text-neutral-400'
                          }`}
                        >
                          {line.change}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-neutral-400 mr-1.5 text-[11px]">
                          {line.subMetricLabel}
                        </span>
                        <span className="font-bold text-white font-mono">
                          {line.subMetricValue}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEdit(line)}
                            className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                            title="Edit station"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(line)}
                            className="p-1.5 rounded text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete station"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
