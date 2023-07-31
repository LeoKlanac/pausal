import { Box, Button, Grid } from "@mui/material";
import { api } from "../../../utils/api";
import { Layout } from "../../layout/layout";
import { usePickBankAccountDialog } from "../../stores/pickBankAccountDialogStore";
import PickBankAccountDialog from "../bankovni-racuni/PickBankAccountDialog";

export default function BankovniRacuni() {
  const { openPickBankAccountDialog } = usePickBankAccountDialog((state) => ({
    openPickBankAccountDialog: state.openPickBankAccountDialog,
  }));

  const institutions = api.bank.getInstitutions.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" onClick={openPickBankAccountDialog}>
            Poveži račun
          </Button>

          {institutions.isSuccess && (
            <PickBankAccountDialog institutions={institutions.data} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

BankovniRacuni.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title={"Bankovni računi"}>{page}</Layout>;
};
