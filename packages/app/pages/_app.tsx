import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { Toaster } from "react-hot-toast";
import { Router } from "next/router";
import nProgress from "nprogress";

// nprogress loader
Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

export default function App({ Component, pageProps }: AppProps) {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <ChakraProvider>
        {/* <DataContextProvider> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* </DataContextProvider> */}
      </ChakraProvider>
      <Toaster />
      {/* <Analytics /> */}
    </QueryClientProvider>
  );
}
