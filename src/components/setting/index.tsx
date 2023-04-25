import React  from "react";
import { useRouter } from "next/router";

import { usePocket } from "@/context/PocketProvider";

export default function Setting() {
  const { pb, logout } = usePocket();
  const router = useRouter();

  const handleLogout = () => {
    pb?.authStore.clear();
    logout?.();
    document.cookie = `pb_auth=;expires=Thu, 01 Jan 1970 00:00:01 GMT;Path=/;`;
    router.push('/')
  };

  return (
    <div>
      <button onClick={handleLogout}>log out</button>
    </div>
  );
}
