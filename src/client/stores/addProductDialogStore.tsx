import { create } from "zustand";

interface AddProductDialogStore {
  AddProductDialogOpen: boolean;
  openClientDialog: () => void;
  closeClientDialog: () => void;
}

export const useAddProductDialog = create<AddProductDialogStore>((set) => ({
  AddProductDialogOpen: false,
  openClientDialog: () => set(() => ({ AddProductDialogOpen: true })),
  closeClientDialog: () => set(() => ({ AddProductDialogOpen: false })),
}));
