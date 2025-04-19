
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  dateAdded: string;
  tags: string[];
  status: 'active' | 'archived' | 'draft';
  image?: string;
  description: string;
}

// Generate random products for our demo
const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Toys'];
const statuses: ('active' | 'archived' | 'draft')[] = ['active', 'archived', 'draft'];
const tagsList = ['New', 'Sale', 'Best Seller', 'Trending', 'Limited Edition', 'Eco-Friendly', 'Handmade', 'Organic', 'Imported', 'Local'];

const generateRandomProduct = (index: number): Product => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const price = parseFloat((Math.random() * 500 + 10).toFixed(2));
  const stock = Math.floor(Math.random() * 100);
  const rating = parseFloat((Math.random() * 4 + 1).toFixed(1));
  
  // Generate random date within the last year
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * 365));
  const dateAdded = pastDate.toISOString().split('T')[0];
  
  // Generate 1-3 random tags
  const numTags = Math.floor(Math.random() * 3) + 1;
  const tags: string[] = [];
  for (let i = 0; i < numTags; i++) {
    const tag = tagsList[Math.floor(Math.random() * tagsList.length)];
    if (!tags.includes(tag)) tags.push(tag);
  }

  return {
    id: `PROD-${(index + 1).toString().padStart(4, '0')}`,
    name: `Product ${index + 1}`,
    category,
    price,
    stock,
    rating,
    dateAdded,
    tags,
    status,
    description: `This is a sample description for Product ${index + 1}. It belongs to the ${category} category.`,
  };
};

export const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => generateRandomProduct(i));
};

// Function to simulate API fetch with filtering, sorting, and pagination
export const fetchProducts = ({
  page = 1,
  pageSize = 10,
  filters = {},
  sortField = 'name',
  sortDirection = 'asc',
  searchTerm = '',
}: {
  page: number;
  pageSize: number;
  filters: Record<string, any>;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
}) => {
  // For demo purposes, we'll generate 500 products
  const allProducts = generateProducts(500);
  
  // Apply filters
  let filtered = [...allProducts];
  
  // Search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      p => p.name.toLowerCase().includes(term) || 
           p.description.toLowerCase().includes(term) || 
           p.category.toLowerCase().includes(term)
    );
  }
  
  // Status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(p => filters.status.includes(p.status));
  }
  
  // Category filter
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(p => filters.category.includes(p.category));
  }
  
  // Price range filter
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const min = filters.priceMin ?? 0;
    const max = filters.priceMax ?? Infinity;
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }
  
  // Rating filter
  if (filters.rating !== undefined) {
    filtered = filtered.filter(p => p.rating >= filters.rating);
  }
  
  // Tags filter (any match)
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(p => p.tags.some(tag => filters.tags.includes(tag)));
  }
  
  // Stock filter
  if (filters.inStock !== undefined) {
    filtered = filters.inStock ? filtered.filter(p => p.stock > 0) : filtered;
  }
  
  // Date range filter
  if (filters.dateFrom || filters.dateTo) {
    const from = filters.dateFrom ? new Date(filters.dateFrom) : new Date(0);
    const to = filters.dateTo ? new Date(filters.dateTo) : new Date();
    
    filtered = filtered.filter(p => {
      const date = new Date(p.dateAdded);
      return date >= from && date <= to;
    });
  }
  
  // Sort
  filtered.sort((a: any, b: any) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });
  
  // Calculate pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const paginatedData = filtered.slice(startIndex, endIndex);
  
  // Simulate API delay
  return new Promise<{
    data: Product[];
    pagination: { page: number; pageSize: number; total: number; totalPages: number };
  }>(resolve => {
    setTimeout(() => {
      resolve({
        data: paginatedData,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
      });
    }, 300);
  });
};

export const getAllCategories = (): string[] => {
  return categories;
};

export const getAllTags = (): string[] => {
  return tagsList;
};
