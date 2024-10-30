import React from "react";

const AssociatedBusiness = ({ color = "#000000", size = "20" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 22 20"
      fill="none"
    >
      <path
        d="M6.5 9H3.6C3.03995 9 2.75992 9 2.54601 9.10899C2.35785 9.20487 2.20487 9.35785 2.10899 9.54601C2 9.75992 2 10.0399 2 10.6V19M15.5 9H18.4C18.9601 9 19.2401 9 19.454 9.10899C19.6422 9.20487 19.7951 9.35785 19.891 9.54601C20 9.75992 20 10.0399 20 10.6V19M15.5 19V4.2C15.5 3.0799 15.5 2.51984 15.282 2.09202C15.0903 1.71569 14.7843 1.40973 14.408 1.21799C13.9802 1 13.4201 1 12.3 1H9.7C8.57989 1 8.01984 1 7.59202 1.21799C7.21569 1.40973 6.90973 1.71569 6.71799 2.09202C6.5 2.51984 6.5 3.0799 6.5 4.2V19M21 19H1M10 5H12M10 9H12M10 13H12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AssociatedBusiness;
