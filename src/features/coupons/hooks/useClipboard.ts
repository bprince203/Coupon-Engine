/**
 * useClipboard — Clipboard copy with toast feedback.
 */

import { useCallback } from 'react';
import { copyToClipboard } from '../services/ClipboardService';

interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
}

export function useClipboard(): UseClipboardReturn {
  const copy = useCallback(async (text: string): Promise<boolean> => {
    return copyToClipboard(text);
  }, []);

  return { copy };
}
