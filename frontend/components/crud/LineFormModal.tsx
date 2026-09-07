'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Eye } from 'lucide-react';
import { LineCardData, StatusColor } from '@/types/line';
import { LineCard } from '../andon/LineCard';

interface LineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (line: Omit<LineCardData, 'id'>, id?: string) => Promise<void>;
  initialData?: LineCardData | null;
}

export const LineFormModal: React.FC<LineFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [area, setArea] = useState('ASSY');
  const [metricLabel, setMetricLabel] = useState('DEFECT RATE:');
  const [value, setValue] = useState('0%');
  const [change, setChange] = useState('0%');
  const [subMetricLabel, setSubMetricLabel] = useState('REJECTS:');
  const [subMetricValue, setSubMetricValue] = useState('0');
  const [status, setStatus] = useState<StatusColor>('YELLOW');
  const [order, setOrder] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setName(initialData.name || '');
      setArea(initialData.area || 'ASSY');
      setMetricLabel(initialData.metricLabel);
      setValue(initialData.value);
      setChange(initialData.change);
      setSubMetricLabel(initialData.subMetricLabel);
      setSubMetricValue(initialData.subMetricValue);
      setStatus(initialData.status);
      setOrder(initialData.order);
    } else {
      // Default new line
      setCode('STN-NEW');
      setName('New Line Process');
      setArea('ASSY');
      setMetricLabel('DEFECT RATE:');
      setValue('0%');
      setChange('0%');
      setSubMetricLabel('REJECTS:');
      setSubMetricValue('0');
      setStatus('YELLOW');
      setOrder(35);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(
        {
          code: code.trim().toUpperCase(),
          name: name.trim() || undefined,
          area: area.trim().toUpperCase() || undefined,
          metricLabel: metricLabel.trim() || 'DEFECT RATE:',
          value: value.trim() || '0%',
          change: change.trim() || '0%',
          subMetricLabel: subMetricLabel.trim() || 'REJECTS:',
          subMetricValue: subMetricValue.trim() || '0',
          status,
          order: Number(order) || 1,
        },
        initialData ? initialData.id : undefined,
      );
      onClose();
    } catch (err) {
      console.error('Failed to save line', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Construct mock preview line
  const previewData: LineCardData = {
    id: 'preview',
    code: code.trim().toUpperCase() || 'STN-CODE',
    name: name.trim() || undefined,
    area: area.trim().toUpperCase() || undefined,
    metricLabel: metricLabel.trim() || 'DEFECT RATE:',
    value: value.trim() || '0%',
    change: change.trim() || '0%',
    subMetricLabel: subMetricLabel.trim() || 'REJECTS:',
    subMetricValue: subMetricValue.trim() || '0',
    status,
    order: Number(order) || 1,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#12151b] border border-neutral-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-white">
              {initialData ? 'Edit Station Line' : 'Add New Station Line'}
            </h3>
            <p className="text-xs text-neutral-400">
              Configure station metrics, area, and card appearance.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Live Preview section */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 mb-2">
              <Eye className="w-3.5 h-3.5 text-orange-500" />
              <span>LIVE CARD PREVIEW</span>
            </div>
            <div className="max-w-xs mx-auto h-36">
              <LineCard data={previewData} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Station Code */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Line / Station Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. 2CF, ASSYARMC, D14"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-orange-500 font-mono uppercase"
              />
            </div>

            {/* Line Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Line Name (Description)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. SPINDLE 2CF, Ball Race"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Area
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="ASSY">ASSY</option>
                <option value="MACHINING">MACHINING</option>
                <option value="FORGING">FORGING</option>
                <option value="PPIC">PPIC</option>
              </select>
            </div>

            {/* Status Color */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Status / Alert Color *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('RED')}
                  className={`py-2 px-2.5 rounded-md text-xs font-bold transition-all ${
                    status === 'RED'
                      ? 'bg-[linear-gradient(135deg,hsl(356,85%,44%)_0%,hsl(16,95%,48%)_100%)] text-white ring-2 ring-white ring-offset-2 ring-offset-black shadow-md'
                      : 'bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/40'
                  }`}
                >
                  RED
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('YELLOW')}
                  className={`py-2 px-2.5 rounded-md text-xs font-bold transition-all ${
                    status === 'YELLOW'
                      ? 'bg-[linear-gradient(135deg,hsl(48,100%,46%)_0%,hsl(68,96%,45%)_100%)] text-black ring-2 ring-white ring-offset-2 ring-offset-black shadow-md'
                      : 'bg-yellow-950/40 text-yellow-300 border border-yellow-800/50 hover:bg-yellow-900/40'
                  }`}
                >
                  YELLOW
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('GREEN')}
                  className={`py-2 px-2.5 rounded-md text-xs font-bold transition-all ${
                    status === 'GREEN'
                      ? 'bg-[linear-gradient(135deg,hsl(148,100%,33%)_0%,hsl(168,100%,33%)_100%)] text-white ring-2 ring-white ring-offset-2 ring-offset-black shadow-md'
                      : 'bg-green-950/40 text-green-300 border border-green-800/50 hover:bg-green-900/40'
                  }`}
                >
                  GREEN
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('GRAY')}
                  className={`py-2 px-2.5 rounded-md text-xs font-bold transition-all ${
                    status === 'GRAY'
                      ? 'bg-[linear-gradient(135deg,hsl(220,14%,24%)_0%,hsl(220,14%,15%)_100%)] text-white ring-2 ring-white ring-offset-2 ring-offset-black shadow-md'
                      : 'bg-neutral-800/80 text-neutral-300 border border-neutral-700 hover:bg-neutral-700/80'
                  }`}
                >
                  GRAY (OFF)
                </button>
              </div>
            </div>

            {/* Metric Label */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Metric Label
              </label>
              <input
                type="text"
                value={metricLabel}
                onChange={(e) => setMetricLabel(e.target.value)}
                placeholder="e.g. DEFECT RATE:, YIELD RATE:"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-orange-500 uppercase"
              />
            </div>

            {/* Main Value */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Primary Value *
              </label>
              <input
                type="text"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. - 10.825%, 175%, 2,300"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Change % */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Change %
              </label>
              <input
                type="text"
                value={change}
                onChange={(e) => setChange(e.target.value)}
                placeholder="e.g. -2.26%, 0%, +0.47%"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Grid Order
              </label>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Sub Metric Label */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Sub Metric Label
              </label>
              <input
                type="text"
                value={subMetricLabel}
                onChange={(e) => setSubMetricLabel(e.target.value)}
                placeholder="e.g. REJECTS:, DEFECTS:"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-orange-500 uppercase"
              />
            </div>

            {/* Sub Metric Value */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Sub Metric Count
              </label>
              <input
                type="text"
                value={subMetricValue}
                onChange={(e) => setSubMetricValue(e.target.value)}
                placeholder="e.g. 250, 0, -15"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#ff5f00] hover:bg-[#e05400] text-white text-xs font-bold rounded-md shadow-md transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Station' : 'Create Station'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
