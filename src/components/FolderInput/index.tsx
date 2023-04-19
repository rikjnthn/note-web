import React, { useState } from "react";

import { sanitize } from "dompurify";

import { usePocket } from "@/context/PocketProvider";

import style from "./FolderInput.module.css";

const FolderInput = ({
  setAddFolder,
}: {
  setAddFolder: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { pb, user } = usePocket();

  const [folderName, setFolderName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const createFolder = async () => {
    try {
      const data = await pb
        ?.collection("notes_folder")
        .create({ folder_name: folderName, user: user?.id });

      setAddFolder(() => false);
    } catch (e: any) {
      setError(() => true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName) createFolder();
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const inp = sanitize(e.currentTarget.value);
    setFolderName(() => inp);
    setError(() => false);
  };

  const handleBlur = () => {
    if (folderName) createFolder();
    if (!folderName) setAddFolder(() => false);
  };

  return (
    <form onSubmit={handleSubmit} className={style.folder_input}>
      <input
        onInput={handleInput}
        onBlur={handleBlur}
        type="text"
        value={folderName}
        placeholder="Folder name"
        autoFocus
        autoComplete="off"
        spellCheck="false"
        required
      />
      {error && <span>Foldername already exist</span>}
    </form>
  );
};

export default FolderInput;
