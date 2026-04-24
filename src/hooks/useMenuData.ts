import { useState, useEffect, useCallback } from 'react';
import type { MenuItem, Category, SiteMenu } from '@/types/menu';
import { getDefaultMenu } from '@/data/defaultMenus';

const STORAGE_PREFIX = 'flavortable_';

const getStorageKey = (siteId: string) => `${STORAGE_PREFIX}${siteId}_menu`;

const loadMenu = (siteId: string): SiteMenu => {
  try {
    const stored = localStorage.getItem(getStorageKey(siteId));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading menu:', e);
  }
  const defaultMenu = getDefaultMenu(siteId);
  saveMenu(siteId, defaultMenu);
  return defaultMenu;
};

const saveMenu = (siteId: string, menu: SiteMenu) => {
  try {
    menu.lastModified = new Date().toISOString();
    localStorage.setItem(getStorageKey(siteId), JSON.stringify(menu));
  } catch (e) {
    console.error('Error saving menu:', e);
    alert('Warning: localStorage may be full. Try removing some images.');
  }
};

export const useMenuData = (siteId: string) => {
  const [menu, setMenu] = useState<SiteMenu>(() => loadMenu(siteId));
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    setMenu(loadMenu(siteId));
  }, [siteId]);

  const refreshMenu = useCallback(() => {
    setMenu(loadMenu(siteId));
  }, [siteId]);

  const addItem = useCallback(
    (item: Omit<MenuItem, 'id'>) => {
      const newItem: MenuItem = { ...item, id: Date.now().toString() };
      const updated = { ...menu, items: [...menu.items, newItem] };
      setMenu(updated);
      saveMenu(siteId, updated);
    },
    [menu, siteId]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<MenuItem>) => {
      const updated = {
        ...menu,
        items: menu.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      };
      setMenu(updated);
      saveMenu(siteId, updated);
    },
    [menu, siteId]
  );

  const deleteItem = useCallback(
    (id: string) => {
      const updated = { ...menu, items: menu.items.filter((item) => item.id !== id) };
      setMenu(updated);
      saveMenu(siteId, updated);
    },
    [menu, siteId]
  );

  const addCategory = useCallback(
    (name: string) => {
      const newCat: Category = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        order: menu.categories.length,
      };
      const updated = { ...menu, categories: [...menu.categories, newCat] };
      setMenu(updated);
      saveMenu(siteId, updated);
    },
    [menu, siteId]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      const updated = {
        ...menu,
        categories: menu.categories.filter((cat) => cat.id !== id),
        items: menu.items.filter((item) => item.category !== id),
      };
      setMenu(updated);
      saveMenu(siteId, updated);
    },
    [menu, siteId]
  );

  const exportMenu = useCallback(() => {
    const dataStr = JSON.stringify(menu, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${siteId}-menu.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [menu, siteId]);

  const importMenu = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (imported.categories && imported.items) {
            setMenu(imported);
            saveMenu(siteId, imported);
          }
        } catch (err) {
          alert('Invalid menu file');
        }
      };
      reader.readAsText(file);
    },
    [siteId]
  );

  const getItemsByCategory = useCallback(
    (categoryId: string) => {
      return menu.items.filter((item) => item.category === categoryId);
    },
    [menu.items]
  );

  return {
    menu,
    isAdminOpen,
    setIsAdminOpen,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    deleteCategory,
    exportMenu,
    importMenu,
    getItemsByCategory,
    refreshMenu,
  };
};
