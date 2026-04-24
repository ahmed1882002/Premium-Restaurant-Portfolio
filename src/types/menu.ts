export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface SiteMenu {
  categories: Category[];
  items: MenuItem[];
  lastModified: string;
}

export interface SiteConfig {
  id: string;
  name: string;
  type: 'restaurant' | 'cafe';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    cardBg: string;
  };
  heroImage: string;
  description: string;
}
