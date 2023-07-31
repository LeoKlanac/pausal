import {
  Avatar,
  Button,
  DialogTitle,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import type { Institution } from "../../../server/api/routers/banks";
import { usePickBankAccountDialog } from "../../stores/pickBankAccountDialogStore";
import { api } from "../../../utils/api";
import { useSnackbarStore } from "../../stores/globalSnackbarStore";

export default function PickBankAccountDialog({
  institutions,
}: {
  institutions: Institution[];
}) {
  const { pickBankAccountDialogOpen, closePickBankAccountDialog } =
    usePickBankAccountDialog((state) => ({
      pickBankAccountDialogOpen: state.pickBankAccountDialogOpen,
      closePickBankAccountDialog: state.closePickBankAccountDialog,
    }));
  const { showMsg, closeSnackbar } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
    closeSnackbar: state.close,
  }));
  const linkTokenMutation = api.bank.linkToken.useMutation();

  const onBankPicked = async (institutionId: string) => {
    closePickBankAccountDialog();
    showMsg("Preusmjeravamo vas na stranicu za povezivanje računa...");
    try {
      const response = await linkTokenMutation.mutateAsync({
        institutionId,
        redirectUrl: window.location.href,
      });
      window.open(response.link);
      closeSnackbar();
    } catch (error) {
      showMsg("Došlo je do pogreške");
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog
        open={pickBankAccountDialogOpen}
        onClose={closePickBankAccountDialog}
        style={{ maxHeight: "70%" }}
      >
        <DialogTitle>Odaberite svoju banku</DialogTitle>
        <DialogContent>
          <List>
            {institutions.map((institution) => {
              return (
                <ListItemButton
                  key={institution.id}
                  onClick={() => void onBankPicked(institution.id)}
                >
                  <ListItemAvatar>
                    <Avatar alt="logo banke" src={institution.logo} />
                  </ListItemAvatar>

                  <ListItemText>{institution.name}</ListItemText>
                </ListItemButton>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePickBankAccountDialog}>Odustani</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
