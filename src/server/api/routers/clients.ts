import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const clientRouter = createTRPCRouter({
  createClient: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        country: z.string(),
        city: z.string(),
        address: z.string(),
        zip: z.string(),
        oib: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.client.create({
        data: {
          ...input,
          user_id: ctx.session.user.id,
        },
      });
    }),
  getClients: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.client.findMany({
      where: {
        user_id: ctx.session.user.id,
      },
    });
  }),
  updateClient: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        country: z.string(),
        city: z.string(),
        address: z.string(),
        zip: z.string(),
        oib: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { clientId, ...data } = input;

      await ctx.prisma.client.update({
        where: { id: clientId },
        data: {
          ...data,
          user_id: ctx.session.user.id,
        },
      });
    }),
  deleteClient: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.client.delete({
        where: { id: input.clientId },
      });
    }),
});
