/**
 * Validator result state store.
 * Holds the latest validation result for the validator screen.
 */

import { create } from 'zustand';
import { ValidationResult } from '../types';

interface ValidatorStoreState {
  validationResult: ValidationResult | null;
  setResult: (result: ValidationResult) => void;
  clearResult: () => void;
}

export const useValidatorStore = create<ValidatorStoreState>((set) => ({
  validationResult: null,

  setResult: (result) => set({ validationResult: result }),
  clearResult: () => set({ validationResult: null }),
}));
