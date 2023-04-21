import React, { useState } from "react";
import SideNav from "../SideNav";
import Hamburger from "../Hamburger";

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const [hamburger, setHamburger] = useState<boolean>(false);
  return (
    <div className="flex">
      <Hamburger hamburger={hamburger} setHamburger={setHamburger} />
      <SideNav open={hamburger} />
      {children}
    </div>
  );
};

export default Layout;
