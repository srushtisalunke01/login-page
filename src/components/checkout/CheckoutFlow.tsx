import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '../../store/nexusStore';
import { 
  CreditCard, MapPin, AlertCircle, Plus, Check, ChevronRight, ChevronLeft, 
  Wallet, ShieldCheck, Sparkles, Building, QrCode 
} from 'lucide-react';

interface CheckoutFlowProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutFlow({ onClose, onSuccess }: CheckoutFlowProps) {
  const {
    cartItems,
    addresses,
    addAddress,
    walletBalance,
    placeOrder,
    appliedCoupon,
    applyCoupon,
    giftWrap,
    toggleGiftWrap,
    savedCards,
    addSavedCard
  } = useNexusStore();

  const [step, setStep] = React.useState(1); // 1: Address, 2: Payment, 3: Review
  
  // Address selection states
  const [selectedAddressIdx, setSelectedAddressIdx] = React.useState(0);
  const [showAddAddress, setShowAddAddress] = React.useState(false);
  const [newAddressInput, setNewAddressInput] = React.useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'upi' | 'netbanking' | 'cod'>('card');
  const [selectedCardIdx, setSelectedCardIdx] = React.useState(0);
  
  // Card input states
  const [showAddCard, setShowAddCard] = React.useState(false);
  const [cardNum, setCardNum] = React.useState('');
  const [cardHolder, setCardHolder] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');
  
  // UPI QR states
  const [selectedBank, setSelectedBank] = React.useState('Nexus Bank Group');

  // Coupon states
  const [couponInput, setCouponInput] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [couponSuccess, setCouponSuccess] = React.useState(false);

