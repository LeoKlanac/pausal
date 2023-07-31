import { Layout } from "../../client/layout/layout";
import Button from "@mui/material/Button";
import FormDialog from "../../client/components/klijenti/AddClientDialog";
import { useAddClientDialog } from "../../client/stores/addClientDialogStore";
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
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import { Delete, Edit } from "@mui/icons-material";
import { useEditClientDialog } from "../../client/stores/editClientDialogStore";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { useDeleteClientDialog } from "../../client/stores/deleteClientDialogStore";
import { DeleteClientDialog } from "../../client/components/klijenti/DeleteClientDialog";
import EditClientDialog from "../../client/components/klijenti/EditClientDialog";
import * as locales from "@mui/material/locale";
type Klijenti = RouterOutputs["clients"]["getClients"];
type Klijent = Klijenti[0];

interface HeadCell {
  disablePadding: boolean;
  id: keyof Klijent | "akcije";
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Naziv klijenta",
  },
  {
    id: "oib",
    numeric: false,
    disablePadding: false,
    label: "OIB",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: "Grad",
  },
  {
    id: "zip",
    numeric: false,
    disablePadding: false,
    label: "Poštanski broj",
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Adresa",
  },
  {
    id: "country",
    numeric: false,
    disablePadding: false,
    label: "Država",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "phone",
    numeric: false,
    disablePadding: false,
    label: "Broj telefona",
  },
  {
    id: "akcije",
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
  const [locale, setLocale] = React.useState<SupportedLocales>("hrHR");

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

  const clients = api.clients.getClients.useQuery();

  const { openClientModal, setClient } = useEditClientDialog((state) => ({
    openClientModal: state.openClientDialog,
    setClient: state.setClient,
  }));

  const { openDeleteClientModal, setClientId } = useDeleteClientDialog(
    (state) => ({
      openDeleteClientModal: state.openClientDialog,
      setClientId: state.setClientId,
    })
  );

  if (clients.isError) return <LinearProgress color="error" />;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (clients.data ? clients.data.length : 0)
        )
      : 0;

  // PROBLEM od 171-173 i 196
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
            {clients.isLoading ? <LinearProgress /> : ""}
            <EditClientDialog />
            <DeleteClientDialog />
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <EnhancedTableHead />
                <TableBody>
                  {clients.data &&
                    clients.data
                      .filter((row) =>
                        row.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow hover tabIndex={-1} key={row.id}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.oib}</TableCell>
                            <TableCell>{row.city}</TableCell>
                            <TableCell>{row.zip}</TableCell>
                            <TableCell>{row.address}</TableCell>
                            <TableCell>{row.country}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.phone}</TableCell>
                            <TableCell>
                              <Edit
                                sx={{ cursor: "pointer", color: "#ffd966" }}
                                onClick={() => {
                                  setClient(row);
                                  openClientModal();
                                }}
                              ></Edit>
                              {
                                <Delete
                                  sx={{ cursor: "pointer", color: "#e06666" }}
                                  onClick={() => {
                                    setClientId(row.id);
                                    openDeleteClientModal();
                                  }}
                                ></Delete>
                              }
                            </TableCell>
                          </TableRow>
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
              count={clients.data ? clients.data.length : 0}
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
export default function Klijenti() {
  const { openClientModal } = useAddClientDialog((state) => ({
    openClientModal: state.openClientDialog,
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
          onClick={() => openClientModal()}
        >
          Dodaj klijenta
        </Button>

        <FormDialog />
        <EnhancedTable searchQuery={searchQuery} />
      </div>
    </Box>
  );
}

Klijenti.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title={"Klijenti"}>{page}</Layout>;
};
