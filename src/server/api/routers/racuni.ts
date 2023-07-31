import { z } from "zod";
import Racuni from "../../../pages/dashboard/racuni";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const invoiceRouter = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(
      z.object({
        brojRacuna: z.string(),
        datumRacuna: z.date(),
        datumDospijeca: z.date(),
        datumIsporuke: z.date(),
        clientId: z.string(),
        companyId: z.string(),

        invoiceItem: z.array(
          z.object({
            naziv: z.string(),
            kolicina: z.number(),
            cijena: z.number(),
            popust: z.number(),
            opis: z.string(),
            mjernaJedinica: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { invoiceItem, ...racun } = input;

      await ctx.prisma.invoice.create({
        data: {
          ...racun,
          userId: ctx.session.user.id,
          //@ts-ignore
          InvoiceItem: {
            createMany: {
              data: invoiceItem,
            },
          },
        },
      });
    }),

  getInvoice: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.invoice.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        client: true,
        InvoiceItem: {
          select: {
            naziv: true,
            kolicina: true,
            cijena: true,
            popust: true,
            opis: true,
            mjernaJedinica: true,
          },
        },
      },
    });
  }),
  updateInvoice: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        brojRacuna: z.string(),
        datumRacuna: z.date(),
        datumDospijeca: z.date(),
        datumIsporuke: z.date(),
        clientId: z.string(),
        companyId: z.string(),
        invoiceItem: z.array(
          z.object({
            naziv: z.string(),
            kolicina: z.number(),
            cijena: z.number(),
            popust: z.number(),
            opis: z.string(),
            mjernaJedinica: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { invoiceItem, ...racun } = input;

      await ctx.prisma.invoiceItem.deleteMany({
        where: {
          invoiceId: racun.id,
        },
      });

      await ctx.prisma.invoice.update({
        where: { id: racun.id },
        data: {
          ...racun,
          userId: ctx.session.user.id,
          InvoiceItem: {
            createMany: {
              data: invoiceItem,
            },
          },
        },
      });
    }),
  deleteInvoice: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.invoice.delete({
        where: { id: input.invoiceId },
      });
    }),
});