  // Bill computations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  if (appliedCoupon === 'FESTIVAL-30') {
    discount = subtotal * 0.3;
  } else if (appliedCoupon === 'NEXUS-STUDENT') {
    discount = subtotal * 0.15;
  } else if (appliedCoupon === 'WELCOME-NEXUS') {
    discount = subtotal * 0.1;
  } else if (appliedCoupon === 'GOLD-VIP') {
    discount = subtotal * 0.25;
  }

  const taxedSubtotal = subtotal - discount;
  const taxes = taxedSubtotal * 0.08;
  const shipping = subtotal > 10000 ? 0 : 50;
  const wrappingCost = giftWrap ? 20 : 0;
  const total = taxedSubtotal + taxes + shipping + wrappingCost;

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressInput.trim()) return;
    addAddress(newAddressInput);
    setNewAddressInput('');
    setShowAddAddress(false);
    setSelectedAddressIdx(0); // Select the newly added address
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNum || !cardHolder || !cardExpiry) return;
    
    // Mask card number for display
    const masked = `•••• •••• •••• ${cardNum.slice(-4)}`;
    addSavedCard({
      cardNumber: masked,
      cardHolder: cardHolder.toUpperCase(),
      expiryDate: cardExpiry,
      cardType: cardNum.startsWith('3') ? 'amex' : cardNum.startsWith('5') ? 'mastercard' : 'visa'
    });

    setCardNum('');
    setCardHolder('');
    setCardExpiry('');
    setCardCvv('');
    setShowAddCard(false);
  };

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
      setCouponError('INVALID COGNITIVE VOUCHER');
    }
  };

  const handlePlaceOrder = () => {
    if (walletBalance < total && paymentMethod === 'card') {
      // Wallet limit check alert
      alert('Wallet assets insufficient. Please replenish assets in profile.');
      return;
    }
    
    placeOrder(paymentMethod);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-sans select-none">
      
      {/* Container sheet */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl h-[620px] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl flex flex-col justify-between"
      >
        
        {/* Top title navigation steps */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
            <h3 className="font-orbitron font-black text-sm tracking-widest text-slate-900 uppercase">
              Secure Checkout Gate
            </h3>
          </div>
          
          {/* Wizard step dots */}
          <div className="flex items-center gap-3 font-orbitron text-[10px] font-black text-slate-400">
            <span className={step === 1 ? 'text-[#d4af37]' : ''}>1. ADDRESS</span>
            <ChevronRight className="w-3 h-3" />
            <span className={step === 2 ? 'text-[#d4af37]' : ''}>2. PAYMENT</span>
            <ChevronRight className="w-3 h-3" />
            <span className={step === 3 ? 'text-[#d4af37]' : ''}>3. DOCK LEDGER</span>
          </div>
        </div>

        {/* Content Views */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Address Selection */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-800 uppercase text-xs">Verify Shipping Address</h4>
                  <p className="text-[11px] text-slate-400">Select where the cargo node container will be routed.</p>
                </div>

                <div className="space-y-3">
                  {addresses.map((addr, idx) => {
                    const isSelected = selectedAddressIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedAddressIdx(idx)}
                        className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-[#d4af37] bg-[#d4af37]/5 text-slate-950 font-semibold' 
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#d4af37]' : 'text-slate-400'}`} />
                          <span className="text-xs truncate max-w-[500px]">{addr}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#d4af37]" />}
                      </div>
                    );
                  })}
                </div>

                {/* Add new address section */}
                {!showAddAddress ? (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    ADD NEW SHIPPING LOCATION
                  </button>
                ) : (
                  <form onSubmit={handleAddAddressSubmit} className="flex gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <input
                      type="text"
                      required
                      value={newAddressInput}
                      onChange={(e) => setNewAddressInput(e.target.value)}
                      placeholder="ENTER FULL ROUTING LOCATION HUD..."
                      className="flex-1 bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-4 py-2 text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 bg-slate-900 text-white hover:bg-[#d4af37] text-[10px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      SAVE
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* Step 2: Payment Selection */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8"
              >
                {/* Left pane: selector buttons */}
                <div className="md:col-span-4 space-y-3.5">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-800 uppercase text-xs">Payment Method</h4>
                    <p className="text-[11px] text-slate-400">Choose your secure validation type.</p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {([
                      { id: 'card', label: 'Credit Card', icon: CreditCard },
                      { id: 'upi', label: 'UPI QR Scan', icon: QrCode },
                      { id: 'netbanking', label: 'Net Banking', icon: Building },
                      { id: 'cod', label: 'Cash on Delivery', icon: Wallet }
                    ] as const).map((m) => {
                      const isSelected = paymentMethod === m.id;
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={`w-full p-3.5 rounded-xl border flex items-center gap-3 text-xs font-bold transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? 'border-[#d4af37] bg-[#d4af37]/5 text-[#d4af37]' 
                              : 'border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right pane: selector specific inputs */}
                <div className="md:col-span-8 space-y-4">
                  
                  {/* Cards display */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <h4 className="font-orbitron font-black text-[10px] tracking-wider text-slate-400 uppercase">SAVED CREDIT DECK CARDS</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedCards.map((card, idx) => {
                          const isSelected = selectedCardIdx === idx;
                          return (
                            <div
                              key={card.id}
                              onClick={() => setSelectedCardIdx(idx)}
                              className={`p-4 rounded-2xl border flex flex-col justify-between h-36 cursor-pointer relative overflow-hidden transition-all duration-300 ${
                                isSelected 
                                  ? 'border-[#d4af37] bg-slate-950 text-white shadow-md' 
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-orbitron font-black tracking-widest">{card.cardType.toUpperCase()}</span>
                                <CreditCard className={`w-5 h-5 ${isSelected ? 'text-[#d4af37]' : 'text-slate-400'}`} />
                              </div>
                              <div className="space-y-1">
                                <span className="font-mono text-sm tracking-widest block">{card.cardNumber}</span>
                                <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase mt-2">
                                  <span>{card.cardHolder}</span>
                                  <span>{card.expiryDate}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Card Form */}
                      {!showAddCard ? (
                        <button
                          onClick={() => setShowAddCard(true)}
                          className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          ADD NEW CREDIT CARD
                        </button>
                      ) : (
                        <form onSubmit={handleAddCardSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            required
                            maxLength={16}
                            value={cardNum}
                            onChange={(e) => setCardNum(e.target.value)}
                            placeholder="CARD NUMBER (16 DIGITS)..."
                            className="col-span-2 bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-4 py-2 text-xs font-mono"
                          />
                          <input
                            type="text"
                            required
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="CARD HOLDER NAME..."
                            className="bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-4 py-2 text-xs"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-1/2 bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl text-center text-xs font-mono"
                            />
                            <input
                              type="password"
                              required
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="CVV"
                              className="w-1/2 bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl text-center text-xs font-mono"
                            />
                          </div>
                          <button
                            type="submit"
                            className="col-span-2 py-2.5 bg-slate-900 text-white hover:bg-[#d4af37] text-[10px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-200 cursor-pointer"
                          >
                            SAVE CREDIT CARD
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* UPI QR Display */}
                  {paymentMethod === 'upi' && (
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center text-center space-y-4">
                      <h4 className="font-bold text-slate-800 text-xs">Simulated Instant UPI Payment</h4>
                      <div className="w-40 h-40 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-3 relative shadow-inner">
                        {/* Mock QR matrix lines layout */}
                        <div className="w-full h-full border border-slate-150 border-dashed rounded-lg flex flex-col justify-between p-2">
                          <div className="flex justify-between">
                            <div className="w-6 h-6 border-2 border-slate-900 rounded" />
                            <div className="w-6 h-6 border-2 border-slate-900 rounded" />
                          </div>
                          <span className="text-[9px] font-mono text-slate-400">NEXUS UPI CODE</span>
                          <div className="flex justify-between items-end">
                            <div className="w-6 h-6 border-2 border-slate-900 rounded" />
                            <div className="w-4 h-4 bg-slate-900 rounded" />
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                        Scan with your device camera to authenticate immediate wallet payload transfers.
                      </p>
                    </div>
                  )}

                  {/* Net banking view */}
                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs">Select Commercial Banking Node</h4>
                      {['Nexus First Bank', 'Apex Digital Trust', 'Tokyo Citizens Hub', 'Global Commerce Vault'].map((b) => (
                        <div
                          key={b}
                          onClick={() => setSelectedBank(b)}
                          className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-colors text-xs font-bold ${
                            selectedBank === b 
                              ? 'border-[#d4af37] bg-[#d4af37]/5 text-slate-900' 
                              : 'border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span>{b}</span>
                          {selectedBank === b && <Check className="w-4 h-4 text-[#d4af37]" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CoD view */}
                  {paymentMethod === 'cod' && (
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 text-xs space-y-3">
                      <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wide flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-[#d4af37]" />
                        Cash on Delivery Clearance
                      </h4>
                      <p className="leading-relaxed text-[11px]">
                        Cash on Delivery includes an extra $20 service fee. Ensure biometric scanner verification is present at terminal delivery.
                      </p>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* Step 3: Dock Ledger Review */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8"
              >
                {/* Left side: Items & coupon input */}
                <div className="md:col-span-7 space-y-5">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-800 uppercase text-xs">Confirm Order Package</h4>
                    <p className="text-[11px] text-slate-400">Examine details in active dock.</p>
                  </div>

                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 overflow-hidden shrink-0">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block font-mono uppercase">{item.brand}</span>
                            <h5 className="font-bold text-slate-800 uppercase truncate max-w-[200px]">{item.name}</h5>
                            <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">QTY: {item.quantity} | Size: {item.selectedSize}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-slate-800">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Gift wrapping check */}
                  <div 
                    onClick={toggleGiftWrap}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                      giftWrap 
                        ? 'border-[#d4af37]/45 bg-[#d4af37]/5 text-[#d4af37]' 
                        : 'border-slate-200 bg-white text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold tracking-widest uppercase">Premium Gift Wrap Protection</span>
                    <span className="text-[9px] font-mono font-bold">+$20 NEX</span>
                  </div>

                  {/* Coupon Codes */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="ENTER COUPON CODE..."
                      className="flex-1 bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-3 py-2.5 text-[10px] uppercase font-mono text-slate-800"
                    />
                    <button
                      type="submit"
                      className="px-5 bg-slate-900 text-white hover:bg-[#d4af37] text-[10px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      APPLY
                    </button>
                  </form>

                  {couponError && <p className="text-[9px] font-mono text-nexus-magenta uppercase">{couponError}</p>}
                  {couponSuccess && <p className="text-[9px] font-mono text-emerald-600 uppercase">✓ COGNITIVE VOUCHER SAVINGS CALIBRATED!</p>}

                </div>

                {/* Right side: Ledger billing breakdown */}
                <div className="md:col-span-5 space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-800 uppercase text-xs">Dock Ledger Summary</h4>
                    <p className="text-[11px] text-slate-400">Quantum ledger valuations checklist.</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-[10px] space-y-2.5 font-mono">
                    <div className="flex justify-between text-slate-400 font-bold">
                      <span>SUBTOTAL</span>
                      <span className="text-slate-800">${subtotal.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-nexus-magenta font-bold">
                        <span>COUPON DISCOUNT</span>
                        <span>-${discount.toLocaleString()}</span>
                      </div>
                    )}
                    {giftWrap && (
                      <div className="flex justify-between text-[#d4af37] font-bold">
                        <span>GIFT PROTECTION</span>
                        <span>+$20</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400 font-bold">
                      <span>TAXES (8% HUD)</span>
                      <span className="text-slate-800">${taxes.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-bold">
                      <span>SHIPPING LOGISTICS</span>
                      <span className="text-slate-800">{shipping === 0 ? 'FREE' : `+$${shipping}`}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2.5 text-xs font-black tracking-widest text-slate-900">
                      <span>TOTAL BILL</span>
                      <span className="text-[#d4af37] text-sm">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })} NEX</span>
                    </div>
                  </div>

                  {/* Wallet state checks */}
                  <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between text-xs bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-500 animate-pulse" />
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold block font-mono">WALLET ASSET BAL</span>
                        <strong className="text-slate-800 font-mono">${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} NEX</strong>
                      </div>
                    </div>
                    {walletBalance >= total ? (
                      <span className="text-[8px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase font-bold">Verified APPROVED</span>
                    ) : (
                      <span className="text-[8px] text-nexus-magenta bg-rose-50 border border-rose-200 px-2 py-0.5 rounded uppercase font-bold">INSUFFICIENT ASSETS</span>
                    )}
                  </div>

                  <div className="text-[9px] text-slate-400 font-mono leading-relaxed uppercase flex gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span>Transactions secured by 256-bit quantum portal encryptions.</span>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer controls layout */}
        <div className="p-5 border-t border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-4 py-2 border border-slate-200 hover:border-slate-400 text-xs font-bold text-slate-600 rounded-xl cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                PREV
              </button>
            )}
          </div>

          <div>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 px-5 py-2.5 bg-slate-900 hover:bg-[#d4af37] text-white text-[10px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-sm"
              >
                NEXT STEP
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                className="flex items-center gap-1.5 px-6 py-3.5 bg-[#d4af37] hover:bg-slate-950 text-white text-[10px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                ACQUIRE NODE CARGO
              </button>
            )}
          </div>
        </div>

      </motion.div>
      
    </div>
  );
}
