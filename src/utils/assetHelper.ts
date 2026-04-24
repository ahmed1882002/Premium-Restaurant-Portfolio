export const getAssetPath = (path: string) => {
  if (!path) return '';
  
  // If the path is already an external URL, return it
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  // Remove leading slash if it exists
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Get the base path from Vite's environment
  const base = import.meta.env.BASE_URL || '/';
  
  // Ensure base ends with a slash and combine
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  
  return `${normalizedBase}${cleanPath}`;
};
