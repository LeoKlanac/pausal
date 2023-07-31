import { create } from "zustand";
import { RouterOutputs } from "../../utils/api";

interface DeleteClientDialogStore {
  deleteClientDialogOpen: boolean;
  openClientDialog: () => void;
  closeClientDialog: () => void;
  clientId: string | undefined;
  setClientId: (klijent: string) => void;
}

export const useDeleteClientDialog = create<DeleteClientDialogStore>((set) => ({
  deleteClientDialogOpen: false,
  openClientDialog: () => set(() => ({ deleteClientDialogOpen: true })),
  closeClientDialog: () => set(() => ({ deleteClientDialogOpen: false })),
  clientId: undefined,
  setClientId: (klijent: string) => set(() => ({ clientId: klijent })),
}));
