import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '../../store/nexusStore';
import { Product } from '../../components/products/productsData';
import BrowseFilters from '../../components/home/BrowseFilters';
import ProductDetails from '../../components/products/ProductDetails';
import CompareMatrix from '../../components/products/CompareMatrix';
import CheckoutFlow from '../../components/checkout/CheckoutFlow';
import AiAssistant from '../../components/ai/AiAssistant';
import CartDrawer from '../../components/cart/CartDrawer';
import CelebrationScreen from '../../components/ui/CelebrationScreen';
import ThemeSwitcher from '../../components/ui/ThemeSwitcher';
import PromoCarousel from '../../components/home/PromoCarousel';
import AdminDashboard from '../../components/admin/AdminDashboard';

import { 
  Search, Mic, Image, History, ShoppingCart, Heart, 
  Wallet, Bell, Sparkles, MapPin, CreditCard, 
  Plus, Eye, LogOut, Clipboard
} from 'lucide-react';

const TRANSLATIONS = {
  EN: {
    shopHub: "Shop Hub",
    trackCargo: "Track Cargo",
    wishlist: "Wishlist",
    compare: "Compare",
    profile: "Profile",
    searchPlaceholder: "Search Apple, Nike, Tesla collections, check clearance deals...",
    lightningDeals: "⚡ Lightning Deals (Flash Sale)",
    bestSellers: "🔥 Best Sellers (Highest Rated)",
    trending: "✨ Trending Augmentations (Popularity Index)",
    selectCategory: "Select category deck",
    catalogListings: "Catalog Listings",
    continueShopping: "Continue Shopping",
    addToCart: "ADD TO CART",
    buy: "BUY",
    systemLogs: "SYSTEM LOGS",
    securityEnvelope: "SECURITY ENVELOPE: SECURE PORTAL CHANNEL",
    adminPortal: "Admin Portal",
  },
  JP: {
    shopHub: "ショップハブ",
    trackCargo: "貨物追跡",
    wishlist: "ウィッシュリスト",
    compare: "比較",
    profile: "プロファイル",
    searchPlaceholder: "アップル、ナイキ、テスラコレクションを検索...",
    lightningDeals: "⚡ ライトニングディール (タイムセール)",
    bestSellers: "🔥 ベストセラー (最高評価)",
    trending: "✨ トレンド商品 (人気指標)",
    selectCategory: "カテゴリデッキ選択",
    catalogListings: "カタログリスト",
    continueShopping: "買い物を続ける",
    addToCart: "カートに入れる",
    buy: "購入する",
    systemLogs: "システムログ",
    securityEnvelope: "セキュリティ封筒: 安全なポータルチャネル",
    adminPortal: "管理ポータル",
  },
  DE: {
    shopHub: "Shop-Zentrum",
    trackCargo: "Fracht verfolgen",
    wishlist: "Wunschliste",
    compare: "Vergleichen",
    profile: "Profil",
    searchPlaceholder: "Suche Apple, Nike, Tesla...",
    lightningDeals: "⚡ Blitzangebote (Flash-Sale)",
    bestSellers: "🔥 Bestseller (Am besten bewertet)",
    trending: "✨ Trend-Produkte (Beliebtheitsindex)",
    selectCategory: "Kategorie-Deck auswählen",
    catalogListings: "Katalog-Einträge",
    continueShopping: "Einkauf fortsetzen",
    addToCart: "IN DEN WARENKORB",
    buy: "KAUFEN",
    systemLogs: "Systemprotokolle",
    securityEnvelope: "SICHERHEITSUMSCHLAG: SICHERER PORTALKANAL",
    adminPortal: "Admin-Portal",
  },
  ES: {
    shopHub: "Centro de Tienda",
    trackCargo: "Rastrear Carga",
    wishlist: "Lista de Deseos",
    compare: "Comparar",
    profile: "Perfil",
    searchPlaceholder: "Buscar colecciones de Apple, Nike, Tesla...",
    lightningDeals: "⚡ Ofertas Relámpago",
    bestSellers: "🔥 Los Más Vendidos",
    trending: "✨ Productos en Tendencia",
    selectCategory: "Seleccionar cubierta de categoría",
    catalogListings: "Listados del catálogo",
    continueShopping: "Continuar comprando",
    addToCart: "AÑADIR AL CARRITO",
    buy: "COMPRAR",
    systemLogs: "Registros del sistema",
    securityEnvelope: "SOBRE DE SEGURIDAD: CANAL DE PORTAL SEGURO",
    adminPortal: "Portal de Admin",
  }
};

