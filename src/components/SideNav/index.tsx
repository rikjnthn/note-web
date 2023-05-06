import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { User } from "..";
import AddFolder from "../AddFolder";
import FolderList from "../FolderList";

import style from "./SideNav.module.css";
import { openSans } from "@/fonts";

const SideNav = ({ open }: { open: boolean }) => {
  const [addFolder, setAddFolder] = useState<boolean>(false);

  return (
    <nav
      className={`${style.nav} ${openSans.className} full-height ${
        open ? style.translateX : ""
      }`}
    >
      <div>
        <User />
      </div>

      <div>
        <FolderList addFolder={addFolder} setAddFolder={setAddFolder} />
      </div>

      <div>
        <AddFolder setAddFolder={setAddFolder} />
      </div>
      {/* 
      <div className={style.setting}>
        <Link href="/setting">
          <span>Setting</span>
          <Image
            src="/assets/setting.svg"
            alt="setting"
            width={15}
            height={15}
          />
        </Link>
      </div> */}
    </nav>
  );
};

export default SideNav;
