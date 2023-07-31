import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";

interface DateState {
  datumRacuna: Dayjs;
  datumDospijeca: Dayjs;
  datumIsporuke: Dayjs;
  brojRacuna: string;
  setBrojRacuna: (value: string) => void;
  setDatumRacuna: (value: Dayjs) => void;
  setDatumDospijeca: (value: Dayjs) => void;
  setDatumIsporuke: (value: Dayjs) => void;
  reset: () => void;
}

export const useDateTimeStore = create<DateState>((set) => ({
  datumRacuna: dayjs(),
  datumDospijeca: dayjs().add(10, "day"),
  datumIsporuke: dayjs(),
  brojRacuna: "",
  setBrojRacuna: (value: string) => set(() => ({ brojRacuna: value })),
  setDatumRacuna: (value: Dayjs) => set(() => ({ datumRacuna: value })),
  setDatumDospijeca: (value: Dayjs) => set(() => ({ datumDospijeca: value })),
  setDatumIsporuke: (value: Dayjs) => set(() => ({ datumIsporuke: value })),
  reset: () =>
    set(() => ({
      datumRacuna: dayjs(),
      datumDospijeca: dayjs().add(10, "day"),
      datumIsporuke: dayjs(),
      brojRacuna: "",
    })),
}));
