import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, DialogTitle, Grid, TextField } from "@mui/material";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../utils/api";
import { useAddClientDialog } from "../../stores/addClientDialogStore";
import { useSnackbarStore } from "../../stores/globalSnackbarStore";
import { GradAutoComplete } from "../GradAutoComplete";
import { Location } from "@prisma/client";
const validationSchema = z.object({
  name: z.string().min(1, { message: "Potreban je naziv klijenta" }),
  email: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().min(1, { message: "Potreban je naziv države." }),
  address: z.string().min(1, { message: "Potrebna je adresa" }),
  zip: z.string().min(1, { message: "Potreban je ZIP" }),
  oib: z.string().min(1, { message: "Potreban je OIB" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function AddClientDialog() {
  const { addClientModalOpen, closeClientModal } = useAddClientDialog(
    (state) => ({
      addClientModalOpen: state.addClientDialogOpen,
      openClientModal: state.openClientDialog,
      closeClientModal: state.closeClientDialog,
    })
  );
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const { showMsg } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
  }));
  const apiContex = api.useContext();

  const createClientMutation = api.clients.createClient.useMutation({
    onSuccess: () => {
      apiContex.clients.getClients.invalidate();
      showMsg("Dodali ste Klijenta.");
      closeClientModal();
    },
  });
  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    if (selectedLocation === null) return;
    createClientMutation.mutate({
      address: data.address,
      name: data.name,
      email: data.email,
      phone: data.phone,
      city:
        typeof selectedLocation === "string"
          ? selectedLocation
          : selectedLocation.name,
      country: data.country,
      zip: data.zip,
      oib: data.oib,
    });
  };
  const [selectedLocation, setSelectedLocationQuery] = React.useState<
    Location | string | null
  >("");
  const onLocationZipPicked = (location: Location | string | null) => {
    setSelectedLocationQuery(location);
    if (location !== null && typeof location === "object") {
      setValue("zip", location.zip);
    }
  };
  return (
    <Dialog open={addClientModalOpen} onClose={closeClientModal}>
      <DialogTitle>Dodaj klijenta</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Naziv klijenta *"
                  variant="outlined"
                  error={errors.name ? true : false}
                  helperText={errors.name?.message}
                  id="name"
                  type="text"
                  {...register("name")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="OIB *"
                  error={errors.oib ? true : false}
                  helperText={errors.oib?.message}
                  id="oib"
                  type="oib"
                  {...register("oib")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <GradAutoComplete
                  onLocationPicked={onLocationZipPicked}
                  selectedLocation={selectedLocation}
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  label="Grad"
                  error={errors.city ? true : false}
                  helperText={errors.city?.message}
                  {...register("city")}
                  fullWidth
                />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Poštanski broj "
                  InputLabelProps={{ shrink: !!watch("zip") }}
                  error={errors.zip ? true : false}
                  helperText={errors.zip?.message}
                  {...register("zip")}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Adresa *"
                  error={errors.address ? true : false}
                  helperText={errors.address?.message}
                  id="address"
                  type="text"
                  {...register("address")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Država *"
                  error={errors.country ? true : false}
                  helperText={errors.country?.message}
                  id="country"
                  type="country"
                  {...register("country")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  id="email"
                  type="email"
                  {...register("email")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Broj telefona"
                  id="phone"
                  type="phone"
                  {...register("phone")}
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeClientModal} variant="outlined">
          ODUSTANI
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          DODAJ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
