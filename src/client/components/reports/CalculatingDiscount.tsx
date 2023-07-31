import { Typography } from "@mui/material";
import { api } from "../../../utils/api";

const calculatingDiscount = () => {
  const racuni = api.racuni.getInvoice.useQuery();
  const sviRacuni = racuni.data;

  let totalCost = 0;

  sviRacuni?.forEach((p) => {
    p.InvoiceItem.forEach((s) => {
      const subtotal = (s.cijena * s.kolicina * (100 - s.popust)) / 100;
      totalCost += subtotal;
    });
  });

  return <>{totalCost.toFixed(2)} </>;
};

export default calculatingDiscount;
