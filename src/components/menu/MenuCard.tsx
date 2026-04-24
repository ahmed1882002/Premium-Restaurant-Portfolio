import { useState } from 'react';
import type { MenuItem } from '@/types/menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MenuCardProps {
  item: MenuItem;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  primaryColor: string;
}

export default function MenuCard({ item, onEdit, onDelete, isAdmin, primaryColor }: MenuCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="group relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-white/10"
        onClick={() => setIsOpen(true)}
        style={{ '--hover-color': primaryColor + '20' } as any}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = (primaryColor + '15');
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)';
        }}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-lg font-bold text-white">{item.name}</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm opacity-70 line-clamp-2 mb-2" style={{ color: 'inherit' }}>
            {item.description}
          </p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>
            ${item.price.toFixed(2)}
          </p>
        </div>
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(item);
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              className="p-1.5 rounded-full bg-red-500/60 backdrop-blur-sm hover:bg-red-500/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this item?')) onDelete?.(item.id);
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg bg-black/90 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">{item.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img src={item.image} alt={item.name} className="w-full h-64 object-cover rounded-lg mb-4" />
            <p className="text-white/70 mb-4">{item.description}</p>
            <p className="text-2xl font-bold" style={{ color: primaryColor }}>
              ${item.price.toFixed(2)}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
