import { Layout } from "../../client/layout/layout";
import Button from "@mui/material/Button";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  InputAdornment,
  LinearProgress,
} from "@mui/material";
import { api } from "../../utils/api";
import { Delete, Edit } from "@mui/icons-material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import { v4 as uuidv4 } from "uuid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useState } from "react";
import { Collapse } from "@mui/material";
import { useAddDodajRacunDialog } from "../../client/stores/addDodajRacunDialogStore";
import DodajRacun from "../../client/components/racuni/dodaj-racun";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useDeleteDodajRacunDialog } from "../../client/stores/deleteDodajRacunDialogStore";
import { IzbrisiRacun } from "../../client/components/racuni/izbrisi-racun";
import EditRacun from "../../client/components/racuni/edit-racun";
import { useEditDodajRacunDialog } from "../../client/stores/editDodajRacunDialogStore";
type InvoiceItem = {
  naziv: string;
  kolicina: number;
  cijena: number;
  popust: number;
  opis: string;
  mjernaJedinica: string;
};

type SimpleAccordionProps = {
  invoiceItems: InvoiceItem[];
};

export function SimpleAccordion({ invoiceItems }: SimpleAccordionProps) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        ></AccordionSummary>
        <AccordionDetails>
          <ul>
            {invoiceItems.map((item) => (
              <li key={item.naziv}>
                <Typography>{item.naziv}</Typography>
                <Typography>{item.kolicina}</Typography>
                <Typography>{item.cijena}</Typography>
                <Typography>{item.popust}</Typography>
                <Typography>{item.opis}</Typography>
                <Typography>{item.mjernaJedinica}</Typography>
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: uuidv4(),
    numeric: false,
    disablePadding: false,
    label: "",
  },
  {
    id: uuidv4(),
    numeric: false,
    disablePadding: false,
    label: "Broj računa",
  },
  {
    id: uuidv4(),
    numeric: false,
    disablePadding: false,
    label: "Datum računa",
  },
  {
    id: uuidv4(),
    numeric: false,
    disablePadding: false,
    label: "Datum dospijeća",
  },
  {
    id: uuidv4(),
    numeric: false,
    disablePadding: false,
    label: "Datum isporuke",
  },
  {
    id: uuidv4(),
    numeric: false,
    disablePadding: false,
    label: "Naziv klijenta",
  },

  {
    id: uuidv4(),
    numeric: false,
    disablePadding: false,
    label: "Akcije",
  },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
type SupportedLocales = keyof typeof locales;

export function EnhancedTable({ searchQuery }: { searchQuery: string }) {
  const [locale] = React.useState<SupportedLocales>("hrHR");

  const theme = useTheme();

  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme]
  );
  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const racuni = api.racuni.getInvoice.useQuery();

  const { openDodajRacunModal } = useEditDodajRacunDialog((state) => ({
    openDodajRacunModal: state.openDodajRacunDialog,
  }));

  const { openDeleteClientModal, setClientId } = useDeleteDodajRacunDialog(
    (state) => ({
      openDeleteClientModal: state.openClientDialog,
      setClientId: state.setClientId,
    })
  );

  if (racuni.isError) return <LinearProgress color="error" />;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (racuni.data ? racuni.data.length : 0)
        )
      : 0;

  const [expanded, setExpanded] = useState<string | null>(null);
  interface ProductProps {
    price: number;
    qty: number;
    discount: number;
  }

  function AddTotalPrice({ price, qty, discount }: ProductProps) {
    const calculateProductSubtotal = () => {
      const subtotal = (price * qty * (100 - discount)) / 100;
      return subtotal;
    };

    return <>{calculateProductSubtotal()}€</>;
  }

  return (
    <Box sx={{}}>
      <ThemeProvider theme={themeWithLocale}>
        <div style={{}}>
          <Paper
            sx={{
              minWidth: 750,
              width: "100%",
              mb: 2,
              borderRadius: 5,
              paddingTop: 10,
              marginTop: 5,
            }}
          >
            {racuni.isLoading ? <LinearProgress /> : ""}
            <EditRacun />
            <IzbrisiRacun />
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <EnhancedTableHead />
                <TableBody>
                  {racuni.data
                    ?.filter((row) =>
                      row.client.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <>
                          <TableRow
                            hover
                            tabIndex={-1}
                            key={row.id}
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                              setExpanded(expanded === row.id ? null : row.id)
                            }
                          >
                            <TableCell
                              sx={{
                                paddingRight: "0",
                              }}
                            >
                              {expanded === row.id ? (
                                <KeyboardArrowDownRoundedIcon
                                  sx={{ marginRight: "-10px" }}
                                />
                              ) : (
                                <KeyboardArrowUpRoundedIcon
                                  sx={{ marginRight: "-10px" }}
                                />
                              )}
                            </TableCell>
                            <TableCell>{row.brojRacuna}feafefafeaf</TableCell>
                            <TableCell>
                              {row.datumRacuna.toLocaleString("hr-HR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </TableCell>
                            <TableCell>
                              {row.datumDospijeca.toLocaleDateString("hr-HR")}
                            </TableCell>
                            <TableCell>
                              {row.datumIsporuke.toLocaleDateString("hr-HR")}
                            </TableCell>
                            <TableCell>{row.client.name}</TableCell>
                            <TableCell>
                              <Edit
                                sx={{ cursor: "pointer", color: "#ffd966" }}
                                onClick={(e) => {
                                  setClientId(row.id);
                                  openDodajRacunModal(row);
                                  e.stopPropagation();
                                }}
                              ></Edit>
                              {
                                <Delete
                                  sx={{ cursor: "pointer", color: "#e06666" }}
                                  onClick={(e) => {
                                    setClientId(row.id);
                                    openDeleteClientModal();
                                    e.stopPropagation();
                                  }}
                                ></Delete>
                              }
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ padding: 0 }} colSpan={7}>
                              <Collapse in={expanded === row.id} timeout="auto">
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Cijena</TableCell>
                                      <TableCell>Količina</TableCell>
                                      <TableCell>Popust</TableCell>
                                      <TableCell>Ukupno</TableCell>
                                      <TableCell>Naziv</TableCell>
                                      <TableCell>Opis</TableCell>
                                      <TableCell>Mjerna jedinica</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {row.InvoiceItem.map((item) => (
                                      <TableRow key={row.id}>
                                        <TableCell>{item.cijena}€</TableCell>
                                        <TableCell>{item.kolicina}</TableCell>
                                        <TableCell>{item.popust}%</TableCell>
                                        <TableCell>
                                          <AddTotalPrice
                                            price={item.cijena}
                                            qty={item.kolicina}
                                            discount={item.popust}
                                          />
                                        </TableCell>
                                        <TableCell>{item.naziv}</TableCell>
                                        <TableCell>{item.opis}</TableCell>
                                        <TableCell>
                                          {item.mjernaJedinica}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={racuni.data ? racuni.data.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </ThemeProvider>
    </Box>
  );
}
export default function Racuni() {
  const { openDodajRacunModal } = useAddDodajRacunDialog((state) => ({
    openDodajRacunModal: state.openDodajRacunDialog,
  }));

  const [searchQuery, setSearchQuery] = React.useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <div
        style={{
          margin: 35,
          height: 50,

          textAlign: "center",
        }}
      >
        <TextField
          sx={{
            marginTop: 2,
            float: "left",
            width: "50%",
            marginLeft: 5,
            minWidth: 200,
          }}
          value={searchQuery}
          label="Pretraga"
          id="outlined-size-small"
          size="small"
          placeholder="Naziv klijenta..."
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button
          startIcon={<PersonAddIcon />}
          sx={{
            marginTop: 2,
            float: "left",
            width: "200px",
            height: 40,
            marginLeft: 5,
            marginRight: 5,
            minWidth: 100,
          }}
          variant="contained"
          onClick={() => openDodajRacunModal()}
        >
          Dodaj račun
        </Button>

        <DodajRacun />
        <EnhancedTable searchQuery={searchQuery} />
      </div>
    </Box>
  );
}

Racuni.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title={"Računi"}>{page}</Layout>;
};
