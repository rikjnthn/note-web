import React from "react";
import Image from "next/image";

import style from "./AddFolder.module.css";

const AddFolder = ({
  setAddFolder,
}: {
  setAddFolder: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleAddFolder = () => {
    setAddFolder(() => true);
  };

  return (
    <button type="button" onClick={handleAddFolder} className={style.add_folder}>
      <span>Add Folder</span>
      <Image src="/assets/plus.svg" alt="add folder" width={15} height={15} />
    </button>
  );
};

export default AddFolder;
