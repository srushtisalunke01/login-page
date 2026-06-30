import { create } from 'zustand';
import { Product, PRODUCTS } from '../components/products/productsData';

export type NexusTheme = 
  | 'luxury-white-gold'
  | 'midnight-luxury'
  | 'ocean-sapphire'
  | 'sakura-premium'
  | 'royal-purple'
  | 'emerald-elite'
  | 'sunset-elite'
  | 'white-crystal';

export type NexusLanguage = 'EN' | 'JP' | 'DE' | 'ES';

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  status: 'ordered' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  date: string;
  imageUrl?: string;
  selectedColor?: string;
  selectedSize?: string;
}

export interface SavedCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: 'visa' | 'mastercard' | 'amex';
}

export interface SystemNotification {
  id: string;
  title: string;
  text: string;
  date: string;
  read: boolean;
}

interface NexusState {
  theme: NexusTheme;
  language: NexusLanguage;
  soundEnabled: boolean;
  introComplete: boolean;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  activeCategory: string;
  
  // Dynamic editable products list
  products: Product[];

  // Navigation Tabs state
  currentTab: 'home' | 'orders' | 'profile' | 'details' | 'compare' | 'wishlist' | 'admin';
  selectedProduct: Product | null;
  
  // Cart & checkout arrays
  cartCount: number;
  cartItems: CartItem[];
  appliedCoupon: string | null;
  giftWrap: boolean;
  
  // Wishlist state
  wishlistCount: number;
  wishlistItems: Product[];
  
  // Compare state
  compareItems: Product[];

  // User Profile nodes
  userName: string;
  userEmail: string;
  userAvatar: string;
  membershipLevel: string;
  loyaltyPoints: number;
  walletBalance: number;
  addresses: string[];
  savedCards: SavedCard[];
  coupons: string[];

  // Logistics order tracker
  orders: OrderItem[];
  
  // System Notifications
  notifications: SystemNotification[];

  // Recently Viewed tracker
  recentlyViewed: Product[];
  
  setTheme: (theme: NexusTheme) => void;
  setLanguage: (lang: NexusLanguage) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setIntroComplete: (complete: boolean) => void;
  setLoggingIn: (loggingIn: boolean) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setActiveCategory: (category: string) => void;
  
  // Navigation Setters
  setCurrentTab: (tab: 'home' | 'orders' | 'profile' | 'details' | 'compare' | 'wishlist' | 'admin') => void;
  setSelectedProduct: (prod: Product | null) => void;
  
  // Cart Actions
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  toggleGiftWrap: () => void;
  
  // Wishlist Actions
  toggleWishlist: (product: Product) => void;
  moveToCart: (product: Product) => void;
  
  // Compare Actions
  toggleCompare: (product: Product) => boolean; // returns true if added, false if removed
  clearCompare: () => void;
  
  // Profile & Wallet Actions
  placeOrder: (paymentMethod: string) => void;
  cancelOrder: (orderId: string) => void;
  returnOrder: (orderId: string) => void;
  addAddress: (addr: string) => void;
  removeAddress: (addr: string) => void;
  topUpWallet: (amount: number) => void;
  updateProfile: (name: string, email: string, avatar: string) => void;
  addSavedCard: (card: Omit<SavedCard, 'id'>) => void;
  removeSavedCard: (cardId: string) => void;

  // Notification Actions
  addNotification: (title: string, text: string) => void;
  markNotificationsRead: () => void;

  // Recently Viewed Actions
  addToRecentlyViewed: (prod: Product) => void;

  // Admin Actions
  addProduct: (prod: Product) => void;
  editProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderItem['status']) => void;
  addCouponCode: (code: string) => void;
  removeCouponCode: (code: string) => void;
  
  logout: () => void;
}

const PREMIUM_THEMES: NexusTheme[] = [
  'luxury-white-gold',
  'midnight-luxury',
  'ocean-sapphire',
  'sakura-premium',
  'royal-purple',
  'emerald-elite',
  'sunset-elite',
  'white-crystal'
];

const getInitialTheme = (): NexusTheme => {
  const cached = localStorage.getItem('nexus-theme');
  if (cached && PREMIUM_THEMES.includes(cached as NexusTheme)) {
    return cached as NexusTheme;
  }
  return 'luxury-white-gold';
};

