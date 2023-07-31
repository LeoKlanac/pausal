import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const companyRouter = createTRPCRouter({
  createCompany: protectedProcedure
    .input(z.object({ name: z.string().min(1), logo: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.prisma.company.create({
        data: input,
      });

      await ctx.prisma.userCompany.create({
        data: {
          userId: ctx.session.user.id,
          companyId: company.id,
        },
      });
    }),
  getCompanies: protectedProcedure.query(async ({ ctx }) => {
    const companies = await ctx.prisma.userCompany.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        company: true,
      },
    });

    return companies.map(({ company }) => company);
  }),
  updateCompany: protectedProcedure
    .input(
      z.object({
        companyId: z.string(),
        name: z.string().min(1),
        logo: z.string().optional(),
        oib: z.string().optional(),
        country: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
        zip: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { companyId, ...modificators } = input;
      return await ctx.prisma.company.update({
        where: {
          id: companyId,
        },
        data: modificators,
      });
    }),
});
