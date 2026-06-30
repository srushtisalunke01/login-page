import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ShoppingCart, Heart, ShieldCheck, Sparkles, 
  MessageCircle, Star, ThumbsUp, Send, Check, Play, Pause 
} from 'lucide-react';
import { Product, Review, PRODUCTS } from './productsData';
import { useNexusStore } from '../../store/nexusStore';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CyberShoe, CyberDrone, CyberHeadphones, QuantumCore } from '../3D/ProductModels';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onCartOpen: () => void;
}

export default function ProductDetails({ product, onBack, onCartOpen }: ProductDetailsProps) {
  const { 
    addToCart, toggleWishlist, wishlistItems, 
    toggleCompare, compareItems, addToRecentlyViewed
  } = useNexusStore();

  React.useEffect(() => {
    addToRecentlyViewed(product);
  }, [product, addToRecentlyViewed]);

  const [activeImage, setActiveImage] = React.useState(product.imageUrl);
  const [selectedColor, setSelectedColor] = React.useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = React.useState(product.sizes[0]);
  
  // Custom video player states
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [showVideo, setShowVideo] = React.useState(false);
  const [show3D, setShow3D] = React.useState(false);
  
  // Custom review states
  const [productReviews, setProductReviews] = React.useState<Review[]>(product.reviews);
  const [newReviewName, setNewReviewName] = React.useState('');
  const [newReviewComment, setNewReviewComment] = React.useState('');
  const [newReviewRating, setNewReviewRating] = React.useState(5);
  const [reviewSuccess, setReviewSuccess] = React.useState(false);

  // Frequently Bought Together combo states
  const [comboChecked, setComboChecked] = React.useState(true);
  const comboProduct = React.useMemo(() => {
    // Find another product in same category
    return PRODUCTS.find(p => p.category === product.category && p.id !== product.id) || PRODUCTS[0];
  }, [product]);

  // Zoom magnifier states
  const [zoomStyle, setZoomStyle] = React.useState<React.CSSProperties>({ display: 'none' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const isLiked = wishlistItems.some(p => p.id === product.id);
  const isCompared = compareItems.some(p => p.id === product.id);

  // Form submit for adding custom review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview: Review = {
      name: newReviewName,
      avatar: '',
      rating: newReviewRating,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      comment: newReviewComment,
      verified: true,
      helpfulVotes: 0
    };

    setProductReviews([newReview, ...productReviews]);
    setNewReviewName('');
    setNewReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.discountPrice,
      imageUrl: product.imageUrl,
      selectedColor,
      selectedSize
    });
  };

  const handleAddComboToCart = () => {
    handleAddToCart();
    if (comboChecked) {
      addToCart({
        id: comboProduct.id,
        name: comboProduct.name,
        brand: comboProduct.brand,
        price: comboProduct.discountPrice,
        imageUrl: comboProduct.imageUrl,
        selectedColor: comboProduct.colors[0],
        selectedSize: comboProduct.sizes[0]
      });
    }
    onCartOpen();
  };

  // Dynamic similar products
  const similarProducts = React.useMemo(() => {
    return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product]);

  // Compute rating distributions
  const distribution = React.useMemo(() => {
    const total = productReviews.length || 1;
    const counts = [0, 0, 0, 0, 0]; // 1-star to 5-star
    productReviews.forEach(r => {
      const idx = Math.min(4, Math.max(0, Math.round(r.rating) - 1));
      counts[idx]++;
    });
    return counts.map(c => Math.round((c / total) * 100)).reverse(); // 5-star first
  }, [productReviews]);

  return (
    <div className="space-y-12 select-none font-sans pb-16">
      
      {/* Back nav bar */}
      <div className="flex justify-between items-center border-b border-nexus-border pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO HUB CATALOG
        </button>
        <span className="text-[10px] font-orbitron font-black tracking-widest text-[#d4af37] bg-[#d4af37]/15 px-3 py-1 rounded-md border border-[#d4af37]/35 uppercase">
          Product Details
        </span>
      </div>

      {/* Main product specs overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Images gallery & video preview */}
        <div className="lg:col-span-5 space-y-4">
          
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-96 relative border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center cursor-crosshair group"
          >
            {show3D ? (
              // Three.js R3F 3D Canvas
              <div className="w-full h-full relative bg-[#0b0f19] flex items-center justify-center text-white">
                <div className="w-full h-full relative">
                  <Canvas camera={{ position: [0, 0, 2.5], fov: 50 } as any}>
                    <ambientLight intensity={1.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <directionalLight position={[-5, 5, -5]} intensity={0.8} />
                    <React.Suspense fallback={null}>
                      {product.modelType === 'shoe' && <CyberShoe color="#d4af37" />}
                      {product.modelType === 'drone' && <CyberDrone color="#d4af37" />}
                      {product.modelType === 'headphones' && <CyberHeadphones color="#d4af37" />}
                      {product.modelType === 'core' && <QuantumCore color="#d4af37" />}
                      <OrbitControls enableZoom={true} enablePan={false} autoRotate={true} autoRotateSpeed={1.5} />
                    </React.Suspense>
                  </Canvas>
                </div>
                
                <button 
                  onClick={() => setShow3D(false)}
                  className="absolute top-4 right-4 text-xs font-bold font-mono px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg cursor-pointer z-10"
                >
                  DISMISS 3D
                </button>
                
                <div className="absolute bottom-4 left-4 text-[9px] font-mono text-slate-400 bg-black/60 px-3 py-1.5 rounded border border-white/10 select-none pointer-events-none z-10">
                  🖱 Drag to Rotate | Scroll to Zoom
                </div>
              </div>
            ) : showVideo ? (
              // Luxury Mock Video Player
              <div className="w-full h-full relative bg-slate-900 flex items-center justify-center text-white">
                {isVideoPlaying ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4 cursor-pointer"
                      onClick={() => setIsVideoPlaying(false)}
                    >
                      <Pause className="w-6 h-6 fill-white" />
                    </motion.div>
                    <span className="font-orbitron text-xs tracking-widest font-bold uppercase animate-pulse">STREAMING CYBER LOGS...</span>
                    <span className="text-[9px] text-slate-400 mt-2 font-mono">Ver. 8.4 luxury presentation active</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90">
                    <div 
                      className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                    <span className="font-orbitron text-xs tracking-widest font-bold uppercase">PLAY LUXURY SHOWCASE</span>
                  </div>
                )}
                <button 
                  onClick={() => setShowVideo(false)}
                  className="absolute top-4 right-4 text-xs font-bold font-mono px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg cursor-pointer"
                >
                  DISMISS VIDEO
                </button>
              </div>
            ) : (
              // Standard Product Photo Image
              <>
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-opacity duration-300" 
                />
                
                {/* Custom Magnifier Lens */}
                <div 
                  className="absolute inset-0 pointer-events-none border border-slate-200 rounded-2xl hidden group-hover:block" 
                  style={zoomStyle} 
                />

                {/* Optional 3D View badge floating */}
                {product.modelType && (
                  <button
                    onClick={() => { setShow3D(true); setShowVideo(false); }}
                    className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-[#d4af37]/95 hover:bg-[#d4af37] text-[9px] text-white font-orbitron font-black tracking-widest rounded-lg border border-[#d4af37]/40 shadow-md transition-all duration-300 cursor-pointer z-10"
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                    INSPECT 3D MODEL
                  </button>
                )}
 
                {/* Video Play badge floating */}
                <button
                  onClick={() => { setShowVideo(true); setIsVideoPlaying(true); }}
                  className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/75 hover:bg-black text-[9px] text-white font-orbitron font-black tracking-widest rounded-lg border border-white/20 transition-all duration-300 cursor-pointer shadow-md"
                >
                  <Play className="w-3 h-3 fill-white" />
                  PLAY SHOWCASE
                </button>
              </>
            )}

            {/* Discount Ribbons */}
            <div className="absolute top-4 left-4 bg-nexus-magenta text-white px-3 py-1 text-[9px] font-black tracking-widest rounded-lg uppercase shadow-sm">
              {product.discountPercent}% SAVINGS
            </div>
          </div>

          {/* Thumbnails array selection */}
          <div className="flex gap-3 justify-center">
            {product.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImage(img);
                  setShowVideo(false);
                  setShow3D(false);
                }}
                className={`w-20 h-20 rounded-xl overflow-hidden border bg-white flex items-center justify-center p-1 cursor-pointer transition-all duration-200 hover:scale-105 shrink-0 ${
                  activeImage === img && !showVideo && !show3D ? 'border-[#d4af37] shadow-sm ring-1 ring-[#d4af37]/30' : 'border-slate-200'
                }`}
              >
                <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover rounded-lg" />
              </button>
            ))}
          </div>

        </div>

        {/* Right Side: Options ledger, specifications */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          
          {/* Brand, Title, Rating */}
          <div className="space-y-2">
            <span className="text-[10px] font-orbitron font-black text-slate-400 tracking-widest block uppercase">
              💎 {product.brand.toUpperCase()} SELLER NETWORK
            </span>
            <h1 className="text-2xl md:text-3xl font-orbitron font-black tracking-wider text-slate-900 uppercase">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
              <div className="flex items-center gap-1 text-[#d4af37] font-bold">
                <Star className="w-4 h-4 fill-[#d4af37] text-transparent" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({productReviews.length} Verified Buyers)</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span>Seller: <strong className="text-slate-800">{product.sellerName}</strong></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-emerald-600 font-bold uppercase">{product.stockStatus}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="glass-panel p-5 rounded-2xl border border-nexus-border flex justify-between items-center bg-white/90">
            <div>
              <span className="text-[9px] font-orbitron font-black tracking-widest text-slate-400 block uppercase">Valuation Ledger</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl font-mono font-bold text-slate-950">${product.discountPrice.toLocaleString()} NEX</span>
                <span className="text-sm text-slate-400 line-through font-mono">${product.originalPrice.toLocaleString()} NEX</span>
              </div>
            </div>
            <div className="text-right text-[9px] font-mono text-slate-400 uppercase hidden sm:block leading-relaxed">
              <p>Atmospheric shipping: standard free</p>
              <p>Estimated arrival: {product.deliveryTime}</p>
            </div>
          </div>

          {/* Color & Size Customization Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Color pills selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-orbitron font-black text-slate-900 tracking-widest block uppercase">Color Options</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  const isActive = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'bg-[#d4af37] text-white border-transparent shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {color.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes selection list */}
            <div className="space-y-2">
              <span className="text-[10px] font-orbitron font-black text-slate-900 tracking-widest block uppercase">Sizes Configuration</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'bg-slate-900 text-white border-transparent shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Action triggers: Compare / Wishlist / Cart */}
          <div className="flex gap-4">
            
            {/* Add to wishlist */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-200 cursor-pointer hover:scale-105 ${
                isLiked 
                  ? 'text-nexus-magenta bg-nexus-magenta/10 border-nexus-magenta/25' 
                  : 'text-slate-400 bg-white border-slate-200 hover:text-slate-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            {/* Compare deck toggle */}
            <button
              onClick={() => toggleCompare(product)}
              className={`px-4 h-12 rounded-xl border text-[10px] font-orbitron font-black tracking-widest cursor-pointer transition-all duration-300 hover:scale-105 ${
                isCompared 
                  ? 'bg-nexus-cyan text-white border-transparent shadow-sm' 
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800'
              }`}
            >
              {isCompared ? 'COMPARE ACTIVE' : 'ADD TO COMPARE'}
            </button>

            {/* Add to cart trigger */}
            <button
              onClick={() => {
                handleAddToCart();
                onCartOpen();
              }}
              className="flex-1 py-3.5 bg-[#d4af37] text-white hover:bg-slate-900 font-orbitron font-black tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              ADD MODULE TO DOCK
            </button>
          </div>

          {/* Security alerts, return policy tags */}
          <div className="p-4 bg-amber-50/50 border border-[#d4af37]/20 rounded-2xl flex gap-3 text-slate-600 text-xs">
            <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wide">SECURE DOCK TELEMETRY APPROVED</h4>
              <p className="leading-relaxed text-[11px]">
                Features {product.warranty}. Includes {product.returnPolicy}. Authenticated with luxury signature checks.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Frequently Bought Together Combo builder */}
      <div className="glass-panel p-6 rounded-2xl border border-nexus-border space-y-4 bg-white/70">
        <h3 className="font-orbitron font-black text-xs tracking-widest text-slate-950 uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#d4af37] animate-pulse" />
          Frequently Bought Together
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            {/* Primary Item Thumbnail */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-white shrink-0">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-[11px]">
                <h5 className="font-bold text-slate-800 uppercase truncate max-w-[150px]">{product.name}</h5>
                <span className="text-slate-500 font-mono">${product.discountPrice}</span>
              </div>
            </div>

            <span className="text-slate-400 font-orbitron font-black text-lg">+</span >

            {/* Combo Product Thumbnail */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-white shrink-0 relative">
                <img src={comboProduct.imageUrl} alt={comboProduct.name} className="w-full h-full object-cover" />
                <input
                  type="checkbox"
                  checked={comboChecked}
                  onChange={() => setComboChecked(!comboChecked)}
                  className="absolute top-1 right-1 rounded border-slate-300 text-[#d4af37] focus:ring-[#d4af37] w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="text-[11px]">
                <h5 className="font-bold text-slate-800 uppercase truncate max-w-[150px]">{comboProduct.name}</h5>
                <span className="text-slate-500 font-mono">${comboProduct.discountPrice}</span>
              </div>
            </div>
          </div>

          {/* Pricing combo actions */}
          <div className="text-center md:text-right space-y-2 shrink-0">
            <div className="text-xs text-slate-500 font-medium">
              Bundle Price: <strong className="text-slate-900 text-sm font-mono font-bold">
                ${(product.discountPrice + (comboChecked ? comboProduct.discountPrice : 0)).toLocaleString()} NEX
              </strong>
            </div>
            <button
              onClick={handleAddComboToCart}
              className="px-5 py-2.5 bg-slate-900 hover:bg-[#d4af37] text-white text-[10px] font-orbitron font-black tracking-widest rounded-xl cursor-pointer transition-all duration-300"
            >
              ADD BUNDLE TO CART
            </button>
          </div>
        </div>
      </div>

      {/* Specifications list section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Features list */}
        <div className="glass-panel p-6 rounded-2xl border border-nexus-border space-y-4 bg-white/70">
          <h3 className="font-orbitron font-black text-xs tracking-widest text-slate-950 uppercase border-b border-slate-100 pb-2">
            CORE ADVANTAGES
          </h3>
          <ul className="space-y-3.5 text-xs text-slate-600">
            {product.features.map((feat, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Specs sheet table */}
        <div className="glass-panel p-6 rounded-2xl border border-nexus-border space-y-4 bg-white/70">
          <h3 className="font-orbitron font-black text-xs tracking-widest text-slate-950 uppercase border-b border-slate-100 pb-2">
            TECHNICAL HUD LEDGERS
          </h3>
          <div className="divide-y divide-slate-100 font-mono text-[10px]">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2.5 text-slate-600">
                <span className="uppercase text-slate-400 font-sans font-bold">{key}</span>
                <span className="text-slate-800 font-bold uppercase">{val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Q&A Accordion section */}
      <div className="glass-panel p-6 rounded-2xl border border-nexus-border space-y-4 bg-white/70">
        <h3 className="font-orbitron font-black text-xs tracking-widest text-slate-950 uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#d4af37]" />
          QUESTIONS & ANSWERS HUD
        </h3>
        
        <div className="space-y-4 divide-y divide-slate-100">
          {product.qas.map((qa, i) => (
            <div key={i} className={`pt-4 ${i === 0 ? 'pt-0' : ''} space-y-2`}>
              <div className="flex gap-2.5 font-bold text-slate-900 text-xs">
                <span className="text-[#d4af37] font-orbitron font-black">Q:</span>
                <span>{qa.question}</span>
              </div>
              <div className="flex gap-2.5 text-slate-600 text-xs leading-relaxed pl-4">
                <span className="text-emerald-500 font-bold">A:</span>
                <p>{qa.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews rating charts & buyer reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Distributions rating stats */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-nexus-border h-fit space-y-5 bg-white/70">
          <h3 className="font-orbitron font-black text-xs tracking-widest text-slate-950 uppercase border-b border-slate-100 pb-2">
            RATINGS SPECTRUM
          </h3>
          
          <div className="text-center space-y-1">
            <div className="text-4xl font-mono font-bold text-slate-950">{product.rating.toFixed(1)}</div>
            <div className="flex justify-center text-[#d4af37] gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 fill-current ${i < Math.round(product.rating) ? 'text-[#d4af37]' : 'text-slate-200'}`} />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Clearance Index</span>
          </div>

          <div className="space-y-2 pt-2">
            {distribution.map((pct, idx) => {
              const stars = 5 - idx;
              return (
                <div key={stars} className="flex items-center gap-3 text-[10px] font-mono text-slate-500 font-bold">
                  <span className="w-8">{stars} Star</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#d4af37] rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  <span className="w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews lists & add-review form */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Write review form */}
          <div className="glass-panel p-6 rounded-2xl border border-nexus-border bg-white/70 space-y-4">
            <h3 className="font-orbitron font-black text-xs tracking-widest text-slate-950 uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
              LOG CUSTOMER REVIEW
            </h3>
            
            <form onSubmit={handleAddReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder="OPERATOR USER KEY..."
                  className="bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 uppercase font-mono"
                />
                
                {/* Custom Stars Rating selection */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 justify-around">
                  <span className="text-[10px] text-slate-400 uppercase font-bold font-mono shrink-0">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setNewReviewRating(val)}
                        className="text-slate-300 hover:scale-110 cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${val <= newReviewRating ? 'text-[#d4af37] fill-[#d4af37]' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                required
                rows={3}
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="INPUT RECENT SPECIFICATION LOG COMMENTS..."
                className="w-full bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400"
              />

              <div className="flex justify-between items-center">
                {reviewSuccess ? (
                  <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    REVIEW RECORDED TO TELEMETRY DOCK!
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-400 font-mono uppercase">VERIFICATION: SECURED CERTIFIED BY PORTAL</span>
                )}
                
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-[#d4af37] text-white text-[10px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 uppercase"
                >
                  <Send className="w-3.5 h-3.5" />
                  LOG REVIEW
                </button>
              </div>
            </form>
          </div>

          {/* List of reviews */}
          <div className="space-y-4">
            {productReviews.map((rev, rIdx) => (
              <div 
                key={rIdx} 
                className="glass-panel p-5 rounded-2xl border border-nexus-border bg-white/70 space-y-3"
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h5 className="font-orbitron font-black text-[10px] tracking-wider text-slate-950 uppercase">{rev.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex text-[#d4af37] gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 fill-current ${i < rev.rating ? 'text-[#d4af37]' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">{rev.date}</span>
                    </div>
                  </div>
                  {rev.verified && (
                    <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50 uppercase">
                      ✓ Verified Buyer
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">{rev.comment}</p>

                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2.5 pt-1">
                    {rev.images.map((img, i) => (
                      <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img src={img} alt="review" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1 text-[9px] text-slate-400 font-mono">
                  <span>Helpful review?</span>
                  <button 
                    onClick={() => {
                      // Increments helpfulVotes for the local review
                      const updated = [...productReviews];
                      updated[rIdx] = { ...updated[rIdx], helpfulVotes: updated[rIdx].helpfulVotes + 1 };
                      setProductReviews(updated);
                    }}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer font-bold"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    YES ({rev.helpfulVotes})
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Similar products section slider layout */}
      <div className="space-y-4">
        <h3 className="font-orbitron font-black text-xs tracking-widest text-slate-950 uppercase">
          SIMILAR AUGMENTATIONS
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {similarProducts.map((sim) => (
            <div 
              key={sim.id}
              onClick={() => {
                // Change product view
                product = sim;
                setActiveImage(sim.imageUrl);
                setProductReviews(sim.reviews);
                setSelectedColor(sim.colors[0]);
                setSelectedSize(sim.sizes[0]);
                setIsVideoPlaying(false);
                setShowVideo(false);
                // Trigger selectedProduct update
                useNexusStore.getState().setSelectedProduct(sim);
              }}
              className="glass-panel p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#d4af37]/40 cursor-pointer transition-all duration-300 group"
            >
              <div className="w-full h-32 rounded-lg overflow-hidden bg-slate-50 relative border border-slate-100">
                <img src={sim.imageUrl} alt={sim.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="mt-3.5 text-[10px]">
                <span className="text-slate-400 font-mono block uppercase">{sim.brand}</span>
                <h4 className="font-bold text-slate-800 uppercase truncate mt-0.5">{sim.name}</h4>
                <div className="flex justify-between items-baseline mt-1 flex-wrap">
                  <span className="text-[#d4af37] font-mono font-bold">${sim.discountPrice}</span>
                  <span className="text-[8px] text-slate-400 line-through font-mono">${sim.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
