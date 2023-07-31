import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {
  Box,
  Button,
  Checkbox,
  FilledInput,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { api } from "../../../utils/api";
import { useSelectedCompany } from "../../stores/selectedCompanyStore";
import { useSession } from "next-auth/react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";

import CalculatingDiscount from "./CalculatingDiscount";
import GPO from "./GPO";

export function PoSdPrint() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <Button
        sx={{ marginRight: 1, paddingRight: 1 }}
        className="print-button"
        variant="contained"
        startIcon={<PrintIcon />}
        onClick={handlePrint}
      />
      <style>
        {`
     @media print {
      body * {
        visibility: hidden;
      }
      #posdTablePrint, #posdTablePrint * {
        visibility: visible;
      }
      #posdTablePrint {
        position: absolute;
        left: 0;
        top: 0;
      }
      .posd-table-chip, .print-button {
        display:none;
      }
      * {
        padding: 0;
        margin: 0;
      }
    }
      `}
      </style>
    </div>
  );
}

export default function PoSdTable() {
  const [numberOfMonths, setNumberOfMonths] = useState(1);

  const handleNumberOfMonthsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    setNumberOfMonths(value);
  };

  //3(1+2) trenutno ničemu ne služi - ako bude trebalo slučajno
  // const [amount1, setAmount1] = useState(0);
  // const [amount2, setAmount2] = useState(0);
  // const amount3 = amount1 + amount2;

  //Ukupni godišnji paušali dohodak
  const [amount4, setAmount4] = useState(0);
  const [amount5, setAmount5] = useState(0);
  const amount6 = amount4 + amount5;

  //Računanje GPO
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

  const totalGPO = (gpo / 12) * numberOfMonths;
  //

  const selectedCompany = useSelectedCompany((state) => state.company);

  const company = api.company.getCompanies.useQuery();
  const { data: sessionData } = useSession();
  const [name] = React.useState(sessionData?.user.name || "");
  if (company.isLoading)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  if (company.isError)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress color="error" />
      </Box>
    );

  const defaultCompany = company.data?.find(
    (c) => c.id === selectedCompany?.id
  );

  return (
    <div id="posdTablePrint">
      <TableContainer>
        <Paper
          sx={{
            minWidth: 750,
            width: "100%",
            mb: 2,
            borderRadius: 5,
            paddingTop: 2,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ marginLeft: 1, marginTop: 1 }}
            >
              <Chip
                className="posd-table-chip"
                label="Što je PO-SD obrazac? "
                component="a"
                rel="noopener"
                target="_blank"
                href="https://plaviured.hr/vodici/pausalni-obrt-predaja-po-sd-obrasca/ "
                clickable
              />
              <Chip
                className="posd-table-chip"
                label="Kako popuniti i poslati obrazac?"
                component="a"
                rel="noopener"
                target="_blank"
                href="https://plaviured.hr/vodici/kako-popuniti-i-poslati-po-sd-obrazac/ "
                clickable
              />
            </Stack>
            <PoSdPrint />
          </div>

          <Table sx={{ minWidth: 500 }}>
            <TableBody>
              <TableRow>
                <TableCell component="td" scope="row" colSpan={3}>
                  <h3>
                    IZVJEŠĆE O PAUŠALNOM DOHOTKU OD SAMOSTALNIH DJELATNOSTI I
                    UPLAĆENOM PAUŠALNOM POREZU NA DOHODAK I
                  </h3>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" colSpan={3}>
                  PRIREZU POREZA NA DOHODAK OD 1.1.2022. do 31.12.2022.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                  component="th"
                  scope="row"
                  colSpan={3}
                >
                  I. PODACI O POREZNOM OBVEZNIKU
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  OIB
                </TableCell>
                <TableCell component="th" scope="row">
                  IME I PREZIME
                </TableCell>
                <TableCell component="th" scope="row">
                  ADRESA PREBIVALIŠTA / UOBIČAJENOG BORAVIŠTA
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  sx={{ backgroundColor: "papayawhip" }}
                  component="th"
                  scope="row"
                >
                  {defaultCompany?.oib}
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip" }}
                  component="th"
                  scope="row"
                >
                  {name}
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip" }}
                  component="th"
                  scope="row"
                >
                  {defaultCompany?.address}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                  component="th"
                  scope="row"
                >
                  II. PODACI O DJELATNOSTI
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  1. NAZIV I VRSTA DJELATNOSTI
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip" }}
                  component="th"
                  scope="row"
                >
                  {defaultCompany?.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  2. ADRESA OBAVLJANJA DJELATNOSTI
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip" }}
                  component="th"
                  scope="row"
                >
                  {defaultCompany?.address}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">
                  3. GRAD VUKOVAR I POTPOMOGNUTA PODRUČJA JEDINICA LOKALNE
                  SAMOUPRAVE I. SKUPINE I OTOCI I.SKUPINE
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip" }}
                  component="th"
                  scope="row"
                >
                  <Checkbox defaultChecked />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  4. RAZDOBLJE OBAVLJANJA DJELATNOSTI
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ backgroundColor: "papayawhip" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="OD"
                      format="DD.MM.YYYY"
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                </TableCell>
                <TableCell sx={{ backgroundColor: "papayawhip" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="DO"
                      format="DD.MM.YYYY"
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                  component="th"
                  scope="row"
                >
                  III. PODACI O OSTVARENIM PRIMICIMA OD POJEDINAČNE DJELATNOSTI
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  PRIMICI NAPLAĆENI U GOTOVINI
                </TableCell>
                <TableCell component="th" scope="row">
                  PRIMICI NAPLAĆENI BEZGOTOVINSKIM PUTEM
                </TableCell>
                <TableCell component="th" scope="rowspan=2">
                  UKUPNO NAPLAĆENI PRIMICI
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  1
                </TableCell>
                <TableCell component="th" scope="row">
                  2
                </TableCell>
                <TableCell component="th" scope="rowspan=2">
                  3 (1+2)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ backgroundColor: "papayawhip", fontWeight: "bold" }}
                  component="th"
                  scope="row"
                >
                  {/* <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="amount1">1</InputLabel>
                    <OutlinedInput
                      id="amount1"
                      startAdornment={
                        <InputAdornment position="start">€</InputAdornment>
                      }
                      label="Amount"
                      value={amount1}
                      onChange={(e) => setAmount1(Number(e.target.value))}
                    />
                  </FormControl> */}
                  0 €
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip", fontWeight: "bold" }}
                  component="th"
                  scope="row"
                >
                  {/* <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="amount2">2</InputLabel>
                    <OutlinedInput
                      id="amount2"
                      startAdornment={
                        <InputAdornment position="start">€</InputAdornment>
                      }
                      label="Amount"
                      value={amount2}
                      onChange={(e) => setAmount2(Number(e.target.value))}
                    />
                  </FormControl> */}
                  <CalculatingDiscount /> €
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip", fontWeight: "bold" }}
                  component="th"
                  scope="rowspan=2"
                >
                  {/* <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">
                      Ukupno
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">€</InputAdornment>
                      }
                      label="Amount"
                      value={amount3}
                    />
                  </FormControl> */}
                  <CalculatingDiscount /> €
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  IV. GODIŠNJI PAUŠALNI DOHODAK OD POJEDINAČNE DJELATNOSTI /
                  BROJ MJESECI OBAVLJANJA DJELATNOSTI
                </TableCell>
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
                  {totalGPO.toFixed(2)} €
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip" }}
                  component="th"
                >
                  <TextField
                    id="number-of-months"
                    type="number"
                    value={numberOfMonths}
                    onChange={handleNumberOfMonthsChange}
                    inputProps={{ min: "1", step: "1" }}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  V. GODIŠNJI PAUŠALNI DOHODAK OD ZAJEDNIČKE DJELATNOSTI / BROJ
                  MJESECI OBAVLJANJA DJELATNOSTI
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip", fontWeight: "bold" }}
                  component="th"
                  scope="row"
                >
                  {/* <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="amount5">5</InputLabel>
                    <OutlinedInput
                      id="amount5"
                      startAdornment={
                        <InputAdornment position="start">€</InputAdornment>
                      }
                      label="Amount"
                      value={amount5}
                      onChange={(e) => setAmount5(Number(e.target.value))}
                    />
                  </FormControl> */}
                  0 €
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip", fontWeight: "bold" }}
                  component="th"
                  scope="rowspan=2"
                >
                  0 €
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  VI. UKUPNI GODIŠNJI PAUŠALNI DOHODAK
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                >
                  {/* <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="amount6">6</InputLabel>
                    <OutlinedInput
                      id="amount6"
                      startAdornment={
                        <InputAdornment position="start">€</InputAdornment>
                      }
                      label="Ukupno"
                      value={amount6}
                    />
                  </FormControl> */}
                  {totalGPO.toFixed(2)} €
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  VII. OBRAČUN PAUŠALNOG POREZA NA DOHODAK I PRIREZA POREZU NA
                  DOHODAK
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  1.
                </TableCell>
                <TableCell component="th" scope="row">
                  IZNOS OBVEZE PAUŠALNOG POREZA NA DOHODAK
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                >
                  {(totalGPO * 0.1).toFixed(2)} €
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  2.
                </TableCell>
                <TableCell component="th" scope="row">
                  PRIREZ POREZU NA DOHODAK (PROSJEČNA STOPA)
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip", fontWeight: "bold" }}
                  component="th"
                  scope="row"
                >
                  0,00%
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                >
                  0,00 EUR
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  3.
                </TableCell>
                <TableCell component="th" scope="row">
                  UKUPNO PAUŠALNI POREZ NA DOHODAK I PRIREZ POREZU NA DOHODAK
                  (1.+2.)
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                >
                  14,10 EUR
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  4.
                </TableCell>
                <TableCell component="th" scope="row">
                  "UMANJENJE PAUŠALNOG POREZA NA DOHODAK ZA PODRUČJE GRADA
                  VUKOVARA I POTPOMOGNUTIH PODRUČJA JEDINICA LOKALNE SAMOUPRAVE
                  I. SKUPINE I OTOCI I. SKUPINE"
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                >
                  0,00 EUR
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  5.
                </TableCell>
                <TableCell component="th" scope="row">
                  UKUPNA OBVEZA PAUŠALNOG POREZA NA DOHODAK I POREZ PRIREZU NA
                  DOHODAK NAKON UMANJENJA
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                >
                  14,10 EUR
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  6.
                </TableCell>
                <TableCell component="th" scope="row">
                  UKUPNO UPLAĆENI PAUŠALNI POREZ NA DOHODAK I PRIREZ POREZU NA
                  DOHODAK
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "papayawhip", fontWeight: "bold" }}
                  component="th"
                  scope="row"
                >
                  0,00 EUR
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  7.
                </TableCell>
                <TableCell component="th" scope="row">
                  RAZLIKA ZA UPLATU/POVRAT
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                >
                  14,10 EUR
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  8.
                </TableCell>
                <TableCell component="th" scope="row">
                  IZNOS MJESEČNOG PAUŠALNOG POREZA I PRIREZA POREZU NA DOHODAK
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                >
                  14,10 EUR
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </TableContainer>
    </div>
  );
}
