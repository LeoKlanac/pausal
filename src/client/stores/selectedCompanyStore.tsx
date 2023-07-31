import { create } from "zustand";
import { RouterOutputs } from "../../utils/api";

import { persist, createJSONStorage } from "zustand/middleware";
type Companies = RouterOutputs["company"]["getCompanies"];
type Company = Companies[0];

interface SelectedCompanyStore {
  company: Company | undefined;
  setCompany: (company: Company) => void;
  reset: () => void;
}

export const useSelectedCompany = create<SelectedCompanyStore>()(
  persist(
    (set) => ({
      company: undefined,
      setCompany: (company: Company) => set(() => ({ company: company })),
      reset: () => set(() => ({ company: undefined })),
    }),
    { name: "selected-company" }
  )
);
