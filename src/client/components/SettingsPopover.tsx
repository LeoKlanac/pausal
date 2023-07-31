import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useAddCompanyDialog } from "../stores/addCompanyDialogStore";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import {
  Avatar as MuiAvatar,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Avatar from "react-avatar";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { api } from "../../utils/api";
import { useSelectedCompany } from "../stores/selectedCompanyStore";

type ContainerProps = {
  children: React.ReactNode;
};

export const App = (props: ContainerProps) => {
  const { data: sessionData } = useSession();
  const [name, setName] = React.useState(sessionData?.user.name || "");
  const [isNameFocused, setIsNamedFocused] = React.useState(false);
  const nameMutation = api.user.changeName.useMutation();

  return (
    <div>
      {!isNameFocused ? (
        <div>
          <Typography
            className={name}
            onClick={() => {
              setIsNamedFocused(true);
            }}
          >
            {name}
          </Typography>
        </div>
      ) : (
        <TextField
          autoFocus
          inputProps={{ className: name }}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={(event) => {
            nameMutation.mutate({
              name: event.target.value,
            });
            setIsNamedFocused(false);
          }}
        />
      )}
    </div>
  );
};

export function SettingsPopover() {
  const { data: sessionData } = useSession();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { openCompanyModal } = useAddCompanyDialog((state) => ({
    openCompanyModal: state.openCompanyDialog,
  }));

  const companies = api.company.getCompanies.useQuery();
  const { company, setCompany } = useSelectedCompany((state) => ({
    setCompany: state.setCompany,
    company: state.company,
  }));

  if (companies.isLoading)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  if (companies.isError)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress color="error" />
      </Box>
    );

  return (
    <div>
      <Button
        className="Button"
        aria-describedby={id}
        variant="text"
        onClick={handleClick}
      >
        <Avatar
          className="avatar"
          size="50"
          round={true}
          name={sessionData?.user.email ?? undefined}
          src={sessionData?.user.image ?? undefined}
        />
      </Button>
      <Popover
        style={{ width: "400px" }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography>
          <Stack direction="row" sx={{ justifyContent: "center" }} spacing={2}>
            <Avatar
              className="avatar"
              size="80"
              round={true}
              name={sessionData?.user.email ?? undefined}
              src={sessionData?.user.image ?? undefined}
            />
          </Stack>
        </Typography>

        <Typography
          className="popover_olovka"
          id="modal-modal-title"
          sx={{
            textAlign: "center",
            marginTop: 1,
          }}
          variant="h6"
          component="h2"
        >
          <App>{sessionData?.user.name}</App>
        </Typography>
        <Typography
          id="modal-modal-title"
          sx={{ textAlign: "center", fontSize: 15 }}
          variant="h6"
          component="h2"
        >
          {sessionData?.user.email}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography
          id="modal-modal-description"
          sx={{ mt: 2, paddingLeft: 2, paddingBottom: 2 }}
        >
          Tvrtke
        </Typography>

        {companies.data.map((firma) => {
          return (
            <div
              className={firma.id === company?.id ? "link" : "popover"}
              key={firma.id}
              onClick={() => {
                setCompany(firma);
                handleClose();
              }}
              style={{
                justifyContent: "start",
                display: "flex",
                cursor: "pointer",
                paddingLeft: 20,
                paddingBottom: 5,
                paddingTop: 5,
              }}
            >
              <MuiAvatar
                alt=""
                src={firma.logo ?? undefined}
                sx={{
                  width: 30,
                  height: 30,
                  marginRight: 5,
                }}
              />
              <Typography
                id="modal-modal-description"
                sx={{
                  marginTop: 0.5,
                  position: "relative",
                  overflowWrap: "break-word",
                }}
              >
                {firma.name}
              </Typography>
            </div>
          );
        })}
        <div
          className="popover"
          style={{
            justifyContent: "start",
            display: "flex",
            cursor: "pointer",
            paddingLeft: 20,
            paddingBottom: 5,
            paddingTop: 5,
          }}
          onClick={() => openCompanyModal()}
        >
          <MuiAvatar
            sx={{
              width: 30,
              height: 30,
              marginRight: 5,
            }}
          >
            <AddIcon />
          </MuiAvatar>
          <Typography
            id="modal-modal-description"
            sx={{
              marginTop: 0.5,
              position: "relative",
              overflowWrap: "break-word",
              width: 400,
            }}
          >
            Dodaj tvrtku
          </Typography>
        </div>

        <div
          className="popover"
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "left",
            cursor: "pointer",
          }}
          onClick={() => void signOut({ callbackUrl: "/" })}
        >
          <Typography
            id="modal-modal-description"
            sx={{
              mt: 2,
              mb: 2,
              marginLeft: 3,
            }}
          >
            Odjava
          </Typography>
        </div>
      </Popover>
    </div>
  );
}
