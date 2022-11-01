// // src/pages/api/trpc/[trpc].ts
// import { createNextApiHandler } from "@trpc/server/adapters/next";
// import { env } from "../../../env/server.mjs";
// import { appRouter } from "../../../server/router";
// import { createContext } from "../../../server/router/context";

// // export API handler
// export default createNextApiHandler({
//   router: appRouter,
//   createContext,
//   onError:
//     env.NODE_ENV === "development"
//       ? ({ path, error }) => {
//           console.error(`❌ tRPC failed on ${path}: ${error}`);
//         }
//       : undefined,
// });

import { createContext } from "../../../server/router/context";
import { appRouter } from "../../../server/router/_app";
import * as trpcNext from '@trpc/server/adapters/next';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error('Something went wrong', error)
    }
  },

  batching: {
    enabled: true,
  }
})