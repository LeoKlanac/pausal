import Modal from "@mui/material/Modal";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import React from "react";
import { api } from "../../../utils/api";
import { useDeleteClientDialog } from "../../stores/deleteClientDialogStore";
import { useSnackbarStore } from "../../stores/globalSnackbarStore";
import { useDeleteDodajRacunDialog } from "../../stores/deleteDodajRacunDialogStore";
const deleteSchema = z.object({
  invoiceId: z.string(),
});

type deleteSchema = z.infer<typeof deleteSchema>;

export function IzbrisiRacun() {
  const { openClientModal, closeClientModal, clientId } =
    useDeleteDodajRacunDialog((state) => ({
      openClientModal: state.deleteClientDialogOpen,
      closeClientModal: state.closeClientDialog,
      clientId: state.clientId,
    }));
  const { showMsg } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
  }));
  const apiContext = api.useContext();
  const deleteDodajRacunMutation = api.racuni.deleteInvoice.useMutation({
    onSuccess: () => {
      apiContext.racuni.getInvoice.invalidate();
      showMsg("Račun obrisan.");
      closeClientModal();
    },
  });
  if (clientId == undefined) {
    return <p></p>;
  }
  return (
    <Dialog open={openClientModal} onClose={closeClientModal}>
      <DialogTitle>Želite li sigurno izbrisati račun?</DialogTitle>
      <Divider sx={{ marginBottom: 1 }} />

      <DialogActions>
        <Button variant="outlined" onClick={closeClientModal}>
          ODUSTANI
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            deleteDodajRacunMutation.mutate({ invoiceId: clientId });
          }}
        >
          POTVRDI
        </Button>
      </DialogActions>
    </Dialog>
  );
}
