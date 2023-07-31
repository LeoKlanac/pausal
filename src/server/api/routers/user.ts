import { S3 } from "aws-sdk";
import { randomUUID } from "crypto";
import { z } from "zod";
import { env } from "../../../env.mjs";

import { createTRPCRouter, protectedProcedure } from "../trpc";
const s3 = new S3({
  accessKeyId: env.ACCESS_KEY,
  secretAccessKey: env.SECRET_KEY,
  region: env.REGION,
});

export const userRouter = createTRPCRouter({
  changeName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  signS3Url: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const ex = input.filename.split("/")[1];
      const Key = `${randomUUID()}.${ex}`;
      const s3Params = {
        Bucket: env.BUCKET_NAME,
        Key: Key,
        ContentType: `image/${ex}`,
        ACL: "public-read",
      };
      console.log(input);

      const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);

      return { uploadUrl, Key };
    }),
});
