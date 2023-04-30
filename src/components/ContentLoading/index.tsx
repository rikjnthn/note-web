import React from "react";
import Image from "next/image";

import style from "./ContentLoading.module.css";
import Head from "next/head";

const ContentLoading = () => {
  return (
    <>
      <Head>
        <title>Note Web</title>
      </Head>
      <div className={style.loader_container}>
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
