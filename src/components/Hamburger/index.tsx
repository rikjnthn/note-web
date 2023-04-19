import Image from "next/image";
import React from "react";

const Hamburger = ({
  hamburger,
  setHamburger,
}: {
  hamburger: boolean,
  setHamburger: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleHamburger = () => {
    setHamburger((prev) => !prev)
  }
  return (
    <button onClick={handleHamburger} className={`hamburger ${hamburger ? 'hamburger_click': ''}`}>
      <Image
        src="/assets/hamburger-icon.svg"
        alt="hamburger"
        width={30}
        height={30}
      />
    </button>
  );
};

export default Hamburger;
