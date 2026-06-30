import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '../../store/nexusStore';
import { X, Plus, Minus, CreditCard, Sparkles, Gift } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutSuccess: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckoutSuccess }: CartDrawerProps) {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    giftWrap,
    toggleGiftWrap
  } = useNexusStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Computations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Coupon logic
  let discount = 0;
  if (appliedCoupon === 'FESTIVAL-30') {
    discount = subtotal * 0.3;
  } else if (appliedCoupon === 'NEXUS-STUDENT') {
    discount = subtotal * 0.15;
  }

  const taxedSubtotal = subtotal - discount;
  const taxes = taxedSubtotal * 0.08;
  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 50;
  const wrappingCost = giftWrap ? 20 : 0;
  const total = taxedSubtotal + taxes + shipping + wrappingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    if (!couponInput) return;
    const isValid = applyCoupon(couponInput);
    
    if (isValid) {
      setCouponSuccess(true);
      setCouponInput('');
    } else {
      setCouponError('INVALID COGNITIVE CODE');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    onCheckoutSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 w-screen h-screen z-50 flex justify-end font-orbitron select-none">
          {/* Backdrop Blur Clickable Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer w-full h-full"
          />

          {/* Drawer glass sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative w-full max-w-md h-full bg-black/80 backdrop-blur-xl border-l border-nexus-border/60 p-6 flex flex-col justify-between shadow-glass z-10"
          >
            {/* Header bar */}
            <div className="flex justify-between items-center border-b border-nexus-border pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-nexus-cyan animate-pulse" />
                <h3 className="text-sm font-black tracking-widest text-white uppercase">
                  CART CHECKOUT HUD
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 border border-nexus-border flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-4 scrollbar-thin">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                  <span className="text-[10px] tracking-widest font-black uppercase">Cart Vacant</span>
                  <span className="text-[8px] uppercase mt-1">no core nodes added to queue</span>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white/5 border border-nexus-border rounded-xl flex items-center justify-between gap-4 transition-all duration-300 hover:border-white/10"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-nexus-border shrink-0 bg-slate-900">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[6px] text-slate-500 block uppercase font-mono tracking-widest">{item.brand}</span>
                      <h4 className="text-[10px] font-bold text-white uppercase truncate">{item.name}</h4>
                      <span className="text-[9px] font-mono text-nexus-cyan block mt-0.5">
                        ${item.price.toLocaleString()} NEX
                      </span>
                    </div>

                    {/* Quantity Adjustment node */}
                    <div className="flex items-center gap-2 border border-nexus-border rounded-lg p-0.5 bg-black/40">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-mono text-white px-1 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => addToCart({ id: item.id, name: item.name, brand: item.brand, price: item.price, imageUrl: item.imageUrl })}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations and Actions Footer */}
            <div className="border-t border-nexus-border pt-4 space-y-4">
              
              {/* Optional Gift Wrapping check */}
              {cartItems.length > 0 && (
                <div 
                  onClick={toggleGiftWrap}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                    giftWrap 
                      ? 'border-nexus-cyan/40 bg-nexus-cyan/5 text-nexus-cyan' 
                      : 'border-nexus-border bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    <span className="text-[9px] font-bold tracking-widest uppercase">Premium Gift Wrapping</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold">+$20 NEX</span>
                </div>
              )}

              {/* Coupon inputs bar */}
              {cartItems.length > 0 && (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="ENTER COUPON CODE..."
                    className="flex-1 bg-white/5 border border-nexus-border focus:border-nexus-cyan/40 focus:outline-none rounded-xl px-3 py-2 text-[10px] uppercase font-mono text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-white text-black hover:bg-black hover:text-white border hover:border-white text-[9px] font-black tracking-widest rounded-xl transition-all duration-200 cursor-pointer shadow-neon-white shrink-0"
                  >
                    APPLY
                  </button>
                </form>
              )}

              {/* Validation alert logs */}
              {couponError && (
                <div className="text-[8px] font-mono text-nexus-magenta uppercase tracking-wider">{couponError}</div>
              )}
              {couponSuccess && (
                <div className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                  COGNITIVE SYSTEM OFFERS CALIBRATED!
                </div>
              )}

              {/* Pricing ledger */}
              <div className="p-4 bg-black/60 border border-nexus-border rounded-xl text-[10px] space-y-2 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>SUBTOTAL</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-nexus-magenta font-bold">
                    <span>COUPON REDUCTION ({appliedCoupon === 'FESTIVAL-30' ? '30%' : '15%'})</span>
                    <span>-${discount.toLocaleString()}</span>
                  </div>
                )}
                {giftWrap && (
                  <div className="flex justify-between text-nexus-cyan">
                    <span>GIFT WRAP</span>
                    <span>+$20</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>TAXES (8% HUD)</span>
                  <span className="text-white">${taxes.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>SHIPPING LOGISTICS</span>
                  <span className="text-white">{shipping === 0 ? 'FREE' : `+$${shipping}`}</span>
                </div>
                <div className="flex justify-between border-t border-nexus-border/50 pt-2 text-xs font-black tracking-widest text-white mt-1">
                  <span>TOTAL BILL</span>
                  <span className="text-nexus-cyan">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })} NEX</span>
                </div>
              </div>

              {/* Checkout Trigger button */}
              <button
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
                className="w-full py-4 bg-white text-black hover:bg-black hover:text-white border border-transparent hover:border-white font-black tracking-widest text-[10px] rounded-xl cursor-pointer transition-all duration-300 shadow-neon-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <CreditCard className="w-3.5 h-3.5" />
                COMPLETE SECURE CHECKOUT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
