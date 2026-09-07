import { LineCardData } from '@/types/line';
import { INITIAL_LINES } from './initialData';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/lines';
const STORAGE_KEY = 'mtm_andon_ppic_master_lines_v4';

// Helper to filter out any legacy dummy cards (STN-P, QC-LAB, etc.)
function filterOutLegacyMockData(lines: LineCardData[]): LineCardData[] {
  if (!Array.isArray(lines)) return [];
  return lines.filter((l) => {
    const code = (l.code || '').toUpperCase();
    const id = (l.id || '').toLowerCase();
    if (
      code === 'STN-P' ||
      code === 'STN-V' ||
      code === 'STN-PC' ||
      code === 'STN-PP' ||
      code === 'STN-PS' ||
      code === 'STN-JI' ||
      code === 'STN-IA' ||
      code === 'STN-TD' ||
      code === 'STN-TP' ||
      code === 'QC-LAB' ||
      code === 'STN-CM' ||
      code === 'QC-FINAL' ||
      id === 'stn-p' ||
      id === 'stn-v' ||
      id === 'qc-lab' ||
      code.startsWith('STN-')
    ) {
      return false;
    }
    return true;
  });
}

// Helper to access localStorage safely
function getLocalLines(): LineCardData[] {
  if (typeof window === 'undefined') return INITIAL_LINES;
  try {
    // Purge old keys if present
    localStorage.removeItem('mtm_andon_lines_data');
    localStorage.removeItem('mtm_andon_ppic_master_lines');
    localStorage.removeItem('mtm_andon_ppic_master_lines_v3');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LINES));
      return INITIAL_LINES;
    }
    const parsed = JSON.parse(raw);
    const clean = filterOutLegacyMockData(parsed);

    // Auto-update if local data has no GRAY cards yet
    const hasGray = clean.some((l) => l.status === 'GRAY');
    if (clean.length === 0 || !hasGray) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LINES));
      return INITIAL_LINES;
    }
    return clean;
  } catch {
    return INITIAL_LINES;
  }
}

function saveLocalLines(lines: LineCardData[]): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = filterOutLegacyMockData(lines);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean.length > 0 ? clean : INITIAL_LINES));
    window.dispatchEvent(new Event('andon-lines-updated'));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export async function fetchLines(): Promise<LineCardData[]> {
  try {
    const res = await fetch(BACKEND_URL, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const data = await res.json();
      const cleanData = filterOutLegacyMockData(data);
      if (cleanData.length > 0) {
        saveLocalLines(cleanData);
        return cleanData;
      }
    }
  } catch (err) {
    console.debug('Backend unreachable, using local state:', err);
  }

  return getLocalLines();
}

export async function createLine(line: Omit<LineCardData, 'id'>): Promise<LineCardData> {
  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(line),
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const created = await res.json();
      const current = getLocalLines();
      saveLocalLines([...current, created]);
      return created;
    }
  } catch (err) {
    console.debug('Backend offline, creating locally:', err);
  }

  const current = getLocalLines();
  const nextOrder = current.length > 0 ? Math.max(...current.map((l) => l.order)) + 1 : 1;
  const newLine: LineCardData = {
    ...line,
    id: line.code.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4),
    order: line.order ?? nextOrder,
  };
  saveLocalLines([...current, newLine]);
  return newLine;
}

export async function updateLine(id: string, updates: Partial<LineCardData>): Promise<LineCardData> {
  try {
    const res = await fetch(`${BACKEND_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const updated = await res.json();
      const current = getLocalLines();
      const index = current.findIndex((l) => l.id === id);
      if (index !== -1) {
        current[index] = updated;
        saveLocalLines(current);
      }
      return updated;
    }
  } catch (err) {
    console.debug('Backend offline, updating locally:', err);
  }

  const current = getLocalLines();
  const index = current.findIndex((l) => l.id === id);
  if (index === -1) {
    throw new Error(`Line with id ${id} not found`);
  }
  current[index] = { ...current[index], ...updates };
  saveLocalLines(current);
  return current[index];
}

export async function deleteLine(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const current = getLocalLines().filter((l) => l.id !== id);
      saveLocalLines(current);
      return true;
    }
  } catch (err) {
    console.debug('Backend offline, deleting locally:', err);
  }

  const current = getLocalLines().filter((l) => l.id !== id);
  saveLocalLines(current);
  return true;
}

export async function resetLines(): Promise<LineCardData[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/reset`, {
      method: 'POST',
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const data = await res.json();
      const clean = filterOutLegacyMockData(data);
      if (clean.length > 0) {
        saveLocalLines(clean);
        return clean;
      }
    }
  } catch (err) {
    console.debug('Backend offline, resetting locally:', err);
  }

  saveLocalLines(INITIAL_LINES);
  return INITIAL_LINES;
}
