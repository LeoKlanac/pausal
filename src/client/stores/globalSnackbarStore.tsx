import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SnackbarState {
  opened: boolean;
  message: string;
  showMsg: (message: string) => void;
  close: () => void;
}

export const useSnackbarStore = create<SnackbarState>()(
  devtools((set) => ({
    opened: false,
    message: "",
    showMsg: (message) => set({ opened: true, message: message }),
    close: () => set({ opened: false, message: "" }),
  }))
);
