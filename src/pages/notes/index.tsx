import React from "react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import Pocketbase from "pocketbase";

import Layout from "@/components/Layout";
import Head from "next/head";

export default function Notes() {
  return (
    <>
      <Head>
        <title>Note Web</title>
      </Head>
    </>
  );
}

Notes.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps({
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {
  const pb = new Pocketbase();

  pb.authStore.loadFromCookie(req.headers.cookie ?? "");

  if (!pb.authStore.model) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
