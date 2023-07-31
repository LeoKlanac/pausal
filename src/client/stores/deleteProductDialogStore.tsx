import { create } from "zustand";

interface DeleteProductDialogStore {
  deleteProductDialogOpen: boolean;
  openProductDialog: () => void;
  closeProductDialog: () => void;
  productId: string | undefined;
  setProductId: (product: string) => void;
}

export const useDeleteProductDialog = create<DeleteProductDialogStore>(
  (set) => ({
    deleteProductDialogOpen: false,
    openProductDialog: () => set(() => ({ deleteProductDialogOpen: true })),
    closeProductDialog: () => set(() => ({ deleteProductDialogOpen: false })),
    productId: undefined,
    setProductId: (product: string) => set(() => ({ productId: product })),
  })
);
