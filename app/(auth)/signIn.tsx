import { SignInForm } from '@/components/sign-in-form';
import useTheme from '@/src/hooks/useTheme';
import { ScrollView, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/hooks/useAuth';

const AnimatedView = Animated.createAnimatedComponent(View);

export const options = {
  headerTransparent: true,
  headerTitleAlign: 'center' as const,
  headerTitle: () => (
    <Text className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
      Kopcenter
    </Text>
  ),
};

export default function SignInScreen() {
  const theme = useTheme();
  const { login, isLoading, errors, clearErrors } = useAuth();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    translateY.value = withSpring(0, { damping: 20, stiffness: 100 });

    return () => clearErrors();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
    } catch (error) {}
  };

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex-grow px-2 py-12"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.background }}>
      <AnimatedView className="flex-1 justify-center" style={containerStyle}>
        <SignInForm onSubmit={handleLogin} isLoading={isLoading} errors={errors} />

        <View className="mt-12 items-center">
          <Text style={{ color: theme.textMuted }} className="text-xs">
            v1.0.0 • Venezuela
          </Text>
        </View>
      </AnimatedView>
    </ScrollView>
  );
}
