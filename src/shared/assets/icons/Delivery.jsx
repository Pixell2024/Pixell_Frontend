import React from "react";

const Delivery = ({ color = "#000000", size = "20" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.24984 10.3504H9.74984M2.74984 10.3504H2.21574C2.06174 10.3504 1.98474 10.3504 1.92034 10.342C1.68861 10.3131 1.47311 10.2078 1.30792 10.0428C1.14273 9.87772 1.03728 9.6623 1.00824 9.43059C0.999843 9.36549 0.999843 9.28849 0.999843 9.13449V7.20039C0.999843 5.99366 1.47922 4.83635 2.33251 3.98305C3.1858 3.12976 4.34311 2.65039 5.54984 2.65039M5.89984 8.95039V3.00039C5.89984 2.00989 5.89984 1.51499 6.20784 1.20839C6.51514 0.900391 7.01004 0.900391 7.99984 0.900391H14.9998V8.60039C14.9998 9.25489 14.9998 9.58179 14.8591 9.82539C14.767 9.985 14.6345 10.1175 14.4748 10.2097C14.2312 10.3504 13.9043 10.3504 13.2498 10.3504M13 3H10M13 4.5H11.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Delivery;