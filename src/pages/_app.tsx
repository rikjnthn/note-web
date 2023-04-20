import type { AppProps } from "next/app";

import PocketProvider from "@/context/PocketProvider";

import "@/styles/globals.css";

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: { getLayout?: (page: React.ReactElement) => React.ReactNode };
}) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(
    <PocketProvider>
      <div className="flex">
        <Component {...pageProps} />
      </div>
    </PocketProvider>
  );
}
