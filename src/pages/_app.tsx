import type { AppProps } from "next/app";
import Router from "next/router";
import { useState } from "react";

import PocketProvider from "@/context/PocketProvider";

import ContentLoading from "@/components/ContentLoading";
import "@/styles/globals.css";

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: { getLayout?: (page: React.ReactElement) => JSX.Element };
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getLayout = Component.getLayout ?? ((page) => page);

  Router.events.on("routeChangeStart", () => setIsLoading(() => true));
  Router.events.on("routeChangeComplete", () => setIsLoading(() => false));
  Router.events.on("routeChangeError", () => setIsLoading(() => false));

  return (
    <PocketProvider>
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
