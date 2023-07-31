import { useState } from "react";
import { Typography, TextField, TableCell } from "@mui/material";
import { api } from "../../../utils/api";

const GPO = () => {
  const racuni = api.racuni.getInvoice.useQuery();
  const sviRacuni = racuni.data;

  let totalCost = 0;

  sviRacuni?.forEach((p) => {
    p.InvoiceItem.forEach((s) => {
      const subtotal = (s.cijena * s.kolicina * (100 - s.popust)) / 100;
      totalCost += subtotal;
    });
  });

  let gpo = 0;

  if (totalCost <= 11281.44) {
    gpo = 1692.22;
  } else if (totalCost > 11281.45 && totalCost <= 15263.12) {
    gpo = 2289.47;
  } else if (totalCost > 15263.13 && totalCost <= 19842.06) {
    gpo = 2976.31;
  } else if (totalCost > 19842.07 && totalCost <= 30526.25) {
    gpo = 4578.94;
  } else if (totalCost > 30526.26 && totalCost <= 39816.84) {
    gpo = 5972.23;
  }

  const [numberOfMonths, setNumberOfMonths] = useState(1);
  //@ts-ignore
  const handleNumberOfMonthsChange = (event) => {
    const value = event.target.value;
    setNumberOfMonths(value);
  };

  const totalGPO = (gpo / 12) * numberOfMonths;

  return (
    <>
      <TableCell
        sx={{ backgroundColor: "papayawhip", fontWeight: "bold" }}
        component="th"
        scope="row"
      >
        {/* <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="amount4">4</InputLabel>
                    <OutlinedInput
                      id="amount4"
                      startAdornment={
                        <InputAdornment position="start">€</InputAdornment>
                      }
                      label="Amount"
                      value={amount4}
                      onChange={(e) => setAmount4(Number(e.target.value))}
                    />
                  </FormControl> */}
        {totalGPO.toFixed(2)}
      </TableCell>
      <TableCell sx={{ backgroundColor: "papayawhip" }} component="th">
        <TextField
          id="number-of-months"
          type="number"
          value={numberOfMonths}
          onChange={handleNumberOfMonthsChange}
          inputProps={{ min: "1", step: "1" }}
          fullWidth
        />
      </TableCell>
    </>
  );
};

export default GPO;
