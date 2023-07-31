import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Client, Product } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { id } from "aws-sdk/clients/datapipeline";

type Klijent = {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  reset: () => void;
};

export const useAddClientRacunStore = create<Klijent>((set) => ({
  selectedClient: null,
  setSelectedClient: (client) => set(() => ({ selectedClient: client })),
  reset: () =>
    set((state) => ({
      ...state,
      selectedClient: null,
    })),
}));

interface InvoiceProduct extends Product {
  id: string;
  qty: number;
  discount: number;
}

interface InvoiceProducts {
  products: InvoiceProduct[];
  setProducts: (products: InvoiceProduct[]) => void;
  reset: () => void;
}

export const useInvoiceProducts = create<InvoiceProducts>()(
  devtools(
    (set) => ({
      products: [
        {
          id: uuidv4(),
          name: "",
          userId: "",
          unit: "",
          currency: "",
          description: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          price: 0,
          qty: 0,
          discount: 0,
        },
      ],
      setProducts: (products) => set({ products }),
      reset: () =>
        set({
          products: [
            {
              id: uuidv4(),
              name: "",
              userId: "",
              unit: "",
              currency: "",
              description: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              price: 0,
              qty: 0,
              discount: 0,
            },
          ],
        }),
    }),
    { name: "addInvoiceStore" }
  )
);
