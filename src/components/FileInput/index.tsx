import React, { useState } from "react";

import { sanitize } from "dompurify";

import { usePocket } from "@/context/PocketProvider";

import style from "./FileInput.module.css";

const FileInput = ({
setAddFile,
  folderId,
}: {
  setAddFile: React.Dispatch<React.SetStateAction<boolean>>;
  folderId: string;
}) => {
  const { pb } = usePocket();

  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const createFile = async () => {
    try {
      await pb
        ?.collection("notes_file")
        .create({ file_name: fileName, folder: folderId });

      setAddFile(() => false);
    } catch (e: any) {
      setError(() => true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName) createFile();
  };

  const handleBlur = () => {
    if (fileName) createFile();
    if (!fileName) setAddFile(() => false);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const inp = sanitize(e.currentTarget.value, {RETURN_DOM: true});
    setFileName(() => inp.textContent ?? '');
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
        spellCheck='false'
        autoComplete="off"
        required
      />
      {error && <span>Filename already exist</span>}
    </form>
  );
};

export default FileInput;
