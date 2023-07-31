import { Button, Snackbar } from "@mui/material";
import { useSnackbarStore } from "../stores/globalSnackbarStore";

const ActionForSnack = () => {
  const close = useSnackbarStore((state) => state.close);

  return (
    <>
      <Button onClick={close}>Ok</Button>
    </>
  );
};

export const GlobalSnackbar = () => {
  const { opened, message, close } = useSnackbarStore((state) => ({
    opened: state.opened,
    message: state.message,
    close: state.close,
  }));

  return (
    <Snackbar
      open={opened}
      autoHideDuration={3000}
      message={message}
      action={<ActionForSnack />}
      onClose={close}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    />
  );
};
