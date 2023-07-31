import { create } from "zustand";

interface AddCompanyDialogStore {
  addCompanyDialogOpen: boolean;
  openCompanyDialog: () => void;
  closeCompanyDialog: () => void;
}

export const useAddCompanyDialog = create<AddCompanyDialogStore>((set) => ({
  addCompanyDialogOpen: false,
  openCompanyDialog: () => set(() => ({ addCompanyDialogOpen: true })),
  closeCompanyDialog: () => set(() => ({ addCompanyDialogOpen: false })),
}));
