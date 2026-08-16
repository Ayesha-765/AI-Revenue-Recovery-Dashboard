export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: "active" | "draft" | "archived";
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 79.99,
    stock: 24,
    imageUrl: "",
    status: "active",
  },
  {
    id: "2",
    name: "Running Shoes",
    description: "Lightweight running shoes for everyday training.",
    price: 120.0,
    stock: 12,
    imageUrl: "",
    status: "active",
  },
  {
    id: "3",
    name: "Classic T-Shirt",
    description: "Comfortable cotton t-shirt available in multiple colors.",
    price: 35.0,
    stock: 45,
    imageUrl: "",
    status: "draft",
  },
];

export const productStatusConfig: Record<
  Product["status"],
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "danger" }
> = {
  active: { label: "Active", variant: "success" },
  draft: { label: "Draft", variant: "secondary" },
  archived: { label: "Archived", variant: "secondary" },
};
