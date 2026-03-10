import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState, memo } from 'react';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import fastDelivery from '@/assets/lottie/fast_delivery.json';
import useTheme from '@/src/hooks/useTheme';

type TProps = {
  onFinish: () => void;
};

const messages = [
  'Localizando frutas frescas',
  'Cargando cestas',
  'Preparando tu pedido',
  'Casi listo',
];

const ANIMATION_DURATION = 8000;
const MESSAGE_INTERVAL = ANIMATION_DURATION / messages.length;

export default memo(function SplashScreenComponent({ onFinish }: TProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const lottieRef = useRef<LottieView>(null);

  const LOTTIE_SIZE = width * 0.75;
  const CIRCLE_1 = LOTTIE_SIZE * 0.93;
  const CIRCLE_2 = LOTTIE_SIZE * 0.8;

  const progress = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(0.95);
  const lottieScale = useSharedValue(0.9);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const lottieAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lottieScale.value }],
  }));

  const dotsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.3, 1, 0.3]),
  }));

  const circle1Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.1]) }],
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.5, 0.3, 0.5]),
  }));

  const circle2Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.2]) }],
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.3, 0.5, 0.3]),
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
    scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });

    lottieScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.98, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    progress.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: Easing.linear,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev >= messages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, MESSAGE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Animated.View
        className="flex-1 items-center justify-center px-6"
        style={containerAnimatedStyle}>
        <View className="mb-5 items-center gap-3">
          <Badge style={{ backgroundColor: theme.primary, borderColor: theme.primary }}>
            <Text
              style={{ color: theme.white }}
              className="text-xs font-bold uppercase tracking-widest">
              Entrega Rápida
            </Text>
          </Badge>

          <Text
            style={{ color: theme.textPrimary }}
            className="text-3xl font-extrabold tracking-tight">
            Durazno Store
          </Text>

          <Text style={{ color: theme.textSecondary }} className="text-sm font-medium">
            Frescura a tu puerta
          </Text>
        </View>

        <View
          className="my-8 items-center justify-center"
          style={{ width: LOTTIE_SIZE, height: LOTTIE_SIZE }}>
          <Animated.View
            className="absolute rounded-full"
            style={[
              { width: CIRCLE_1, height: CIRCLE_1, backgroundColor: theme.primaryLight },
              circle1Style,
            ]}
          />
          <Animated.View
            className="absolute rounded-full"
            style={[
              { width: CIRCLE_2, height: CIRCLE_2, backgroundColor: theme.primaryLighter },
              circle2Style,
            ]}
          />
          <Animated.View style={lottieAnimatedStyle} className="z-10">
            <LottieView
              ref={lottieRef}
              source={fastDelivery}
              autoPlay
              loop={false}
              onAnimationFinish={onFinish}
              resizeMode="contain"
              style={{ width: LOTTIE_SIZE, height: LOTTIE_SIZE }}
            />
          </Animated.View>
        </View>

        <View className="w-full max-w-[300px] items-center gap-4">
          <View className="flex-row items-center">
            <Text
              style={{ color: theme.textPrimary }}
              className="text-center text-base font-semibold">
              {messages[currentMessageIndex]}
            </Text>
            <Animated.Text
              style={[{ color: theme.primary }, dotsAnimatedStyle]}
              className="ml-1 text-base font-bold">
              ...
            </Animated.Text>
          </View>

          <View className="w-full gap-2">
            <View
              className="h-1 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: theme.progressBackground }}>
              <Animated.View
                style={[{ height: '100%', backgroundColor: theme.primary }, progressBarStyle]}
              />
            </View>

            <View className="w-full flex-row justify-between px-1">
              {messages.map((_, index) => (
                <View key={index} className="items-center">
                  <View
                    style={{
                      backgroundColor:
                        index <= currentMessageIndex ? theme.primary : theme.progressBackground,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="absolute bottom-10 items-center">
          <Text style={{ color: theme.textMuted }} className="text-xs font-medium tracking-wide">
            v1.0.0 • Hecho con 🍑 en Venezuela
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
});
