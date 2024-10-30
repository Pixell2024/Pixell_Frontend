import React from "react";

const RightArrow = ({ color = "#000000", size = "20" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 11L6 6L1 1M8 11L13 6L8 1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RightArrow;
