import { CATEGORIES } from '../lib/constants';

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export type Category = (typeof CATEGORIES)[number];
