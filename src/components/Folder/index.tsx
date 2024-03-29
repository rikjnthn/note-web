import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { usePocket } from "@/context/PocketProvider";

import FileList from "../FileList";

import style from "./Folder.module.css";

const Folder = ({
  folderName,
  folderId,
}: {
  folderName: string;
  folderId: string;
}) => {
  const { pb } = usePocket();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(
    JSON.parse(localStorage.getItem(folderId) ?? "false")
  );
  const [addFile, setAddFile] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const handleAddFile = () => {
    setOpen(() => true);
    setAddFile(() => true);
  };

  const handleDelete = async () => {
    setIsDelete(() => true);
    try {
      if (window.location.href !== `${window.location.origin}/notes`)
        router.push(`${window.location.origin}/notes`);
      await pb?.collection("notes_folder").delete(folderId);
      localStorage.removeItem(folderId);
    } catch {
      alert("Cannot delete folder")
      setIsDelete(() => false);
    }
  };

  const handleFolderOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    localStorage.setItem(folderId, JSON.stringify(open));
  }, [open, folderId]);

  return (
    <li className={isDelete ? "display_none" : ""}>
      <div className={style.folder}>
        <div onClick={handleFolderOpen}>
          <Image
            className={open ? "rotate-90deg" : ""}
            src="/assets/arrow.svg"
            alt="arrow"
            width="15"
            height="15"
          />
          <span title={folderName}>{folderName}</span>
        </div>
        <div className={style.add_file_delete_folder}>
          <Image
            onClick={handleAddFile}
            src="/assets/plus.svg"
            alt="add file"
            title="add file"
            width={15}
            height={15}
          />
          <Image
            onClick={handleDelete}
            src="/assets/delete.svg"
            alt="delete folder"
            title="delete folder"
            width={13}
            height={13}
          />
        </div>
      </div>
      <FileList
        open={open}
        addFile={addFile}
        setAddFile={setAddFile}
        folderId={folderId}
      />
    </li>
  );
};

export default Folder;
