"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
}

function DeleteProductModal({
  isOpen,
  onClose,
  onConfirm,
  product,
}: DeleteProductModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleClose = () => {
    setIsDeleting(false);
    onClose();
  };

  const handleConfirm = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onConfirm();
      setIsDeleting(false);
    }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF5C5C]/10">
          <svg
            className="h-6 w-6 text-[#FF5C5C]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Delete Product?</h2>
        <p className="mt-2 text-sm text-[#6B7280]">
          Are you sure you want to delete{" "}
          <span className="font-medium text-[#1A1A1A]">
            &ldquo;{product?.name ?? "this product"}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </Modal>
  );
}

export { DeleteProductModal, type DeleteProductModalProps };
