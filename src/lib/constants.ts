import { Category } from '../types/model';

export const API_URL = 'https://fakestoreapi.com/products';
export const IMAGE_API_URL = 'https://picsum.photos/seed';
export const CATEGORIES = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
] as const;
export const TRANSLATIONS: Record<Category, string> = {
  electronics: 'Electrónica',
  jewelery: 'Joyería',
  "men's clothing": 'Ropa de hombre',
  "women's clothing": 'Ropa de mujer',
};
export const CATEGORY_TRANSLATIONS = Object.fromEntries(
  CATEGORIES.map((cat) => [cat, TRANSLATIONS[cat]])
) as Record<Category, string>;
