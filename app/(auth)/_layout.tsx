import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/(home)/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="signIn" />
    </Stack>
  );
}
