import { create } from "zustand";
import { RouterOutputs } from "../../utils/api";
import { devtools } from "zustand/middleware";
import { useDateTimeStore } from "./dateTimeStore";
import dayjs from "dayjs";
import { useAddClientRacunStore, useInvoiceProducts } from "./addInvoiceStore";
import { useAddProductDialog } from "./addProductDialogStore";

type Racuni = RouterOutputs["racuni"]["getInvoice"];
type Racun = Racuni[0];

interface EditDodajRacunDialogStore {
  editDodajRacunDialogOpen: boolean;
  openDodajRacunDialog: (racun: Racun) => void;
  closeDodajRacunDialog: () => void;
  racunId?: string;
}

export const useEditDodajRacunDialog = create<EditDodajRacunDialogStore>()(
  devtools(
    (set) => ({
      editDodajRacunDialogOpen: false,
      openDodajRacunDialog: (racun: Racun) =>
        set(() => {
          useDateTimeStore.setState({
            brojRacuna: racun.brojRacuna,
            datumIsporuke: dayjs(racun.datumIsporuke),
            datumDospijeca: dayjs(racun.datumDospijeca),
            datumRacuna: dayjs(racun.datumRacuna),
          });
          useAddClientRacunStore.setState({
            selectedClient: racun.client,
          });
          useInvoiceProducts.setState({
            products: racun.InvoiceItem.map((item) => ({
              id: racun.brojRacuna,
              qty: item.kolicina,
              discount: item.popust,
              userId: racun.userId,
              name: item.naziv,
              unit: item.mjernaJedinica,
              price: item.cijena,
              description: item.opis,
              currency: "",
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          });
          return {
            racunId: racun.id,
            editDodajRacunDialogOpen: true,
          };
        }),
      closeDodajRacunDialog: () =>
        set(() => ({ editDodajRacunDialogOpen: false })),
      racun: undefined,
      racunId: undefined,
    }),
    {
      name: "edit-dodaj-racun-dialog-store",
    }
  )
);
