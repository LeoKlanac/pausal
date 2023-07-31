import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  DialogContent,
  Dialog,
  MenuItem,
  DialogActions,
  Box,
  Grid,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  Input,
  Typography,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../utils/api";
import { useAddProductDialog } from "../../stores/addProductDialogStore";
import { useSnackbarStore } from "../../stores/globalSnackbarStore";
import { currencies } from "../../../utils/currencies";

const AddProductSchema = z.object({
  name: z.string().min(1, { message: "Potreban je naziv prozivoda." }),
  price: z.number().min(1, { message: "Potrebna je cijena proizvoda." }),
  currency: z.string().min(1, { message: "Odaberi valutu." }),
  description: z.string().min(1, { message: "Unesi opis proizvoda." }),
  unit: z.string().min(1, { message: "Unesi mjernu jedinicu." }),
});

type AddProductSchema = z.infer<typeof AddProductSchema>;

export function FinishProductContent() {
  const { closeClientModal } = useAddProductDialog((state) => ({
    closeClientModal: state.closeClientDialog,
  }));
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductSchema>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      currency: currencies[0]?.value,
    },
  });
  const { showMsg } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
  }));
  const apiContex = api.useContext();

  const createProductMutation = api.products.createProduct.useMutation({
    onSuccess: () => {
      apiContex.products.getProducts.invalidate();
      showMsg("Dodali ste Proizvod/Uslugu.");
      closeClientModal();
    },
  });
  const onSubmit: SubmitHandler<AddProductSchema> = (data) => {
    createProductMutation.mutate({
      name: data.name,
      price: Number(data.price),
      currency: "",
      description: data.description,
      unit: data.unit,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ flexGrow: 1 }}>
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
              fullWidth
              multiline
              label="Opis proizvoda *"
              error={errors.description ? true : false}
              helperText={errors.description?.message}
              id="description"
              type="description"
              {...register("description")}
            />
          </Grid>

          <Grid item xs={12}>
            <Button sx={{ float: "right" }} variant="contained" type="submit">
              AŽURIRAJ
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}

export default function AddProductDialog() {
  const { addClientModalOpen, closeClientModal } = useAddProductDialog(
    (state) => ({
      addClientModalOpen: state.AddProductDialogOpen,
      openClientModal: state.openClientDialog,
      closeClientModal: state.closeClientDialog,
    })
  );

  return (
    <Dialog open={addClientModalOpen} onClose={closeClientModal}>
      <DialogContent>
        <FinishProductContent />
      </DialogContent>
    </Dialog>
  );
}
