import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../utils/api";
import { useEditProductDialog } from "../../stores/editProductDialogStore";
import { useSnackbarStore } from "../../stores/globalSnackbarStore";
import { currencies } from "../../../utils/currencies";

const updateProductSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string(),
  description: z.string(),
  unit: z.string(),
});

type updateProductSchema = z.infer<typeof updateProductSchema>;

export default function EditProductDialog() {
  const { editProductModalOpen, closeProductModal, product } =
    useEditProductDialog((state) => ({
      editProductModalOpen: state.editProductDialogOpen,
      openProductModal: state.openProductDialog,
      closeProductModal: state.closeProductDialog,
      product: state.product,
    }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<updateProductSchema>({
    values: {
      productId: product?.userId ?? "",
      name: product?.name ?? "",
      price: product?.price ?? 0,
      currency: product?.currency ?? "",
      description: product?.description ?? "",
      unit: product?.unit ?? "",
    },
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      currency: currencies[0]?.value,
    },
  });
  const { showMsg } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
  }));

  const context = api.useContext();
  const updateProductMutation = api.products.updateProduct.useMutation({
    onSuccess: () => {
      context.products.getProducts.invalidate();
      showMsg("Predmet/Usluga ažurirani.");
      closeProductModal();
    },
  });
  const onSubmit: SubmitHandler<updateProductSchema> = (data) => {
    console.log(product?.id);
    updateProductMutation.mutate({
      name: data.name,
      price: Number(data.price),
      currency: data.currency,
      description: data.description,
      unit: data.unit,
      productId: product?.id ?? "",
    });
  };

  return (
    <Dialog open={editProductModalOpen} onClose={closeProductModal}>
      <DialogTitle>Uredi proizvod/uslugu</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              flexGrow: 1,
              paddingBottom: 1,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Naziv proizvoda *"
                  variant="outlined"
                  error={errors.name ? true : false}
                  helperText={errors.name?.message}
                  id="name"
                  type="text"
                  {...register("name")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    fullWidth
                    label="Cijena proizvoda *"
                    error={errors.price ? true : false}
                    helperText={errors.price?.message}
                    id="price"
                    type="number"
                    {...register("price", {
                      valueAsNumber: true,
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body1" color="textSecondary">
                            {currencies[0]?.label}
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mjerna jedinica *"
                  error={errors.unit ? true : false}
                  helperText={errors.unit?.message}
                  id="unit"
                  type="text"
                  {...register("unit")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  fullWidth
                  label="Opis proizvoda *"
                  error={errors.description ? true : false}
                  helperText={errors.description?.message}
                  id="description"
                  type="description"
                  {...register("description")}
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={closeProductModal} variant="outlined">
          ODUSTANI
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          AŽURIRAJ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
