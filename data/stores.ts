export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  heroTitle: string;
  heroDescription: string;
  ownerId: string;
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
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export const mockStores: Store[] = [
  {
    id: "store-1",
    name: "Fatima Fashion",
    slug: "fatima-fashion",
    description: "Trendy fashion for everyone.",
    logo: "",
    heroTitle: "Welcome to Fatima Fashion",
    heroDescription: "Discover our latest collection of stylish clothing and accessories.",
    ownerId: "user-1",
    createdAt: "2026-08-10",
  },
  {
    id: "store-2",
    name: "Tech Store",
    slug: "tech-store",
    description: "Latest tech gadgets and accessories.",
    logo: "",
    heroTitle: "Welcome to Tech Store",
    heroDescription: "Upgrade your gear with the latest tech.",
    ownerId: "user-1",
    createdAt: "2026-08-12",
  },
];

export const mockStoreProducts: Product[] = [
  {
    id: "prod-1",
    storeId: "store-1",
    name: "Classic T-Shirt",
    description: "Comfortable cotton t-shirt available in multiple colors.",
    price: 35.0,
    image: "",
    stock: 45,
    active: true,
  },
  {
    id: "prod-2",
    storeId: "store-1",
    name: "Running Shoes",
    description: "Lightweight running shoes for everyday training.",
    price: 120.0,
    image: "",
    stock: 12,
    active: true,
  },
  {
    id: "prod-3",
    storeId: "store-2",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 79.99,
    image: "",
    stock: 24,
    active: true,
  },
  {
    id: "prod-4",
    storeId: "store-2",
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard for gaming and work.",
    price: 149.99,
    image: "",
    stock: 8,
    active: true,
  },
];

export const mockOrders: Order[] = [
  {
    id: "ORD-9001",
    storeId: "store-1",
    customer: {
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "+1234567890",
      address: "123 Main St",
      city: "New York",
      postalCode: "10001",
    },
    items: [
      {
        product: mockStoreProducts[0],
        quantity: 2,
      },
    ],
    subtotal: 70.0,
    shipping: 0,
    total: 70.0,
    status: "pending",
    createdAt: "2026-08-14T10:00:00Z",
  },
];
