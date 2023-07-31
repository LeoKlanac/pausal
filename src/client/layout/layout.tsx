import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddCompanyDialog from "../components/AddCompanyDialog";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/People";
import LayersIcon from "@mui/icons-material/Layers";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import { useRouter } from "next/router";
import { SettingsPopover } from "../components/SettingsPopover";
import { AccountBalance } from "@mui/icons-material";
import { GlobalSnackbar } from "../components/GlobalSnackbar";
import { api } from "../../utils/api";
import { useSelectedCompany } from "../stores/selectedCompanyStore";
import { Company } from "@prisma/client";
import { shallow } from "zustand/shallow";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#1BA3A8",
    },
  },
});

export function Layout({
  children,
  title,
}: {
  children: JSX.Element;
  title: string;
}) {
  const [company, setCompany] = useSelectedCompany(
    (state) => [state.company, state.setCompany],
    shallow
  );

  api.company.getCompanies.useQuery(undefined, {
    enabled: company === undefined,
    onSuccess: (data) => {
      if (data.length > 0) {
        const company = data[0] as Company;
        setCompany(company);
      }
    },
  });

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const router = useRouter();
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {/* Dashboard je tu pisalo */}
            </Typography>
            <SettingsPopover />
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>  TU TREBA BIT BUTON*/}
          </Toolbar>

          <AddCompanyDialog />
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              Pausal
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />

          <List component="nav">
            <React.Fragment>
              <ListItemButton
                className={router.asPath === "/dashboard/pocetna" ? "link" : ""}
                onClick={() => void router.push("/dashboard/pocetna")}
              >
                <ListItemIcon>
                  <HomeIcon
                    style={{
                      color:
                        router.asPath === "/dashboard/pocetna" ? "#1BA3A8" : "",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Početna" />
              </ListItemButton>
              <ListItemButton
                className={
                  router.asPath === "/dashboard/bankovni-racuni" ? "link" : ""
                }
                onClick={() => void router.push("/dashboard/bankovni-racuni")}
              >
                <ListItemIcon>
                  <AccountBalance
                    style={{
                      color:
                        router.asPath === "/dashboard/bankovni-racuni"
                          ? "#1BA3A8"
                          : "",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Bankovni računi" />
              </ListItemButton>
              <ListItemButton
                className={router.asPath === "/dashboard/racuni" ? "link" : ""}
                onClick={() => void router.push("/dashboard/racuni")}
              >
                <ListItemIcon>
                  <ReceiptLongIcon
                    style={{
                      color:
                        router.asPath === "/dashboard/racuni" ? "#1BA3A8" : "",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Računi" />
              </ListItemButton>
              <ListItemButton
                className={
                  router.asPath === "/dashboard/klijenti" ? "link" : ""
                }
                onClick={() => void router.push("/dashboard/klijenti")}
              >
                <ListItemIcon>
                  <PeopleIcon
                    style={{
                      color:
                        router.asPath === "/dashboard/klijenti"
                          ? "#1BA3A8"
                          : "",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Klijenti" />
              </ListItemButton>
              <ListItemButton
                className={
                  router.asPath === "/dashboard/proizvodi-i-usluge"
                    ? "link"
                    : ""
                }
                onClick={() =>
                  void router.push("/dashboard/proizvodi-i-usluge")
                }
              >
                <ListItemIcon>
                  <DesignServicesIcon
                    style={{
                      color:
                        router.asPath === "/dashboard/proizvodi-i-usluge"
                          ? "#1BA3A8"
                          : "",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Proizvodi i usluge" />
              </ListItemButton>
              <ListItemButton
                className={
                  router.asPath === "/dashboard/izvjesca" ? "link" : ""
                }
                onClick={() => void router.push("/dashboard/izvjesca")}
              >
                <ListItemIcon>
                  <LayersIcon
                    style={{
                      color:
                        router.asPath === "/dashboard/izvjesca"
                          ? "#1BA3A8"
                          : "",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Izvješća" />
              </ListItemButton>
            </React.Fragment>
            {/* <Divider sx={{ my: 1 }} />  To je za crtu skroz dolje, nez ak treba?*/}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <div>
            <h1 style={{ marginLeft: 23 }}>{title}</h1>
            {children}
            <GlobalSnackbar />
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
