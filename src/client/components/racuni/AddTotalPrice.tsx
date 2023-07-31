import { Box, Grid, Typography } from "@mui/material";
import { Product } from "@prisma/client";
import { useInvoiceProducts } from "../../stores/addInvoiceStore";

export default function AddTotalPrice() {
  const { products } = useInvoiceProducts();

  const calculateProductCost = (product: Product) => {
    //@ts-ignore
    const { price, qty, discount } = product;
    const total = (price * discount) / 100;
    const cost = price * qty - total;
    return cost;
  };

  const calculateTotalCost = () => {
    const totalCost = products.reduce(
      (initial, product) => initial + calculateProductCost(product),
      0
    );
    return totalCost;
  };

  return (
    <Typography sx={{}} variant="h6">
      UKUPNO: {calculateTotalCost()}€
    </Typography>
  );
}
