import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import style from "./ContentLoading.module.css";
import Head from "next/head";

const ContentLoading = () => {
  const router = useRouter();
  const isNotes = router.pathname.startsWith("/notes");
  return (
    <>
      <Head>
        <title>Note Web</title>
      </Head>
      <div
        className={`${style.loader_container} ${
          isNotes ? "" : style.loader_full
        }`}
      >
        <Image
          className="spinner"
          src="/assets/spinner_black.svg"
          alt="tes"
          width={100}
          height={100}
        />
      </div>
    </>
  );
};
export default ContentLoading;
