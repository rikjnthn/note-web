import React, { useState, useEffect } from "react";

import { Record, UnsubscribeFunc } from "pocketbase";

import { usePocket } from "@/context/PocketProvider";

import File from "../File";

import style from "./FileList.module.css";
import FileInput from "../FileInput";

interface FileListPropsType {
  addFile: boolean;
  setAddFile: React.Dispatch<React.SetStateAction<boolean>>;
  folderId: string;
}

const FileList = ({ addFile, setAddFile, folderId }: FileListPropsType) => {
  const { pb } = usePocket();

  const [file, setFile] = useState<Record[] | undefined>();

  const getFile = async () => {
    const data = await pb?.collection("notes_file").getList(1, 50, {
      filter: `(folder.id="${folderId}")`,
      sort: "+file_name",
      $autoCancel: false,
    });

    const items = data?.items;
    setFile(() => {
      if (typeof items === "object") return [...items];
    });
  };

  let unsubscribe: UnsubscribeFunc | undefined;

  const pbSubscribe = async () => {
    unsubscribe = await pb
      ?.collection("notes_file")
      .subscribe("*", async (e) => {
        if (e.action === "create") await getFile();
        if (e.action === "delete") await getFile();
      });
  };

  useEffect(() => {
    pbSubscribe();
    getFile();

    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <ul className={style.file_list}>
      {addFile && <FileInput setAddFile={setAddFile} folderId={folderId} />}

      {file?.map((value) => {
        return (
          <File key={value.id} fileName={value.file_name} fileId={value.id} />
        );
      })}
    </ul>
  );
};

export default FileList;
