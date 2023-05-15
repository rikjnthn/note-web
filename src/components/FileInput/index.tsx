import React, { useState } from "react";

import { sanitize } from "dompurify";
import type { Record } from "pocketbase";

import { usePocket } from "@/context/PocketProvider";

import style from "./FileInput.module.css";

const FileInput = ({
  file,
  setAddFile,
  folderId,
}: {
  file: Record[] | undefined;
  setAddFile: React.Dispatch<React.SetStateAction<boolean>>;
  folderId: string;
}) => {
  const { pb } = usePocket();

  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isCreateFile, setIsCreateFIle] = useState<boolean>(false);

  const createFile = async () => {
    setIsCreateFIle(() => true);
    try {
      const isAlreadyHas = file?.filter((val) => val.file_name === fileName);
      if (isAlreadyHas?.length)
        throw new Error("File name has already been use");
      await pb
        ?.collection("notes_file")
        .create({ file_name: fileName, folder: folderId });

      setAddFile(() => false);
    } catch {
      setIsCreateFIle(() => false);
      setError(() => true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isCreateFile) return;
    e.preventDefault();
    if (fileName) createFile();
  };

  const handleBlur = () => {
    if (isCreateFile) return;
    if (fileName) createFile();
    if (!fileName) setAddFile(() => false);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const inp = sanitize(e.currentTarget.value, { RETURN_DOM: true });
    setFileName(() => inp.textContent ?? "");
    setError(() => false);
  };

  return (
    <form onSubmit={handleSubmit} className={style.file_input}>
      <input
        onInput={handleInput}
        onBlur={handleBlur}
        type="text"
        value={fileName}
        placeholder="File name"
        autoFocus
        spellCheck="false"
        autoComplete="off"
        required
      />
      {error && <span>Filename already exist</span>}
    </form>
  );
};

export default FileInput;
