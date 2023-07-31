import * as React from "react";

import { Autocomplete, Box, LinearProgress, TextField } from "@mui/material";

import { api, RouterOutputs } from "../../../utils/api";

type Products = RouterOutputs["products"]["getProducts"];

type Product = Products[0];

export default function ProductAutoComplete({
  onProductPicked,
  selectedProduct,
  defaultProduct,
}: {
  onProductPicked: (id: Product | string | null) => void;
  defaultProduct?: string;
  selectedProduct: Product | string | null;
}) {
  const product = api.products.getProducts.useQuery();

  if (product.isLoading)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  if (product.isError)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress color="error" />
      </Box>
    );

  return (
    <Autocomplete
      ListboxProps={{ style: { maxHeight: 200 } }}
      getOptionLabel={(option: string | Product) => {
        if (typeof option === "string") {
          return option;
        } else {
          return option.name;
        }
      }}
      defaultValue={
        product.data.find((l) => l.name === defaultProduct) ??
        defaultProduct ??
        undefined
      }
      freeSolo
      value={
        product.data.find((product) => product.name === selectedProduct) ?? null
      }
      disablePortal
      options={product.data}
      onInputChange={(event, v) => {
        onProductPicked(v);
      }}
      onChange={(_, v) => onProductPicked(v)}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          label="Proizvod/usluga"
        />
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
