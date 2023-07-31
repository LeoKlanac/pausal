import { create } from "zustand";

interface AddClientDialogStore {
  addClientDialogOpen: boolean;
  openClientDialog: () => void;
  closeClientDialog: () => void;
}

export const useAddClientDialog = create<AddClientDialogStore>((set) => ({
  addClientDialogOpen: false,
  openClientDialog: () => set(() => ({ addClientDialogOpen: true })),
  closeClientDialog: () => set(() => ({ addClientDialogOpen: false })),
}));
