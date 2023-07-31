import { createTRPCRouter, protectedProcedure } from "../trpc";

export const locationsRouter = createTRPCRouter({
  getLocations: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.location.findMany();
  }),
});
