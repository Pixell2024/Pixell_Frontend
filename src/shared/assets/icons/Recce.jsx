import React from "react";

const Recce = ({ color = "#000000", size = "20" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8.99972" cy="8.49972" r="6.35714" stroke={color} />
      <path d="M1 8.5L4.42857 8.5" stroke={color} strokeLinecap="round" />
      <path d="M13.5714 8.5H17" stroke={color} strokeLinecap="round" />
      <path d="M9 16.5V13.0714" stroke={color} strokeLinecap="round" />
      <path d="M9 3.92871V0.50014" stroke={color} strokeLinecap="round" />
      <path
        d="M6.71387 8.11863L7.71836 9.45796C7.79139 9.55533 7.93372 9.56544 8.01978 9.47938L11.2853 6.21387"
        stroke={color}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Recce;
