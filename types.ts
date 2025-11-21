export enum Category {
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  HOME = 'Home & Kitchen',
  SPORTS = 'Sports',
  BEAUTY = 'Beauty'
}

export interface ProductOption {
  name: string;
  values: string[];
  // Fix: Add priceModifiers property to support price calculation in App.tsx
  priceModifiers?: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  features: string[];
  options?: ProductOption[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: Record<string, string>;
  cartItemId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}