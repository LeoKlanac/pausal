import * as React from "react";
import Box from "@mui/material/Box";
import { Layout } from "../../layout/layout";
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
import { z } from "zod";
import { useSnackbarStore } from "../../stores/globalSnackbarStore";
import { useSelectedCompany } from "../../stores/selectedCompanyStore";
import { useDateTimeStore } from "../../stores/dateTimeStore";
import { useAddDodajRacunDialog } from "../../stores/addDodajRacunDialogStore";

export default function DodajRacun() {
  const { addDodajRacunModalOpen, closeDodajRacunModal } =
    useAddDodajRacunDialog((state) => ({
      addDodajRacunModalOpen: state.addDodajRacunDialogOpen,
      openDodajRacunModal: state.openDodajRacunDialog,
      closeDodajRacunModal: state.closeDodajRacunDialog,
    }));
  const { showMsg } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
  }));

  const apiContext = api.useContext();

  const createInvoiceMutation = api.racuni.createInvoice.useMutation({
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
    const client = useAddClientRacunStore.getState().selectedClient;
    if (!client) {
      console.log("Nema klijenta");
      return;
    }
    const products = useInvoiceProducts.getState().products;
    const company = useSelectedCompany.getState().company;
    const datumRacuna = useDateTimeStore.getState().datumRacuna;
    const datumDospijeca = useDateTimeStore.getState().datumDospijeca;
    const datumIsporuke = useDateTimeStore.getState().datumIsporuke;
    const brojRacuna = useDateTimeStore.getState().brojRacuna;
    createInvoiceMutation.mutate({
      companyId: company?.id ?? "",
      clientId: client.id,
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
    <Dialog open={addDodajRacunModalOpen} onClose={closeDodajRacunModal}>
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
              maxWidth: 1000,
              maxHeight: 1000,
              overflow: "auto",
              padding: "0.5rem",
              backgroundColor: "#fff",
            }}
          >
            <AddRacun />
            <AddClientRacun />
            <AddProductRacun />
            <DialogActions sx={{ marginTop: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  marginLeft: 5,
                }}
              >
                <AddTotalPrice />
              </Box>
              <Box sx={{ marginLeft: "auto" }}>
                <Button
                  sx={{ marginRight: 1 }}
                  variant="outlined"
                  type="reset"
                  onClick={resetValues}
                >
                  ODUSTANI
                </Button>
                <Button
                  sx={{ marginRight: 5 }}
                  variant="contained"
                  type="submit"
                >
                  DODAJ
                </Button>
              </Box>
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
