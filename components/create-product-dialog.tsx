import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  Pressable,
  View,
  ScrollView,
  Keyboard,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Product, Category } from '@/src/types/model';
import { CATEGORY_TRANSLATIONS } from '@/src/lib/constants';
import useTheme from '@/src/hooks/useTheme';

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: Omit<Product, 'id' | 'image'>) => void;
  isLoading?: boolean;
}

export function CreateProductDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateProductDialogProps) {
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [rate, setRate] = useState<null | number>(null);
  const [count, setCount] = useState<null | number>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<Record<string, TextInput | null>>({});

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const scrollToInput = useCallback((fieldName: string) => {
    setTimeout(() => {
      inputRefs.current[fieldName]?.measureLayout(
        scrollViewRef.current as any,
        (x, y, width, height) => {
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, y - 100),
            animated: true,
          });
        },
        () => {}
      );
    }, 100);
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'El título es requerido';
    if (!price.trim() || isNaN(Number(price))) newErrors.price = 'Precio inválido';
    if (!description.trim()) newErrors.description = 'La descripción es requerida';
    if (!category) newErrors.category = 'Selecciona una categoría';
    if (rate === null || rate < 0 || rate > 5) newErrors.rate = 'Puntuación inválida (0-5)';
    if (count === null || count < 0) newErrors.count = 'Cantidad inválida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      price: Number(price),
      description: description.trim(),
      category: category as Category,
      rating: { rate: rate ?? 0, count: count ?? 0 },
    });
    setTitle('');
    setPrice('');
    setDescription('');
    setCategory('');
    setRate(0);
    setCount(0);
    setErrors({});
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onOpenChange(false);
    setErrors({});
  };

  const saveAsNumber = (
    value: string,
    setter: (value: number | null) => void,
    parser: (v: string) => number = Number.parseFloat
  ) => {
    if (!value) return setter(null);
    const parsed = parser(value);
    setter(Number.isNaN(parsed) ? null : parsed);
  };

  const screenHeight = Dimensions.get('window').height;
  const maxModalHeight = screenHeight * 0.85;
  const availableHeight = maxModalHeight - (keyboardHeight > 0 ? keyboardHeight - 20 : 0);

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            handleClose();
          }}
          className="absolute inset-0"
        />

        <View
          className="rounded-t-3xl bg-background"
          style={{
            maxHeight: availableHeight,
          }}>
          <View className="flex-row items-center justify-between border-b border-border p-6">
            <View>
              <Text className="text-xl font-bold text-foreground">Nuevo Producto</Text>
              <Text className="text-sm text-muted-foreground">Agrega un producto a tu tienda</Text>
            </View>
            <Pressable onPress={handleClose} className="rounded-full bg-secondary p-2">
              <Icon as={X} size={20} className="text-foreground" />
            </Pressable>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={{ maxHeight: availableHeight - 140 }}
            contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? 20 : 0 }}
            className="bg-background px-6"
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag">
            <View className="mb-4 mt-4">
              <Text className="mb-2 text-sm font-medium text-foreground">Título</Text>
              <TextInput
                ref={(ref) => {
                  inputRefs.current['title'] = ref;
                }}
                onFocus={() => scrollToInput('title')}
                className="rounded-lg border border-border bg-secondary px-3 py-2.5 text-base"
                placeholder="Ej: iPhone 15 Pro"
                placeholderTextColor={theme.placeholder}
                style={{ color: theme.foreground }}
                value={title}
                onChangeText={setTitle}
              />
              {errors.title && (
                <Text className="mt-1 text-xs text-destructive">{errors.title}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-foreground">Precio</Text>
              <TextInput
                ref={(ref) => {
                  inputRefs.current['price'] = ref;
                }}
                onFocus={() => scrollToInput('price')}
                className="rounded-lg border border-border bg-secondary px-3 py-2.5 text-base"
                placeholder="0"
                placeholderTextColor={theme.placeholder}
                style={{ color: theme.foreground }}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
              {errors.price && (
                <Text className="mt-1 text-xs text-destructive">{errors.price}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-foreground">Categoría</Text>
              <View className="flex-row flex-wrap gap-2">
                {Object.entries(CATEGORY_TRANSLATIONS).map(([key, value]) => {
                  const isSelected = category === key;
                  return (
                    <Pressable
                      key={key}
                      onPress={() => setCategory(key)}
                      className={`rounded-full border px-4 py-2 ${
                        isSelected ? 'border-primary bg-primary' : 'border-border bg-background'
                      }`}>
                      <Text
                        className={`text-sm font-medium ${
                          isSelected ? 'text-primary-foreground' : 'text-foreground'
                        }`}>
                        {value}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {errors.category && (
                <Text className="mt-1 text-xs text-destructive">{errors.category}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-foreground">Puntuación</Text>
              <TextInput
                ref={(ref) => {
                  inputRefs.current['rate'] = ref;
                }}
                onFocus={() => scrollToInput('rate')}
                className="rounded-lg border border-border bg-secondary px-3 py-2.5 text-base"
                placeholder="0"
                placeholderTextColor={theme.placeholder}
                style={{ color: theme.foreground }}
                value={rate?.toString() ?? ''}
                onChangeText={(v) => saveAsNumber(v, setRate, Number.parseFloat)}
                keyboardType="decimal-pad"
              />
              {errors.rate && <Text className="mt-1 text-xs text-destructive">{errors.rate}</Text>}
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-foreground">Cantidad de reseñas</Text>
              <TextInput
                ref={(ref) => {
                  inputRefs.current['count'] = ref;
                }}
                onFocus={() => scrollToInput('count')}
                className="rounded-lg border border-border bg-secondary px-3 py-2.5 text-base"
                placeholder="0"
                placeholderTextColor={theme.placeholder}
                style={{ color: theme.foreground }}
                value={count?.toString() ?? ''}
                onChangeText={(v) => saveAsNumber(v, setCount, Number.parseInt)}
                keyboardType="decimal-pad"
              />
              {errors.count && (
                <Text className="mt-1 text-xs text-destructive">{errors.count}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-foreground">Descripción</Text>
              <TextInput
                ref={(ref) => {
                  inputRefs.current['description'] = ref;
                }}
                onFocus={() => scrollToInput('description')}
                className="rounded-lg border border-border bg-secondary px-3 py-2.5 text-base"
                placeholder="Describe tu producto..."
                placeholderTextColor={theme.placeholder}
                style={{ color: theme.foreground, height: 96, textAlignVertical: 'top' }}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
              {errors.description && (
                <Text className="mt-1 text-xs text-destructive">{errors.description}</Text>
              )}
            </View>
          </ScrollView>

          <View className="border-t border-border bg-background px-6 pb-8 pt-4">
            <Button
              onPress={handleSubmit}
              disabled={isLoading}
              className="w-full rounded-lg bg-primary">
              <Text className="text-base font-semibold text-primary-foreground">
                {isLoading ? 'Creando...' : 'Crear Producto'}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