export const useNexusStore = create<NexusState>((set) => ({
  theme: getInitialTheme(),
  language: 'EN',
  soundEnabled: true,
  introComplete: false,
  isLoggingIn: false,
  isLoggedIn: false,
  activeCategory: 'Electronics',
  
  products: PRODUCTS,
  
  currentTab: 'home',
  selectedProduct: null,
  
  cartCount: 0,
  cartItems: [],
  appliedCoupon: null,
  giftWrap: false,
  
  wishlistCount: 0,
  wishlistItems: [],
  
  compareItems: [],

  userName: 'Operator Alex',
  userEmail: 'alex.carter@nexus.infinity',
  userAvatar: '💎',
  membershipLevel: 'VIP Platinum',
  loyaltyPoints: 1250,
  walletBalance: 87420.90,
  
  addresses: [
    'Bay 12, Neon Convergence Point, Neo-Tokyo Grid',
    'Level 8, Alpha Sector, Central Server Hub, DE'
  ],

  savedCards: [
    { id: 'card-1', cardNumber: '•••• •••• •••• 8842', cardHolder: 'ALEX CARTER', expiryDate: '12/28', cardType: 'visa' },
    { id: 'card-2', cardNumber: '•••• •••• •••• 3055', cardHolder: 'ALEX CARTER', expiryDate: '08/29', cardType: 'mastercard' }
  ],

  coupons: ['FESTIVAL-30', 'NEXUS-STUDENT', 'WELCOME-NEXUS', 'GOLD-VIP'],

  orders: [
    {
      id: 'ORD-584902',
      name: 'Strike Drone Apex-4 Pro',
      brand: 'DJI',
      price: 8900,
      quantity: 1,
      status: 'shipped',
      date: 'Jun 28, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=300',
      selectedColor: 'Carbon Gray',
      selectedSize: 'Pro Size'
    },
    {
      id: 'ORD-294012',
      name: 'MacBook MacBooks Apex',
      brand: 'Apple',
      price: 4390,
      quantity: 1,
      status: 'delivered',
      date: 'Jun 25, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300',
      selectedColor: 'Space Gray',
      selectedSize: '16-inch'
    }
  ],

  notifications: [
    { id: 'notif-1', title: 'Telemetry Connected', text: 'Secure neural tunnel created successfully. Welcome back to Nexus Infinity portal.', date: 'Jun 30, 2026', read: false },
    { id: 'notif-2', title: 'Special VIP Offer Calibrated', text: 'Use code GOLD-VIP to claim double loyalty credits on any Luxury collection purchases.', date: 'Jun 29, 2026', read: true }
  ],

  recentlyViewed: [],

  setTheme: (theme) => {
    localStorage.setItem('nexus-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
  setLanguage: (language) => set({ language }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setIntroComplete: (introComplete) => set({ introComplete }),
  setLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),

  setCurrentTab: (currentTab) => set({ currentTab }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),

  addToCart: (item) => set((state) => {
    const existingIndex = state.cartItems.findIndex(
      (i) => i.id === item.id && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize
    );
    let updatedItems: CartItem[];

    if (existingIndex > -1) {
      updatedItems = state.cartItems.map((i, index) => 
        index === existingIndex ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedItems = [...state.cartItems, { ...item, quantity: 1 }];
    }

    const newCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    return { cartItems: updatedItems, cartCount: newCount };
  }),

  updateCartQty: (id, qty) => set((state) => {
    if (qty <= 0) {
      const updated = state.cartItems.filter(i => i.id !== id);
      return { cartItems: updated, cartCount: updated.reduce((sum, i) => sum + i.quantity, 0) };
    }
    const updated = state.cartItems.map(i => i.id === id ? { ...i, quantity: qty } : i);
    return { cartItems: updated, cartCount: updated.reduce((sum, i) => sum + i.quantity, 0) };
  }),

  removeFromCart: (id) => set((state) => {
    const existing = state.cartItems.find((i) => i.id === id);
    if (!existing) return {};

    let updatedItems: CartItem[];
    if (existing.quantity <= 1) {
      updatedItems = state.cartItems.filter((i) => i.id !== id);
    } else {
      updatedItems = state.cartItems.map((i) => 
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    }

    const newCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    return { cartItems: updatedItems, cartCount: newCount };
  }),

  clearCart: () => set({ cartItems: [], cartCount: 0, appliedCoupon: null, giftWrap: false }),

  applyCoupon: (code) => {
    const upperCode = code.toUpperCase();
    const storeCoupons = ['FESTIVAL-30', 'NEXUS-STUDENT', 'WELCOME-NEXUS', 'GOLD-VIP'];
    if (storeCoupons.includes(upperCode)) {
      set({ appliedCoupon: upperCode });
      return true;
    }
    return false;
  },

  toggleGiftWrap: () => set((state) => ({ giftWrap: !state.giftWrap })),
  
  toggleWishlist: (product) => set((state) => {
    const exists = state.wishlistItems.find((p) => p.id === product.id);
    let updated: Product[];
    if (exists) {
      updated = state.wishlistItems.filter((p) => p.id !== product.id);
    } else {
      updated = [...state.wishlistItems, product];
    }
    return { wishlistItems: updated, wishlistCount: updated.length };
  }),

  moveToCart: (product) => set((state) => {
    // Add to cart
    const numericPrice = product.discountPrice;
    const cartExistsIndex = state.cartItems.findIndex(i => i.id === product.id);
    let updatedCart: CartItem[];
    if (cartExistsIndex > -1) {
      updatedCart = state.cartItems.map((i, idx) => idx === cartExistsIndex ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      updatedCart = [...state.cartItems, {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: numericPrice,
        imageUrl: product.imageUrl,
        selectedColor: product.colors[0],
        selectedSize: product.sizes[0],
        quantity: 1
      }];
    }

    // Remove from wishlist
    const updatedWish = state.wishlistItems.filter(p => p.id !== product.id);
    return {
      cartItems: updatedCart,
      cartCount: updatedCart.reduce((sum, i) => sum + i.quantity, 0),
      wishlistItems: updatedWish,
      wishlistCount: updatedWish.length
    };
  }),

  toggleCompare: (product) => {
    let result = false;
    set((state) => {
      const exists = state.compareItems.find(p => p.id === product.id);
      if (exists) {
        return { compareItems: state.compareItems.filter(p => p.id !== product.id) };
      } else {
        if (state.compareItems.length >= 3) {
          // Exceeded compare limit! Replace first
          const updated = [...state.compareItems.slice(1), product];
          result = true;
          return { compareItems: updated };
        } else {
          result = true;
          return { compareItems: [...state.compareItems, product] };
        }
      }
    });
    return result;
  },

  clearCompare: () => set({ compareItems: [] }),

  placeOrder: (paymentMethod) => set((state) => {
    if (state.cartItems.length === 0) return {};

    const subtotal = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    if (state.appliedCoupon === 'FESTIVAL-30') {
      discount = subtotal * 0.3;
    } else if (state.appliedCoupon === 'NEXUS-STUDENT') {
      discount = subtotal * 0.15;
    } else if (state.appliedCoupon === 'WELCOME-NEXUS') {
      discount = subtotal * 0.1;
    } else if (state.appliedCoupon === 'GOLD-VIP') {
      discount = subtotal * 0.25;
    }
    const taxes = (subtotal - discount) * 0.08;
    const shipping = subtotal > 10000 ? 0 : 50;
    const wrap = state.giftWrap ? 20 : 0;
    const totalCost = (subtotal - discount) + taxes + shipping + wrap;

    const newShipments: OrderItem[] = state.cartItems.map((item) => ({
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      name: item.name,
      brand: item.brand,
      price: item.price,
      quantity: item.quantity,
      status: 'ordered' as const,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      imageUrl: item.imageUrl,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }));

    // Earn loyalty points: 1 point per $10 spent
    const pointsEarned = Math.round(totalCost / 10);
    
    // Create checkout notification
    const orderNo = newShipments[0].id;
    const newNotif: SystemNotification = {
      id: `notif-${Math.random()}`,
      title: 'Order Placed Securely',
      text: `Order ${orderNo} has been queued. Total value: $${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })} NEX via ${paymentMethod.toUpperCase()}.`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false
    };

    return {
      orders: [...newShipments, ...state.orders],
      walletBalance: Math.max(0, state.walletBalance - totalCost),
      loyaltyPoints: state.loyaltyPoints + pointsEarned,
      notifications: [newNotif, ...state.notifications],
      cartItems: [],
      cartCount: 0,
      appliedCoupon: null,
      giftWrap: false
    };
  }),

  cancelOrder: (orderId) => set((state) => {
    const orderIndex = state.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return {};
    
    const order = state.orders[orderIndex];
    if (order.status === 'delivered' || order.status === 'cancelled') return {};
    
    // Refund the order cost to wallet
    const refundCost = order.price * order.quantity * 1.08; // Base + 8% tax mock refund

    const updatedOrders = state.orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' as const } : o);

    const cancelNotif: SystemNotification = {
      id: `notif-${Math.random()}`,
      title: 'Order Cancelled & Refunded',
      text: `Order node ${orderId} cancelled successfully. Refund of $${refundCost.toLocaleString()} NEX processed to wallet balance.`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false
    };

    return {
      orders: updatedOrders,
      walletBalance: state.walletBalance + refundCost,
      notifications: [cancelNotif, ...state.notifications]
    };
  }),

  returnOrder: (orderId) => set((state) => {
    const orderIndex = state.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return {};

    const order = state.orders[orderIndex];
    if (order.status !== 'delivered') return {};

    const refundCost = order.price * order.quantity * 1.08;
    const updatedOrders = state.orders.map(o => o.id === orderId ? { ...o, status: 'returned' as const } : o);

    const returnNotif: SystemNotification = {
      id: `notif-${Math.random()}`,
      title: 'Return Request Initiated',
      text: `Return routing node registered for order ${orderId}. Refund of $${refundCost.toLocaleString()} NEX initiated to wallet.`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false
    };

    return {
      orders: updatedOrders,
      walletBalance: state.walletBalance + refundCost,
      notifications: [returnNotif, ...state.notifications]
    };
  }),

  addAddress: (addr) => set((state) => ({ addresses: [addr, ...state.addresses] })),
  removeAddress: (addr) => set((state) => ({ addresses: state.addresses.filter(a => a !== addr) })),
  
  topUpWallet: (amount) => set((state) => {
    const notif: SystemNotification = {
      id: `notif-${Math.random()}`,
      title: 'Wallet Asset Replenished',
      text: `Secured vault replenished with +$${amount.toLocaleString()} NEX core balance.`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false
    };
    return {
      walletBalance: state.walletBalance + amount,
      notifications: [notif, ...state.notifications]
    };
  }),
  
  updateProfile: (name, email, avatar) => set({ userName: name, userEmail: email, userAvatar: avatar }),
  
  addSavedCard: (card) => set((state) => {
    const newCard: SavedCard = {
      id: `card-${Math.random()}`,
      ...card
    };
    return { savedCards: [...state.savedCards, newCard] };
  }),
  
  removeSavedCard: (cardId) => set((state) => ({ savedCards: state.savedCards.filter(c => c.id !== cardId) })),

  addNotification: (title, text) => set((state) => {
    const newNotif: SystemNotification = {
      id: `notif-${Math.random()}`,
      title,
      text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false
    };
    return { notifications: [newNotif, ...state.notifications] };
  }),

  markNotificationsRead: () => set((state) => {
    const updated = state.notifications.map(n => ({ ...n, read: true }));
    return { notifications: updated };
  }),

  addToRecentlyViewed: (prod) => set((state) => {
    const updated = [prod, ...state.recentlyViewed.filter(p => p.id !== prod.id)].slice(0, 8);
    return { recentlyViewed: updated };
  }),

  addProduct: (prod) => set((state) => {
    const updated = [prod, ...state.products];
    return { products: updated };
  }),

  editProduct: (id, updatedFields) => set((state) => {
    const updated = state.products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    return { products: updated };
  }),

  deleteProduct: (id) => set((state) => {
    const updated = state.products.filter(p => p.id !== id);
    return { products: updated };
  }),

  updateOrderStatus: (orderId, status) => set((state) => {
    const updated = state.orders.map(o => o.id === orderId ? { ...o, status } : o);
    
    // Add notification about logistics state change
    const orderObj = state.orders.find(o => o.id === orderId);
    const orderName = orderObj ? orderObj.name : "Cargo Package";
    const statusText = status.toUpperCase();
    
    const notif: SystemNotification = {
      id: `notif-${Math.random()}`,
      title: `Cargo Status Update: ${statusText}`,
      text: `Your order payload for ${orderName} has been marked as ${statusText} by operations control.`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false
    };

    return { 
      orders: updated,
      notifications: [notif, ...state.notifications]
    };
  }),

  addCouponCode: (code) => set((state) => {
    if (state.coupons.includes(code.toUpperCase())) return {};
    return { coupons: [...state.coupons, code.toUpperCase()] };
  }),

  removeCouponCode: (code) => set((state) => {
    return { coupons: state.coupons.filter(c => c !== code.toUpperCase()) };
  }),

  logout: () => set({ isLoggedIn: false, isLoggingIn: false }),
}));
