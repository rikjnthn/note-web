import React, { useEffect, useState } from "react";
import Head from "next/head";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import pocketbaseInit from "@/helper/PocketbaseInit";

import Layout from "@/components/Layout";
import style from "@/styles/App.module.css";
import { openSans } from "@/fonts";

export default function FileContent({ isExist }: { isExist: boolean }) {
  const [content, setContent] = useState<string>("");

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const inp = e.currentTarget.value;
    setContent(() => inp);
  };

  const saveContent = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const inp = e.currentTarget.value;

    setContent(() => inp);
  };

  if (isExist) {
    return (
      <>
        <Head>
          <title>Note Website</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <main className={`${style.file_edit}`}>
          <form>
            <textarea
              onInput={handleInput}
              onBlur={saveContent}
              spellCheck={false}
              className={`${openSans.className}`}
              placeholder="Text here..."
              value={content}
            />
          </form>
        </main>
      </>
    );
  }

  return (
    <div className={`${style.not_found} ${openSans.className}`}>
      <span>404</span>
      <span>File Not Found</span>
    </div>
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
    const date = new Date()
    const time = date.getTime()
    const expired = time + 1000*3600*24*30
    date.setTime(expired)
    res.setHeader("set-cookies", pb.authStore.exportToCookie({ secure: true, expires: date }));
  });

  try {
    if (query.user !== pb.authStore.model?.username) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    if (typeof query.fileID === "string")
      await pb.collection("notes_file").getOne(query.fileID);

    return {
      props: {
        isExist: true,
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
