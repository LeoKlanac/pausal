import * as React from "react";
import AddClientRacun from "./AddClientRacun";
import AddProductRacun from "./AddProductRacun";
import { Button, DialogActions, Paper } from "@mui/material";
import AddRacun from "./AddRacun";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import AddTotalPrice from "./AddTotalPrice";
import {
  useAddClientRacunStore,
  useInvoiceProducts,
} from "../../stores/addInvoiceStore";
import { api } from "../../../utils/api";
import { useSnackbarStore } from "../../stores/globalSnackbarStore";
import { useSelectedCompany } from "../../stores/selectedCompanyStore";
import { useDateTimeStore } from "../../stores/dateTimeStore";
import { useEditDodajRacunDialog } from "../../stores/editDodajRacunDialogStore";

export default function EditRacun() {
  const { editDodajRacunModalOpen, closeDodajRacunModal } =
    useEditDodajRacunDialog((state) => ({
      editDodajRacunModalOpen: state.editDodajRacunDialogOpen,
      openDodajRacunModal: state.openDodajRacunDialog,
      closeDodajRacunModal: state.closeDodajRacunDialog,
    }));
  const { showMsg } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
  }));

  const apiContext = api.useContext();

  const updateInvoiceMutation = api.racuni.updateInvoice.useMutation({
    onSuccess: () => {
      apiContext.racuni.getInvoice.invalidate();
      showMsg("Dodali ste račun.");
      closeDodajRacunModal();
    },
    onError: (error) => {
      console.error(error);
      showMsg("Došlo je do greške prilikom dodavanja računa.");
      console.log(error);
    },
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const { racunId } = useEditDodajRacunDialog.getState();
    if (!racunId) {
      console.log("Nema racuna");
      return;
    }
    const clients = useAddClientRacunStore.getState().selectedClient;
    const products = useInvoiceProducts.getState().products;
    const company = useSelectedCompany.getState().company;
    const datumRacuna = useDateTimeStore.getState().datumRacuna;
    const datumDospijeca = useDateTimeStore.getState().datumDospijeca;
    const datumIsporuke = useDateTimeStore.getState().datumIsporuke;
    const brojRacuna = useDateTimeStore.getState().brojRacuna;

    updateInvoiceMutation.mutate({
      id: racunId ?? "",
      companyId: company?.id ?? "",
      clientId: clients?.id ?? "",
      brojRacuna: brojRacuna,
      datumRacuna: datumRacuna.toDate(),
      datumDospijeca: datumDospijeca.toDate(),
      datumIsporuke: datumIsporuke.toDate(),
      invoiceItem: products.map((product) => ({
        naziv: product.name,
        kolicina: product.qty,
        cijena: product.price,
        popust: product.discount,
        opis: product.description,
        mjernaJedinica: product.unit,
      })),
    });
  };
  const resetValues = () => {
    useAddClientRacunStore.getState().reset();
    useInvoiceProducts.getState().reset();
    useDateTimeStore.getState().setBrojRacuna("");
    useDateTimeStore.getState().setDatumRacuna(dayjs(new Date()));
    useDateTimeStore
      .getState()
      .setDatumDospijeca(dayjs(new Date()).add(10, "day"));

    useDateTimeStore.getState().setDatumIsporuke(dayjs(new Date()));
  };

  return (
    <Dialog open={editDodajRacunModalOpen} onClose={closeDodajRacunModal}>
      <form onSubmit={onSubmit}>
        <div style={{}}>
          <Paper
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "calc(100vw - 50px)",
              height: "calc(100vh - 50px)",
              maxWidth: 750,
              maxHeight: 923,
              overflow: "auto",
              padding: "1rem",
              backgroundColor: "#fff",
            }}
          >
            <AddRacun />
            <AddClientRacun />
            <AddProductRacun />
            <AddTotalPrice />
            <DialogActions sx={{ marginTop: 2 }}>
              <Button variant="outlined" type="reset" onClick={resetValues}>
                ODUSTANI
              </Button>
              <Button variant="contained" type="submit">
                DODAJ
              </Button>
            </DialogActions>
          </Paper>
        </div>
      </form>
    </Dialog>
  );
}

// DodajRacun.getLayout = function getLayout(page: React.ReactElement) {
//   return <Layout title={"Računi"}>{page}</Layout>;
// };
