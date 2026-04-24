import type { Category } from '@/types/menu';

interface MenuTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  primaryColor: string;
}

export default function MenuTabs({ categories, activeCategory, onCategoryChange, primaryColor }: MenuTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300"
          style={{
            backgroundColor: activeCategory === cat.id ? primaryColor : 'rgba(255,255,255,0.1)',
            color: activeCategory === cat.id ? '#fff' : 'inherit',
            border: `1px solid ${activeCategory === cat.id ? primaryColor : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
