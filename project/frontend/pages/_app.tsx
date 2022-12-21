import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react";
import { ReactElement, ReactNode } from "react";
import getConfig from "next/config";
import { SWRConfig } from "swr";
import { NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import type { AppProps } from 'next/app'

import theme from "../theme";

const { publicRuntimeConfig } = getConfig();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

//TODO define baseURL when backend is ready
axios.defaults.baseURL = `${publicRuntimeConfig.API_URL}/api`;

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  return (
    <>
      <Head>
        <title>ZOO Manager</title>
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <SWRConfig
          value={{
            fetcher,
            onError: (err) => {
              console.error(err);
            },
            dedupingInterval: 10000,
          }}
        >
          {getLayout(<Component {...pageProps} />)}
        </SWRConfig>
      </ChakraProvider>
    </>
  );
}
