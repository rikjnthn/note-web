import Head from "next/head";
import React from "react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Layout from "@/components/Layout";

const FilePage = () => {
  return (
    <>
      <Head>
        <title>Note Web</title>
      </Head>
    </>
  );
};
export default FilePage;

FilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps({
  req,
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {
  
  if (JSON.parse(req.cookies.pb_auth ?? "").model.username !== query.user) {
    return {
      redirect: {
        destination: `/${JSON.parse(req.cookies.pb_auth ?? "").model.username}`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
