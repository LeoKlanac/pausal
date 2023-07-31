import NordigenClient from "nordigen-node";
import { z } from "zod";
import { env } from "../../../env.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const nordigen = new NordigenClient({
  secretId: env.NORDIGEN_SECRET_ID,
  secretKey: env.NORDIGEN_SECRET_KEY,
});

// TODO: handle expirations
void nordigen.generateToken();

export interface Institution {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo: string;
}

interface Requisition {
  id: string;
  created: string;
  redirect: string;
  status: string;
  institution_id: string;
  agreement: string;
  reference: string;
  accounts: string[];
  user_language: string;
  link: string;
  ssn: string | null;
  account_selection: boolean;
  redirect_immediate: boolean;
}

export const bankRouter = createTRPCRouter({
  getInstitutions: protectedProcedure.query(async ({}) => {
    return nordigen.institution.getInstitutions({
      country: "HR",
    }) as Promise<Institution[]>;
  }),
  linkToken: protectedProcedure
    .input(z.object({ institutionId: z.string(), redirectUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // The library types are horrible.
      // All the inputs to initSession are mandatory in typescript and in reality they are not.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const init = (await nordigen.initSession({
        redirectUrl: input.redirectUrl,
        institutionId: "SANDBOXFINANCE_SFIN0000",
        userLanguage: "HR",
      })) as Requisition;

      await ctx.prisma.nordigenRequisition.create({
        data: {
          id: init.id,
          user_id: ctx.session.user.id,
        },
      });

      return init;
    }),
  getBankAccountsData: protectedProcedure.query(async ({ ctx }) => {
    await nordigen.generateToken();

    const requisitions = await ctx.prisma.nordigenRequisition.findMany({
      where: { user_id: ctx.session.user.id },
    });

    const nordigenRequisitions = await Promise.all(
      requisitions.map(
        (requisition) =>
          nordigen.requisition.getRequisitionById(
            requisition.id
          ) as Promise<Requisition>
      )
    );

    const data = await Promise.all(
      nordigenRequisitions.map((requisition) => {
        return Promise.all(
          requisition.accounts.map(async (account) => {
            const nordigenAccount = nordigen.account(account);
            const [metadata, balances, details, transactions] =
              await Promise.all([
                nordigenAccount.getMetadata(),
                nordigenAccount.getBalances(),
                nordigenAccount.getDetails(),
                nordigenAccount.getTransactions(),
              ]);

            return { metadata, balances, details, transactions };
          })
        );
      })
    );

    return data;
  }),
});
