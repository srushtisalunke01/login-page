import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '../../store/nexusStore';
import { Product } from './productsData';
import { ShoppingCart, Eye, Check, Heart } from 'lucide-react';

interface ProductCard3DProps {
  product: Product;
}

export default function ProductCard3D({ product }: ProductCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isBought, setIsBought] = useState(false);

  const { addToCart, toggleWishlist, wishlistItems, toggleCompare, compareItems } = useNexusStore();
  
  const isLiked = wishlistItems.some(p => p.id === product.id);
  const isCompared = compareItems.some(p => p.id === product.id);

  const handleBuyNow = () => {
    setIsBought(true);
    setTimeout(() => {
      setIsBought(false);
    }, 2000);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.discountPrice,
      imageUrl: product.imageUrl,
      selectedColor: product.colors[0],
      selectedSize: product.sizes[0]
    });
  };

  const handleSelectProduct = () => {
    useNexusStore.getState().setSelectedProduct(product);
    useNexusStore.getState().setCurrentTab('details');
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-4 rounded-2xl border border-nexus-border relative flex flex-col justify-between interactive-card group select-none w-full"
    >
      {/* Top badges bar */}
      <div className="flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-bold tracking-widest text-black uppercase px-2.5 py-1 rounded-md bg-[#d4af37]">
            {product.category}
          </span>
          <span className="text-[7px] font-mono text-slate-500">{product.id}</span>
        </div>

        {/* Compare / Wishlist controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => toggleCompare(product)}
            className={`px-1.5 py-0.5 rounded text-[8px] border transition-colors ${
              isCompared ? 'bg-slate-900 border-transparent text-white' : 'border-slate-200 hover:text-slate-700'
            }`}
          >
            COMP
          </button>
          <button 
            onClick={() => toggleWishlist(product)}
            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
              isLiked ? 'text-nexus-magenta bg-nexus-magenta/10' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Image display */}
      <div className="h-56 w-full relative z-0 my-2 rounded-xl overflow-hidden">
        <div onClick={handleSelectProduct} className="w-full h-full relative overflow-hidden flex items-center justify-center bg-black/20 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10" />
          <motion.img 
            src={product.imageUrl} 
            alt={product.name}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Discount Ribbon */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[7px] font-black tracking-widest bg-nexus-magenta text-white shadow-neon-magenta">
          {product.discountPercent}% OFF
        </div>

        {/* Floating price tag */}
        <div className="absolute bottom-2 left-2 z-10 px-3 py-1 text-xs font-mono font-bold tracking-widest rounded-lg border border-nexus-border bg-black/70 backdrop-blur-md text-white">
          ${product.discountPrice} <span className="text-[9px] text-[#d4af37]">NEX</span>
          <span className="text-[9px] font-sans font-normal text-slate-500 line-through ml-2">
            ${product.originalPrice}
          </span>
        </div>

        {/* Stock Alert */}
        <div className="absolute bottom-2 right-2 text-[8px] font-mono bg-black/60 px-2 py-0.5 rounded border border-nexus-border/60 text-slate-400">
          STK: <span className="text-emerald-400 font-bold uppercase">{product.stockStatus}</span>
        </div>
      </div>

      {/* Details */}
      <div className="mt-2 border-t border-nexus-border/40 pt-3 flex flex-col gap-2 relative z-10">
        <div>
          <span className="text-[7px] font-mono tracking-widest text-slate-500 block uppercase">
            {product.brand}
          </span>
          <div className="flex justify-between items-start mt-0.5">
            <h3 onClick={handleSelectProduct} className="font-bold tracking-widest text-xs text-slate-800 group-hover:text-nexus-cyan transition-colors duration-300 uppercase truncate max-w-[70%] cursor-pointer">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-[8px] text-[#d4af37] font-bold font-mono">
              <span>⭐ {product.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal">({product.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Sliding Button actions drawer */}
        <div className="relative h-10 overflow-hidden w-full mt-1">
          <motion.div
            animate={{ y: isHovered ? 0 : 45 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="w-full h-10 flex gap-2"
          >
            {/* Quick View Button */}
            <button
              onClick={() => setShowQuickView(true)}
              className="w-10 h-10 bg-white/5 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-10 bg-slate-900 text-white hover:bg-[#d4af37] text-[9px] font-black tracking-widest rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              ADD
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="px-4 h-10 bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#d4af37] hover:text-white border border-[#d4af37]/35 text-[9px] font-black tracking-widest rounded-lg cursor-pointer transition-all duration-300"
            >
              {isBought ? <Check className="w-4 h-4 text-white" /> : 'BUY'}
            </button>
          </motion.div>
          
          <motion.div
            animate={{ y: isHovered ? -45 : 0 }}
            className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-400 tracking-widest border border-dashed border-slate-200 rounded-lg"
          >
            HOVER TO INSPECT DECK
          </motion.div>
        </div>
      </div>

      {/* Quick View Specifications Dialog overlay */}
      <AnimatePresence>
        {showQuickView && (
          <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[1000] bg-black/70 backdrop-blur-md p-4 font-sans text-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-md p-6 bg-white rounded-2xl border border-slate-200 text-center flex flex-col gap-4 relative"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-[10px] tracking-widest text-[#d4af37] font-bold font-orbitron">SPECIFICATIONS HUD</span>
                <button 
                  onClick={() => setShowQuickView(false)}
                  className="text-slate-400 hover:text-slate-700 font-mono cursor-pointer"
                >
                  [X]
                </button>
              </div>
              <div className="text-left text-xs font-sans text-slate-600 space-y-2">
                <p><strong className="font-orbitron text-slate-800 text-[10px] tracking-widest block">Augmentation Model:</strong> {product.name}</p>
                <p><strong className="font-orbitron text-slate-800 text-[10px] tracking-widest block">Class Node:</strong> {product.category}</p>
                <p><strong className="font-orbitron text-slate-800 text-[10px] tracking-widest block">Rating Clearance:</strong> verified ⭐ {product.rating} by {product.reviewsCount} logs</p>
                <p><strong className="font-orbitron text-slate-800 text-[10px] tracking-widest block">Security telemetry:</strong> 8.4 GHz Quantum decryption verified.</p>
              </div>
              <button
                onClick={() => setShowQuickView(false)}
                className="py-2.5 bg-slate-900 text-white font-black tracking-widest text-[10px] rounded-lg mt-2 cursor-pointer"
              >
                DISMISS SPECTROGRAPH
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
