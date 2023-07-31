import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import { Box, DialogTitle, Grid } from "@mui/material";
import { Client } from "@prisma/client";
import ClientAutoComplete from "./ClientAutoComplete";
import { useState } from "react";
import { useAddClientRacunStore } from "../../stores/addInvoiceStore";

export default function AddClientRacun() {
  const { selectedClient, setSelectedClient } = useAddClientRacunStore();

  const handleClientPicked = (client: string | Client | null) => {
    if (typeof client !== "string" && client !== null)
      setSelectedClient(client);
  };
  return (
    <>
      <DialogTitle sx={{ marginLeft: "20px" }}>Primatelj računa</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            flexGrow: 1,

            padding: "20px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ClientAutoComplete
                onClientPicked={handleClientPicked}
                selectedClient={selectedClient ?? null}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </>
  );
}
