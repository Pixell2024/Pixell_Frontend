import React from "react";

const Client = ({ color = "#000000", size = "20" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 21C4 19.6044 4 18.9067 4.17224 18.3389C4.56004 17.0605 5.56045 16.06 6.83886 15.6722C7.40665 15.5 8.10444 15.5 9.5 15.5H16C16.5 15.5 20 16.1722 20 18.5V21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22L13 20.3333L12 16L11 20.3333L12 22Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Client;
