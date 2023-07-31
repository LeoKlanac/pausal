import {
  Button,
  DialogTitle,
  Grid,
  Input,
  InputAdornment,
} from "@mui/material";
import { useAddCompanyDialog } from "../stores/addCompanyDialogStore";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { IconButton } from "@mui/material";
import { api } from "../../utils/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbarStore } from "../stores/globalSnackbarStore";

async function uploadToS3(file: File, uploadUrl: string) {
  const putResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    // headers: {
    //   "Content-Type": fileType,
    // },
  });

  if (!putResponse.ok) {
    throw new Error("Failed to upload file to S3.");
  }
}

const CompanySchema = z.object({
  name: z.string().min(1, { message: "Potreban je naziv subjekta" }),
});
type CompanySchema = z.infer<typeof CompanySchema>;

export default function AddCompanyDialog() {
  const { addCompanyModalOpen, closeCompanyModal } = useAddCompanyDialog(
    (state) => ({
      addCompanyModalOpen: state.addCompanyDialogOpen,
      openCompanyModal: state.openCompanyDialog,
      closeCompanyModal: state.closeCompanyDialog,
    })
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanySchema>({
    resolver: zodResolver(CompanySchema),
  });
  const handleClose = () => closeCompanyModal();

  const apiContex = api.useContext();
  const { showMsg } = useSnackbarStore((state) => ({
    showMsg: state.showMsg,
  }));
  const createCompanytMutation = api.company.createCompany.useMutation({
    onSuccess: () => {
      apiContex.company.getCompanies.invalidate();
    },
  });

  const onSubmit: SubmitHandler<CompanySchema> = async (data) => {
    let logoUrl = undefined;
    if (selectedImage) {
      const uploadImage = await context.user.signS3Url.fetch({
        filename: selectedImage.type,
      });

      const { Key, uploadUrl } = uploadImage;
      await uploadToS3(selectedImage, uploadUrl);
      logoUrl = `https://pre-signed-url-pausal.s3.eu-north-1.amazonaws.com/${Key}`;
    }
    createCompanytMutation.mutate({
      name: data.name,
      logo: logoUrl,
    });

    showMsg("Dodali ste tvrtku.");
    closeCompanyModal();
  };
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const context = api.useContext();

  async function handleUpload() {
    if (!selectedImage) return;
    const data = await context.user.signS3Url.fetch({
      filename: selectedImage.type,
    });
    console.log(data);
  }

  return (
    <Dialog open={addCompanyModalOpen} onClose={handleClose}>
      <DialogTitle>Dodaj novi poslovni subjekt</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            flexGrow: 1,
            paddingBottom: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {selectedImage ? (
                <div>
                  <img
                    alt="not found"
                    width={"250px"}
                    src={URL.createObjectURL(selectedImage)}
                  />
                  <br />
                  <Button
                    variant="contained"
                    onClick={() => setSelectedImage(null)}
                  >
                    Ukloni
                  </Button>
                </div>
              ) : (
                <IconButton component="label" color="primary">
                  <CameraAltIcon />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                      const input = event.target as HTMLInputElement;
                      if (input.files && input.files.length > 0) {
                        setSelectedImage(input.files[0] ?? null);
                      } else {
                        setSelectedImage(null);
                      }
                    }}
                  />
                </IconButton>
              )}
            </Grid>
            <Grid item xs={12}>
              <DialogContentText>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": {
                      m: 1,
                      width: "90%",
                      position: "relative",
                      right: 7,
                      paddingBottom: 3,
                    },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      fullWidth
                      sx={{}}
                      required
                      id="outlined-required"
                      label="Naziv subjekta..."
                      {...register("name")}
                      defaultValue=""
                      error={errors.name ? true : false}
                      helperText={errors.name?.message}
                    />
                    <br />
                  </div>
                </Box>
              </DialogContentText>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          PONIŠTI
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleSubmit(onSubmit)();
            handleUpload();
          }}
        >
          DODAJ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
