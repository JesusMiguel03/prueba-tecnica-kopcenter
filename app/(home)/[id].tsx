import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  FadeInUp,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { ArrowLeft, Star } from 'lucide-react-native';
import { useCallback } from 'react';
import useGetData from '@/src/hooks/useGetData';
import { Button } from '@/components/ui/button';
import { useColorScheme } from 'nativewind';
import { TRANSLATIONS } from '@/src/lib/constants';
import Header from '@/components/header';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.45;

export default function ProductDetailScreen() {
  const { colorScheme } = useColorScheme();
  const { id } = useLocalSearchParams();
  const { data, loading } = useGetData();
  const router = useRouter();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollY.value, [-IMAGE_HEIGHT, 0], [1.2, 1], 'clamp'),
        },
      ],
    };
  });

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (loading || !data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Cargando...</Text>
      </SafeAreaView>
    );
  }

  const product = data?.find((p) => p.id.toString() === id);

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Producto no encontrado</Text>
        <Button onPress={handleBack} className="mt-4">
          <Text>Volver</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const { title, price, description, image, rating, category } = product;

  return (
    <>
      <Header />
      <View className="flex-1 bg-background">
        <View className="absolute left-6 top-36 z-50">
          <Button
            onPressIn={handleBack}
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full bg-secondary/50 hover:bg-secondary">
            <ArrowLeft className="size-5" color={colorScheme === 'dark' ? 'white' : 'black'} />
          </Button>
        </View>

        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          className="flex-1">
          <View className="relative overflow-hidden pt-32" style={{ height: IMAGE_HEIGHT }}>
            <Animated.Image
              source={{ uri: image }}
              style={[{ width, height: IMAGE_HEIGHT }, imageAnimatedStyle]}
              resizeMode="cover"
            />
            <View className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </View>

          <View className="relative -mt-8 rounded-t-3xl bg-background px-6 pb-8 pt-6">
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <View className="mb-4 self-start rounded-full bg-secondary px-4 py-1.5">
                <Text className="text-xs font-medium uppercase tracking-wider text-secondary-foreground">
                  {TRANSLATIONS[category]}
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).duration(500)} className="mb-6">
              <Text className="mb-3 text-3xl font-bold leading-tight text-foreground">{title}</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-4xl font-bold text-primary">${price.toFixed(2)}</Text>
                {rating && (
                  <View className="flex-row items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2">
                    <Star
                      size={16}
                      className="fill-yellow-600 text-yellow-600 dark:fill-yellow-400 dark:text-yellow-400"
                    />
                    <Text className="font-semibold text-yellow-600 dark:text-yellow-400">
                      {rating.rate}
                    </Text>
                    <Text className="text-sm text-yellow-600/60 dark:text-yellow-400/60">
                      ({rating.count})
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(300).duration(500)} className="mb-8">
              <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Descripción
              </Text>
              <Text className="text-base leading-relaxed text-foreground/80">{description}</Text>
            </Animated.View>
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
}
