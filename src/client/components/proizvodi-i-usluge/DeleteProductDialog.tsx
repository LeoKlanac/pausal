import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Modal,
} from "@mui/material";
import { z } from "zod";
import { api } from "../../../utils/api";
import { useDeleteProductDialog } from "../../stores/deleteProductDialogStore";
import { useSnackbarStore } from "../../stores/globalSnackbarStore";

const deleteProductSchema = z.object({
  productId: z.string(),
});

type deleteProductSchema = z.infer<typeof deleteProductSchema>;

export function DeleteProductDialog() {
  const { openProductModal, closeProductModal, productId } =
    useDeleteProductDialog((state) => ({
      openProductModal: state.deleteProductDialogOpen,
      closeProductModal: state.closeProductDialog,
      productId: state.productId,
    }));
  const { showMsg } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
  }));
  api;
  const apiContext = api.useContext();
  const deleteProductMutation = api.products.deleteProduct.useMutation({
    onSuccess: () => {
      apiContext.products.getProducts.invalidate();
      showMsg("Proizvod/usluga obrisani.");
      closeProductModal();
    },
  });
  if (productId == undefined) {
    return <p></p>;
  }
  return (
    <Dialog open={openProductModal} onClose={closeProductModal}>
      <DialogTitle>Želite li sigurno izbrisati proizvod/uslugu?</DialogTitle>
      <Divider sx={{ marginBottom: 1 }} />

      <DialogActions>
        <Button variant="outlined" onClick={closeProductModal}>
          Odustani
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            deleteProductMutation.mutate({ productId: productId });
          }}
        >
          Potvrdi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
