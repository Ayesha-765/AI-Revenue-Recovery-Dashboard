"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StoreFormModal } from "@/components/store/store-form-modal";
import { fetchStoreByOwnerId, createStore, updateStore, type Store } from "@/lib/supabase/stores";
import { Plus, ExternalLink, Store as StoreIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

function DashboardStorePage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [store, setStore] = React.useState<Store | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadStore() {
      try {
        const { data: sessionData } = await supabase.auth.getUser();
        const userId = sessionData.user?.id;
        if (!userId || !mounted) return;

        const userStore = await fetchStoreByOwnerId(userId);
        if (mounted && userStore) {
          setStore(userStore);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadStore();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateStore = async (data: { name: string; slug: string; description: string; logo: string; heroTitle: string; heroDescription: string; published: boolean }) => {
    setError(null);

    const { data: sessionData } = await supabase.auth.getUser();
    const userId = sessionData.user?.id;
    if (!userId) {
      setError("You must be logged in to create a store.");
      return;
    }

    const result = await createStore({
      owner_id: userId,
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      logo: data.logo || undefined,
      hero_title: data.heroTitle || undefined,
      hero_description: data.heroDescription || undefined,
      published: data.published,
    });

    if (result.success && result.store) {
      setStore(result.store);
      setIsFormOpen(false);
    } else {
      setError(result.error || "Failed to create store.");
    }
  };

  const handleUpdateStore = async (data: { name: string; slug: string; description: string; logo: string; heroTitle: string; heroDescription: string; published: boolean }) => {
    if (!store) return;
    setError(null);

    const result = await updateStore(store.id, {
      name: data.name,
      slug: data.slug,
      description: data.description,
      logo: data.logo,
      heroTitle: data.heroTitle,
      heroDescription: data.heroDescription,
      published: data.published,
    });

    if (result.success) {
      setStore((prev) =>
        prev
          ? {
              ...prev,
              name: data.name,
              slug: data.slug,
              description: data.description,
              logo: data.logo,
              heroTitle: data.heroTitle,
              heroDescription: data.heroDescription,
              published: data.published,
            }
          : prev
      );
      setIsFormOpen(false);
    } else {
      setError(result.error || "Failed to update store.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C5CFC]" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Store</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Create and manage your online store.
          </p>
        </div>
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Store</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Manage your online store.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              if (!store.published) {
                const result = await updateStore(store.id, { published: true });
                if (result.success) {
                  setStore((prev) => prev ? { ...prev, published: true } : prev);
                  window.open(`/store/${store.slug}`, "_blank", "noopener,noreferrer");
                } else {
                  setError(result.error || "Failed to publish store.");
                }
              } else {
                window.open(`/store/${store.slug}`, "_blank", "noopener,noreferrer");
              }
            }}
            className="inline-flex items-center justify-center rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {store.published ? "View Store" : "Publish & View Store"}
          </button>
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            Edit Store
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
          {error}
        </div>
      )}

      <Card padding="default" className="max-w-2xl">
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
        <p className="text-sm text-[#6B7280] mb-4">{store.description || "No description"}</p>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-[10px] px-2.5 py-0.5 text-xs font-medium ${
            store.published
              ? "bg-[#00C48C]/10 text-[#00C48C]"
              : "bg-[#FFB800]/10 text-[#D4A000]"
          }`}>
            {store.published ? "Published" : "Draft"}
          </span>
          <span className="text-xs text-[#6B7280]">
            Created {new Date(store.createdAt).toLocaleDateString()}
          </span>
        </div>
      </Card>

      <StoreFormModal
        key={isFormOpen ? "open" : "closed"}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleUpdateStore}
        store={store}
        mode="edit"
      />
    </div>
  );
}

export { DashboardStorePage };
export default DashboardStorePage;
