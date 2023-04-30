import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import Pocketbase from "pocketbase";

import { usePocket } from "@/context/PocketProvider";

import Layout from "@/components/Layout";
import style from "@/styles/App.module.css";
import { openSans } from "@/fonts";
import ContentInput from "@/components/ContentInput";

export default function FileContent() {
  const { pb } = usePocket();
  const { fileID } = useRouter().query;

  const [isExist, setIsExist] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (typeof fileID === "string")
      pb?.collection("notes_file")
        .getOne(fileID, { $autoCancel: false })
        .then((res) => {
          setFileName(() => res.file_name);
          setIsExist(() => true);
        })
        .catch(() => setIsExist(() => false));
  }, [fileID]);

  if (isExist) {
    return (
      <>
        <Head>
          <title>{fileName}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <main className={`${style.file_edit} ${openSans.className}`}>
          <ContentInput />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Error 404</title>
      </Head>
      <div className={`${style.not_found} ${openSans.className}`}>
        <span>404</span>
        <span>File Not Found</span>
      </div>
    </>
  );
}

FileContent.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps({
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {
  const pb = new Pocketbase("http://127.0.0.1:8090");

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
