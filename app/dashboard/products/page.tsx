"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductTable, ProductFormModal, DeleteProductModal } from "@/components/products";
import type { Product } from "@/data/products";
import type { ProductFormData } from "@/components/products/product-form-modal";
import { Plus, Store as StoreIcon, Loader2 } from "lucide-react";
import { fetchStoreByOwnerId } from "@/lib/supabase/stores";
import { fetchProductsByStore, createProduct, updateProduct, deleteProduct } from "@/lib/supabase/products";
import { supabase } from "@/lib/supabase/client";

function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [storeId, setStoreId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const { data: sessionData } = await supabase.auth.getUser();
        const userId = sessionData.user?.id;
        if (!userId || !mounted) return;

        const userStore = await fetchStoreByOwnerId(userId);
        if (!mounted) return;

        if (userStore) {
          setStoreId(userStore.id);
          const storeProducts = await fetchProductsByStore(userStore.id);
          if (mounted) {
            setProducts(storeProducts);
          }
        }
      } catch {
        // ignore
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

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

  const handleFormSubmit = async (data: ProductFormData) => {
    if (!storeId) return;
    setError(null);

    const price = parseFloat(data.price);
    const stock = parseInt(data.stock, 10);
    const active = data.status === "active";

    if (editingProduct) {
      const result = await updateProduct(editingProduct.id, {
        name: data.name,
        description: data.description,
        price,
        image: data.imageUrl,
        stock,
        active,
      });

      if (result.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  name: data.name,
                  description: data.description,
                  price,
                  stock,
                  imageUrl: data.imageUrl,
                  status: data.status,
                }
              : p
          )
        );
        setIsFormOpen(false);
        setEditingProduct(null);
      } else {
        setError(result.error || "Failed to update product.");
      }
    } else {
      const result = await createProduct({
        store_id: storeId,
        name: data.name,
        description: data.description,
        price,
        image: data.imageUrl,
        stock,
        active,
      });

      if (result.success && result.product) {
        setProducts((prev) => [result.product!, ...prev]);
        setIsFormOpen(false);
        setEditingProduct(null);
      } else {
        setError(result.error || "Failed to create product.");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setError(null);

    const result = await deleteProduct(deletingProduct.id);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setIsDeleteOpen(false);
      setDeletingProduct(null);
    } else {
      setError(result.error || "Failed to delete product.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C5CFC]" />
      </div>
    );
  }

  if (!storeId) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Manage your product catalog, pricing, and inventory.
          </p>
        </div>
        <Card padding="default" className="text-center py-12">
          <StoreIcon className="mx-auto h-12 w-12 text-[#6B7280] mb-4" />
          <h3 className="text-lg font-semibold text-[#1A1A1A]">No store found</h3>
          <p className="mt-2 text-sm text-[#6B7280] max-w-sm mx-auto">
            You need to create a store before adding products. Go to the Store page to get started.
          </p>
          <a
            href="/dashboard/store"
            className="mt-6 inline-flex items-center justify-center rounded-[14px] bg-[#7C5CFC] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#6B4BE0] hover:shadow-md transition-all duration-200"
          >
            Create Your Store
          </a>
        </Card>
      </div>
    );
  }

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

      {error && (
        <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
          {error}
        </div>
      )}

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

export { ProductsPage };
export default ProductsPage;
