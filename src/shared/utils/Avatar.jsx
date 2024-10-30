import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

// Set the default color for the avatar background
const blueColor = "#007bff";

function stringAvatar(name = "John Doe") {
  const nameParts = name.split(" ");
  return {
    sx: {
      bgcolor: "var(--primary-color)",
    },
    children:
      nameParts.length === 1
        ? `${nameParts[0][0]}` // Single word: Only show the first letter
        : nameParts.length === 2
        ? `${nameParts[0][0]}${nameParts[1][0]}` // Two words: Show first letter of each
        : `${nameParts[0][0]}${nameParts[2][0]}`, // Three or more words: Show first letter of the first and third
  };
}

export default function BackgroundLetterAvatars({ name }) {
  // Use a default name if 'name' is not provided or is an empty string
  const displayName = name && name.trim() ? name : "Default Name";

  return (
    <Stack direction="row" spacing={2}>
      <Avatar {...stringAvatar(displayName)} />
    </Stack>
  );
}
