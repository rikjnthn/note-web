import React from "react";

import { usePocket } from "@/context/PocketProvider";


export default function Setting() {
  const {pb} = usePocket()

  const handleLogout = () => {
    pb?.authStore.clear()
  }

  return (
    <div>
      <button onClick={handleLogout}>
        log out
      </button>
    </div>
  )
}
