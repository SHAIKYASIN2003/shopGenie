import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, Heart, X, Sparkles, ArrowRight, Check, Loader2, Trash2, Plus, Minus, MapPin, CreditCard, Star, Edit2, Save, LogOut, Repeat, Camera, Truck, Package, ShieldCheck, Clock } from 'lucide-react';
import { Product, CartItem, Category, User as UserType, Order } from './types';
import { PRODUCTS } from './constants';
import ProductCard from './components/ProductCard';
import AIAssistant from './components/AIAssistant';
import { getProductInsights } from './services/geminiService';

// --- Global State ---
interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product, options?: Record<string, string>, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  user: UserType | null;
  login: () => void;
  logout: () => void;
  updateUserProfile: (data: Partial<UserType>) => void;
  clearCart: () => void;
  // New Features
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  recentlyViewed: Product[];
  addToHistory: (product: Product) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

const useStore = () => useContext(AppContext);

// --- Wrapper Provider ---
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [user, setUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    const saved = localStorage.getItem('recentlyViewed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = (product: Product, options?: Record<string, string>, quantity: number = 1) => {
    // Calculate price with modifiers
    let finalPrice = product.price;
    if (options && product.options) {
      Object.entries(options).forEach(([optName, optValue]) => {
        const optionDef = product.options?.find(o => o.name === optName);
        if (optionDef && optionDef.priceModifiers && optionDef.priceModifiers[optValue]) {
          finalPrice += optionDef.priceModifiers[optValue];
        }
      });
    }

    const cartItemId = product.id + (options ? JSON.stringify(options) : '');
    
    setCart(prev => {
      const existing = prev.find(p => (p.cartItemId || p.id) === cartItemId);
      if (existing) {
        return prev.map(p => (p.cartItemId || p.id) === cartItemId ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { ...product, price: finalPrice, quantity: quantity, selectedOptions: options, cartItemId }];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(p => {
      if ((p.cartItemId || p.id) === cartItemId) {
        const newQuantity = Math.max(1, p.quantity + delta);
        return { ...p, quantity: newQuantity };
      }
      return p;
    }));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(p => (p.cartItemId || p.id) !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const login = () => {
    setUser({
      id: 'u1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'https://i.pravatar.cc/150?u=alex'
    });
  };

  const logout = () => setUser(null);

  const updateUserProfile = (data: Partial<UserType>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.some(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const addToHistory = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10); // Keep last 10
    });
  };

  return (
    <AppContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, 
      user, login, logout, updateUserProfile, clearCart,
      wishlist, toggleWishlist, recentlyViewed, addToHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};

// --- Helper Components ---

const RatingBar = ({ star, percent }: { star: number, percent: number }) => (
  <div className="flex items-center gap-2 text-sm mb-1">
    <span className="w-12 text-indigo-600 hover:underline cursor-pointer">{star} star</span>
    <div className="flex-1 h-4 bg-gray-100 rounded-sm overflow-hidden">
      <div className="h-full bg-yellow-400" style={{ width: `${percent}%` }}></div>
    </div>
    <span className="w-10 text-right text-gray-500">{percent}%</span>
  </div>
);

// --- Pages ---

// 1. Home Page
const Home = () => {
  const { addToCart, recentlyViewed } = useStore();
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState<string>('All');

  const featuredProducts = activeCat === 'All' 
    ? PRODUCTS.slice(0, 4) 
    : PRODUCTS.filter(p => p.category === activeCat).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center max-w-2xl px-4">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Future of Shopping is Here</h1>
          <p className="text-xl text-gray-200 mb-8">Discover AI-curated products tailored just for your lifestyle. Experience the next gen commerce.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Shop by Category</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {['All', ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeCat === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Grid */}
      <section className="py-8 container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Trending Now</h2>
          <Link to="/shop" className="text-indigo-600 font-medium flex items-center hover:underline">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart} 
              onClick={(id) => navigate(`/product/${id}`)} 
            />
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="py-12 container mx-auto px-4 border-t border-gray-100 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Browsing History</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
            {recentlyViewed.map(product => (
              <div key={product.id} className="min-w-[240px] max-w-[240px]">
                <ProductCard 
                  product={product} 
                  onAddToCart={addToCart} 
                  onClick={(id) => navigate(`/product/${id}`)} 
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// 2. Shop Page (Listing)
const Shop = () => {
  const { addToCart } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [sort, setSort] = useState('newest');

  const filtered = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  }).sort((a, b) => {
    if (sort === 'low') return a.price - b.price;
    if (sort === 'high') return b.price - a.price;
    return 0; // Newest default mock
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8 sticky top-20 bg-gray-50 z-10 py-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        
        <div className="flex gap-4 overflow-x-auto">
          <select 
            value={selectedCat} 
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
          >
            <option value="All">All Categories</option>
            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={addToCart} 
            onClick={(id) => navigate(`/product/${id}`)} 
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
};

// 3. Product Details
const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, addToHistory, toggleWishlist, wishlist } = useStore();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(0);
  
  // Delivery Date Logic
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const deliveryDate = tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  useEffect(() => {
    const found = PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setCurrentPrice(found.price);
      addToHistory(found);
      // Initialize options if available
      if (found.options) {
        const defaults: Record<string, string> = {};
        found.options.forEach(opt => {
          defaults[opt.name] = opt.values[0];
        });
        setSelectedOptions(defaults);
      }
      
      setLoadingInsight(true);
      getProductInsights(found.name, found.description)
        .then(res => setAiInsight(res))
        .finally(() => setLoadingInsight(false));
    }
  }, [id]);

  // Recalculate price when options change
  useEffect(() => {
    if (product && product.options) {
      let price = product.price;
      Object.entries(selectedOptions).forEach(([optName, optValue]) => {
        const optionDef = product.options?.find(o => o.name === optName);
        if (optionDef && optionDef.priceModifiers && optionDef.priceModifiers[optValue]) {
          price += optionDef.priceModifiers[optValue];
        }
      });
      setCurrentPrice(price);
    }
  }, [selectedOptions, product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const relatedProducts = React.useMemo(() => {
    if (!product) return [];
    return PRODUCTS
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const getColorClass = (color: string) => {
    switch (color.toLowerCase()) {
      case 'blue': return 'bg-blue-600';
      case 'black': return 'bg-gray-900';
      case 'white': return 'bg-white border border-gray-200';
      case 'heather grey': return 'bg-gray-500';
      default: return 'bg-gray-200';
    }
  };

  if (!product) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  const isInWishlist = wishlist.some(p => p.id === product.id);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* Image Column */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
            <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg object-cover aspect-square" />
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <div className="mb-2 text-indigo-600 font-semibold text-sm">{product.category}</div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-indigo-600 hover:underline cursor-pointer">{product.reviews} ratings</span>
              </div>
            </div>
          </div>

          <div className="border-t border-b border-gray-100 py-4">
            <div className="text-3xl font-bold text-gray-900">
              <span className="text-sm font-normal align-top text-gray-500 mr-1">$</span>
              {Math.floor(currentPrice)}
              <span className="text-sm font-normal align-top text-gray-900">{(currentPrice % 1).toFixed(2).substring(1)}</span>
            </div>
            <div className="text-gray-500 text-sm mt-1">
              All prices include VAT.
            </div>
          </div>

           {/* AI Insights */}
           <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" /> AI Product Insight
            </h3>
            {loadingInsight ? (
              <div className="flex items-center gap-2 text-indigo-600 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating intelligent summary...
              </div>
            ) : (
              <div className="text-indigo-800 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: aiInsight }} />
            )}
          </div>

          {/* Options Selectors */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-4">
              {product.options.map(opt => (
                <div key={opt.name}>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">{opt.name}: <span className="font-normal text-gray-600">{selectedOptions[opt.name]}</span></h4>
                  <div className="flex flex-wrap gap-3">
                    {opt.values.map(val => {
                       const isSelected = selectedOptions[opt.name] === val;
                       const priceMod = opt.priceModifiers?.[val];
                       
                       if (opt.name === 'Color') {
                         return (
                           <button
                             key={val}
                             onClick={() => setSelectedOptions(prev => ({...prev, [opt.name]: val}))}
                             className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${getColorClass(val)} ${
                               isSelected ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110' : 'hover:scale-105'
                             }`}
                             title={`${val} ${priceMod ? `(+$${priceMod.toFixed(2)})` : ''}`}
                           >
                             {isSelected && <Check className={`w-4 h-4 ${val.toLowerCase() === 'white' ? 'text-gray-900' : 'text-white'}`} />}
                           </button>
                         );
                       }

                       return (
                         <button
                           key={val}
                           onClick={() => setSelectedOptions(prev => ({...prev, [opt.name]: val}))}
                           className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                             isSelected 
                             ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                             : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                           }`}
                         >
                           {val} {priceMod ? `(+$${priceMod.toFixed(2)})` : ''}
                         </button>
                       );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div>
            <h4 className="font-bold mb-3 text-sm">About this item</h4>
            <ul className="space-y-2 text-sm">
              {product.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-gray-700">
                  <div className="mt-1 min-w-[4px] h-1 rounded-full bg-gray-400" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Buy Box Column */}
        <div className="lg:col-span-3">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <div className="text-2xl font-bold text-gray-900 mb-2">${currentPrice.toFixed(2)}</div>
            
            <div className="text-sm text-gray-600 mb-4">
              <span className="text-teal-600 font-medium flex items-center gap-1"><Truck className="w-4 h-4" /> FREE delivery</span> 
              <span className="font-bold text-gray-800 block mt-1">{deliveryDate}</span>
              <div className="text-xs mt-1">Order within <span className="text-green-600">3 hrs 15 mins</span></div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <MapPin className="w-4 h-4" />
              <span className="truncate text-teal-600 hover:underline cursor-pointer">Deliver to Alex - New York 10001</span>
            </div>

            <div className="text-lg font-medium text-green-700 mb-4">In Stock</div>

            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-full font-medium transition-colors shadow-sm"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-medium transition-colors shadow-sm"
              >
                Buy Now
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure transaction</span>
            </div>

            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <div className="flex justify-between"><span>Ships from</span> <span>ShopGenie</span></div>
              <div className="flex justify-between"><span>Sold by</span> <span>ShopGenie</span></div>
            </div>

            <button 
              onClick={() => toggleWishlist(product)}
              className={`w-full mt-4 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                isInWishlist 
                  ? 'border-red-200 text-red-600 bg-red-50' 
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-gray-100 pt-12 mb-16">
        <div className="lg:col-span-4">
           <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
           <div className="flex items-center gap-2 mb-4">
             <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
             </div>
             <span className="text-lg font-medium">{product.rating} out of 5</span>
           </div>
           <div className="text-gray-500 mb-6">{product.reviews} global ratings</div>
           
           <div className="space-y-2">
             <RatingBar star={5} percent={74} />
             <RatingBar star={4} percent={16} />
             <RatingBar star={3} percent={6} />
             <RatingBar star={2} percent={2} />
             <RatingBar star={1} percent={2} />
           </div>

           <div className="border-t border-gray-100 mt-8 pt-6">
             <h3 className="font-bold text-lg mb-2">Review this product</h3>
             <p className="text-sm text-gray-600 mb-4">Share your thoughts with other customers</p>
             <button className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
               Write a customer review
             </button>
           </div>
        </div>

        <div className="lg:col-span-8">
           <h3 className="font-bold text-lg mb-6">Top reviews from United States</h3>
           <div className="space-y-8">
             {[1, 2, 3].map((i) => (
               <div key={i} className="pb-6 border-b border-gray-100 last:border-0">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                     <User className="w-4 h-4 text-gray-500" />
                   </div>
                   <span className="text-sm font-medium text-gray-900">ShopGenie Customer</span>
                 </div>
                 <div className="flex items-center gap-2 mb-2">
                   <div className="flex text-yellow-400 text-xs">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-4 h-4 fill-current`} />
                      ))}
                   </div>
                   <span className="text-sm font-bold text-gray-900">Exactly what I needed!</span>
                 </div>
                 <div className="text-xs text-gray-500 mb-3">Reviewed in the United States on October {10 + i}, 2023</div>
                 <div className="text-sm text-gray-700 leading-relaxed mb-3">
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                 </div>
                 <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 text-xs">Helpful</button>
                    <span className="text-xs">Report</span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAddToCart={addToCart} 
                onClick={(id) => {
                  navigate(`/product/${id}`);
                  window.scrollTo(0, 0);
                }} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Cart
const Cart = () => {
  const { cart, removeFromCart, updateQuantity, user } = useStore();
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({cart.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => {
            const itemId = item.cartItemId || item.id;
            return (
            <div key={itemId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md bg-gray-50" />
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4 sm:mb-0">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    {/* Display Options */}
                    {item.selectedOptions && (
                      <div className="flex gap-2 mt-1 text-xs text-gray-600">
                        {Object.entries(item.selectedOptions).map(([key, val]) => (
                          <span key={key} className="bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-green-600 mt-2">In Stock</div>
                    <div className="text-xs text-gray-500 mt-1">Prime eligible</div>
                  </div>
                  <button onClick={() => removeFromCart(itemId)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" aria-label="Remove item">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                    <button 
                      onClick={() => updateQuantity(itemId, -1)} 
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(itemId, 1)} 
                      className="p-2 hover:bg-gray-100 text-gray-600 transition-colors rounded-r-lg"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-bold text-gray-900 text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>
          )})}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
             onClick={() => navigate('/checkout')}
             className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Checkout (Simulated)
const Checkout = () => {
  const { clearCart, user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearCart();
    navigate('/profile'); // Redirect to order history
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handlePayment} className="space-y-6">
        {/* Shipping */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="flex items-center gap-2 font-bold text-lg mb-4 text-gray-800">
            <MapPin className="w-5 h-5 text-indigo-600" /> Shipping Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" placeholder="Full Name" defaultValue={user?.name} className="input-field col-span-2" />
            <input required type="text" placeholder="Address" className="input-field col-span-2" />
            <input required type="text" placeholder="City" className="input-field" />
            <input required type="text" placeholder="ZIP / Postal" className="input-field" />
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="flex items-center gap-2 font-bold text-lg mb-4 text-gray-800">
            <CreditCard className="w-5 h-5 text-indigo-600" /> Payment Method
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <input required type="text" placeholder="Card Number" className="input-field" />
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" placeholder="MM/YY" className="input-field" />
              <input required type="text" placeholder="CVC" className="input-field" />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Place Your Order'}
        </button>
      </form>
    </div>
  );
};

// 6. Wishlist
const Wishlist = () => {
  const { wishlist, addToCart, toggleWishlist } = useStore();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is empty</h2>
        <p className="text-gray-500 mb-8">Save items you want to buy later.</p>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700"
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map(product => (
          <div key={product.id} className="relative group">
            <ProductCard 
              product={product} 
              onAddToCart={addToCart} 
              onClick={(id) => navigate(`/product/${id}`)} 
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md z-10 hover:bg-gray-50"
              title="Remove from Wishlist"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. Profile / Orders
const Profile = () => {
  const { user, logout, updateUserProfile, addToCart } = useStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', avatar: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock Orders Data with structured items
  const mockOrders: Order[] = [
    {
      id: 'ORD-7782',
      date: 'Oct 24, 2023',
      status: 'Delivered',
      total: 329.99,
      items: [
        { ...PRODUCTS[0], quantity: 1 } as CartItem,
        { ...PRODUCTS[2], quantity: 1, selectedOptions: { Color: 'Blue', Size: 'M' } } as CartItem
      ]
    },
    {
      id: 'ORD-9921',
      date: 'Just Now',
      status: 'Processing',
      total: 245.50,
      items: [
        { ...PRODUCTS[1], quantity: 1 } as CartItem,
        { ...PRODUCTS[7], quantity: 1 } as CartItem
      ]
    }
  ];

  useEffect(() => {
    if (!user) navigate('/');
    else {
      setFormData({ 
        name: user.name, 
        email: user.email, 
        avatar: user.avatar || 'https://i.pravatar.cc/150?u=alex' 
      });
    }
  }, [user, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUserProfile(formData);
    setIsEditing(false);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart(item, item.selectedOptions, item.quantity);
    });
    navigate('/cart');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="relative group">
              <img 
                src={isEditing ? formData.avatar : user.avatar} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full border-4 border-indigo-50 object-cover" 
              />
              {isEditing && (
                <div 
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/50 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-6 h-6 text-white" />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-[200px]">
              {isEditing ? (
                <div className="space-y-3 animate-fade-in">
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input-field py-2 text-lg font-bold"
                    placeholder="Your Name"
                  />
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="input-field py-2 text-sm"
                    placeholder="Email Address"
                  />
                </div>
              ) : (
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {isEditing ? (
              <>
                <button 
                  onClick={() => {
                    setFormData({ 
                      name: user.name, 
                      email: user.email, 
                      avatar: user.avatar || 'https://i.pravatar.cc/150?u=alex' 
                    });
                    setIsEditing(false);
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg border border-gray-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
                <button 
                  onClick={logout} 
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Order History</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-600">Order ID</th>
              <th className="p-4 font-medium text-gray-600">Date</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Total</th>
              <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-sm text-indigo-600 font-medium">{order.id}</td>
                <td className="p-4 text-gray-600">{order.date}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 font-medium">${order.total.toFixed(2)}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleReorder(order)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-colors text-sm font-medium text-gray-600"
                    title="Reorder all items"
                  >
                    <Repeat className="w-4 h-4" /> Reorder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Layout Component ---
const Layout = () => {
  const { cart, user, login, wishlist } = useStore();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              ShopGenie
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-indigo-600 font-medium">Shop</Link>
            <Link to="/wishlist" className="text-gray-600 hover:text-indigo-600 font-medium">Wishlist</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
             <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative hidden sm:block"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="w-6 h-6 text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-400 text-gray-900 font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cart.length}
                </span>
              )}
            </button>
            
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-full pr-3 transition-colors">
                <img src={user.avatar} alt="Me" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                <span className="text-sm font-medium hidden sm:block">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <button onClick={login} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
         <div className="md:hidden bg-white border-b p-4 space-y-4">
            <Link to="/" onClick={() => setMobileMenu(false)} className="block text-gray-600">Home</Link>
            <Link to="/shop" onClick={() => setMobileMenu(false)} className="block text-gray-600">Shop</Link>
            <Link to="/wishlist" onClick={() => setMobileMenu(false)} className="block text-gray-600">Wishlist</Link>
         </div>
      )}

      {/* Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">ShopGenie</h3>
            <p className="text-sm">Next generation shopping experience powered by Artificial Intelligence.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>Electronics</li>
              <li>Fashion</li>
              <li>Home & Living</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>Order Status</li>
              <li>Shipping & Delivery</li>
              <li>Returns</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Stay in the loop</h4>
            <div className="flex">
              <input type="email" placeholder="Enter email" className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none w-full" />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700">Sub</button>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Floating Button */}
      <button 
        onClick={() => setIsAiOpen(!isAiOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-110 z-40"
      >
        {isAiOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      <AIAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
};

// --- Styles ---
const styleSheet = `
  .input-field {
    @apply w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors;
  }
`;

const App = () => {
  return (
    <Router>
      <style>{styleSheet}</style>
      <AppProvider>
        <Layout />
      </AppProvider>
    </Router>
  );
};

export default App;