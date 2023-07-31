import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Alert, Button, Chip, Stack } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
export function KprTablePrint() {
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
      #kprTablePrint, #kprTablePrint * {
        visibility: visible;
      }
      #kprTablePrint {
        position: absolute;
        left: 0;
        top: 0;
      }
      .kpr-table-stack, .print-button {
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

export default function KprTable() {
  return (
    <>
      <div id="kprTablePrint">
        <TableContainer>
          <Paper
            sx={{
              minWidth: 750,
              width: "100%",
              mb: 2,
              borderRadius: 5,
              paddingTop: 2,
              paddingBottom: 3,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Stack
                className="kpr-table-stack"
                direction="row"
                spacing={1}
                sx={{ marginLeft: 1, marginTop: 1 }}
              >
                <Alert severity="info">
                  Knjigu prometa nije potrebno predavati u Poreznu upravu, već
                  služi samo kao evidencija kako bi Vama bilo lakše.
                </Alert>
              </Stack>
              <KprTablePrint />
            </div>
            <Table sx={{ minWidth: 500 }}>
              <TableBody>
                <TableRow>
                  <TableCell component="td" scope="row">
                    <h3>KNJIGA PROMETA</h3>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold" }}
                    component="th"
                    scope="row"
                  >
                    I. OPĆI PODACI O POREZNOM OBVEZNIKU
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    1. NAZIV DJELATNOSTI
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    testirammmmmmmmmmmmm
                  </TableCell>
                  <TableCell component="th" scope="row">
                    ŠIFRA DJELATNOSTI
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    testirammmmmmmmmmmmm
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    2. IME I PREZIME PODUZETNIKA / NOSITELJA ZAJEDNIČKE
                    DJELATNOSTI
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    testirammmmmmmmmmmmm
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    3. ADRESA PREBIVALIŠTA / UOBIČAJENOG BORAVIŠTA
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    testirammmmmmmmmmmmm
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    4. OIB PODUZETNIKA / NOSITELJA ZAJEDNIČKE DJELATNOSTI
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    testirammmmmmmmmmmmm
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold" }}
                    component="th"
                    scope="row"
                  >
                    II. PODACI O POSLOVNOJ JEDINICI
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    1. NAZIV
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    Široki, obrt za računalno programiranje
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    R. BR.
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    NADNEVAK
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    BROJ TEMELJNICE
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    OPIS ISPRAVA O PRIMICIMA U GOTOVINI
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    IZNOS NAPLAĆEN U GOTOVINI / ČEKOVIMA
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    IZNOST NAPLAĆEN BEZGOTOVINSKIM PUTEM
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: "papayawhip" }}
                    component="th"
                    scope="row"
                  >
                    UKUPNO NAPLAĆENI IZNOS
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </TableContainer>
      </div>
    </>
  );
}
