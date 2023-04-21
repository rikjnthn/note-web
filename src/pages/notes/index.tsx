import React from "react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import Layout from "@/components/Layout";

export default function Notes() {
  return <></>;
}

Notes.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps({
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {
  if (!req.cookies.pb_auth) {
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
