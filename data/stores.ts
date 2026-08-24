export interface Store {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo: string;
  slug: string;
  heroTitle: string;
  heroDescription: string;
  published: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  storeId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
}

export const mockStores: Store[] = [
  {
    id: "store-1",
    ownerId: "owner-1",
    name: "Fatima Fashion",
    description: "Discover the latest fashion trends at Fatima Fashion.",
    logo: "",
    slug: "fatima-fashion",
    heroTitle: "Welcome to Fatima Fashion",
    heroDescription: "Discover our latest collection of trendy clothing and accessories.",
    published: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "store-2",
    ownerId: "owner-2",
    name: "Tech Store",
    description: "Your one-stop shop for the latest gadgets and electronics.",
    logo: "",
    slug: "tech-store",
    heroTitle: "Welcome to Tech Store",
    heroDescription: "Explore cutting-edge electronics and accessories.",
    published: true,
    createdAt: "2024-01-02T00:00:00Z",
  },
];

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    storeId: "store-1",
    name: "T-Shirt",
    description: "Comfortable cotton t-shirt.",
    price: 25,
    image: "",
    stock: 100,
    active: true,
  },
  {
    id: "prod-2",
    storeId: "store-1",
    name: "Shoes",
    description: "Stylish running shoes.",
    price: 80,
    image: "",
    stock: 50,
    active: true,
  },
  {
    id: "prod-3",
    storeId: "store-1",
    name: "Hoodie",
    description: "Warm and cozy hoodie.",
    price: 45,
    image: "",
    stock: 30,
    active: true,
  },
  {
    id: "prod-4",
    storeId: "store-2",
    name: "Headphones",
    description: "Wireless noise-cancelling headphones.",
    price: 120,
    image: "",
    stock: 20,
    active: true,
  },
  {
    id: "prod-5",
    storeId: "store-2",
    name: "Keyboard",
    description: "Mechanical gaming keyboard.",
    price: 90,
    image: "",
    stock: 15,
    active: true,
  },
  {
    id: "prod-6",
    storeId: "store-2",
    name: "Mouse",
    description: "Ergonomic wireless mouse.",
    price: 40,
    image: "",
    stock: 25,
    active: true,
  },
];

export function getStore(slug: string): Store | null {
  return mockStores.find((store) => store.slug === slug) ?? null;
}

export function getStoreProducts(storeId: string): Product[] {
  return mockProducts.filter((product) => product.storeId === storeId && product.active);
}

export function getProduct(storeId: string, productId: string): Product | null {
  return mockProducts.find((product) => product.storeId === storeId && product.id === productId) ?? null;
}
