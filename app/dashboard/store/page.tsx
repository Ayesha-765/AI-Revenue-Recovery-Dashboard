"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StoreFormModal } from "@/components/store/store-form-modal";
import { mockStores } from "@/data/stores";
import { Plus, ExternalLink, Store as StoreIcon } from "lucide-react";

function DashboardStorePage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [stores, setStores] = React.useState(mockStores);

  const handleCreateStore = (data: { name: string; slug: string }) => {
    const newStore = {
      id: `store-${Date.now()}`,
      name: data.name,
      slug: data.slug,
      description: "",
      logo: "",
      heroTitle: `Welcome to ${data.name}`,
      heroDescription: "",
      ownerId: "current-user",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setStores((prev) => [newStore, ...prev]);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Store</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Create and manage your online store.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Store
        </Button>
      </div>

      {stores.length === 0 ? (
        <Card padding="default" className="text-center py-12">
          <StoreIcon className="mx-auto h-12 w-12 text-[#6B7280] mb-4" />
          <h3 className="text-lg font-semibold text-[#1A1A1A]">No stores yet</h3>
          <p className="mt-2 text-sm text-[#6B7280] max-w-sm mx-auto">
            Create your first store to start selling products online.
          </p>
          <Button className="mt-6" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Store
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Card key={store.id} hoverable padding="default" className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                {store.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="h-10 w-10 rounded-[10px] object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#7C5CFC] text-sm font-bold text-white">
                    {store.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-[#1A1A1A]">{store.name}</h3>
                  <p className="text-xs text-[#6B7280]">/{store.slug}</p>
                </div>
              </div>
              <p className="text-sm text-[#6B7280] flex-1 line-clamp-2">
                {store.description || "No description"}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={`/store/${store.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Store
                  </Button>
                </a>
                <Button variant="secondary" size="sm">Edit</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <StoreFormModal
        key={isFormOpen ? "open" : "closed"}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateStore}
        mode="create"
      />
    </div>
  );
}

export { DashboardStorePage };
export default DashboardStorePage;
