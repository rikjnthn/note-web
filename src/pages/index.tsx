import Head from "next/head";
import React from "react";

import { openSans } from "@/fonts";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export default function Home() {
  return (
    <>
      <Head>
        <title>Note Web</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={openSans.className}>
        <header>
          <h2>Notes Web</h2>
          jadi ini harusnya desain buat homepage?
        </header>
      </main>
    </>
  );
}

export async function getServerSideProps({
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {

  if (req.cookies.pb_auth) {
    return {
      redirect: {
        permanent: false,
        destination: "/notes",
      },
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
  };
}
