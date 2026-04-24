import type { MenuItem } from '@/types/menu';
import MenuCard from './MenuCard';

interface MenuGridProps {
  items: MenuItem[];
  onEdit?: (item: MenuItem) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  primaryColor: string;
}

export default function MenuGrid({ items, onEdit, onDelete, isAdmin, primaryColor }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 opacity-50">
        <p className="text-lg">No items in this category yet.</p>
        {isAdmin && <p className="text-sm mt-2">Click "+ Add Product" to get started.</p>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {items.map((item, index) => (
        <div
          key={item.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
        >
          <MenuCard
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            isAdmin={isAdmin}
            primaryColor={primaryColor}
          />
        </div>
      ))}
    </div>
  );
}
