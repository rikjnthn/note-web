import React from "react";
import Head from "next/head";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import Pocketbase from "pocketbase";

import Layout from "@/components/Layout";
import style from "@/styles/App.module.css";
import { openSans } from "@/fonts";
import ContentInput from "@/components/ContentInput";
import type { FileContentType } from "@/types/File";

export default function FileContent({
  isExist,
  content,
  fileName,
}: FileContentType) {
  if (isExist) {
    return (
      <>
        <Head>
          <title>{fileName}</title>
        </Head>

        <main className={`${style.file_edit} ${openSans.className}`}>
          <ContentInput content={content} />
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
  query,
}: GetServerSidePropsContext): Promise<
  GetServerSidePropsResult<FileContentType>
> {
  const pb = new Pocketbase(process.env.API_URL);

  pb.authStore.loadFromCookie(req.headers.cookie ?? "");

  if (!pb.authStore.model) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    if (typeof query.fileID === "string") {
      const record = await pb
        ?.collection("notes_file")
        .getOne(query.fileID, { $autoCancel: false });

      return {
        props: {
          isExist: true,
          content: record.notes_content,
          fileName: record.file_name,
        },
      };
    }
  } catch {
    return {
      props: {
        isExist: false,
      },
    };
  }

  return {
    props: {},
  };
}
