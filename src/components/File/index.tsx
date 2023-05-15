import React, { MouseEventHandler, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { usePocket } from "@/context/PocketProvider";

import style from "./File.module.css";

const File = ({ fileName, fileId }: { fileName: string; fileId: string }) => {
  const { pb } = usePocket();

  const router = useRouter();
  const { fileID } = router.query;

  const [open, setOpen] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  useEffect(() => {
    if (fileId == fileID) setOpen(() => true);
    else setOpen(() => false);
  }, [fileId, fileID]);

  const handleDelete = async () => {
    setIsDelete(() => true);
    try {
      if (window.location.href !== `${window.location.origin}/notes`)
        router.push(`${window.location.origin}/notes`);
      await pb?.collection("notes_file").delete(fileId);
    } catch {
      alert("Cannot delete file");
      setIsDelete(() => false);
    }
  };

  return (
    <li
      className={`${style.file} ${open ? style.open : ""} ${
        isDelete ? style.display_none : ""
      }`}
    >
      <Link href={`/notes/${fileId}`}>
        <span title={fileName}>{fileName}</span>
      </Link>
      <Image
        onClick={handleDelete}
        src="/assets/delete.svg"
        alt="delete file"
        title="delete file"
        width={13}
        height={13}
      />
    </li>
  );
};

export default File;
