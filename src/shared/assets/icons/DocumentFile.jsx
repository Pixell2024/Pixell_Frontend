import React from "react";

const DocumentFile = ({ color = "#000000", size = "20" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.2188 6.08374V11.2188C11.2187 11.5544 11.0854 11.8763 10.8481 12.1137C10.6107 12.351 10.2888 12.4844 9.95312 12.4844H4.04688C3.71121 12.4844 3.38929 12.351 3.15194 12.1137C2.91459 11.8763 2.78125 11.5544 2.78125 11.2188V2.78125C2.78125 2.44559 2.91459 2.12367 3.15194 1.88632C3.38929 1.64897 3.71121 1.51563 4.04688 1.51562H6.65063C6.87433 1.51566 7.08886 1.60452 7.24706 1.76269L10.9717 5.48731C11.1299 5.64551 11.2187 5.86004 11.2188 6.08374Z"
        stroke={color}
        strokeLinejoin="round"
      />
      <path
        d="M7 1.72656V4.89062C7 5.1144 7.08889 5.32901 7.24713 5.48725C7.40536 5.64548 7.61997 5.73438 7.84375 5.73438H11.0078"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4.75 7H6.25" stroke="#6B7280" strokeLinecap="round" />
      <path d="M4.75 9.25H9.25" stroke="#6B7280" strokeLinecap="round" />
    </svg>
  );
};

export default DocumentFile;
