import { useNexusStore } from '../../store/nexusStore';
import { Trash2, ShoppingCart, Star, X, Sparkles } from 'lucide-react';

interface CompareMatrixProps {
  onClose: () => void;
  onCartOpen: () => void;
}

export default function CompareMatrix({ onClose, onCartOpen }: CompareMatrixProps) {
  const { compareItems, toggleCompare, clearCompare, addToCart } = useNexusStore();

  const handleAddToCart = (sim: any) => {
    addToCart({
      id: sim.id,
      name: sim.name,
      brand: sim.brand,
      price: sim.discountPrice,
      imageUrl: sim.imageUrl,
      selectedColor: sim.colors[0],
      selectedSize: sim.sizes[0]
    });
    onCartOpen();
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      
      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-nexus-border pb-4">
        <div>
          <h2 className="text-xl font-orbitron font-black tracking-widest text-slate-900 uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d4af37] animate-pulse" />
            Comparison Matrix
          </h2>
          <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-1 uppercase">
            Side-by-side nodes specifications matching analyzer ({compareItems.length}/3 nodes active)
          </p>
        </div>
        <div className="flex items-center gap-3">
          {compareItems.length > 0 && (
            <button
              onClick={clearCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-[10px] text-slate-500 font-bold border border-slate-200 rounded-lg cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              CLEAR DECK
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {compareItems.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-nexus-border rounded-2xl bg-white/70">
          <span className="text-xs text-slate-400 font-orbitron font-black uppercase tracking-widest block">
            Comparison Deck Empty
          </span>
          <span className="text-[9px] text-slate-400 font-mono uppercase block mt-1">
            add products to compare specs parameters side-by-side
          </span>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl border border-nexus-border overflow-x-auto bg-white/70 shadow-sm">
          <table className="w-full min-w-[600px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 font-orbitron font-black tracking-widest text-slate-400 uppercase w-1/4">Parameters</th>
                {compareItems.map((prod) => (
                  <th key={prod.id} className="py-4 px-6 w-1/4 relative">
                    <button
                      onClick={() => toggleCompare(prod)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="space-y-2">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-100 bg-white mx-auto">
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center">
                        <span className="text-[8px] text-slate-400 font-mono block uppercase">{prod.brand}</span>
                        <h4 className="font-bold text-slate-800 uppercase truncate mt-0.5 max-w-[150px] mx-auto">{prod.name}</h4>
                        <span className="text-[#d4af37] font-mono font-bold text-xs mt-1 block">${prod.discountPrice}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 font-medium">
              
              {/* Star Rating row */}
              <tr>
                <td className="py-3.5 font-bold text-slate-500 uppercase tracking-wider">Rating index</td>
                {compareItems.map((prod) => (
                  <td key={prod.id} className="py-3.5 px-6 text-center text-[#d4af37] font-mono font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#d4af37] text-transparent" />
                      <span>{prod.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-sans font-normal">({prod.reviewsCount})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Original Price row */}
              <tr>
                <td className="py-3.5 font-bold text-slate-500 uppercase tracking-wider">Original Price</td>
                {compareItems.map((prod) => (
                  <td key={prod.id} className="py-3.5 px-6 text-center text-slate-400 line-through font-mono">
                    ${prod.originalPrice}
                  </td>
                ))}
              </tr>

              {/* Discount Percent row */}
              <tr>
                <td className="py-3.5 font-bold text-slate-500 uppercase tracking-wider">Promo Savings</td>
                {compareItems.map((prod) => (
                  <td key={prod.id} className="py-3.5 px-6 text-center text-nexus-magenta font-mono font-bold">
                    {prod.discountPercent}% OFF
                  </td>
                ))}
              </tr>

              {/* Available Colors row */}
              <tr>
                <td className="py-3.5 font-bold text-slate-500 uppercase tracking-wider">Available Colors</td>
                {compareItems.map((prod) => (
                  <td key={prod.id} className="py-3.5 px-6 text-center text-slate-600 font-mono text-[10px]">
                    {prod.colors.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Available Sizes row */}
              <tr>
                <td className="py-3.5 font-bold text-slate-500 uppercase tracking-wider">Size configurations</td>
                {compareItems.map((prod) => (
                  <td key={prod.id} className="py-3.5 px-6 text-center text-slate-600 font-mono text-[10px]">
                    {prod.sizes.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Decryption speed row */}
              <tr>
                <td className="py-3.5 font-bold text-slate-500 uppercase tracking-wider">Decryption rate</td>
                {compareItems.map((prod) => (
                  <td key={prod.id} className="py-3.5 px-6 text-center text-slate-700 font-mono">
                    {prod.specifications['Decryption Node'] || '8.4 GHz Quantum'}
                  </td>
                ))}
              </tr>

              {/* Core build row */}
              <tr>
                <td className="py-3.5 font-bold text-slate-500 uppercase tracking-wider">Core build material</td>
                {compareItems.map((prod) => (
                  <td key={prod.id} className="py-3.5 px-6 text-center text-slate-700 font-mono uppercase text-[9px]">
                    {prod.specifications['Core Build'] || 'Brushed Aerogel'}
                  </td>
                ))}
              </tr>

              {/* Return Policy row */}
              <tr>
                <td className="py-3.5 font-bold text-slate-500 uppercase tracking-wider">Return response</td>
                {compareItems.map((prod) => (
                  <td key={prod.id} className="py-3.5 px-6 text-center text-slate-600 uppercase text-[9px]">
                    {prod.returnPolicy}
                  </td>
                ))}
              </tr>

              {/* Seller Network row */}
              <tr>
                <td className="py-3.5 font-bold text-slate-500 uppercase tracking-wider">Seller Node</td>
                {compareItems.map((prod) => (
                  <td key={prod.id} className="py-3.5 px-6 text-center text-slate-600">
                    {prod.sellerName}
                  </td>
                ))}
              </tr>

              {/* Action trigger row */}
              <tr>
                <td className="py-4 font-bold text-slate-500 uppercase tracking-wider">Operations</td>
                {compareItems.map((prod) => (
                  <td key={prod.id} className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-[#d4af37] text-white hover:text-white text-[10px] font-orbitron font-black tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      ADD
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
