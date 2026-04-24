import { useState, useRef } from 'react';
import type { MenuItem, Category, SiteConfig } from '@/types/menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  siteConfig: SiteConfig;
  categories: Category[];
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<MenuItem>) => void;
  onDeleteItem?: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  editItem?: MenuItem | null;
  onClearEdit: () => void;
}

export default function AdminPanel({
  isOpen,
  onOpenChange,
  siteConfig,
  categories,
  onAddItem,
  onUpdateItem,
  onAddCategory,
  onDeleteCategory,
  onExport,
  onImport,
  editItem,
  onClearEdit,
}: AdminPanelProps) {
  const [newCategory, setNewCategory] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) return;

    const itemData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      image: formData.image || siteConfig.heroImage,
    };

    if (editItem) {
      onUpdateItem(editItem.id, itemData);
    } else {
      onAddItem(itemData);
    }

    setFormData({ name: '', price: '', description: '', category: '', image: '' });
    setImagePreview('');
    onClearEdit();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert('Image must be under 500KB. Please compress or use a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setFormData((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg bg-black/95 backdrop-blur-xl border-white/10 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Panel
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Import / Export */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={onExport}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export JSON
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={() => importRef.current?.click()}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import JSON
              </Button>
              <input
                ref={importRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onImport(file);
                    e.target.value = '';
                  }
                }}
              />
            </div>

            {/* Add/Edit Product Form */}
            <div className="border border-white/10 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                {editItem ? 'Edit Product' : 'Add Product'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white/70">Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Product name"
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white/70">Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white/70">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Product description"
                    className="bg-white/5 border-white/10 text-white"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-white/70">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => setFormData((p) => ({ ...p, category: val }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/10">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-white hover:bg-white/10">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/70">Image</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-lg" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 text-white"
                    style={{ backgroundColor: siteConfig.colors.primary }}
                  >
                    {editItem ? 'Update Product' : 'Add Product'}
                  </Button>
                  {editItem && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        onClearEdit();
                        setFormData({ name: '', price: '', description: '', category: '', image: '' });
                        setImagePreview('');
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Category Management */}
            <div className="border border-white/10 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                Categories
              </h3>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="bg-white/5 border-white/10 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCategory.trim()) {
                      onAddCategory(newCategory.trim());
                      setNewCategory('');
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newCategory.trim()) {
                      onAddCategory(newCategory.trim());
                      setNewCategory('');
                    }
                  }}
                  style={{ backgroundColor: siteConfig.colors.primary }}
                  className="text-white"
                >
                  Add
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                  >
                    <span className="text-white text-sm">{cat.name}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"? All items in this category will be removed.`)) {
                          onDeleteCategory(cat.id);
                        }
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="border border-white/10 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">
                How to Edit Menu
              </h3>
              <ol className="text-sm text-white/50 space-y-1 list-decimal list-inside">
                <li>Use the form above to add new products</li>
                <li>Click the pencil icon on any menu card to edit it</li>
                <li>Click the trash icon to delete items</li>
                <li>Add or remove categories in the section above</li>
                <li>Export your menu as JSON for backup</li>
                <li>Import a JSON file to restore a previous menu</li>
              </ol>
              <p className="text-xs text-white/30 mt-3">
                Images are stored as base64 in localStorage. Keep them under 500KB.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating edit/delete buttons on cards */}
    </>
  );
}

export { AdminPanel };
