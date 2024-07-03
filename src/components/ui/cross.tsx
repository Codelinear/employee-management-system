import React from "react";

const Cross = ({ stroke }: { stroke: string }) => {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.757996 11.243L6.001 6.00002L11.244 11.243M11.244 0.757019L6 6.00002L0.757996 0.757019"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Cross;
