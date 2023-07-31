import { create } from "zustand";
import { RouterOutputs } from "../../utils/api";

type Klijenti = RouterOutputs["clients"]["getClients"];
type Klijent = Klijenti[0];

interface EditClientDialogStore {
  editClientDialogOpen: boolean;
  openClientDialog: () => void;
  closeClientDialog: () => void;
  client: Klijent | undefined;
  setClient: (klijent: Klijent) => void;
}

export const useEditClientDialog = create<EditClientDialogStore>((set) => ({
  editClientDialogOpen: false,
  openClientDialog: () => set(() => ({ editClientDialogOpen: true })),
  closeClientDialog: () => set(() => ({ editClientDialogOpen: false })),
  client: undefined,
  setClient: (klijent: Klijent) => set(() => ({ client: klijent })),
}));
