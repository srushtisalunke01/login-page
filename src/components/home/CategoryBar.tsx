import { useNexusStore } from '../../store/nexusStore';

const CATEGORIES: string[] = [
  'Electronics',
  'Fashion',
  'Shoes',
  'Watches',
  'Furniture',
  'Gaming',
  'Smartphones',
  'Laptops',
  'Beauty',
  'Sports',
  'Home Decor'
];

export default function CategoryBar() {
  const { activeCategory, setActiveCategory } = useNexusStore();

  return (
    <div className="w-full select-none mt-2 font-orbitron">
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-[9px] font-black tracking-widest rounded-xl border transition-all duration-300 cursor-pointer shrink-0 ${
                isSelected 
                  ? 'bg-white text-black border-transparent shadow-neon-white'
                  : 'bg-white/5 text-slate-400 border-nexus-border hover:text-white hover:border-slate-500'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
