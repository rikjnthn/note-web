import type { AppProps, AppContext } from "next/app";
import App from "next/app";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import PocketProvider from "@/context/PocketProvider";

import ContentLoading from "@/components/ContentLoading";
import "@/styles/globals.css";

export default function MyApp({
  Component,
  pageProps,
  API_URL,
}: AppProps & {
  Component: { getLayout?: (page: React.ReactElement) => JSX.Element };
  API_URL: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(() => true);
    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router]);

  useEffect(() => {
    const handleRouteChangeComplete = () => setIsLoading(() => false);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeComplete);
    };
  }, [router]);
  
  useEffect(() => {
    const handleRouteChangeError = () => setIsLoading(() => false);
    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeError);
    };
  }, [router]);

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
  const appProps = await App.getInitialProps(ctx);
  const API_URL = process.env.API_URL;

  return {
    ...appProps,
    API_URL,
  };
};
