import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { ColorLens } from "@mui/icons-material";

const CustomButton = ({
  color,
  text = "Click Here",
  onClick,
  isLoading = false,
  disabled = false,
  bgcolor = "var(--primary-color)",
  icon,
  fontWeight,
  ...props
}) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={isLoading || disabled}
      style={{
        backgroundColor: isLoading ? "var(--para-color)" : bgcolor, // Grey background when loading
        color: disabled ? color : "#ffffff",
        // display: "flex",
        // alignItems: "center",
        // justifyContent: "center",
        textTransform: "initial",
        fontWeight: fontWeight,

        ...props.style,
      }}
      {...props}
    >
      {isLoading ? (
        <>
          {text}
          <CircularProgress
            size={24}
            color="inherit"
            style={{ marginLeft: 8 }}
          />
        </>
      ) : (
        text
      )}
    </Button>
  );
};

CustomButton.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

export default CustomButton;
