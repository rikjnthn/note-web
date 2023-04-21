import React from "react";
import Head from "next/head";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import pocketbaseInit from "@/helper/PocketbaseInit";

import Layout from "@/components/Layout";
import style from "@/styles/App.module.css";
import { openSans } from "@/fonts";
import ContentInput from "@/components/ContentInput";

export default function FileContent({
  isExist,
  fileName,
  content,
}: {
  isExist: boolean;
  fileName: string;
  content?: string;
}) {
  if (isExist) {
    return (
      <>
        <Head>
          <title>{fileName}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
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
  res,
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {
  const pb = await pocketbaseInit(req);
  pb.authStore.onChange(() => {
    const date = new Date();
    date.setTime(date.getDate() + 30);
    res.setHeader(
      "set-cookies",
      pb.authStore.exportToCookie({ secure: true, expires: date })
    );
  });

  try {
    if (typeof query.fileID === "string") {
      const record = await pb.collection("notes_file").getOne(query.fileID);

      return {
        props: {
          isExist: true,
          fileName: record.file_name,
          content: record.notes_content,
        },
      };
    }

    return {
      props: {
        isExist: false,
      },
    };
  } catch {
    return {
      props: {
        isExist: false,
      },
    };
  }
}
