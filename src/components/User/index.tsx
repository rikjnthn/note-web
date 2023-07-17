import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { usePocket } from "@/context/PocketProvider";

import style from "./User.module.css";

const User = () => {
  const [userOption, setUserOption] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const { pb, user, logout } = usePocket();
  const router = useRouter();

  const handleLogout = () => {
    pb?.authStore.clear();
    logout?.();
    document.cookie = `pb_auth=;expires=Thu, 01 Jan 1970 00:00:01 GMT;Path=/;`;
    router.push("/");
  };

  const handleDelete = async () => {
    pb?.authStore.clear();
    await pb?.collection("users").delete(user?.id ?? "");
    document.cookie = `pb_auth=;expires=Thu, 01 Jan 1970 00:00:01 GMT;Path=/;`;
    router.push("/");
  };

  useEffect(() => {
    setUsername(() => user?.username);
  }, [user?.username]);

  return (
    <div className={style.user}>
      <button onClick={() => setUserOption(() => true)} type="button">
        {username}
      </button>

      {userOption && (
        <div>
          <button onClick={() => setUserOption(() => false)} type="button">
            <Image
              src="/assets/delete.svg"
              alt="close"
              width={13}
              height={13}
            />
          </button>
          <div className={style.option}>
            <button onClick={handleLogout} type="button">
              <Image
                src="/assets/logout.svg"
                alt="setting"
                width={15}
                height={15}
              />
              <span>Logout</span>
            </button>
            <button onClick={handleDelete} type="button">
              <Image
                src="/assets/delete.svg"
                alt="setting"
                width={13}
                height={13}
              />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
