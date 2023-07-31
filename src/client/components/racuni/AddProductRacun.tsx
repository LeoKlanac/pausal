import {
  TextField,
  Button,
  DialogContent,
  MenuItem,
  DialogActions,
  FormControl,
  InputAdornment,
  Grid,
  Box,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { currencies } from "../../../utils/currencies";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import ProductAutoComplete from "./ProductAutoComplete";

import { Product } from "@prisma/client";
import { useInvoiceProducts } from "../../stores/addInvoiceStore";

export default function AddProductRacun() {
  const { products, setProducts } = useInvoiceProducts();

  const handleProductPicked = (
    product: Product | string | null,
    productId: string
  ) => {
    const clonedProducts = [...products];
    const productToModify = clonedProducts.find((p) => p.id === productId);
    if (!productToModify) return;

    if (typeof product !== "string" && product !== null) {
      productToModify.currency = product.currency;
      productToModify.price = product.price;
      productToModify.unit = product.unit;
      productToModify.description = product.description;
      productToModify.name = product.name;
    } else if (typeof product === "string") {
      productToModify.name = product;
    } else {
      productToModify.name = "";
    }

    setProducts(clonedProducts);
  };
  const handleAddNewRow = () => {
    const clonedProducts = [...products];
    const newProduct = {
      id: uuidv4(),
      name: "",
      userId: "",
      unit: "",
      currency: "",
      description: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      price: 0,
      qty: 0,
      discount: 0,
    };
    clonedProducts.push(newProduct);
    setProducts(clonedProducts);
  };

  return (
    <>
      <DialogTitle sx={{ marginLeft: "20px" }}>Stavke računa</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            flexGrow: 1,
            paddingBottom: 1,
            padding: "20px",
          }}
        >
          {products.map((product, index) => (
            <div key={product.id} className="rows">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ProductAutoComplete
                    onProductPicked={(pickedProduct: Product | string | null) =>
                      handleProductPicked(pickedProduct, product.id)
                    }
                    selectedProduct={product.name}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      fullWidth
                      label="Cijena proizvoda *"
                      // error={errors.price ? true : false}
                      // helperText={errors.price?.message}
                      id="price"
                      type="number"
                      value={product.price}
                      onChange={(e) => {
                        const clonedProducts = [...products];
                        const productToModify = clonedProducts.find(
                          (p) => p.id === product.id
                        );
                        if (!productToModify) return;
                        productToModify.price = Number(e.target.value);
                        setProducts(clonedProducts);
                      }}
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
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Popust *"
                    variant="outlined"
                    // error={errors.amount ? true : false}
                    // helperText={errors.amount?.message}

                    type="number"
                    value={product.discount}
                    onChange={(e) => {
                      const clonedProducts = [...products];
                      const productToModify = clonedProducts.find(
                        (p) => p.id === product.id
                      );
                      if (!productToModify) return;
                      productToModify.discount = parseInt(e.target.value);
                      setProducts(clonedProducts);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body1" color="textSecondary">
                            %
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Količina *"
                    variant="outlined"
                    // error={errors.amount ? true : false}
                    // helperText={errors.amount?.message}

                    type="number"
                    value={product.qty}
                    onChange={(e) => {
                      const clonedProducts = [...products];
                      const productToModify = clonedProducts.find(
                        (p) => p.id === product.id
                      );
                      if (!productToModify) return;
                      productToModify.qty = parseInt(e.target.value);
                      setProducts(clonedProducts);
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Mjerna jedinica *"
                    // error={errors.unit ? true : false}
                    // helperText={errors.unit?.message}
                    id="unit"
                    type="text"
                    value={product.unit}
                    onChange={(e) => {
                      const clonedProducts = [...products];
                      const productToModify = clonedProducts.find(
                        (p) => p.id === product.id
                      );
                      if (!productToModify) return;
                      productToModify.unit = e.target.value;
                      setProducts(clonedProducts);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Opis proizvoda *"
                    // error={errors.description ? true : false}
                    // helperText={errors.description?.message}
                    id="outlined-multiline-flexible"
                    maxRows={4}
                    multiline
                    value={product.description}
                    onChange={(e) => {
                      const clonedProducts = [...products];
                      const productToModify = clonedProducts.find(
                        (p) => p.id === product.id
                      );
                      if (!productToModify) return;
                      productToModify.description = e.target.value;
                      setProducts(clonedProducts);
                    }}
                  />
                </Grid>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sx={{ textAlign: "right", marginBottom: 3 }}
                  >
                    {products.length > 1 && (
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          const clonedProducts = [...products];
                          clonedProducts.splice(index, 1);
                          setProducts(clonedProducts);
                        }}
                        sx={{
                          cursor: "pointer",
                          color: "#e06666",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          ))}
        </Box>

        <DialogActions>
          <Box
            sx={{
              flexGrow: 1,
              paddingBottom: 1,
              discountplay: "flex",
              justifyContent: "flex-start",
              marginLeft: 1.7,
            }}
          >
            <Button
              sx={{ marginRight: 1 }}
              variant="contained"
              onClick={handleAddNewRow}
            >
              Dodaj red
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </>
  );
}
