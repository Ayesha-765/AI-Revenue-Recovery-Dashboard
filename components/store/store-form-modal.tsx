"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Store } from "@/data/stores";

interface StoreFormData {
  name: string;
  description: string;
  logo: string;
  slug: string;
  heroTitle: string;
  heroDescription: string;
  published: boolean;
}

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StoreFormData) => void;
  store?: Store | null;
  mode: "create" | "edit";
}

const emptyFormData: StoreFormData = {
  name: "",
  description: "",
  logo: "",
  slug: "",
  heroTitle: "",
  heroDescription: "",
  published: false,
};

function StoreFormModal({
  isOpen,
  onClose,
  onSubmit,
  store,
  mode,
}: StoreFormModalProps) {
  const [formData, setFormData] = React.useState<StoreFormData>(() => {
    if (store && mode === "edit") {
      return {
        name: store.name,
        description: store.description,
        logo: store.logo,
        slug: store.slug,
        heroTitle: store.heroTitle,
        heroDescription: store.heroDescription,
        published: store.published,
      };
    }
    return emptyFormData;
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
      heroTitle: prev.heroTitle || `Welcome to ${value}`,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Store name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A]">
          {mode === "create" ? "Create Store" : "Edit Store"}
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          {mode === "create"
            ? "Set up your online store in a few steps."
            : "Update your store details."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="rounded-[14px] border border-[#7C5CFC]/10 bg-[#7C5CFC]/5 px-4 py-3 text-sm text-[#7C5CFC]">
          Each account can create only one store. You can update your store details anytime after creation.
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Store Name</label>
          <Input
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Fatima Fashion"
            error={errors.name}
          />
          {errors.name && <p className="mt-1.5 text-xs text-[#FF5C5C]">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Store Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of your store..."
            rows={3}
            className="w-full rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20 resize-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Store Logo URL</label>
          <Input
            value={formData.logo}
            onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Store Slug</label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="my-store"
            error={errors.slug}
          />
          {errors.slug && <p className="mt-1.5 text-xs text-[#FF5C5C]">{errors.slug}</p>}
          <p className="mt-1 text-xs text-[#6B7280]">
            This will be your public store URL: /store/{formData.slug || "your-slug"}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Hero Title</label>
          <Input
            value={formData.heroTitle}
            onChange={(e) => setFormData((prev) => ({ ...prev, heroTitle: e.target.value }))}
            placeholder="Welcome to My Store"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Hero Description</label>
          <textarea
            value={formData.heroDescription}
            onChange={(e) => setFormData((prev) => ({ ...prev, heroDescription: e.target.value }))}
            placeholder="Discover our latest collection..."
            rows={2}
            className="w-full rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20 resize-none"
          />
        </div>

        <div className="flex items-center justify-between rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[#1A1A1A]">Publish Store</p>
            <p className="text-xs text-[#6B7280]">
              {formData.published
                ? "Your store is visible to the public."
                : "Your store is private and only visible to you."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, published: !prev.published }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.published ? "bg-[#00C48C]" : "bg-[#E8ECF3]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.published ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Create Store" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { StoreFormModal, type StoreFormData, type StoreFormModalProps };
