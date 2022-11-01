// src/pages/_app.tsx
import { withTRPC } from '@trpc/next';
import type { AppType, AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import '../styles/globals.css';
import { trpc } from '../utils/trpc';
import { DefaultLayout } from '../components/DefaultLayout';
import React from 'react';

// export type NextPageWithLayout<
//   TProps = Record<string, unknown>,
//   TInitialProps = TProps,
// > = NextPage<TProps, TInitialProps> & {
//     getLayout?: (page: ReactElement) => ReactNode;

// };

// type AppPropsWithLayout = AppProps & {
//   Component: NextPageWithLayout;
// };

const MyApp = (({ Component, pageProps }) => {
  const [queryClient] = React.useState(() => new QueryClient());
  // const getLayout =
  //   Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}) as AppType;
export default trpc.withTRPC(MyApp);
