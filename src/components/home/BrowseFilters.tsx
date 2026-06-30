import React from 'react';
import { Filter, RefreshCw, ChevronDown } from 'lucide-react';

interface BrowseFiltersProps {
  selectedBrand: string;
  setSelectedBrand: (b: string) => void;
  selectedPriceMax: number;
  setSelectedPriceMax: (p: number) => void;
  selectedRating: number;
  setSelectedRating: (r: number) => void;
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  selectedSize: string;
  setSelectedSize: (s: string) => void;
  selectedAvailability: string;
  setSelectedAvailability: (a: string) => void;
  selectedDiscount: number;
  setSelectedDiscount: (d: number) => void;
  selectedMaterial: string;
  setSelectedMaterial: (m: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  availableBrands: string[];
  resetFilters: () => void;
}

const COLORS_LIST = ['Gold', 'Platinum Silver', 'Midnight Black', 'Emerald Green', 'Royal Violet', 'Crimson Red'];
const SIZES_LIST = ['Standard', 'Compact', 'Pro Size', 'S', 'M', 'L', 'XL', 'XXL', '13-inch', '15-inch', '16-inch'];
const MATERIALS_LIST = ['Brushed Aerogel Composite', 'Titanium-Cobalt Mesh', 'Organic Cotton', 'Smart Mesh NanoWeave'];
const DISCOUNTS = [
  { label: 'Any Discount', value: 0 },
  { label: '10% or more', value: 10 },
  { label: '20% or more', value: 20 },
  { label: '30% or more', value: 30 },
  { label: '45% or more', value: 45 }
];

export default function BrowseFilters({
  selectedBrand,
  setSelectedBrand,
  selectedPriceMax,
  setSelectedPriceMax,
  selectedRating,
  setSelectedRating,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  selectedAvailability,
  setSelectedAvailability,
  selectedDiscount,
  setSelectedDiscount,
  selectedMaterial,
  setSelectedMaterial,
  sortBy,
  setSortBy,
  availableBrands,
  resetFilters
}: BrowseFiltersProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="w-full glass-panel p-5 rounded-2xl border border-nexus-border flex flex-col gap-5 select-none font-sans text-xs text-slate-700">
      {/* Header filter metrics bar */}
      <div className="flex justify-between items-center border-b border-nexus-border pb-3">
        <h3 className="font-orbitron font-black text-sm tracking-widest text-slate-900 flex items-center gap-2 uppercase">
          <Filter className="w-4 h-4 text-nexus-cyan animate-pulse" />
          Filter Parameters
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-[10px] text-slate-500 font-bold border border-slate-200 rounded-lg cursor-pointer transition-colors duration-200 hover:text-slate-800"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            RESET ALL
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold font-orbitron"
          >
            {isCollapsed ? '[+] EXPAND' : '[-] COLLAPSE'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          
          {/* Sorting metrics */}
          <div className="space-y-2">
            <span className="font-orbitron text-[10px] font-black tracking-widest text-slate-900 block uppercase">
              Sort Index
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white/80 border border-slate-200 focus:border-nexus-cyan/40 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="popularity">Popularity Index</option>
                <option value="latest">Latest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rated">Highest Rated</option>
                <option value="bestseller">Best Selling</option>
                <option value="discount">Highest Discount</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Brands list */}
          <div className="space-y-2">
            <span className="font-orbitron text-[10px] font-black tracking-widest text-slate-900 block uppercase">
              Brand Node
            </span>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white/80 border border-slate-200 focus:border-nexus-cyan/40 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="all">All Brands</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Pricing range input */}
          <div className="space-y-2 col-span-1 sm:col-span-2">
            <div className="flex justify-between items-center text-[10px] font-orbitron font-black tracking-widest text-slate-900 uppercase">
              <span>Valuation Threshold</span>
              <span className="text-nexus-cyan text-xs font-mono font-bold">${selectedPriceMax.toLocaleString()} NEX</span>
            </div>
            <div className="pt-2">
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={selectedPriceMax}
                onChange={(e) => setSelectedPriceMax(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>$100</span>
                <span>$2,500</span>
                <span>$5,000+</span>
              </div>
            </div>
          </div>

          {/* Ratings list */}
          <div className="space-y-2">
            <span className="font-orbitron text-[10px] font-black tracking-widest text-slate-900 block uppercase">
              Clearance Rating
            </span>
            <div className="flex items-center gap-1 bg-white/80 border border-slate-200 rounded-xl p-1 justify-around">
              {[0, 3.5, 4.0, 4.5].map((stars) => {
                const isActive = selectedRating === stars;
                return (
                  <button
                    key={stars}
                    onClick={() => setSelectedRating(stars)}
                    className={`px-2 py-1.5 text-[9px] font-bold rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-0.5 ${
                      isActive 
                        ? 'bg-[#d4af37] text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {stars === 0 ? 'All' : `${stars}★`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Colors */}
          <div className="space-y-2">
            <span className="font-orbitron text-[10px] font-black tracking-widest text-slate-900 block uppercase">
              Holographic Color
            </span>
            <div className="relative">
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full bg-white/80 border border-slate-200 focus:border-nexus-cyan/40 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="all">All Colors</option>
                {COLORS_LIST.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Sizes list */}
          <div className="space-y-2">
            <span className="font-orbitron text-[10px] font-black tracking-widest text-slate-900 block uppercase">
              Calibrated Size
            </span>
            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-white/80 border border-slate-200 focus:border-nexus-cyan/40 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="all">All Sizes</option>
                {SIZES_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Discount range */}
          <div className="space-y-2">
            <span className="font-orbitron text-[10px] font-black tracking-widest text-slate-900 block uppercase">
              Promo Savings
            </span>
            <div className="relative">
              <select
                value={selectedDiscount}
                onChange={(e) => setSelectedDiscount(Number(e.target.value))}
                className="w-full bg-white/80 border border-slate-200 focus:border-nexus-cyan/40 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none appearance-none cursor-pointer font-medium"
              >
                {DISCOUNTS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <span className="font-orbitron text-[10px] font-black tracking-widest text-slate-900 block uppercase">
              Dock Status
            </span>
            <div className="relative">
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full bg-white/80 border border-slate-200 focus:border-nexus-cyan/40 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="in stock">In Stock Only</option>
                <option value="limited">Limited Quantities</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-2">
            <span className="font-orbitron text-[10px] font-black tracking-widest text-slate-900 block uppercase">
              Material Core
            </span>
            <div className="relative">
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-white/80 border border-slate-200 focus:border-nexus-cyan/40 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="all">All Materials</option>
                {MATERIALS_LIST.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
