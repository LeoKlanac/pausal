import { create } from "zustand";
import { RouterOutputs } from "../../utils/api";

type ProizvodIUsluge = RouterOutputs["products"]["getProducts"];
type ProizvodIUsluga = ProizvodIUsluge[0];

interface EditProductDialogStore {
  editProductDialogOpen: boolean;
  openProductDialog: () => void;
  closeProductDialog: () => void;
  product: ProizvodIUsluga | undefined;
  setProduct: (proizvodIIUsluga: ProizvodIUsluga) => void;
}

export const useEditProductDialog = create<EditProductDialogStore>((set) => ({
  editProductDialogOpen: false,
  openProductDialog: () => set(() => ({ editProductDialogOpen: true })),
  closeProductDialog: () => set(() => ({ editProductDialogOpen: false })),
  product: undefined,
  setProduct: (proizvodIUsluga: ProizvodIUsluga) =>
    set(() => ({ product: proizvodIUsluga })),
}));
