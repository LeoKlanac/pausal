import * as React from "react";
import Button from "@mui/material/Button";
import { api } from "../../../utils/api";
import { TextField, Typography } from "@mui/material";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbarStore } from "../../stores/globalSnackbarStore";
import { useSelectedCompany } from "../../stores/selectedCompanyStore";
import { GradAutoComplete } from "../GradAutoComplete";
import { Location } from "@prisma/client";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";

const updateSchema = z.object({
  name: z.string().min(1, { message: "Potreban je naziv tvrtke" }),
  oib: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zip: z.string().optional(),
});

type UpdateSchema = z.infer<typeof updateSchema>;

export function FinishCompanyContet() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateSchema>({
    resolver: zodResolver(updateSchema),
  });

  const { showMsg } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
  }));
  const apiContext = api.useContext();
  const { company, setCompany } = useSelectedCompany((state) => ({
    setCompany: state.setCompany,
    company: state.company,
  }));

  const [isLoading, setIsLoading] = useState(false);

  const updateCompanyMutation = api.company.updateCompany.useMutation({
    onSuccess: (updatedCompany) => {
      setCompany(updatedCompany);
      apiContext.company.getCompanies.invalidate();
      showMsg("Ažurirano.");
      setIsLoading(false);
    },
  });
  const [selectedLocation, setSelectedLocationQuery] = React.useState<
    Location | string | null
  >("");

  const onLocationZipPicked = (location: Location | string | null) => {
    setSelectedLocationQuery(location);
    if (location !== null && typeof location === "object") {
      setValue("zip", location.zip);
    }
  };

  const onSubmit: SubmitHandler<UpdateSchema> = (data) => {
    setIsLoading(true);

    updateCompanyMutation.mutate({
      companyId: company?.id ?? "",
      name: data.name,
      oib: data.oib,
      city: data.city,
      address: data.address,
      zip: data.zip,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Naziv poduzeća *"
              variant="outlined"
              error={errors.name ? true : false}
              helperText={errors.name?.message}
              type="text"
              {...register("name")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="OIB "
              error={errors.oib ? true : false}
              helperText={errors.oib?.message}
              type="text"
              {...register("oib")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Adresa "
              error={errors.address ? true : false}
              helperText={errors.address?.message}
              type="text"
              {...register("address")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <GradAutoComplete
              onLocationPicked={onLocationZipPicked}
              selectedLocation={selectedLocation}
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
          <Grid item xs={12}>
            <Button sx={{ float: "right" }} variant="contained" type="submit">
              AŽURIRAJ
            </Button>
            {isLoading && (
              <>
                <Typography fontSize={25}>
                  Gasiranje... <CircularProgress size={25} color="primary" />
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}
