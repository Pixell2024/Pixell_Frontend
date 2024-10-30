import React from "react";

const FormatTimestamp = ({ timestamp }) => {
  // Check if timestamp is valid
  if (!timestamp) return <span>NA</span>;

  // Convert timestamp to date object
  const dateObject = new Date(timestamp);

  // Format time
  const formattedTime = dateObject.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Format date
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <span>
      {formattedTime},{/* <br /> */}
      {formattedDate}
    </span>
  );
};

export default FormatTimestamp;
