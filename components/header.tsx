import { Stack } from 'expo-router';
import { Text } from './ui/text';
import ThemeToggle from './toggle-theme';
import SignOut from './sign-out';
import { useAuth } from '@/src/hooks/useAuth';
import { memo } from 'react';
import { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient';

function AppTitle() {
  return (
    <Text className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
      Kopcenter
    </Text>
  );
}

const HeaderRight = memo(function HeaderRight() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <SignOut /> : null;
});

export default function Header() {
  const SCREEN_OPTIONS: ExtendedStackNavigationOptions = {
    headerTitle: () => <AppTitle />,
    headerTransparent: true,
    headerLeft: () => <ThemeToggle />,
    headerRight: () => <HeaderRight />,
    headerTitleAlign: 'center',
  };

  return <Stack.Screen options={SCREEN_OPTIONS} />;
}
