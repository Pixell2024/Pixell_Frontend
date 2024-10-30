import React from "react";

const LeftArrowDouble = ({ color = "#000000", size = "20" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 11L8 6L13 1M6 11L1 6L6 1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LeftArrowDouble;
