import React from "react";
import Image from "next/image";

const SubmitButton = ({
  loading,
  value,
}: {
  loading: boolean;
  value: string;
}) => {
  return (
    <button className="submit-button" type="submit">
      {loading ? (
        <Image
          className="spinner"
          src="/assets/spinner.svg"
          alt="spinner"
          width={20}
          height={20}
        />
      ) : (
        <span>{value}</span>
      )}
    </button>
  );
};

export default React.memo(SubmitButton);
