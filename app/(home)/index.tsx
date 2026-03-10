import { Text } from '@/components/ui/text';
import useGetData from '@/src/hooks/useGetData';
import { FlatList, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/header';
import CardRender from '@/components/card-render';
import { Product } from '@/src/types/model';
import { CreateProductDialog } from '@/components/create-product-dialog';
import { FAB } from '@/components/fab';
import { Input } from '@/components/ui/input';
import { useEffect, useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Pressable } from 'react-native';

export default function HomeScreen() {
  const { data, insertProduct, loading, filterProducts } = useGetData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localData, setLocalData] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCreateProduct = useCallback(
    async (productData: Omit<Product, 'id' | 'image'>) => {
      try {
        await insertProduct(productData);
        setDialogOpen(false);
      } catch (err) {
        console.error('Failed to create product:', err);
      }
    },
    [insertProduct]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(
      () => setLocalData(filterProducts(searchQuery)),
      searchQuery ? 300 : 0
    );

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, data]);

  const handleClearSearch = useCallback(() => setSearchQuery(''), []);

  return (
    <>
      <Header />
      <SafeAreaView className="flex-1 bg-background">
        <Animated.View entering={FadeIn.duration(600)} className="px-6 pb-6 pt-14">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold tracking-tight">Productos</Text>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary/50">
              <Text className="text-sm font-semibold text-secondary-foreground">
                {data?.length || 0}
              </Text>
            </View>
          </View>
        </Animated.View>

        <View className="relative">
          <Input
            placeholder="Buscar producto..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="mx-6 mb-6 pr-10"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={handleClearSearch} className="absolute right-8 top-3.5">
              <Icon as={X} size={18} className="text-muted-foreground" />
            </Pressable>
          )}
        </View>

        <FlatList
          data={localData}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="px-6 pb-24"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <CardRender item={item} />}
          ItemSeparatorComponent={() => <View className="h-4" />}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
          updateCellsBatchingPeriod={50}
        />

        <FAB onPress={() => setDialogOpen(true)} extended label="Nuevo" variant="primary" />

        <CreateProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleCreateProduct}
          isLoading={loading}
        />
      </SafeAreaView>
    </>
  );
}
