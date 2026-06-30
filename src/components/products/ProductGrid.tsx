import { useNexusStore } from '../../store/nexusStore';
import { PRODUCTS } from './productsData';
import ProductCard3D from './ProductCard3D';

export default function ProductGrid() {
  const activeCategory = useNexusStore((state) => state.activeCategory);

  // Filter based on active category
  const filteredProducts = PRODUCTS.filter(
    (prod) => prod.category.toLowerCase() === activeCategory.toLowerCase()
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="w-full py-16 text-center border border-dashed border-slate-350 rounded-2xl bg-white/70 font-sans text-xs">
        <span className="text-[10px] font-orbitron tracking-widest font-black text-slate-400 block uppercase">
          Neural Grid Vacant
        </span>
        <span className="text-[8px] text-slate-500 uppercase block mt-1">
          dock another category node to inspect spec sheets
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4">
      {filteredProducts.map((prod) => (
        <ProductCard3D
          key={prod.id}
          product={prod}
        />
      ))}
    </div>
  );
}
