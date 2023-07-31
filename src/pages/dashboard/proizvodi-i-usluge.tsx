import { Delete } from "@mui/icons-material";
import Edit from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Box,
  Button,
  InputAdornment,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddProductDialog from "../../client/components/proizvodi-i-usluge/AddProductDialog";
import { DeleteProductDialog } from "../../client/components/proizvodi-i-usluge/DeleteProductDialog";
import * as locales from "@mui/material/locale";
import { Layout } from "../../client/layout/layout";
import { useAddProductDialog } from "../../client/stores/addProductDialogStore";
import { useDeleteProductDialog } from "../../client/stores/deleteProductDialogStore";
import { useEditProductDialog } from "../../client/stores/editProductDialogStore";
import { api, RouterOutputs } from "../../utils/api";
import EditProductDialog from "../../client/components/proizvodi-i-usluge/EditProductDialog";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
type ProizvodIUsluge = RouterOutputs["products"]["getProducts"];
type ProizvodIUsluga = ProizvodIUsluge[0];

interface HeadCell {
  disablePadding: boolean;
  id: keyof ProizvodIUsluga | "akcije";
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Naziv proizvoda",
  },
  {
    id: "price",
    numeric: false,
    disablePadding: false,
    label: "Cijena proizvoda",
  },
  {
    id: "currency",
    numeric: false,
    disablePadding: false,
    label: "Valuta",
  },
  // {
  //   id: "description",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Opis proizvoda",
  // },
  {
    id: "unit",
    numeric: false,
    disablePadding: false,
    label: "Mjerna jedinica",
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
export function ProductTable({ searchQuery }: { searchQuery: string }) {
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

  const products = api.products.getProducts.useQuery();

  const { openProductModal, setProduct } = useEditProductDialog((state) => ({
    openProductModal: state.openProductDialog,
    setProduct: state.setProduct,
  }));

  const { openDeleteProductModal, setProductId } = useDeleteProductDialog(
    (state) => ({
      openDeleteProductModal: state.openProductDialog,
      setProductId: state.setProductId,
    })
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (products.data ? products.data.length : 0)
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
            {products.isLoading ? <LinearProgress /> : ""}
            {products.isError ? <LinearProgress color="error" /> : ""}
            <EditProductDialog />
            <DeleteProductDialog />
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <EnhancedTableHead />
                <TableBody>
                  {products.data &&
                    products.data
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
                            <TableCell>
                              {row.price} {row.currency}
                            </TableCell>
                            <TableCell>{row.currency}</TableCell>
                            <TableCell>{row.unit}</TableCell>

                            <TableCell>
                              <Edit
                                sx={{ cursor: "pointer", color: "#ffd966" }}
                                onClick={() => {
                                  setProduct(row);
                                  openProductModal();
                                }}
                              ></Edit>
                              {
                                <Delete
                                  sx={{ cursor: "pointer", color: "#e06666" }}
                                  onClick={() => {
                                    setProductId(row.id);
                                    openDeleteProductModal();
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
              count={products.data ? products.data.length : 0}
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

export default function ProizvodiIUsluge() {
  const { openClientModal } = useAddProductDialog((state) => ({
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
          placeholder="Naziv proizvoda/usluge..."
          id="outlined-size-small"
          defaultValue=""
          size="small"
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
            width: "260px",
            height: 40,
            marginLeft: 5,
            marginRight: 5,
            minWidth: 100,
          }}
          variant="contained"
          onClick={() => openClientModal()}
        >
          Dodaj proizvod/uslugu
        </Button>
        <AddProductDialog />

        <ProductTable searchQuery={searchQuery} />
      </div>
    </Box>
  );
}

ProizvodiIUsluge.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title={"Proizvodi i usluge"}>{page}</Layout>;
};
