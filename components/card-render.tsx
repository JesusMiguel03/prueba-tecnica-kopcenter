import { Product } from '@/src/types/model';
import { Link } from 'expo-router';
import { useCallback } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Badge } from './ui/badge';
import { Text } from './ui/text';
import { Icon } from './ui/icon';
import { Star } from 'lucide-react-native';
import { Button } from './ui/button';
import { TRANSLATIONS } from '@/src/lib/constants';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function CardRender({ item }: { item: Product }) {
  const { id, category, image, price, rating, title } = item;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.9, { duration: 100 });
  }, [scale, opacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 100 });
  }, [scale, opacity]);

  return (
    <Link href={{ pathname: '/(home)/[id]', params: { id } }} key={id} asChild>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View entering={FadeInUp.duration(400)}>
          <Animated.View
            style={[animatedStyle, { elevation: 2 }]}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm shadow-black/5">
            <View className="relative">
              <Image
                source={{ uri: image }}
                contentFit="cover"
                style={{ width: CARD_WIDTH, height: CARD_WIDTH * 0.75 }}
              />

              <View className="absolute inset-0 bg-black/10" />

              <View className="absolute left-4 top-4">
                <Badge
                  variant="secondary"
                  className="rounded-full bg-white/90 px-3 py-1 dark:bg-black/80">
                  <Text className="text-xs font-semibold capitalize">{TRANSLATIONS[category]}</Text>
                </Badge>
              </View>

              <View className="absolute bottom-4 right-4">
                <View className="rounded-full bg-primary px-4 py-2 shadow-lg">
                  <Text className="text-sm font-bold text-primary-foreground">
                    ${price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="gap-3 p-5">
              <View className="flex-row items-start justify-between gap-3">
                <Text
                  className="flex-1 text-lg font-semibold leading-tight text-foreground"
                  numberOfLines={2}>
                  {title}
                </Text>
                {rating && (
                  <View className="flex-row items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-1">
                    <Icon as={Star} size={12} className="text-yellow-600 dark:text-yellow-400" />
                    <Text className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                      {rating.rate}
                    </Text>
                  </View>
                )}
              </View>

              <View className="mt-2 flex-row items-center justify-between border-t border-border/30 pt-2">
                <Text className="text-xs text-muted-foreground">{rating?.count || 0} reseñas</Text>
                <Button size="sm" variant="ghost" className="h-8 rounded-full px-4">
                  <Text className="text-xs font-semibold text-primary">Ver detalles</Text>
                </Button>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Link>
  );
}
