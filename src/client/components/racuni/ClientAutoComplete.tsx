import * as React from "react";

import { Autocomplete, Box, LinearProgress, TextField } from "@mui/material";

import { api, RouterOutputs } from "../../../utils/api";

type Clients = RouterOutputs["clients"]["getClients"];

type Client = Clients[0];

export default function ClientAutoComplete({
  onClientPicked,
  selectedClient,
  defaultClient,
}: {
  onClientPicked: (id: Client | string | null) => void;
  defaultClient?: string;
  selectedClient: Client | string | null;
}) {
  const client = api.clients.getClients.useQuery();

  if (client.isLoading)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  if (client.isError)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress color="error" />
      </Box>
    );

  return (
    <Autocomplete
      ListboxProps={{ style: { maxHeight: 200 } }}
      getOptionLabel={(option: string | Client) => {
        if (typeof option === "string") {
          return option;
        } else {
          return option.name;
        }
      }}
      defaultValue={
        client.data.find((l) => l.name === defaultClient) ??
        defaultClient ??
        undefined
      }
      freeSolo
      value={
        client.data.find((client) => {
          if (typeof selectedClient === "string") {
            return client.name === selectedClient;
          } else {
            return client.id === selectedClient?.id;
          }
        }) ?? null
      }
      disablePortal
      options={client.data}
      onInputChange={(event, v) => {
        onClientPicked(v);
      }}
      onChange={(_, v) => onClientPicked(v)}
      renderInput={(params) => (
        <TextField {...params} fullWidth variant="outlined" label="Klijent" />
      )}
      renderOption={(props, option) => {
        if (typeof option === "string") {
          return (
            <li {...props} key={option}>
              {option}
            </li>
          );
        } else {
          return (
            <li {...props} key={option.name}>
              {option.name}
            </li>
          );
        }
      }}
    />
  );
}
