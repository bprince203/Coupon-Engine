import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { darkColors, lightColors, type ColorScheme } from './colors';
import { typography, type Typography } from './typography';
import { spacing, borderRadius, iconSizes, hitSlop } from './spacing';
import { shadows, glows } from './shadows';

interface ThemeContextValue {
  colors: ColorScheme;
  typography: Typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  iconSizes: typeof iconSizes;
  hitSlop: typeof hitSlop;
  shadows: typeof shadows;
  glows: typeof glows;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      typography,
      spacing,
      borderRadius,
      iconSizes,
      hitSlop,
      shadows,
      glows,
      isDark,
      toggleTheme,
    }),
    [isDark, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Access the current theme. Must be used within a ThemeProvider.
 * Returns colors, typography, spacing, shadows, and theme toggle.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
