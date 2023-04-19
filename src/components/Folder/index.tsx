import React, { useState } from "react";
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
  const { pb, user } = usePocket();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [addFile, setAddFile] = useState<boolean>(false);

  const handleAddFile = () => {
    setOpen(() => true);
    setAddFile(() => true);
  };

  const handleDelete = async () => {
    router.push(`${window.location.origin}/${user?.username}`);
    await pb?.collection("notes_folder").delete(folderId);
  };

  return (
    <li>
      <div className={style.folder}>
        <div onClick={() => setOpen((prevOpen) => !prevOpen)}>
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
      {open && (
        <FileList
          addFile={addFile}
          setAddFile={setAddFile}
          folderId={folderId}
        />
      )}
    </li>
  );
};

export default Folder;
