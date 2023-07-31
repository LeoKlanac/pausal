import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, DialogTitle, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { useDateTimeStore } from "../../stores/dateTimeStore";

const racunSchema = z.object({
  invoice: z.string().min(1, { message: "Potreban je broj računa" }),
});

type RacunSchema = z.infer<typeof racunSchema>;

export default function AddClientRacun() {
  const {
    register,

    formState: { errors },
  } = useForm<RacunSchema>({
    resolver: zodResolver(racunSchema),
  });

  const {
    datumRacuna,
    datumIsporuke,
    setDatumRacuna,
    datumDospijeca,
    setDatumDospijeca,
    setDatumIsporuke,
  } = useDateTimeStore();

  return (
    <>
      <DialogTitle sx={{ marginLeft: "20px" }}>Dodaj račun</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ flexGrow: 1, padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                id="broj računa"
                label="Broj računa"
                variant="outlined"
                inputProps={{
                  maxLength: 10,
                  // pattern: "",
                }}
                {...register("invoice")}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="Datum i vrijeme računa"
                  value={datumRacuna}
                  onChange={(v) => {
                    if (v !== null) {
                      setDatumRacuna(v);
                    }
                  }}
                  format="DD.MM.YYYY HH:mm"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label="Datum dospijeća"
                  format="DD.MM.YYYY"
                  value={datumDospijeca}
                  onChange={(v) => {
                    if (v !== null) {
                      setDatumDospijeca(v);
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label="Datum isporuke"
                  format="DD.MM.YYYY"
                  value={datumIsporuke}
                  onChange={(v) => {
                    if (v !== null) {
                      setDatumIsporuke(v);
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </>
  );
}
