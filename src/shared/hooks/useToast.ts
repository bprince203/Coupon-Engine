/**
 * Toast state management hook.
 * Controls visibility, message, and auto-dismiss timing.
 */

import { useState, useCallback, useRef } from 'react';
import { TOAST_DURATION_MS } from '../../features/coupons/constants';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  variant: ToastVariant;
}

interface UseToastReturn {
  toast: ToastState;
  showToast: (message: string, variant?: ToastVariant) => void;
  hideToast: () => void;
}

const INITIAL_STATE: ToastState = {
  visible: false,
  message: '',
  variant: 'info',
};

export function useToast(): UseToastReturn {
  const [toast, setToast] = useState<ToastState>(INITIAL_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    setToast(INITIAL_STATE);
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToast({ visible: true, message, variant });

      timerRef.current = setTimeout(() => {
        hideToast();
      }, TOAST_DURATION_MS);
    },
    [hideToast],
  );

  return { toast, showToast, hideToast };
}
