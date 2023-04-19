import React, { useEffect, useState } from "react";

import { Record, UnsubscribeFunc } from "pocketbase";

import { usePocket } from "@/context/PocketProvider";

import style from "./FolderList.module.css";
import Folder from "../Folder";
import FolderInput from "../FolderInput";

interface FolderListPropsType {
  addFolder: boolean;
  setAddFolder: React.Dispatch<React.SetStateAction<boolean>>;
}

const FolderList = ({ addFolder, setAddFolder }: FolderListPropsType) => {
  const { pb, user } = usePocket();

  const [folder, setFolder] = useState<Record[] | undefined>();

  const getFolder = async () => {
    const data = await pb?.collection("notes_folder").getList(1, 50, {
      filter: `(user.id="${user?.id}")`,
      sort: "+folder_name",
      $autoCancel: false,
    });

    const items = data?.items;
    setFolder(() => {
      if (typeof items === "object") return [...items];
    });
  };

  let unsubscribe: UnsubscribeFunc | undefined;

  const pbSubscribe = async () => {
    unsubscribe = await pb
      ?.collection("notes_folder")
      .subscribe("*", async (e) => {
        if (e.action === "create") await getFolder();
        if (e.action === "delete") await getFolder();
      });
  };

  useEffect(() => {
    pbSubscribe();
    getFolder();

    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <ul className={style.folder_list}>
      {addFolder && <FolderInput setAddFolder={setAddFolder} />}
      {folder?.map((value) => {
        return (
          <Folder
            key={value.id}
            folderName={value.folder_name}
            folderId={value.id}
          />
        );
      })}
    </ul>
  );
};

export default FolderList;
