import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { THEME } from '@/src/lib/theme';
import { useColorScheme } from 'nativewind';

export type ThemeType = typeof THEME.light | typeof THEME.dark;

const ThemeContext = createContext<ThemeType>(THEME.light);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme } = useColorScheme();
  const theme = useMemo(() => THEME[colorScheme === 'dark' ? 'dark' : 'light'], [colorScheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export default function useTheme(): ThemeType {
  return useContext(ThemeContext);
}
