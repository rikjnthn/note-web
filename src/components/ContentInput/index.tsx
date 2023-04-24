import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { usePocket } from "@/context/PocketProvider";

import style from "./ContentInput.module.css";
import { openSans } from "@/fonts";
import Image from "next/image";

const ContentInput = () => {
  const { pb } = usePocket();
  const { fileID } = useRouter().query;

  const [inputContent, setInputContent] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(true);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const inp = e.currentTarget.value;
    setInputContent(() => inp);
  };

  const saveContent = async () => {
    if (typeof fileID === "string") {
      try {
        await pb
          ?.collection("notes_file")
          .update(fileID, { notes_content: inputContent });
      } catch (e) {
        alert("Cannot save your notes");
        console.log(e);
      }
    }
  };

  const getContent = async () => {
    try {
      setIsloading(() => true);
      if (typeof fileID === "string") {
        const record = await pb
          ?.collection("notes_file")
          .getOne(fileID, { $autoCancel: false });
        setInputContent(() => record?.notes_content);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsloading(() => false);
    }
  };

  useEffect(() => {
    getContent();
  }, [fileID]);

  if (isLoading) {
    return (
      <div className={style.loader_container}>
        <Image
          className="spinner"
          src="/assets/spinner_black.svg"
          alt="tes"
          width={100}
          height={100}
        />
      </div>
    );
  }

  return (
    <form className={style.content_input}>
      <textarea
        onInput={handleInput}
        onBlur={saveContent}
        spellCheck={false}
        className={`${openSans.className}`}
        placeholder="Text here..."
        value={inputContent}
      />
      <button>Save</button>
    </form>
  );
};

export default ContentInput;
