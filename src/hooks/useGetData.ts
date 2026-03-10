import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, IMAGE_API_URL } from '@/src/lib/constants';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Product } from '../types/model';

const STORAGE_KEY = '@products_data';
const LOCAL_PRODUCTS_KEY = '@local_products_data';

export default function useGetData() {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | boolean>(null);

  const nextLocalIdRef = useRef<number>(-1);
  const dataRef = useRef<Product[] | null>(null);
  dataRef.current = data;

  const loadStoredData = useCallback(async () => {
    try {
      const [storedProducts, storedLocalProducts] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(LOCAL_PRODUCTS_KEY),
      ]);

      if (storedProducts) {
        setData(JSON.parse(storedProducts));
      }

      if (storedLocalProducts) {
        const localProducts: Product[] = JSON.parse(storedLocalProducts);
        const maxId = Math.max(...localProducts.map((p) => p.id), -1);
        nextLocalIdRef.current = maxId - 1;
      }
    } catch (err) {
      console.log('Error loading stored data:', err);
    }
  }, []);

  const saveToStorage = useCallback(async (products: Product[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      const localProducts = products.filter((p) => p.id < 0);
      await AsyncStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(localProducts));
    } catch (err) {
      console.log('Error saving to storage:', err);
    }
  }, []);

  const request = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      const apiProducts: Product[] = json.map((item: Product) => ({
        ...item,
        image: `${IMAGE_API_URL}/${item.id}/200/200`,
      }));

      const stored = await AsyncStorage.getItem(LOCAL_PRODUCTS_KEY);
      const localProducts: Product[] = stored ? JSON.parse(stored) : [];
      const validLocalProducts = localProducts.filter((lp) => lp.id < 0);
      const mergedProducts = [...validLocalProducts, ...apiProducts];

      setData(mergedProducts);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProducts));
      setError(null);
    } catch (err) {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        setData(null);
      }
      console.log('Error fetching data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const insertProduct = useCallback(
    async (newProduct: Omit<Product, 'id' | 'image'>) => {
      try {
        const id = nextLocalIdRef.current;
        nextLocalIdRef.current -= 1;

        const product: Product = {
          ...newProduct,
          id,
          image: `${IMAGE_API_URL}/${Math.abs(id)}/200/200`,
          rating: { rate: 0, count: 0 },
        };

        const currentData = dataRef.current || [];
        const updatedData = [product, ...currentData];

        setData(updatedData);
        await saveToStorage(updatedData);
        return product;
      } catch (err) {
        console.log('Error inserting product:', err);
        throw err;
      }
    },
    [saveToStorage]
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        const updatedData = (dataRef.current || []).filter((p) => p.id !== id);
        setData(updatedData);
        await saveToStorage(updatedData);
      } catch (err) {
        console.log('Error deleting product:', err);
        throw err;
      }
    },
    [saveToStorage]
  );

  const filterProducts = useCallback((search: string): Product[] => {
    const current = dataRef.current;
    if (!current) return [];
    if (!search.trim()) return current;
    const searchLower = search.toLowerCase().trim();
    return current.filter((product) => product.title.toLowerCase().includes(searchLower));
  }, []);

  useEffect(() => {
    loadStoredData().then(() => request());
  }, []);

  return {
    data,
    loading,
    error,
    refetch: request,
    insertProduct,
    deleteProduct,
    filterProducts,
  };
}
