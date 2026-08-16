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
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}
