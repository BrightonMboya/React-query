import { publicProcedure, router } from "../trpc";
import { postRouter } from "./post";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => 'yay!'),
  post: postRouter,
})

export type AppRouter = typeof appRouter;