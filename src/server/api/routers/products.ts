import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const productsRouter = createTRPCRouter({
  createProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        currency: z.string(),
        description: z.string(),
        unit: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.product.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
  getProducts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  updateProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        currency: z.string(),
        description: z.string(),
        unit: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, ...data } = input;

      await ctx.prisma.product.update({
        where: { id: productId },
        data: {
          ...data,
        },
      });
    }),
  deleteProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.product.delete({
        where: { id: input.productId },
      });
    }),
});
