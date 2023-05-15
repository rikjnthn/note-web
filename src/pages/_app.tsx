import type { AppProps, AppContext } from "next/app";
import App from "next/app";
import Router from "next/router";
import { useState } from "react";

import PocketProvider from "@/context/PocketProvider";

import ContentLoading from "@/components/ContentLoading";
import "@/styles/globals.css";

export default function MyApp({
  Component,
  pageProps,
  API_URL
}: AppProps & {
  Component: { getLayout?: (page: React.ReactElement) => JSX.Element };
  API_URL: string
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getLayout = Component.getLayout ?? ((page) => page);

  Router.events.on("routeChangeStart", () => setIsLoading(() => true));
  Router.events.on("routeChangeComplete", () => setIsLoading(() => false));
  Router.events.on("routeChangeError", () => setIsLoading(() => false));

  return (
    <PocketProvider apiUrl={API_URL}>
      {getLayout(
        isLoading ? (
          <ContentLoading />
        ) : (
          <div className="flex">
            <Component {...pageProps} />
          </div>
        )
      )}
    </PocketProvider>
  );
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  const appProps = await App.getInitialProps(ctx)
  const API_URL = process.env.API_URL

  return {
    ...appProps,
    API_URL
  }
}