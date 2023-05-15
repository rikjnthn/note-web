import React, { useState } from "react";

import { sanitize } from "dompurify";
import type { Record } from "pocketbase";

import { usePocket } from "@/context/PocketProvider";

import style from "./FolderInput.module.css";

const FolderInput = ({
  folder,
  setAddFolder,
}: {
  folder: Record[] | undefined;
  setAddFolder: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { pb, user } = usePocket();

  const [folderName, setFolderName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isCreateFolder, setIsCreateFolder] = useState<boolean>(false);

  const createFolder = async () => {
    setIsCreateFolder(() => true);
    try {
      const isAlreadyhas = folder?.filter(
        (val) => val.folder_name === folderName
      );

      if (isAlreadyhas?.length) throw new Error("Folder name has already use");

      await pb
        ?.collection("notes_folder")
        .create({ folder_name: folderName, user: user?.id });

      setAddFolder(() => false);
    } catch {
      setIsCreateFolder(() => false);
      setError(() => true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isCreateFolder) return;
    e.preventDefault();
    if (folderName) createFolder();
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const inp = sanitize(e.currentTarget.value, { RETURN_DOM: true });
    setFolderName(() => inp.textContent ?? "");
    setError(() => false);
  };

  const handleBlur = () => {
    if (isCreateFolder) return;
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
      <dialog open>tes</dialog>
    </form>
  );
};

export default FolderInput;