export default function DashboardPage() {
  const {
    products, logout, language, setLanguage,
    currentTab, setCurrentTab, selectedProduct, setSelectedProduct,
    cartCount, addToCart,
    wishlistItems, wishlistCount, toggleWishlist, moveToCart,
    compareItems, toggleCompare,
    userName, userEmail, userAvatar, membershipLevel, loyaltyPoints, walletBalance, topUpWallet,
    addresses, addAddress, removeAddress,
    savedCards, removeSavedCard,
    coupons, orders, cancelOrder, returnOrder,
    notifications, markNotificationsRead, addNotification,
    activeCategory, setActiveCategory, recentlyViewed
  } = useNexusStore();

  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;

  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [showCheckout, setShowCheckout] = React.useState(false);

  // Curated horizontal sliders collections
  const flashSaleProducts = React.useMemo(() => {
    return products.filter(p => p.discountPercent >= 30).slice(0, 8);
  }, [products]);

  const bestSellersProducts = React.useMemo(() => {
    return products.filter(p => p.rating >= 4.8).slice(8, 16);
  }, [products]);

  const trendingProducts = React.useMemo(() => {
    return products.filter(p => p.reviewsCount >= 1000).slice(16, 24);
  }, [products]);

  // Search States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = React.useState(false);
  const [searchHistory, setSearchHistory] = React.useState<string[]>(['iphone', 'watch', 'nike shoes']);
  const [showImageSearchModal, setShowImageSearchModal] = React.useState(false);
  
  // Simulated Voice Search
  const [isVoiceSearching, setIsVoiceSearching] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  // Filter States
  const [selectedBrand, setSelectedBrand] = React.useState('all');
  const [selectedPriceMax, setSelectedPriceMax] = React.useState(5000);
  const [selectedRating, setSelectedRating] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState('all');
  const [selectedSize, setSelectedSize] = React.useState('all');
  const [selectedAvailability, setSelectedAvailability] = React.useState('all');
  const [selectedDiscount, setSelectedDiscount] = React.useState(0);
  const [selectedMaterial, setSelectedMaterial] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('popularity');

  // Profile Address/Card input states
  const [newAddress, setNewAddress] = React.useState('');
  const [topUpAmount, setTopUpAmount] = React.useState(1000);

  // Flash Sale Timer
  const [countdown, setCountdown] = React.useState('00:00:00');

  // Flying particles & dynamic toasts
  const [flyingParticles, setFlyingParticles] = React.useState<{ id: number; startX: number; startY: number }[]>([]);
  const [toasts, setToasts] = React.useState<{ id: number; text: string; sub: string }[]>([]);
  
  // Infinite scroll limits
  const [visibleCount, setVisibleCount] = React.useState(12);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const triggerCartFly = (e: React.MouseEvent, prodName: string) => {
    const id = Date.now();
    setFlyingParticles(prev => [...prev, { id, startX: e.clientX, startY: e.clientY }]);
    
    // Add toast
    setToasts(prev => [...prev, { 
      id, 
      text: "AUGMENTATION SECURED", 
      sub: `${prodName.toUpperCase()} INSTALLED IN CARGO DECK` 
    }]);

    // Cleanup particle
    setTimeout(() => {
      setFlyingParticles(prev => prev.filter(p => p.id !== id));
    }, 850);

    // Cleanup toast
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Filter & Sort Logic
  const filteredProducts = React.useMemo(() => {
    let list = products;

    // Filter by Top category bar
    list = list.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }

    // Filter by Brand
    if (selectedBrand !== 'all') {
      list = list.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Filter by Price
    list = list.filter(p => p.discountPrice <= selectedPriceMax);

    // Filter by Rating
    if (selectedRating > 0) {
      list = list.filter(p => p.rating >= selectedRating);
    }

    // Filter by Color
    if (selectedColor !== 'all') {
      list = list.filter(p => p.colors.some(c => c.toLowerCase() === selectedColor.toLowerCase()));
    }

    // Filter by Size
    if (selectedSize !== 'all') {
      list = list.filter(p => p.sizes.some(s => s.toLowerCase() === selectedSize.toLowerCase()));
    }

    // Filter by Availability
    if (selectedAvailability === 'in stock') {
      list = list.filter(p => p.stockStatus === 'In Stock');
    } else if (selectedAvailability === 'limited') {
      list = list.filter(p => p.stockStatus !== 'In Stock');
    }

    // Filter by Discount
    if (selectedDiscount > 0) {
      list = list.filter(p => p.discountPercent >= selectedDiscount);
    }

    // Filter by Material
    if (selectedMaterial !== 'all') {
      list = list.filter(p => p.specifications['Core Build'] && p.specifications['Core Build'].toLowerCase().includes(selectedMaterial.toLowerCase()));
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'price-low') return a.discountPrice - b.discountPrice;
      if (sortBy === 'price-high') return b.discountPrice - a.discountPrice;
      if (sortBy === 'rated') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'latest') return b.id.localeCompare(a.id);
      return b.reviewsCount - a.reviewsCount; // default popularity
    });
  }, [
    activeCategory, searchQuery, selectedBrand, selectedPriceMax, selectedRating, 
    selectedColor, selectedSize, selectedAvailability, selectedDiscount, selectedMaterial, sortBy, products
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const mins = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const secs = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      setCountdown(`${hours}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set up Speech Recognition for Search Bar
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'en-US';
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsVoiceSearching(false);
      };
      rec.onerror = () => setIsVoiceSearching(false);
      rec.onend = () => setIsVoiceSearching(false);
      recognitionRef.current = rec;
    }
  }, []);

  // Reset scroll limit on catalog search/filter changes
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory, selectedBrand, selectedPriceMax, selectedRating, selectedColor, selectedSize, selectedAvailability, selectedDiscount, selectedMaterial, sortBy, searchQuery]);

  // Window scroll event listener for Infinite Scroll
  useEffect(() => {
    if (currentTab !== 'home') return;
    
    const handleScroll = () => {
      if (isLoadingMore) return;
      
      const threshold = 250; // pixels from the bottom to trigger load
      const position = window.innerHeight + window.scrollY;
      const height = document.documentElement.scrollHeight;
      
      if (position >= height - threshold) {
        if (visibleCount < filteredProducts.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount(prev => prev + 12);
            setIsLoadingMore(false);
          }, 950);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentTab, visibleCount, isLoadingMore, filteredProducts.length]);

  const handleVoiceSearchToggle = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }
    if (isVoiceSearching) {
      recognitionRef.current.stop();
      setIsVoiceSearching(false);
    } else {
      setIsVoiceSearching(true);
      recognitionRef.current.start();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add query to search history
      const unique = Array.from(new Set([searchQuery.toLowerCase(), ...searchHistory])).slice(0, 5);
      setSearchHistory(unique);
      setShowSearchSuggestions(false);
    }
  };

  const resetFilters = () => {
    setSelectedBrand('all');
    setSelectedPriceMax(5000);
    setSelectedRating(0);
    setSelectedColor('all');
    setSelectedSize('all');
    setSelectedAvailability('all');
    setSelectedDiscount(0);
    setSelectedMaterial('all');
    setSortBy('popularity');
  };



  // Extract unique brands dynamically based on category
  const availableBrands = React.useMemo(() => {
    const brandsSet = new Set(products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase()).map(p => p.brand));
    return Array.from(brandsSet);
  }, [activeCategory, products]);

  // Autocomplete Suggestions
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .slice(0, 5);
  }, [searchQuery, products]);

  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name);
    setShowSearchSuggestions(false);
    // Add to history
    const unique = Array.from(new Set([name.toLowerCase(), ...searchHistory])).slice(0, 5);
    setSearchHistory(unique);
  };

  const handleShareWishlist = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification('Wishlist Shared', 'Your secure wishlist portal coordinates copied to clipboard.');
    alert('Wishlist shared successfully! Link copied to clipboard.');
  };

  const handleBuyNow = (prod: Product) => {
    addToCart({
      id: prod.id,
      name: prod.name,
      brand: prod.brand,
      price: prod.discountPrice,
      imageUrl: prod.imageUrl,
      selectedColor: prod.colors[0],
      selectedSize: prod.sizes[0]
    });
    setIsCartOpen(true);
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setCurrentTab('details');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 selection:bg-[#d4af37]/20 relative z-10 pb-24 px-4 py-6 md:px-12">
      
      {/* Decorative luxury mesh background spot lights */}
      <div className="glow-spot-cyan" />
      <div className="glow-spot-magenta" />
      <div className="noise-overlay" />
      <div className="nexus-grid-bg" />

      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-200/80 pb-5 mb-6 gap-4 relative z-20">
        
        {/* Brand logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }}>
          <div className="w-10 h-10 rounded-xl bg-white border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] text-xl shadow-sm">
            💎
          </div>
          <div>
            <h1 className="font-orbitron font-black text-lg tracking-widest text-slate-900 uppercase flex items-center gap-2">
              NEXUS <span className="text-[#d4af37] font-bold text-xs bg-[#d4af37]/15 px-2 py-0.5 rounded border border-[#d4af37]/30">INFINITY</span>
            </h1>
            <span className="text-[8px] font-mono text-slate-400 tracking-widest uppercase">Luxury E-Commerce Portal</span>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-6 font-orbitron text-xs font-black tracking-widest text-slate-500">
          <button 
            onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }} 
            className={`cursor-pointer uppercase transition-colors pb-1 ${
              currentTab === 'home' ? 'text-slate-950 border-b-2 border-[#d4af37]' : 'hover:text-slate-900'
            }`}
          >
            {t.shopHub}
          </button>
          <button 
            onClick={() => { setCurrentTab('orders'); setSelectedProduct(null); }} 
            className={`cursor-pointer uppercase transition-colors pb-1 ${
              currentTab === 'orders' ? 'text-slate-950 border-b-2 border-[#d4af37]' : 'hover:text-slate-900'
            }`}
          >
            {t.trackCargo}
          </button>
          <button 
            onClick={() => { setCurrentTab('wishlist'); setSelectedProduct(null); }} 
            className={`cursor-pointer uppercase transition-colors pb-1 ${
              currentTab === 'wishlist' ? 'text-slate-950 border-b-2 border-[#d4af37]' : 'hover:text-slate-900'
            }`}
          >
            {t.wishlist} ({wishlistCount})
          </button>
          <button 
            onClick={() => { setCurrentTab('compare'); setSelectedProduct(null); }} 
            className={`cursor-pointer uppercase transition-colors pb-1 ${
              currentTab === 'compare' ? 'text-slate-950 border-b-2 border-[#d4af37]' : 'hover:text-slate-900'
            }`}
          >
            {t.compare} ({compareItems.length})
          </button>
          <button 
            onClick={() => { setCurrentTab('profile'); setSelectedProduct(null); }} 
            className={`cursor-pointer uppercase transition-colors pb-1 ${
              currentTab === 'profile' ? 'text-slate-950 border-b-2 border-[#d4af37]' : 'hover:text-slate-900'
            }`}
          >
            {t.profile}
          </button>
          <button 
            onClick={() => { setCurrentTab('admin'); setSelectedProduct(null); }} 
            className={`cursor-pointer uppercase transition-colors pb-1 ${
              currentTab === 'admin' ? 'text-slate-950 border-b-2 border-[#d4af37]' : 'hover:text-slate-900'
            }`}
          >
            {t.adminPortal}
          </button>
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-3">
          
          {/* Language selector dropdown */}
          <div className="relative group/lang">
            <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 cursor-pointer shadow-sm text-[10px] font-orbitron font-black tracking-widest active:scale-95 transition-all">
              {language}
            </button>
            <div className="absolute right-0 top-11 w-32 bg-white border border-slate-200 rounded-xl p-2 shadow-lg hidden group-hover/lang:block z-50 text-[10px] font-orbitron font-bold text-slate-600 space-y-1">
              {(['EN', 'JP', 'DE', 'ES'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-950 cursor-pointer flex items-center justify-between ${
                    language === lang ? 'text-[#d4af37] bg-amber-50/40' : ''
                  }`}
                >
                  <span>{lang === 'EN' ? 'ENGLISH' : lang === 'JP' ? '日本語' : lang === 'DE' ? 'DEUTSCH' : 'ESPAÑOL'}</span>
                  {language === lang && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications feed */}
          <div className="relative group">
            <button 
              onClick={markNotificationsRead}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 cursor-pointer shadow-sm relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-nexus-magenta animate-ping" />
              )}
            </button>
            {/* Quick notifications list dropdown */}
            <div className="absolute right-0 top-11 w-72 bg-white border border-slate-200 rounded-2xl p-4 shadow-lg hidden group-hover:block z-50 text-xs">
              <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 mb-2 flex items-center justify-between">
                <span>SYSTEM LOGS</span>
                <span className="text-[9px] text-[#d4af37]">SECURE FEED</span>
              </h4>
              <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className={`p-2 rounded-lg border ${n.read ? 'bg-slate-50 border-transparent text-slate-500' : 'bg-amber-50/40 border-amber-100 text-slate-700 font-medium'}`}>
                    <div className="flex justify-between items-baseline font-bold text-[10px]">
                      <span>{n.title}</span>
                      <span className="text-[8px] text-slate-400 font-mono">{n.date}</span>
                    </div>
                    <p className="text-[10px] mt-0.5 leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart triggers */}
          <div 
            onClick={() => setIsCartOpen(true)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 cursor-pointer shadow-sm relative active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#d4af37] text-white flex items-center justify-center font-mono font-bold text-[10px] shadow-sm">
                {cartCount}
              </span>
            )}
          </div>

          {/* Profile Quick Member info */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm hidden sm:flex text-xs">
            <span className="text-sm">{userAvatar}</span>
            <div>
              <span className="font-bold text-slate-800 block leading-none">{userName}</span>
              <span className="text-[8px] font-mono text-[#d4af37] font-bold tracking-wider uppercase mt-1 block">{membershipLevel}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-transparent flex items-center justify-center cursor-pointer transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </header>

      {/* SEARCH BAR HUD */}
      {currentTab === 'home' && (
        <div className="max-w-3xl mx-auto mb-8 relative z-25">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchSuggestions(true);
              }}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-2xl px-5 py-4 pl-12 pr-28 text-sm shadow-sm transition-all placeholder:text-slate-400 text-slate-800"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4" />
            
            {/* Quick image & mic search utilities inside input */}
            <div className="absolute right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleVoiceSearchToggle}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  isVoiceSearching ? 'bg-rose-100 text-rose-600 animate-pulse' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                }`}
              >
                <Mic className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowImageSearchModal(true)}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <Image className="w-4.5 h-4.5" />
              </button>
            </div>
          </form>

          {/* Autocomplete dropdown suggestions & Search History */}
          {showSearchSuggestions && (
            <div className="absolute top-14 left-0 right-0 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl z-50 text-xs text-slate-600 space-y-4">
              
              {/* History */}
              {searchHistory.length > 0 && !searchQuery && (
                <div className="space-y-1.5">
                  <h5 className="font-orbitron font-black text-[9px] tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    SEARCH HISTORY
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((h, i) => (
                      <div
                        key={i}
                        onClick={() => handleSuggestionClick(h)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-150 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center gap-1 font-medium uppercase text-[10px]"
                      >
                        <span>{h}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchHistory(searchHistory.filter(x => x !== h));
                          }}
                          className="text-slate-400 hover:text-rose-500 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-orbitron font-black text-[9px] tracking-widest text-slate-400 uppercase">AUTOSUGGESTIONS FEED</h5>
                  <div className="divide-y divide-slate-100">
                    {searchSuggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSuggestionClick(item.name)}
                        className="py-2.5 hover:bg-slate-50 px-2 rounded-lg cursor-pointer flex items-center justify-between font-medium"
                      >
                        <span className="uppercase text-[11px] text-slate-800">{item.name}</span>
                        <span className="text-[9px] font-mono text-[#d4af37] bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">{item.brand}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                <span>VERIFIED SECURE SEARCH CHANNEL</span>
                <button 
                  onClick={() => setShowSearchSuggestions(false)}
                  className="font-bold text-slate-600 hover:text-slate-900"
                >
                  DISMISS
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* FLOATING AI ASSISTANT */}
      <AiAssistant />

      {/* DYNAMIC VIEW SHEETS */}
      <AnimatePresence mode="wait">
        
        {/* Tab 1: Catalog Shopping Hub */}
        {currentTab === 'home' && (
          <motion.div
            key="home-deck"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Promo Carousel Banners */}
            <PromoCarousel />

            {/* Sub headers Bento deck: Flash deals countdown + recommendations widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-orbitron">
              
              {/* Flash deals countdown card */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/70 flex flex-col justify-between h-40">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 tracking-widest font-black uppercase">TODAY'S DEALS COUNTDOWN</span>
                  <span className="px-2 py-0.5 rounded text-[8px] bg-rose-500 text-white font-bold animate-pulse">FLASH SALE</span>
                </div>
                <div>
                  <div className="text-3xl font-mono font-bold tracking-widest text-[#d4af37]">{countdown}</div>
                  <span className="text-[8px] text-slate-400 block mt-1 uppercase font-mono">Until next catalog rotation refresh</span>
                </div>
                <div className="text-[9px] font-mono text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100 truncate">
                  ⚡ 30% FESTIVAL SAVINGS ACTIVE: USE FESTIVAL-30
                </div>
              </div>

              {/* Wallet Core asset ledger card */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/70 flex flex-col justify-between h-40">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 tracking-widest font-black uppercase">WALLET LEDGER VAULT</span>
                  <Wallet className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[8px] text-slate-400 block mt-1 uppercase font-mono">Active coins value balance</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                  <span>SECURE GATE</span>
                  <span className="text-emerald-500 font-bold uppercase">100% ONLINE</span>
                </div>
              </div>

              {/* Loyalty credits points card */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/70 flex flex-col justify-between h-40">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 tracking-widest font-black uppercase">LOYALTY CREDITS</span>
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {loyaltyPoints.toLocaleString()} <span className="text-xs text-[#d4af37] font-bold">PTS</span>
                  </div>
                  <span className="text-[8px] text-slate-400 block mt-1 uppercase font-mono">VIP reward point tokens</span>
                </div>
                <div className="text-[9px] font-mono text-[#d4af37] uppercase bg-[#d4af37]/15 p-2 rounded-lg border border-[#d4af37]/30 text-center">
                  PLATINUM SHIELD MEMBER
                </div>
              </div>

            </div>

            {/* Curated scroll lanes */}
            
            {/* Recently Viewed / Continue Shopping */}
            {recentlyViewed.length > 0 && (
              <section className="space-y-4">
                <span className="text-[10px] font-orbitron font-black tracking-widest text-[#d4af37] block uppercase">
                  Continue Shopping
                </span>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin select-none">
                  {recentlyViewed.map((prod) => (
                    <div 
                      key={prod.id}
                      onClick={() => { setSelectedProduct(prod); setCurrentTab('details'); }}
                      className="w-48 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#d4af37]/45 cursor-pointer shrink-0 transition-all duration-300 group shadow-sm"
                    >
                      <div className="w-full h-28 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-0.5">
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="mt-3 text-[10px]">
                        <span className="text-slate-400 font-mono block uppercase">{prod.brand}</span>
                        <h4 className="font-bold text-slate-800 uppercase truncate mt-0.5">{prod.name}</h4>
                        <span className="text-[#d4af37] font-mono font-bold block mt-1">${prod.discountPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Lightning Deals (Deep Savings) */}
            <section className="space-y-4">
              <span className="text-[10px] font-orbitron font-black tracking-widest text-slate-900 block uppercase">
                {t.lightningDeals}
              </span>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin select-none">
                {flashSaleProducts.map((prod) => (
                  <div 
                    key={prod.id}
                    onClick={() => { setSelectedProduct(prod); setCurrentTab('details'); }}
                    className="w-48 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#d4af37]/45 cursor-pointer shrink-0 transition-all duration-300 group shadow-sm"
                  >
                    <div className="w-full h-28 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-0.5 relative">
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[7px] font-black bg-rose-500 text-white">
                        -{prod.discountPercent}%
                      </div>
                    </div>
                    <div className="mt-3 text-[10px]">
                      <span className="text-slate-400 font-mono block uppercase">{prod.brand}</span>
                      <h4 className="font-bold text-slate-800 uppercase truncate mt-0.5">{prod.name}</h4>
                      <div className="flex justify-between items-baseline mt-1 font-mono">
                        <span className="text-[#d4af37] font-bold">${prod.discountPrice}</span>
                        <span className="text-[8px] text-slate-400 line-through">${prod.originalPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Best Sellers (Highest Rated) */}
            <section className="space-y-4">
              <span className="text-[10px] font-orbitron font-black tracking-widest text-slate-900 block uppercase">
                {t.bestSellers}
              </span>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin select-none">
                {bestSellersProducts.map((prod) => (
                  <div 
                    key={prod.id}
                    onClick={() => { setSelectedProduct(prod); setCurrentTab('details'); }}
                    className="w-48 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#d4af37]/45 cursor-pointer shrink-0 transition-all duration-300 group shadow-sm"
                  >
                    <div className="w-full h-28 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-0.5">
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="mt-3 text-[10px]">
                      <div className="flex justify-between items-center text-[8px] text-slate-400 uppercase font-bold">
                        <span>{prod.brand}</span>
                        <span className="text-[#d4af37]">★ {prod.rating}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 uppercase truncate mt-0.5">{prod.name}</h4>
                      <span className="text-[#d4af37] font-mono font-bold block mt-1">${prod.discountPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending Products (Popularity Index) */}
            <section className="space-y-4">
              <span className="text-[10px] font-orbitron font-black tracking-widest text-slate-900 block uppercase">
                {t.trending}
              </span>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin select-none">
                {trendingProducts.map((prod) => (
                  <div 
                    key={prod.id}
                    onClick={() => { setSelectedProduct(prod); setCurrentTab('details'); }}
                    className="w-48 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#d4af37]/45 cursor-pointer shrink-0 transition-all duration-300 group shadow-sm"
                  >
                    <div className="w-full h-28 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-0.5">
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="mt-3 text-[10px]">
                      <div className="flex justify-between items-center text-[8px] text-slate-400 uppercase font-bold">
                        <span>{prod.brand}</span>
                        <span className="text-[#d4af37]">★ {prod.rating}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 uppercase truncate mt-0.5">{prod.name}</h4>
                      <div className="flex justify-between items-baseline mt-1 font-mono">
                        <span className="text-[#d4af37] font-bold">${prod.discountPrice}</span>
                        <span className="text-[8px] text-slate-400 font-mono">({prod.reviewsCount} logs)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Subcategory selectors */}
            <section className="space-y-4">
              <span className="text-[10px] font-orbitron font-black tracking-widest text-slate-400 block uppercase">
                {t.selectCategory}
              </span>
              <div className="flex gap-2.5 overflow-x-auto pb-2.5 scrollbar-thin select-none">
                {['Electronics', 'Fashion', 'Gaming', 'Students', 'Home', 'Beauty', 'Sports', 'Books', 'Automotive'].map((cat) => {
                  const isSelected = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); resetFilters(); }}
                      className={`px-5 py-3 text-[10px] font-orbitron font-black tracking-widest rounded-2xl border cursor-pointer shrink-0 transition-all duration-300 ${
                        isSelected 
                          ? 'bg-slate-900 text-white border-transparent shadow-md hover:bg-slate-800'
                          : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-350'
                      }`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Integrated Browse filters */}
            <BrowseFilters
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedPriceMax={selectedPriceMax}
              setSelectedPriceMax={setSelectedPriceMax}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedAvailability={selectedAvailability}
              setSelectedAvailability={setSelectedAvailability}
              selectedDiscount={selectedDiscount}
              setSelectedDiscount={setSelectedDiscount}
              selectedMaterial={selectedMaterial}
              setSelectedMaterial={setSelectedMaterial}
              sortBy={sortBy}
              setSortBy={setSortBy}
              availableBrands={availableBrands}
              resetFilters={resetFilters}
            />

            {/* Catalog Grid results */}
            <section className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-orbitron font-black tracking-wider text-slate-900 uppercase">
                    {t.catalogListings}
                  </h3>
                  <span className="text-[9px] text-slate-400 font-mono block mt-1 uppercase">
                    Displaying {filteredProducts.length} verified products matches in {activeCategory}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-slate-400 uppercase">Hub link clear</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-16 text-center border border-dashed border-slate-300 rounded-3xl bg-white/70">
                  <span className="text-xs text-slate-400 font-orbitron font-black uppercase tracking-widest block">No catalog matches found</span>
                  <span className="text-[9px] text-slate-400 font-mono uppercase block mt-1">try adjusting filters criteria range</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.slice(0, visibleCount).map((prod) => {
                    const liked = wishlistItems.some(p => p.id === prod.id);
                    const compared = compareItems.some(p => p.id === prod.id);

                    return (
                      <motion.div
                        key={prod.id}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="glass-panel p-4 rounded-2xl border border-slate-200 flex flex-col justify-between bg-white relative group"
                      >
                        {/* Top info row */}
                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 relative z-10">
                          <span>{prod.id}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleCompare(prod)}
                              className={`px-1.5 py-0.5 rounded text-[8px] border transition-colors ${
                                compared ? 'bg-slate-900 border-transparent text-white' : 'border-slate-200 hover:text-slate-700'
                              }`}
                            >
                              COMP
                            </button>
                            <button
                              onClick={() => toggleWishlist(prod)}
                              className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                liked ? 'text-rose-500 bg-rose-50 border-rose-100' : 'border-slate-200 hover:text-slate-700'
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${liked ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Thumbnail */}
                        <div 
                          onClick={() => handleSelectProduct(prod)}
                          className="w-full h-44 my-3 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center cursor-pointer relative"
                        >
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-0.5 rounded text-[7px] font-bold">
                            {prod.discountPercent}% OFF
                          </div>
                        </div>

                        {/* Price tags */}
                        <div className="flex justify-between items-center font-mono relative z-10 px-0.5">
                          <div>
                            <span className="text-[#d4af37] font-bold text-xs">${prod.discountPrice}</span>
                            <span className="text-[9px] text-slate-400 line-through ml-2">${prod.originalPrice}</span>
                          </div>
                          <span className="text-[8px] text-slate-400 uppercase font-bold">{prod.stockStatus}</span>
                        </div>

                        {/* Title details */}
                        <div className="border-t border-slate-100 pt-3 mt-3 flex flex-col gap-1.5 relative z-10 px-0.5">
                          <div>
                            <span className="text-[8px] text-slate-400 block font-mono uppercase">{prod.brand}</span>
                            <h4 
                              onClick={() => handleSelectProduct(prod)}
                              className="font-bold text-slate-900 text-xs hover:text-[#d4af37] cursor-pointer transition-colors truncate uppercase"
                            >
                              {prod.name}
                            </h4>
                          </div>

                          <div className="flex justify-between items-center text-[9px] pt-1">
                            <span className="text-[#d4af37] font-bold">★ {prod.rating.toFixed(1)} <span className="text-slate-400 font-normal">({prod.reviewsCount})</span></span>
                            <span className="text-[8px] text-slate-400 font-mono uppercase">{prod.deliveryTime}</span>
                          </div>
                        </div>

                        {/* Actions drawer */}
                        <div className="mt-3.5 flex gap-2 pt-2 border-t border-slate-50">
                          <button
                            onClick={() => handleSelectProduct(prod)}
                            className="w-9 h-9 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-800 cursor-pointer shrink-0 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              addToCart({
                                id: prod.id,
                                name: prod.name,
                                brand: prod.brand,
                                price: prod.discountPrice,
                                imageUrl: prod.imageUrl,
                                selectedColor: prod.colors[0],
                                selectedSize: prod.sizes[0]
                              });
                              triggerCartFly(e, prod.name);
                            }}
                            className="flex-1 py-2 bg-slate-900 hover:bg-[#d4af37] text-white text-[9px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
                          >
                            {t.addToCart}
                          </button>
                          <button
                            onClick={() => handleBuyNow(prod)}
                            className="px-3 py-2 bg-[#d4af37]/15 hover:bg-[#d4af37] text-[#d4af37] hover:text-white border border-[#d4af37]/30 hover:border-transparent text-[9px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-300 cursor-pointer"
                          >
                            {t.buy}
                          </button>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Infinite Scroll Skeleton Loaders */}
              {isLoadingMore && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 animate-pulse select-none">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white/70 space-y-4">
                      <div className="w-full h-44 bg-slate-100 rounded-xl" />
                      <div className="h-4 bg-slate-100 rounded w-2/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                      <div className="h-8 bg-slate-100 rounded-xl w-full" />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        )}

        {/* Tab 2: Logistics orders list */}
        {currentTab === 'orders' && (
          <motion.div
            key="orders-deck"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 max-w-4xl mx-auto font-sans text-slate-700"
          >
            <div className="border-b border-slate-200 pb-3 mb-6">
              <h2 className="text-xl font-orbitron font-black tracking-widest text-slate-900 uppercase">
                Active Cargo Logistics Tracker
              </h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-1 uppercase">
                Monitor current cargo node status and complete cancellation or return forms.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="p-16 text-center border border-dashed border-slate-300 rounded-3xl bg-white/70">
                <span className="text-xs text-slate-400 font-orbitron font-black uppercase tracking-widest block">No active shippings queued</span>
              </div>
            ) : (
              orders.map((ord) => {
                const statusSteps = ['ordered', 'packed', 'shipped', 'delivered'] as const;
                const activeIndex = statusSteps.indexOf(ord.status as any);
                const isCancelled = ord.status === 'cancelled';
                const isReturned = ord.status === 'returned';

                return (
                  <div key={ord.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between gap-6 relative shadow-sm">
                    {/* Item Details */}
                    <div className="flex gap-4 items-center md:w-[35%] shrink-0">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                        <img src={ord.imageUrl} alt={ord.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div className="min-w-0 text-xs">
                        <span className="text-[8px] text-slate-400 font-mono block uppercase">{ord.brand}</span>
                        <h4 className="font-bold text-slate-900 uppercase truncate">{ord.name}</h4>
                        <span className="text-[9px] font-mono text-[#d4af37] block mt-0.5">${ord.price.toLocaleString()} NEX x {ord.quantity}</span>
                        <span className="text-[8px] text-slate-400 font-mono mt-1 block">Docked date: {ord.date}</span>
                      </div>
                    </div>

                    {/* Progress tracking track bar */}
                    {!isCancelled && !isReturned ? (
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono font-bold uppercase mb-2">
                          <span>Ordered</span>
                          <span>Packed</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                        
                        <div className="h-1 bg-slate-100 rounded-full w-full relative flex justify-between items-center">
                          <div 
                            className="absolute h-full bg-[#d4af37] left-0 top-0 transition-all duration-500 shadow-sm"
                            style={{ width: `${(activeIndex / 3) * 100}%` }}
                          />
                          {statusSteps.map((step, idx) => {
                            const isDone = idx <= activeIndex;
                            return (
                              <div 
                                key={step}
                                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10 flex items-center justify-center bg-white ${
                                  isDone 
                                    ? 'border-[#d4af37] text-[#d4af37] scale-110 shadow-sm' 
                                    : 'border-slate-200 text-slate-400'
                                }`}
                              >
                                {isDone && <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />}
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3.5 flex justify-between items-center text-[9px] font-mono text-slate-400">
                          <span>NODE ID: <strong className="text-slate-800">{ord.id}</strong></span>
                          
                          {/* Cancel or return actions */}
                          {ord.status !== 'delivered' ? (
                            <button
                              onClick={() => {
                                if (confirm('Cancel order payload and refund value to wallet?')) {
                                  cancelOrder(ord.id);
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                            >
                              [CANCEL CARGO]
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm('Return delivered item cargo and refund value?')) {
                                  returnOrder(ord.id);
                                }
                              }}
                              className="text-amber-500 hover:text-amber-700 font-bold cursor-pointer"
                            >
                              [RETURN ITEM]
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Cancelled/Returned alerts
                      <div className="flex-1 flex flex-col justify-center text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className={`text-[10px] font-orbitron font-black tracking-widest uppercase ${isCancelled ? 'text-rose-500' : 'text-amber-500'}`}>
                          {isCancelled ? 'ORDER CANCELLED & REFUNDED' : 'RETURN PROCESS INITIATED'}
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono uppercase mt-1">Transaction ID: {ord.id}</span>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Tab 3: Wishlist View */}
        {currentTab === 'wishlist' && (
          <motion.div
            key="wishlist-deck"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 max-w-4xl mx-auto font-sans text-slate-700"
          >
            <div className="border-b border-slate-200 pb-3 mb-6 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-orbitron font-black tracking-widest text-slate-900 uppercase">
                  Saved Wishlist
                </h2>
                <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-1 uppercase">
                  Items bookmarked for later purchase. Share with friend networks.
                </p>
              </div>
              
              {wishlistItems.length > 0 && (
                <button
                  onClick={handleShareWishlist}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors shadow-sm"
                >
                  <Clipboard className="w-4 h-4 text-slate-400" />
                  SHARE WISHLIST LINK
                </button>
              )}
            </div>

            {wishlistItems.length === 0 ? (
              <div className="p-16 text-center border border-dashed border-slate-300 rounded-3xl bg-white/70">
                <span className="text-xs text-slate-400 font-orbitron font-black uppercase tracking-widest block">Wishlist Empty</span>
                <span className="text-[9px] text-slate-400 font-mono uppercase block mt-1">bookmark products from hub to track here</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlistItems.map((prod) => (
                  <div key={prod.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 relative shadow-sm">
                    <div 
                      onClick={() => handleSelectProduct(prod)}
                      className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50 flex items-center justify-center p-0.5 cursor-pointer"
                    >
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="text-[8px] text-slate-400 font-mono block uppercase">{prod.brand}</span>
                      <h4 
                        onClick={() => handleSelectProduct(prod)}
                        className="font-bold text-slate-900 uppercase truncate hover:text-[#d4af37] cursor-pointer"
                      >
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[#d4af37] font-mono font-bold text-xs">${prod.discountPrice}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono ${prod.stockStatus === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                          {prod.stockStatus.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex gap-3 mt-3.5 text-[9px] font-mono font-bold">
                        <button
                          onClick={() => moveToCart(prod)}
                          className="text-slate-800 hover:text-[#d4af37] cursor-pointer uppercase border border-slate-200 px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          MOVE TO CART
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            setShowCheckout(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-700 cursor-pointer uppercase border border-slate-200 px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          BUY NOW
                        </button>
                        <button
                          onClick={() => toggleWishlist(prod)}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer uppercase border border-slate-200 px-2 py-1 rounded bg-rose-50/20 hover:bg-rose-50 transition-colors"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 4: Compare deck */}
        {currentTab === 'compare' && (
          <motion.div
            key="compare-deck"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <CompareMatrix 
              onClose={() => setCurrentTab('home')} 
              onCartOpen={() => setIsCartOpen(true)} 
            />
          </motion.div>
        )}

        {/* Tab 5: User settings profile */}
        {currentTab === 'profile' && (
          <motion.div
            key="profile-deck"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 max-w-4xl mx-auto font-sans text-slate-700 pb-12"
          >
            <div className="border-b border-slate-200 pb-3 mb-6">
              <h2 className="text-xl font-orbitron font-black tracking-widest text-slate-900 uppercase">
                User Profile Node Settings
              </h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-1 uppercase">
                Add shipping address keys, recharge secure wallet balances, and explore coupons index.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Profile Card & Wallet Top Up */}
              <div className="md:col-span-4 space-y-6">
                
                {/* Profile Identity */}
                <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/70 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-3xl mx-auto animate-pulse">
                    {userAvatar}
                  </div>
                  <div>
                    <h3 className="font-orbitron font-black text-sm text-slate-900 uppercase">{userName}</h3>
                    <span className="text-[9px] font-mono text-slate-400 block uppercase mt-0.5">{userEmail}</span>
                    <span className="inline-block mt-2 px-3 py-1 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/35 text-[9px] font-bold text-[#d4af37] font-orbitron uppercase">
                      {membershipLevel}
                    </span>
                  </div>
                </div>

                {/* Wallet Balance Top Up */}
                <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/70 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-orbitron font-black text-slate-400 uppercase">Wallet Vault</span>
                    <Wallet className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono text-slate-900">
                      ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[8px] text-slate-400 block uppercase font-mono mt-0.5">VAULT LEDGER CLEAR</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="100"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(Number(e.target.value))}
                        className="w-1/2 bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-3 py-2 text-xs font-mono text-slate-800"
                      />
                      <button
                        onClick={() => topUpWallet(topUpAmount)}
                        className="flex-1 py-2 bg-slate-900 hover:bg-[#d4af37] text-white text-[9px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        RECHARGE
                      </button>
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-400 font-mono uppercase">
                      <span>Min recharge: $100</span>
                      <span className="text-emerald-500 font-bold">100% SECURE</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Addresses, Credit Cards & Coupons lists */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Saved addresses */}
                <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/70 space-y-4 shadow-sm">
                  <h4 className="font-orbitron font-black text-[10px] tracking-wider text-slate-900 uppercase">Saved shipping locations</h4>
                  
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    {addresses.map((addr, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                          <span className="truncate">{addr}</span>
                        </div>
                        <button
                          onClick={() => removeAddress(addr)}
                          className="text-rose-500 hover:text-rose-700 font-bold ml-2 shrink-0 cursor-pointer"
                        >
                          [DELETE]
                        </button>
                      </div>
                    ))}
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newAddress.trim()) {
                        addAddress(newAddress);
                        setNewAddress('');
                      }
                    }} 
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      required
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="ENTER NEW SHIPPING LOCATION..."
                      className="flex-1 bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-4 py-2 text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 text-white hover:bg-[#d4af37] text-[10px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      ADD
                    </button>
                  </form>
                </div>

                {/* Saved Credit Cards list */}
                <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/70 space-y-4 shadow-sm">
                  <h4 className="font-orbitron font-black text-[10px] tracking-wider text-slate-900 uppercase">SAVED CREDIT DECK CARDS</h4>
                  
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    {savedCards.map((card) => (
                      <div key={card.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-slate-400" />
                          <span className="font-bold uppercase text-[10px] text-slate-500 w-12">{card.cardType}</span>
                          <span className="text-slate-800">{card.cardNumber}</span>
                        </div>
                        <button
                          onClick={() => removeSavedCard(card.id)}
                          className="text-rose-500 hover:text-rose-700 font-bold ml-2 shrink-0 cursor-pointer"
                        >
                          [DELETE]
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available coupons */}
                <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white/70 space-y-4 shadow-sm">
                  <h4 className="font-orbitron font-black text-[10px] tracking-wider text-slate-900 uppercase">Active promo coupons</h4>
                  <div className="flex flex-wrap gap-2">
                    {coupons.map((code) => (
                      <div 
                        key={code} 
                        className="px-3 py-1.5 border border-dashed border-[#d4af37]/60 bg-[#d4af37]/5 text-[#d4af37] rounded-xl text-xs font-mono font-bold cursor-pointer hover:bg-[#d4af37]/15 transition-colors"
                        onClick={() => {
                          alert(`Coupon code ${code} is active. Apply it inside the Checkout ledger!`);
                        }}
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* Tab 6: Selected Product Details */}
        {currentTab === 'details' && selectedProduct && (
          <motion.div
            key="details-deck"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <ProductDetails
              product={selectedProduct}
              onBack={() => {
                setSelectedProduct(null);
                setCurrentTab('home');
              }}
              onCartOpen={() => setIsCartOpen(true)}
            />
          </motion.div>
        )}

        {/* Tab 7: Admin Dashboard Control Panel */}
        {currentTab === 'admin' && (
          <motion.div
            key="admin-deck"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <AdminDashboard />
          </motion.div>
        )}

      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] z-45 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 p-2.5 flex justify-around items-center text-slate-400 shadow-lg relative">
        <button onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }} className={`flex flex-col items-center gap-1 text-[8px] font-bold cursor-pointer ${currentTab === 'home' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700'}`}>
          <span className="text-sm">🏠</span>
          <span>SHOP</span>
        </button>
        <button onClick={() => { setCurrentTab('orders'); setSelectedProduct(null); }} className={`flex flex-col items-center gap-1 text-[8px] font-bold cursor-pointer ${currentTab === 'orders' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700'}`}>
          <span className="text-sm">📂</span>
          <span>CARGO</span>
        </button>
        <button onClick={() => { setCurrentTab('admin'); setSelectedProduct(null); }} className={`flex flex-col items-center gap-1 text-[8px] font-bold cursor-pointer ${currentTab === 'admin' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700'}`}>
          <span className="text-sm">🛠️</span>
          <span>ADMIN</span>
        </button>
        <button onClick={() => { setCurrentTab('wishlist'); setSelectedProduct(null); }} className={`flex flex-col items-center gap-1 text-[8px] font-bold cursor-pointer ${currentTab === 'wishlist' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700'}`}>
          <span className="text-sm">👤</span>
          <span>SAVED</span>
        </button>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-[8px] font-bold hover:text-slate-700 cursor-pointer relative">
          <span className="text-sm">🛒</span>
          <span>CART</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#d4af37] text-white w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono text-[8px] font-bold shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Persistent global widgets */}
      <ThemeSwitcher />

      {/* Cart Drawer sidebar */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckoutSuccess={() => setShowCheckout(true)} 
      />

      {/* Checkout Wizard Dialog */}
      <AnimatePresence>
        {showCheckout && (
          <CheckoutFlow 
            onClose={() => setShowCheckout(false)} 
            onSuccess={() => setShowCelebration(true)} 
          />
        )}
      </AnimatePresence>

      {/* Success Celebration overlay screen */}
      <CelebrationScreen 
        isOpen={showCelebration} 
        onClose={() => setShowCelebration(false)} 
      />

      {/* Image Search Mock Modal */}
      <AnimatePresence>
        {showImageSearchModal && (
          <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[1000] bg-black/60 backdrop-blur-sm p-4 font-sans select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 bg-white rounded-3xl border border-slate-200 text-center flex flex-col gap-4 relative shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs tracking-widest text-[#d4af37] font-orbitron font-black uppercase">Cognitive Image Recognition</span>
                <button 
                  onClick={() => setShowImageSearchModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer text-sm"
                >
                  [X]
                </button>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed">
                Select an image below to simulate cognitive visual recognition parsing.
              </p>

              <div className="grid grid-cols-3 gap-3.5 my-2">
                {[
                  { tag: 'iPhone 15', name: 'iPhone 15 Pro Max', img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=150' },
                  { tag: 'Smart Watch', name: 'Active Smart Watch Pro', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=150' },
                  { tag: 'Nike Shoes', name: 'Alpha Neon Runners', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=150' },
                  { tag: 'Headphones', name: 'AudioScape Virtua-8', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=150' },
                  { tag: 'Strike Drone', name: 'Strike Drone Apex-4 Pro', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=150' },
                  { tag: 'Cinema Monitor', name: 'Ultra Wide Cinema Monitor', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=150' }
                ].map((item) => (
                  <div
                    key={item.tag}
                    onClick={() => {
                      setSearchQuery(item.tag);
                      setShowImageSearchModal(false);
                      setShowSearchSuggestions(false);
                    }}
                    className="p-1 border border-slate-200 hover:border-[#d4af37] bg-slate-50 rounded-xl overflow-hidden cursor-pointer transition-colors"
                  >
                    <div className="w-full h-20 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] font-mono text-slate-400 block mt-1 truncate uppercase">{item.tag}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowImageSearchModal(false)}
                className="py-3 bg-slate-900 text-white font-orbitron font-black tracking-widest text-[9px] rounded-xl cursor-pointer"
              >
                DISMISS VISUAL SCANNER
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Flying particles container */}
      <AnimatePresence>
        {flyingParticles.map((part) => (
          <motion.div
            key={part.id}
            initial={{ 
              x: part.startX, 
              y: part.startY, 
              scale: 1, 
              opacity: 1,
              boxShadow: '0 0 12px rgba(212,175,55,0.8)',
              position: 'fixed',
              zIndex: 9999
            }}
            animate={{ 
              x: window.innerWidth - 80, 
              y: 20, 
              scale: 0.1, 
              opacity: 0.7 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-6 h-6 rounded-full bg-[#d4af37] border border-white pointer-events-none"
          />
        ))}
      </AnimatePresence>

      {/* Telemetry Success Toasts */}
      <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-slate-950/95 text-white border border-[#d4af37]/45 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-start gap-3 pointer-events-auto font-orbitron w-72"
            >
              <div className="w-5 h-5 rounded-md bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                ✓
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black tracking-widest text-[#d4af37] block uppercase">{t.text}</span>
                <span className="text-[8px] text-slate-400 block mt-1 uppercase leading-normal font-sans font-medium">{t.sub}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FOOTER HUDS */}
      <footer className="mt-16 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center text-[9px] text-slate-400 tracking-widest gap-4 font-mono">
        <span>SECURITY ENVELOPE: SECURE PORTAL CHANNEL</span>
        <span>© NEXUS INFINITY TELEMETRY INC. ALL RIGHTS RESERVED.</span>
      </footer>

    </div>
  );
}
