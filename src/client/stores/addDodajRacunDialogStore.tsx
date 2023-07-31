import { create } from "zustand";

interface AddDodajRacunDialogStore {
  addDodajRacunDialogOpen: boolean;
  openDodajRacunDialog: () => void;
  closeDodajRacunDialog: () => void;
}

export const useAddDodajRacunDialog = create<AddDodajRacunDialogStore>(
  (set) => ({
    addDodajRacunDialogOpen: false,
    openDodajRacunDialog: () => set(() => ({ addDodajRacunDialogOpen: true })),
    closeDodajRacunDialog: () =>
      set(() => ({ addDodajRacunDialogOpen: false })),
  })
);
