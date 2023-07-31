import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import {
  Box,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Client } from "@prisma/client";
import { useState } from "react";
import { useAddClientRacunStore } from "../../stores/addInvoiceStore";
import ClientAutoComplete from "../racuni/ClientAutoComplete";
import { v4 as uuidv4 } from "uuid";
export default function AddForm() {
  return <div>možda bude trebalo?</div>;
  // // {to je za autofill klijenta}  const { selectedClient, setSelectedClient } = useAddClientRacunStore();
  // // const { clients, setClients } = useAddClientRacunStore();
  // const handleClientPicked = (
  //   client: string | Client | null,
  //   clientId: string
  // ) => {
  //   const clonedClients = [...clients];
  //   const clientToModify = clonedClients.find((c) => c.id === clientId);
  //   if (!clientToModify) return;

  //   if (typeof client !== "string" && client !== null) {
  //     clientToModify.name = client.name;
  //     clientToModify.oib = client.oib;
  //     clientToModify.address = client.address;
  //     clientToModify.country = client.country;
  //     clientToModify.zip = client.zip;
  //     clientToModify.city = client.city;
  //   } else if (typeof client === "string") {
  //     clientToModify.name = client;
  //     clientToModify.oib = "";
  //     clientToModify.address = "";
  //     clientToModify.country = "";
  //     clientToModify.zip = "";
  //     clientToModify.city = "";
  //   } else {
  //     clientToModify.name = "";
  //     clientToModify.oib = "";
  //     clientToModify.address = "";
  //     clientToModify.country = "";
  //     clientToModify.zip = "";
  //     clientToModify.city = "";
  //   }
  //   setClients(clonedClients);
  // };

  // return (
  //   <>
  //     <DialogContent dividers>
  //       <Box
  //         sx={{
  //           flexGrow: 1,

  //           padding: "20px",
  //         }}
  //       >
  //         {clients.map((client, index) => (
  //           <div key={client.id} className="rows">
  //             <Grid container spacing={2}>
  //               <Grid item xs={12}>
  //                 <ClientAutoComplete
  //                   onClientPicked={(pickedClient: Client | string | null) =>
  //                     handleClientPicked(pickedClient, client.id)
  //                   }
  //                   selectedClient={client.name}
  //                 />
  //               </Grid>

  //               <Grid item xs={12} md={3}>
  //                 <FormControl fullWidth variant="outlined">
  //                   <TextField
  //                     fullWidth
  //                     label="Adresa*"
  //                     // error={errors.price ? true : false}
  //                     // helperText={errors.price?.message}
  //                     id="price"
  //                     type="adresa"
  //                     value={client.address}
  //                     onChange={(e) => {
  //                       const clonedClients = [...clients];
  //                       const clientToModify = clonedClients.find(
  //                         (c) => c.id === client.id
  //                       );
  //                       if (!clientToModify) return;
  //                       clientToModify.address = e.target.value;
  //                       setClients(clonedClients);
  //                     }}
  //                   />
  //                 </FormControl>
  //               </Grid>
  //               <Grid item xs={12} md={3}>
  //                 <TextField
  //                   fullWidth
  //                   label="OIB *"
  //                   variant="outlined"
  //                   // error={errors.amount ? true : false}
  //                   // helperText={errors.amount?.message}

  //                   type="oib"
  //                   value={client.oib}
  //                   onChange={(e) => {
  //                     const clonedClients = [...clients];
  //                     const clientToModify = clonedClients.find(
  //                       (c) => c.id === client.id
  //                     );
  //                     if (!clientToModify) return;
  //                     clientToModify.oib = e.target.value;
  //                     setClients(clonedClients);
  //                   }}
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={3}>
  //                 <TextField
  //                   fullWidth
  //                   label="Grad *"
  //                   variant="outlined"
  //                   // error={errors.amount ? true : false}
  //                   // helperText={errors.amount?.message}

  //                   type="grad"
  //                   value={client.city}
  //                   onChange={(e) => {
  //                     const clonedClients = [...clients];
  //                     const clientToModify = clonedClients.find(
  //                       (c) => c.id === client.id
  //                     );
  //                     if (!clientToModify) return;
  //                     clientToModify.city = e.target.value;
  //                     setClients(clonedClients);
  //                   }}
  //                 />
  //               </Grid>

  //               <Grid item xs={12} md={3}>
  //                 <TextField
  //                   fullWidth
  //                   label="Zip *"
  //                   variant="outlined"
  //                   // error={errors.amount ? true : false}
  //                   // helperText={errors.amount?.message}

  //                   type="zip"
  //                   value={client.zip}
  //                   onChange={(e) => {
  //                     const clonedClients = [...clients];
  //                     const clientToModify = clonedClients.find(
  //                       (c) => c.id === client.id
  //                     );
  //                     if (!clientToModify) return;
  //                     clientToModify.zip = e.target.value;
  //                     setClients(clonedClients);
  //                   }}
  //                 />
  //               </Grid>
  //             </Grid>
  //           </div>
  //         ))}
  //       </Box>
  //     </DialogContent>
  //   </>
  // );
}
