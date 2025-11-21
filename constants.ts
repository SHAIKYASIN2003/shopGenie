import { Category, Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ultra-Noise Cancelling Headphones',
    price: 299.99,
    category: Category.ELECTRONICS,
    image: 'https://picsum.photos/id/1/600/600',
    description: 'Experience pure silence with our industry-leading noise cancellation technology. Perfect for travel and focus.',
    rating: 4.8,
    reviews: 1240,
    features: ['Active Noise Cancellation', '30h Battery Life', 'Multipoint Connection']
  },
  {
    id: '2',
    name: 'Minimalist Smart Watch',
    price: 199.50,
    category: Category.ELECTRONICS,
    image: 'https://picsum.photos/id/119/600/600',
    description: 'Track your fitness, sleep, and notifications in style. A battery that lasts weeks, not days.',
    rating: 4.5,
    reviews: 850,
    features: ['Heart Rate Monitor', 'Sleep Tracking', 'Water Resistant 50m']
  },
  {
    id: '3',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    category: Category.FASHION,
    image: 'https://picsum.photos/id/21/600/600',
    description: 'Soft, breathable, and durable. The perfect staple for your wardrobe.',
    rating: 4.7,
    reviews: 3200,
    features: ['100% Organic Cotton', 'Pre-shrunk', 'Eco-friendly Dye'],
    options: [
      { name: 'Color', values: ['Blue', 'Black', 'White', 'Heather Grey'] },
      { name: 'Size', values: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    price: 349.00,
    category: Category.HOME,
    image: 'https://picsum.photos/id/3/600/600',
    description: 'Say goodbye to back pain. Designed for 8+ hours of comfortable sitting.',
    rating: 4.9,
    reviews: 540,
    features: ['Lumbar Support', 'Adjustable Armrests', 'Breathable Mesh']
  },
  {
    id: '5',
    name: 'Professional Chef Knife',
    price: 89.95,
    category: Category.HOME,
    image: 'https://picsum.photos/id/102/600/600',
    description: 'Razor sharp and perfectly balanced. Elevate your cooking game.',
    rating: 4.8,
    reviews: 210,
    features: ['High Carbon Steel', 'Ergonomic Handle', 'Lifetime Warranty']
  },
  {
    id: '6',
    name: 'Trail Running Shoes',
    price: 129.99,
    category: Category.SPORTS,
    image: 'https://picsum.photos/id/103/600/600',
    description: 'Grip any terrain with confidence. Lightweight and rugged.',
    rating: 4.6,
    reviews: 890,
    features: ['Gore-Tex Waterproofing', 'Vibram Sole', 'Shock Absorption']
  },
  {
    id: '7',
    name: 'Yoga Mat Pro',
    price: 55.00,
    category: Category.SPORTS,
    image: 'https://picsum.photos/id/104/600/600',
    description: 'Non-slip grip for the deepest stretches. Eco-friendly materials.',
    rating: 4.9,
    reviews: 1500,
    features: ['Non-slip Surface', '5mm Cushioning', 'Biodegradable']
  },
  {
    id: '8',
    name: 'Hydrating Face Serum',
    price: 42.00,
    category: Category.BEAUTY,
    image: 'https://picsum.photos/id/64/600/600',
    description: 'Restore your skin\'s natural glow with Hyaluronic Acid and Vitamin C.',
    rating: 4.7,
    reviews: 670,
    features: ['Hyaluronic Acid', 'Vitamin C', 'Cruelty-Free']
  }
];