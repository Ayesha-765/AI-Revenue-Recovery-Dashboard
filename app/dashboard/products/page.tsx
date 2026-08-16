"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ProductTable, ProductFormModal, DeleteProductModal } from "@/components/products";
import type { Product } from "@/data/products";
import type { ProductFormData } from "@/components/products/product-form-modal";
import { mockProducts } from "@/data/products";
import { Plus } from "lucide-react";

function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(null);

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                stock: parseInt(data.stock, 10),
                imageUrl: data.imageUrl,
                status: data.status,
              }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
        imageUrl: data.imageUrl,
        status: data.status,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setIsDeleteOpen(false);
      setDeletingProduct(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Manage your product catalog, pricing, and inventory.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <ProductTable
        products={filteredProducts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductFormModal
        key={isFormOpen ? "form-open" : "form-closed"}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        mode={editingProduct ? "edit" : "add"}
      />

      <DeleteProductModal
        key={isDeleteOpen ? "delete-open" : "delete-closed"}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
        product={deletingProduct}
      />
    </div>
  );
}

export default ProductsPage;
