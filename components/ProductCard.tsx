import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
      onClick={() => onClick(product.id)}
    >
      <div className="relative overflow-hidden aspect-square cursor-pointer bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-800 shadow-sm">
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
