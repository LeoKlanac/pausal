import { create } from "zustand";

interface PickBankAccountDialogStore {
  pickBankAccountDialogOpen: boolean;
  openPickBankAccountDialog: () => void;
  closePickBankAccountDialog: () => void;
}

export const usePickBankAccountDialog = create<PickBankAccountDialogStore>(
  (set) => ({
    pickBankAccountDialogOpen: false,
    openPickBankAccountDialog: () =>
      set(() => ({ pickBankAccountDialogOpen: true })),
    closePickBankAccountDialog: () =>
      set(() => ({ pickBankAccountDialogOpen: false })),
  })
);
