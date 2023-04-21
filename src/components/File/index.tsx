import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { usePocket } from "@/context/PocketProvider";

import style from "./File.module.css";

const File = ({ fileName, fileId }: { fileName: string; fileId: string }) => {
  const { pb, user } = usePocket();

  const router = useRouter();
  const { fileID } = router.query;

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (fileId == fileID) setOpen(() => true);
    else setOpen(() => false);
  }, [fileId, fileID]);

  const handleDelete = async () => {
    await pb?.collection("notes_file").delete(fileId);
    router.push(`${window.location.origin}/notes`);
  };

  return (
    <li className={`${style.file} ${open ? style.open : ""}`}>
      <Link href={`/notes/${fileId}`}>
        <span title={fileName}>{fileName}</span>
        <div>
          <Image
            onClick={handleDelete}
            src="/assets/delete.svg"
            alt="delete file"
            title="delete file"
            width={13}
            height={13}
          />
        </div>
      </Link>
    </li>
  );
};

export default File;
