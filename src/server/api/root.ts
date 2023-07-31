import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { companyRouter } from "./routers/company";
import { clientRouter } from "./routers/clients";
import { bankRouter } from "./routers/banks";
import { productsRouter } from "./routers/products";
import { locationsRouter } from "./routers/locations";
import { invoiceRouter } from "./routers/racuni";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  company: companyRouter,
  clients: clientRouter,
  bank: bankRouter,
  products: productsRouter,
  locations: locationsRouter,
  racuni: invoiceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
