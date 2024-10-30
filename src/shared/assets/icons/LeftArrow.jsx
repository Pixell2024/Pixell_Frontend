import React from "react";

const LeftArrowIcon = ({
  onClick,
  className,
  color = "#36383A",
  size = "20",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      onClick={onClick}
      className={className}
    >
      <mask
        id="mask0_1238_12168"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_1238_12168)"></g>
      <path
        d="M11 18L5 12M5 12H19H5ZM11 6L5 12L11 6Z"
        stroke="#36383A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LeftArrowIcon;
