// import React from "react";
// import TextField from "@mui/material/TextField";
// import PropTypes from "prop-types";
// import { styled } from "@mui/material/styles";

// const StyledTextField = styled(TextField)(
//   ({
//     type,
//     theme,
//     width,
//     normalcolor,
//     activecolor,
//     disabledcolor,
//     errorcolor,
//     error,
//   }) => ({
//     width: width || "100%", // Default width to 100%
//     "& .MuiOutlinedInput-root": {
//       "& fieldset": {
//         borderColor: error ? errorcolor : normalcolor || "#B0B0B0", // Normal or Error state color
//       },
//       "&:hover fieldset": {
//         borderColor: error ? errorcolor : normalcolor || "#B0B0B0",
//       },
//       "&.Mui-focused fieldset": {
//         borderColor: error ? errorcolor : activecolor || "#418CFF", // Active or Error state color
//       },
//       "&.Mui-disabled fieldset": {
//         borderColor: disabledcolor || "#D3D3D3", // Disabled state color
//       },
//     },
//     "& .MuiInputLabel-root": {
//       color: error ? errorcolor : "#666", // title color in normal or error state
//     },
//     "& .MuiFormHelperText-root": {
//       color: errorcolor || "#EA0234", // Error message color
//     },
//   })
// );

// const CustomInput = ({
//   type,
//   title,
//   placeholder,
//   width,
//   normalcolor,
//   activecolor,
//   disabledcolor,
//   errorcolor = "#EA0234", // Default error color
//   error = false,
//   errorMessage,
//   ...props
// }) => {
//   return (
//     <div style={{ marginBottom: "16px" }}>
//       {title && (
//         <label
//           style={{
//             marginBottom: "8px",
//             display: "block",
//             color: error ? errorcolor : "#666",
//           }}
//         >
//           {title}
//         </label>
//       )}
//       <StyledTextField
//         type={type}
//         placeholder={placeholder || "Placeholder"}
//         variant="outlined"
//         fullWidth
//         width={width}
//         normalcolor={normalcolor}
//         activecolor={activecolor}
//         disabledcolor={disabledcolor}
//         errorcolor={errorcolor}
//         error={error} // Pass the error state
//         helperText={error ? errorMessage : ""} // Display error message if error is true
//         {...props}
//       />
//     </div>
//   );
// };

// CustomInput.propTypes = {
//   title: PropTypes.string,
//   placeholder: PropTypes.string,
//   width: PropTypes.string,
//   normalcolor: PropTypes.string,
//   activecolor: PropTypes.string,
//   disabledcolor: PropTypes.string,
//   errorcolor: PropTypes.string,
//   error: PropTypes.bool,
//   errorMessage: PropTypes.string, // New prop for error message
// };

// export default CustomInput;

import React, { forwardRef } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(
  ({
    type,
    theme,
    width,
    normalcolor,
    activecolor,
    disabledcolor,
    errorcolor,
    error,
  }) => ({
    width: width || "100%", // Default width to 100%
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: error ? errorcolor : normalcolor || "#B0B0B0", // Normal or Error state color
      },
      "&:hover fieldset": {
        borderColor: error ? errorcolor : normalcolor || "#B0B0B0",
      },
      "&.Mui-focused fieldset": {
        borderColor: error ? errorcolor : activecolor || "#418CFF", // Active or Error state color
      },
      "&.Mui-disabled fieldset": {
        borderColor: disabledcolor || "#D3D3D3", // Disabled state color
      },
    },
    "& .MuiInputLabel-root": {
      color: error ? errorcolor : "#666", // title color in normal or error state
    },
    "& .MuiFormHelperText-root": {
      color: errorcolor || "#EA0234", // Error message color
    },
  })
);

const CustomInput = forwardRef(
  (
    {
      type,
      title,
      placeholder,
      width,
      normalcolor,
      activecolor,
      disabledcolor,
      errorcolor = "var(--error-color)",
      error = false,
      errorMessage,
      customcolor,
      fontWeight,
      max, // Accept `max` prop from parent component

      ...props
    },
    ref
  ) => {
    return (
      <div style={{ marginBottom: "16px" }}>
        {title && (
          <label
            style={{
              marginBottom: "8px",
              display: "block",
              color: error ? errorcolor : customcolor,
              fontWeight: fontWeight,
            }}
          >
            {title}
          </label>
        )}
        <StyledTextField
          type={type}
          placeholder={placeholder || "Placeholder"}
          variant="outlined"
          fullWidth
          width={width}
          normalcolor={normalcolor}
          activecolor={activecolor}
          disabledcolor={disabledcolor}
          errorcolor={errorcolor}
          error={error} // Pass the error state
          helperText={error ? errorMessage : ""} // Display error message if error is true
          inputRef={ref} // Use inputRef for the actual input element
          {...(type === "date" && { inputProps: { max } })} // Set max date for date input field using the prop

          {...props}
        />
      </div>
    );
  }
);

export default CustomInput;
