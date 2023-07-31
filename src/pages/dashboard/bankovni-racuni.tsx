import PickBankAccountDialog from "../../client/components/bankovni-racuni/PickBankAccountDialog";
import { Layout } from "../../client/layout/layout";
import { usePickBankAccountDialog } from "../../client/stores/pickBankAccountDialogStore";
import { api } from "../../utils/api";

export default function BankovniRacuni() {
  const { openPickBankAccountDialog } = usePickBankAccountDialog((state) => ({
    openPickBankAccountDialog: state.openPickBankAccountDialog,
  }));

  const institutions = api.bank.getInstitutions.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <button onClick={openPickBankAccountDialog}>Povezi racun</button>

      {institutions.isSuccess && (
        <PickBankAccountDialog institutions={institutions.data} />
      )}
    </>
  );
}

BankovniRacuni.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout title={"Bankovni računi"}>{page}</Layout>;
};
