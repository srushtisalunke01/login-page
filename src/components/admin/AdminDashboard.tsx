import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '../../store/nexusStore';
import { Product } from '../products/productsData';
import { 
  Shield, BarChart3, Plus, Edit2, Trash2, PlusCircle, Trash
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    products, addProduct, editProduct, deleteProduct,
    orders, updateOrderStatus,
    coupons, addCouponCode, removeCouponCode,
    addNotification
  } = useNexusStore();

  // Search & filter state
  const [invSearchQuery, setInvSearchQuery] = React.useState('');
  const [selectedInvCategory, setSelectedInvCategory] = React.useState('all');

  // Modal / dialog states
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState<Product | null>(null);

  // New product input states
  const [newBrand, setNewBrand] = React.useState('');
  const [newName, setNewName] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('Electronics');
  const [newPrice, setNewPrice] = React.useState('');
  const [newDiscount, setNewDiscount] = React.useState('10');
  const [newStock, setNewStock] = React.useState('In Stock');
  const [newDesc, setNewDesc] = React.useState('');
  const [newImg, setNewImg] = React.useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300');

  // New coupon state
  const [newCouponInput, setNewCouponInput] = React.useState('');

  // Analytics derivations
  const totalSales = React.useMemo(() => {
    return orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.price * o.quantity), 0);
  }, [orders]);

  const activeOrdersCount = React.useMemo(() => {
    return orders.filter(o => o.status !== 'cancelled' && o.status !== 'delivered' && o.status !== 'returned').length;
  }, [orders]);

  // Inventory filter
  const filteredInventory = React.useMemo(() => {
    return products.filter(p => {
      const matchQuery = p.name.toLowerCase().includes(invSearchQuery.toLowerCase()) || 
                         p.brand.toLowerCase().includes(invSearchQuery.toLowerCase()) ||
                         p.id.toLowerCase().includes(invSearchQuery.toLowerCase());
      const matchCat = selectedInvCategory === 'all' || p.category.toLowerCase() === selectedInvCategory.toLowerCase();
      return matchQuery && matchCat;
    });
  }, [products, invSearchQuery, selectedInvCategory]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand || !newName || !newPrice) {
      alert('Please fill out Brand, Name, and Price values.');
      return;
    }

    const priceNum = parseFloat(newPrice);
    const discNum = parseFloat(newDiscount) || 0;
    const discountPrice = Math.round(priceNum * (1 - discNum / 100));

    const newProd: Product = {
      id: `PRD-${Date.now().toString().slice(-6)}`,
      brand: newBrand,
      brandLogo: '💎',
      name: newName,
      category: newCategory,
      subcategory: newCategory,
      originalPrice: priceNum,
      discountPrice: discountPrice,
      discountPercent: discNum,
      rating: 4.5,
      reviewsCount: 1,
      imageUrl: newImg,
      gallery: [newImg],
      description: newDesc,
      specifications: {
        'Core Build': 'Carbon composite',
        'Warranty': '1 Year'
      },
      features: ['Secured ledger', 'Certified item'],
      stockStatus: newStock as any,
      stockCount: 50,
      deliveryTime: '3-5 Days',
      colors: ['Titanium', 'Gold'],
      sizes: ['Standard'],
      tags: ['new', newCategory.toLowerCase()],
      sellerName: 'Nexus Authorized',
      returnPolicy: '30-Day Hassle-Free Returns',
      warranty: '1-Year Direct Manufacturer Warranty',
      reviews: [],
      qas: []
    };

    addProduct(newProd);
    addNotification('Product Added', `Admin added new product payload ${newName} to catalog.`);
    
    // Reset inputs
    setNewBrand('');
    setNewName('');
    setNewPrice('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;

    editProduct(showEditModal.id, {
      discountPrice: showEditModal.discountPrice,
      originalPrice: showEditModal.originalPrice,
      stockStatus: showEditModal.stockStatus,
    });

    addNotification('Product Modified', `Catalog ledger updated for ${showEditModal.name}.`);
    setShowEditModal(null);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Remove product payload ${name} from live marketplace nodes?`)) {
      deleteProduct(id);
      addNotification('Product Purged', `Administrative node deleted product ${name} from live databases.`);
    }
  };

  const handleAddCoupon = () => {
    if (!newCouponInput.trim()) return;
    addCouponCode(newCouponInput.trim());
    addNotification('Promo Created', `Active coupon code ${newCouponInput.toUpperCase()} registered.`);
    setNewCouponInput('');
  };

  return (
    <div className="space-y-8 font-sans text-slate-700">
      
      {/* Admin header */}
      <div className="border-b border-slate-200 pb-3 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-orbitron font-black tracking-widest text-slate-900 uppercase flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#d4af37]" /> Operations Center (Admin)
          </h2>
          <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-1 uppercase">
            Store ledger overrides, logistics control tower, and database nodes index.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-[#d4af37] text-white text-[10px] font-orbitron font-black tracking-wider rounded-xl transition-all duration-350 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> ADD PRODUCT
        </button>
      </div>

      {/* Analytics stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-28">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Total Sales Value</span>
          <div>
            <span className="text-2xl font-bold font-mono text-slate-900">${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="text-[8px] text-emerald-500 font-mono block mt-1">▲ 12.8% FROM LAST SEGMENT</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-28">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Logistics Queue</span>
          <div>
            <span className="text-2xl font-bold font-mono text-slate-900">{activeOrdersCount} payload units</span>
            <span className="text-[8px] text-[#d4af37] font-mono block mt-1">Awaiting dispatch or packaging</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-28">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Registered Catalog</span>
          <div>
            <span className="text-2xl font-bold font-mono text-slate-900">{products.length} product nodes</span>
            <span className="text-[8px] text-slate-400 font-mono block mt-1">Distributed across 9 category clusters</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-28">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Average Ticket Size</span>
          <div>
            <span className="text-2xl font-bold font-mono text-slate-900">
              ${orders.length > 0 ? (totalSales / orders.length).toFixed(2) : '0.00'}
            </span>
            <span className="text-[8px] text-slate-400 font-mono block mt-1">Calculated from checkout indices</span>
          </div>
        </div>

      </div>

      {/* Main admin panels columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Inventory manager */}
        <div className="lg:col-span-2 glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <h3 className="font-orbitron font-black tracking-widest text-[11px] text-slate-900 uppercase">
              Inventory Ledger Manager
            </h3>
            
            {/* Filter selectors */}
            <div className="flex gap-2">
              <select 
                value={selectedInvCategory}
                onChange={(e) => setSelectedInvCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-[9px] font-mono font-bold text-slate-600 focus:outline-none focus:border-[#d4af37]"
              >
                <option value="all">ALL DECK SECTORS</option>
                <option value="electronics">ELECTRONICS</option>
                <option value="fashion">FASHION</option>
                <option value="gaming">GAMING</option>
                <option value="home">HOME</option>
                <option value="beauty">BEAUTY</option>
                <option value="sports">SPORTS</option>
                <option value="books">BOOKS</option>
                <option value="automotive">AUTOMOTIVE</option>
                <option value="students">STUDENTS</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <input 
              type="text"
              placeholder="Search product nodes by name, SKU, brand..."
              value={invSearchQuery}
              onChange={(e) => setInvSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-4 py-2 pl-9 text-[11px]"
            />
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-[10px]">🔎</span>
          </div>

          {/* Catalog items table list */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl max-h-[350px] overflow-y-auto scrollbar-thin">
            <table className="w-full text-left text-[10px] border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[8px] font-bold">
                  <th className="p-3">SKU</th>
                  <th className="p-3">Brand & Name</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400 uppercase text-[9px]">
                      No catalog node logs match search parameters
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-400">{item.id}</td>
                      <td className="p-3">
                        <span className="text-[8px] text-slate-400 uppercase block font-semibold">{item.brand}</span>
                        <span className="text-slate-800 font-bold uppercase block max-w-[180px] truncate">{item.name}</span>
                      </td>
                      <td className="p-3 text-right text-slate-900 font-bold">
                        ${item.discountPrice}
                        {item.discountPercent > 0 && (
                          <span className="text-[8px] text-slate-400 line-through block font-normal">${item.originalPrice}</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          item.stockStatus === 'In Stock' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : item.stockStatus === 'Limited Stock' 
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-rose-50 text-rose-500 border border-rose-100'
                        }`}>
                          {item.stockStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => setShowEditModal(item)}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(item.id, item.name)}
                            className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 3: Logistics Controller & Coupons */}
        <div className="space-y-6">
          
          {/* Coupon controller card */}
          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-orbitron font-black tracking-widest text-[11px] text-slate-900 uppercase flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-[#d4af37]" /> Coupon Manager
            </h3>

            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="PROMO-CODE-30"
                value={newCouponInput}
                onChange={(e) => setNewCouponInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-3 py-1.5 text-[10px] font-mono font-bold uppercase placeholder:normal-case"
              />
              <button 
                onClick={handleAddCoupon}
                className="px-3 bg-slate-900 hover:bg-[#d4af37] text-white text-[10px] font-orbitron font-bold rounded-xl transition-colors cursor-pointer"
              >
                ADD
              </button>
            </div>

            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
              {coupons.map((code) => (
                <div key={code} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-mono font-bold">
                  <span className="text-slate-800">{code}</span>
                  <button 
                    onClick={() => removeCouponCode(code)}
                    className="text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Sales Category bar chart */}
          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-orbitron font-black tracking-widest text-[11px] text-slate-900 uppercase flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#d4af37]" /> Segment Sales Index
            </h3>
            
            <div className="space-y-3 font-mono text-[9px] font-bold">
              {[
                { label: 'ELECTRONICS', val: 78, price: 68420 },
                { label: 'GAMING', val: 56, price: 12400 },
                { label: 'FASHION', val: 42, price: 5680 },
                { label: 'HOME DECK', val: 24, price: 920.90 }
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>{row.label}</span>
                    <span>${row.price.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-400 to-[#d4af37] h-full" style={{ width: `${row.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Logistics controller grid */}
      <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-orbitron font-black tracking-widest text-[11px] text-slate-900 uppercase">
          Cargo Order Despatch override console
        </h3>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-[10px] border-collapse font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[8px] font-bold">
                <th className="p-3">Invoice ID</th>
                <th className="p-3">Product details</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Change State Overrides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 uppercase text-[9px]">
                    No active client orders found in queue
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-semibold text-[#d4af37]">{ord.id}</td>
                    <td className="p-3">
                      <span className="text-slate-800 font-bold block">{ord.name}</span>
                      <span className="text-[8px] text-slate-400 font-normal">QTY: {ord.quantity} | Total: ${ord.price * ord.quantity}</span>
                    </td>
                    <td className="p-3 text-center text-slate-500 font-medium">{ord.date}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : ord.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-500 border border-rose-100'
                            : ord.status === 'returned'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {ord.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1 font-sans">
                        
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'packed')}
                          disabled={ord.status === 'cancelled' || ord.status === 'delivered'}
                          className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[8px] uppercase font-sans"
                          title="Set Packed"
                        >
                          PACKED
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'shipped')}
                          disabled={ord.status === 'cancelled' || ord.status === 'delivered'}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[8px] uppercase font-sans"
                          title="Set Shipped"
                        >
                          SHIPPED
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'delivered')}
                          disabled={ord.status === 'cancelled' || ord.status === 'delivered'}
                          className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[8px] uppercase font-sans"
                          title="Set Delivered"
                        >
                          DELIVERED
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        
        {/* 1. Add Product modal */}
        {showAddModal && (
          <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[1000] bg-black/60 backdrop-blur-sm p-4 font-sans select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 bg-white rounded-3xl border border-slate-200 flex flex-col gap-4 relative shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs tracking-widest text-[#d4af37] font-orbitron font-black uppercase">REGISTER PRODUCT PAYLOAD</span>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">Brand</span>
                    <input 
                      type="text" 
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      placeholder="e.g. Nike, Apple"
                      className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">Product Name</span>
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Alpha Zoom Shoes"
                      className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">Category</span>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Home">Home</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Sports">Sports</option>
                      <option value="Books">Books</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Students">Students</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">Base Price ($)</span>
                    <input 
                      type="number" 
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g. 199"
                      className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">Discount Percent (%)</span>
                    <input 
                      type="number" 
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">Stock Status</span>
                    <select
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Limited Stock">Limited Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">Image URL</span>
                  <input 
                    type="text" 
                    value={newImg}
                    onChange={(e) => setNewImg(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">Description</span>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Enter premium description highlights..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl h-20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-[#d4af37] text-white font-orbitron font-black tracking-widest text-[9px] rounded-xl cursor-pointer transition-colors shadow"
                >
                  SUBMIT PAYLOAD TO CATALOG
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* 2. Edit Product modal */}
        {showEditModal && (
          <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[1000] bg-black/60 backdrop-blur-sm p-4 font-sans select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm p-6 bg-white rounded-3xl border border-slate-200 flex flex-col gap-4 relative shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs tracking-widest text-[#d4af37] font-orbitron font-black uppercase">EDIT PRODUCT LEDGER</span>
                <button 
                  onClick={() => setShowEditModal(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs text-slate-700 font-mono">
                <div className="text-[10px] text-slate-400">
                  <span className="block">PRODUCT SKU: {showEditModal.id}</span>
                  <span className="block font-bold text-slate-800 text-xs mt-0.5 uppercase">{showEditModal.name}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-450 uppercase block font-bold">Original Price ($)</span>
                  <input 
                    type="number"
                    value={showEditModal.originalPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setShowEditModal({ 
                        ...showEditModal, 
                        originalPrice: val,
                        discountPrice: Math.round(val * (1 - showEditModal.discountPercent / 100))
                      });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-450 uppercase block font-bold">Discounted Price ($)</span>
                  <input 
                    type="number"
                    value={showEditModal.discountPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setShowEditModal({ 
                        ...showEditModal, 
                        discountPrice: val,
                        discountPercent: showEditModal.originalPrice > 0 ? Math.round(((showEditModal.originalPrice - val) / showEditModal.originalPrice) * 100) : 0
                      });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl font-bold text-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-450 uppercase block font-bold">Stock Status</span>
                  <select
                    value={showEditModal.stockStatus}
                    onChange={(e) => setShowEditModal({ ...showEditModal, stockStatus: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl font-bold"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-[#d4af37] text-white font-orbitron font-black tracking-widest text-[9px] rounded-xl cursor-pointer transition-colors shadow"
                >
                  SAVE LEDGER CHANGES
                </button>
              </form>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
