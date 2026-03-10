import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/signIn" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          gestureEnabled: false,
          headerTitle: () => null,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle: () => null,
        }}
      />
    </Stack>
  );
}
