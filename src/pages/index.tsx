import Head from "next/head";
import React from "react";

import Pocketbase from "pocketbase"

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
  const pb = new Pocketbase();

  pb.authStore.loadFromCookie(req.headers.cookie ?? "");

  if (pb.authStore.isValid) {
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
