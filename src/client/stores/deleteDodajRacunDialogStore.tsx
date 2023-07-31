import { create } from "zustand";
import { RouterOutputs } from "../../utils/api";

interface DeleteDodajRacunDialogStore {
  deleteClientDialogOpen: boolean;
  openClientDialog: () => void;
  closeClientDialog: () => void;
  clientId: string | undefined;
  setClientId: (klijent: string) => void;
}

export const useDeleteDodajRacunDialog = create<DeleteDodajRacunDialogStore>(
  (set) => ({
    deleteClientDialogOpen: false,
    openClientDialog: () => set(() => ({ deleteClientDialogOpen: true })),
    closeClientDialog: () => set(() => ({ deleteClientDialogOpen: false })),
    clientId: undefined,
    setClientId: (klijent: string) => set(() => ({ clientId: klijent })),
  })
);
