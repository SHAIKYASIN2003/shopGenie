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
      { name: 'Size', values: ['S', 'M', 'L', 'XL', 'XXL'], priceModifiers: { 'XL': 2.00, 'XXL': 5.00 } }
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
  },
  {
    id: '9',
    name: '4K Ultra-Wide Monitor',
    price: 499.99,
    category: Category.ELECTRONICS,
    image: 'https://picsum.photos/seed/monitor/600/600',
    description: 'Immerse yourself in 1 billion colors with this professional grade display.',
    rating: 4.7,
    reviews: 320,
    features: ['144Hz Refresh Rate', 'HDR10 Support', 'USB-C Hub']
  },
  {
    id: '10',
    name: 'Mechanical Gaming Keyboard',
    price: 129.99,
    category: Category.ELECTRONICS,
    image: 'https://picsum.photos/seed/keyboard/600/600',
    description: 'Tactile switches and customizable RGB lighting for the ultimate typing experience.',
    rating: 4.8,
    reviews: 1150,
    features: ['Cherry MX Switches', 'Aircraft-grade Aluminum', 'Macro Keys'],
    options: [
       { name: 'Switch Type', values: ['Blue', 'Red', 'Brown'] }
    ]
  },
  {
    id: '11',
    name: 'Classic Denim Jacket',
    price: 89.50,
    category: Category.FASHION,
    image: 'https://picsum.photos/seed/jacket/600/600',
    description: 'A timeless classic that gets better with every wear.',
    rating: 4.5,
    reviews: 430,
    features: ['Vintage Wash', 'Copper Buttons', '100% Cotton'],
    options: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Light Blue', 'Dark Blue', 'Black'] }
    ]
  },
  {
    id: '12',
    name: 'Italian Leather Bag',
    price: 249.00,
    category: Category.FASHION,
    image: 'https://picsum.photos/seed/bag/600/600',
    description: 'Handcrafted from full-grain leather, perfect for work or travel.',
    rating: 4.9,
    reviews: 85,
    features: ['Full-grain Leather', 'Laptop Compartment', 'Water Resistant'],
     options: [
      { name: 'Color', values: ['Tan', 'Brown', 'Black'] }
    ]
  },
  {
    id: '13',
    name: 'Smart Air Purifier',
    price: 199.00,
    category: Category.HOME,
    image: 'https://picsum.photos/seed/air/600/600',
    description: 'Breathe cleaner air with HEPA filtration and real-time quality monitoring.',
    rating: 4.6,
    reviews: 2100,
    features: ['HEPA H13 Filter', 'Quiet Mode', 'App Connected']
  },
  {
    id: '14',
    name: 'Automatic Espresso Machine',
    price: 699.00,
    category: Category.HOME,
    image: 'https://picsum.photos/seed/coffee/600/600',
    description: 'Barista-quality coffee at the touch of a button.',
    rating: 4.8,
    reviews: 560,
    features: ['Built-in Grinder', 'Milk Frother', 'Touchscreen Display']
  },
  {
    id: '15',
    name: 'Carbon Fiber Tennis Racket',
    price: 189.99,
    category: Category.SPORTS,
    image: 'https://picsum.photos/seed/tennis/600/600',
    description: 'Lightweight power and control for competitive players.',
    rating: 4.7,
    reviews: 120,
    features: ['Graphite Construction', 'Vibration Dampening', 'Pre-strung']
  },
   {
    id: '16',
    name: 'Adjustable Dumbbell Set',
    price: 299.00,
    category: Category.SPORTS,
    image: 'https://picsum.photos/seed/gym/600/600',
    description: 'Replace 15 sets of weights with one compact design.',
    rating: 4.5,
    reviews: 890,
    features: ['5-52 lbs Range', 'Anti-slip Grip', 'Compact Tray']
  },
  {
    id: '17',
    name: 'Vitamin C Glow Serum',
    price: 55.00,
    category: Category.BEAUTY,
    image: 'https://picsum.photos/seed/serum/600/600',
    description: 'Brighten and even out your skin tone with potent antioxidants.',
    rating: 4.6,
    reviews: 1500,
    features: ['15% Vitamin C', 'Ferulic Acid', 'Glass Bottle']
  },
  {
    id: '18',
    name: 'Rejuvenating Night Cream',
    price: 68.00,
    category: Category.BEAUTY,
    image: 'https://picsum.photos/seed/cream/600/600',
    description: 'Wake up to plumper, smoother skin with our advanced formula.',
    rating: 4.8,
    reviews: 450,
    features: ['Retinol', 'Peptides', 'Deep Hydration']
  }
];
