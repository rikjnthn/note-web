import React, { useState } from "react";
import { useRouter } from "next/router";

import { usePocket } from "@/context/PocketProvider";

import style from "./ContentInput.module.css";
import { openSans } from "@/fonts";

const ContentInput = ({ content }: { content?: string }) => {
  const { pb } = usePocket();
  const { fileID } = useRouter().query;

  const [inputContent, setInputContent] = useState<string>(content ?? "");

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
      }
    }
  };

  return (
    <form className={style.content_input}>
      <textarea
        onInput={handleInput}
        onBlur={saveContent}
        spellCheck={false}
        className={`${openSans.className}`}
        placeholder="Text here..."
        value={inputContent}
        autoFocus
      />
      {/* <button>Save</button> */}
    </form>
  );
};

export default ContentInput;
