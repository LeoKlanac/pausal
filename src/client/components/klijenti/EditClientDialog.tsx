import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  Box,
  TextField,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import React from "react";
import { api } from "../../../utils/api";
import { useEditClientDialog } from "../../stores/editClientDialogStore";
import { useSnackbarStore } from "../../stores/globalSnackbarStore";
import { GradAutoComplete } from "../GradAutoComplete";
import { Location } from "@prisma/client";
import { type } from "os";
const updateSchema = z.object({
  name: z.string().min(1, { message: "Potreban je naziv klijenta" }),
  email: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().min(1, { message: "Potreban je naziv države." }),
  address: z.string().min(1, { message: "Potrebna je adresa" }),
  zip: z.string().min(1, { message: "Potreban je ZIP" }),
  oib: z.string().min(1, { message: "Potreban je OIB" }),
});

type updateSchema = z.infer<typeof updateSchema>;

export default function EditClientDialog() {
  const { editClientModalOpen, closeClientModal, client } = useEditClientDialog(
    (state) => ({
      editClientModalOpen: state.editClientDialogOpen,
      openClientModal: state.openClientDialog,
      closeClientModal: state.closeClientDialog,
      client: state.client,
    })
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<updateSchema>({
    values: {
      name: client?.name ?? "",
      oib: client?.oib ?? "",

      zip: client?.zip ?? "",
      address: client?.address ?? "",
      country: client?.country ?? "",

      email: client?.email ?? "",
      phone: client?.phone ?? "",
    },
    resolver: zodResolver(updateSchema),
  });

  const { showMsg } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
  }));
  const context = api.useContext();
  const updateClientMutation = api.clients.updateClient.useMutation({
    onSuccess: () => {
      context.clients.getClients.invalidate();
      showMsg("Klijent ažuriran.");
      closeClientModal();
    },
  });
  const onSubmit: SubmitHandler<updateSchema> = (data) => {
    if (selectedLocation === null) return;

    console.log(client?.id);
    updateClientMutation.mutate({
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
      clientId: client?.id ?? "",
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
    <Dialog open={editClientModalOpen} onClose={closeClientModal}>
      <DialogTitle>Uredi klijenta</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              flexGrow: 1,
              paddingBottom: 1,
            }}
          >
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
              {/* <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Grad *"
                  InputLabelProps={{ shrink: !!watch("city") }}
                  error={errors.city ? true : false}
                  helperText={errors.city?.message}
                  id="city"
                  type="city"
                  {...register("city")}
                  defaultValue={
                    <GradAutoComplete
                      onLocationPicked={onLocationZipPicked}
                      selectedLocation={selectedLocation}
                    />
                  }
                /> 
              </Grid>  */}
              <Grid item xs={12} md={6}>
                <GradAutoComplete
                  onLocationPicked={onLocationZipPicked}
                  selectedLocation={client?.city ?? ""}
                />
              </Grid>
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
          AŽURIRAJ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
