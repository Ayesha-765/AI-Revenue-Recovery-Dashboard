export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: "active" | "draft" | "archived";
}

export const productStatusConfig: Record<
  Product["status"],
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "danger" }
> = {
  active: { label: "Active", variant: "success" },
  draft: { label: "Draft", variant: "secondary" },
  archived: { label: "Archived", variant: "secondary" },
};
