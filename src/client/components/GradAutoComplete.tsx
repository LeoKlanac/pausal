import { Autocomplete, Box, LinearProgress, TextField } from "@mui/material";
import React from "react";
import JSXStyle from "styled-jsx/style";
import { api, RouterOutputs } from "../../utils/api";

type Locations = RouterOutputs["locations"]["getLocations"];

type Location = Locations[0];

export const GradAutoComplete = ({
  onLocationPicked,
  selectedLocation,
  defaultCity,
}: {
  onLocationPicked: (id: Location | string | null) => void;
  defaultCity?: string;
  selectedLocation: Location | string | null;
}) => {
  const location = api.locations.getLocations.useQuery();

  if (location.isLoading)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  if (location.isError)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress color="error" />
      </Box>
    );

  return (
    <Autocomplete
      ListboxProps={{ style: { maxHeight: 200 } }}
      getOptionLabel={(option: string | Location) => {
        if (typeof option === "string") {
          return option;
        } else {
          return option.name;
        }
      }}
      defaultValue={
        location.data.find((l) => l.name === defaultCity) ??
        defaultCity ??
        undefined
      }
      freeSolo
      value={
        location.data.find((client) => client.name === selectedLocation) ?? null
      }
      disablePortal
      options={location.data}
      onInputChange={(event, v) => {
        onLocationPicked(v);
      }}
      onChange={(_, v) => onLocationPicked(v)}
      renderInput={(params) => (
        <TextField {...params} fullWidth variant="outlined" label="Grad" />
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
            <li {...props} key={option.name + " - " + option.zip}>
              {option.name + " - " + option.zip}
            </li>
          );
        }
      }}
    />
  );
};
