import '@/global.css';
import { NAV_THEME } from '@/src/lib/theme';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/src/hooks/useAuth';
import { ThemeProvider } from '@/src/hooks/useTheme';
import { useState, useCallback, memo, useEffect } from 'react';
import SplashScreenComponent from '../components/splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

const THEME_STORAGE_KEY = '@color_scheme';

const RootLayoutNav = memo(function RootLayoutNav({
  splashFinished,
  onSplashFinish,
}: {
  splashFinished: boolean;
  onSplashFinish: () => void;
}) {
  const { colorScheme } = useColorScheme();
  const { isInitialLoading } = useAuth();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      SplashScreen.hideAsync();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <NavThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <PortalHost />
      {!splashFinished || isInitialLoading ? (
        <SplashScreenComponent onFinish={onSplashFinish} />
      ) : (
        <Slot />
      )}
    </NavThemeProvider>
  );
});

export default function RootLayout() {
  const [splashFinished, setSplashFinished] = useState(false);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'dark' || saved === 'light') setColorScheme(saved);
      })
      .catch(() => {});
  }, []);

  const handleSplashFinish = useCallback(() => setSplashFinished(true), []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutNav splashFinished={splashFinished} onSplashFinish={handleSplashFinish} />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
