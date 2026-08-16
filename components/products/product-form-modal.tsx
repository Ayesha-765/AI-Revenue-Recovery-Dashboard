"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/products";
import { productStatusConfig } from "@/data/products";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  status: Product["status"];
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  product?: Product | null;
  mode: "add" | "edit";
}

const emptyFormData: ProductFormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  status: "active",
};

function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  mode,
}: ProductFormModalProps) {
  const initialData = React.useMemo<ProductFormData>(() => {
    if (product && mode === "edit") {
      return {
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        imageUrl: product.imageUrl,
        status: product.status,
      };
    }
    return emptyFormData;
  }, [product, mode]);

  const [formData, setFormData] = React.useState<ProductFormData>(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required.";
    }

    const price = parseFloat(formData.price);
    if (formData.price.trim() === "") {
      newErrors.price = "Price is required.";
    } else if (isNaN(price) || price < 0) {
      newErrors.price = "Price must be a valid positive number.";
    }

    const stock = parseInt(formData.stock, 10);
    if (formData.stock.trim() === "") {
      newErrors.stock = "Stock is required.";
    } else if (isNaN(stock) || stock < 0) {
      newErrors.stock = "Stock must be a valid non-negative integer.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 400);
  };

  const handleChange = (
    field: keyof ProductFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="pr-8">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">
          {mode === "add" ? "Add Product" : "Edit Product"}
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          {mode === "add"
            ? "Create a new product for your store."
            : "Update the product details below."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
            Product Name <span className="text-[#FF5C5C]">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Wireless Headphones"
            error={errors.name}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-[#FF5C5C]">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Brief product description..."
            rows={3}
            className="w-full rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
              Price <span className="text-[#FF5C5C]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6B7280]">
                $
              </span>
              <Input
                type="text"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="0.00"
                className="pl-7"
                error={errors.price}
              />
            </div>
            {errors.price && (
              <p className="mt-1.5 text-xs text-[#FF5C5C]">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
              Stock <span className="text-[#FF5C5C]">*</span>
            </label>
            <Input
              type="text"
              value={formData.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              placeholder="0"
              error={errors.stock}
            />
            {errors.stock && (
              <p className="mt-1.5 text-xs text-[#FF5C5C]">{errors.stock}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
            Image URL
          </label>
          <Input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              handleChange("status", e.target.value as Product["status"])
            }
            className="h-11 w-full rounded-[14px] border border-[#E8ECF3] bg-white px-4 text-sm text-[#1A1A1A] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20"
          >
            {Object.entries(productStatusConfig).map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <Badge variant={productStatusConfig[formData.status].variant}>
              {productStatusConfig[formData.status].label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {mode === "add" ? "Adding..." : "Saving..."}
              </>
            ) : mode === "add" ? (
              "Add Product"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { ProductFormModal, type ProductFormData, type ProductFormModalProps };
