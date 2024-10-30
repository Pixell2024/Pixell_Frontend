import React, { useEffect, useRef, useState } from "react";

import { Grid, Switch, Typography, Button, Modal, Box } from "@mui/material";
import styles from "./Account.module.css"; // Custom CSS for additional styling
import CustomInput from "../../../shared/utils/Input";
import ClearIcon from "@mui/icons-material/Clear";
import CustomButton from "../../../shared/utils/Button";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  //   width: 500,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

const TransferRight = () => {
  const [open, setOpen] = React.useState(false);
  const [emailToTransferRights, setEmailToTransferRights] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  // otp
  const [inputs, setInputs] = useState(new Array(6).fill(""));
  const [isVerified, setIsVerified] = useState(false);
  const [isValidOtp, setIsValidOtp] = useState(true);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  // end

  const emailInputRef = useRef(null);
  const serverURL = process.env.REACT_APP_URL;
  const firstInputRef = useRef(null);

  const handleOpen = async () => {
    try {
      const response = await axios.post(
        `${serverURL}/client/transferRights/sendOTP`,
        {
          email: localStorage.getItem("email"),
        }
      );
      if (response?.data?.success) {
        setSnackbar({
          open: true,
          message: "OTP sent successfully!",
          severity: "success",
        });
        setOpen(true);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to send OTP. Please try again later.",
        severity: "error",
      });
    }
  };
  const handleClose = () => setOpen(false);

  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const restrictedDomains = ["gmail.", "yahoo", "hotmail"];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    setEmailToTransferRights(enteredEmail);

    const domain = enteredEmail.split("@")[1];

    if (
      validateEmailFormat(enteredEmail) &&
      emailRegex.test(enteredEmail) &&
      domain &&
      !restrictedDomains.some((restrictedDomain) =>
        domain.toLowerCase().includes(restrictedDomain)
      )
    ) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  };

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newInputs = [...inputs];

    // Update the current input value
    newInputs[index] = value;
    setInputs(newInputs);

    // If the input value is not empty, move to the next input
    if (value && index < inputs.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    // Validate OTP and set verification status
    if (newInputs.join("").length === inputs.length) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
      setIsValidOtp(true);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const verifyCode = async () => {
    const otp = inputs.join("");
    try {
      const response = await axios.post(
        `${serverURL}/client//transferRights/verifyOTP`,
        {
          email: localStorage.getItem("email"),
          otp,
          emailToTransferRights,
        }
      );

      if (response.data.success) {
        setOpen(false);
        setSnackbar({
          open: true,
          message: "Rights Transferred Successfully",
          severity: "success",
        });
      }
      // setTimeout(() => {
      //   if (response.data.success) {
      //     Swal.fire({
      //       title: "Success",
      //       text: "Now  you can Transfer to your account",
      //     });
      //   } else {
      //     Swal.fire({
      //       title: "Error",
      //       text: response.data.message,
      //     });
      //     setIsValidOtp(false);
      //   }
      // }, 500);
    } catch (error) {
      // Handle error (likely from server)
      Swal.fire({
        customClass: {
          container: "my-swal",
        },
        title: "Error",
        text: error.response?.data?.message,
      });

      setIsValidOtp(false);
      setIsVerified(false);
      setInputs(new Array(6).fill(""));
    }
  };

  return (
    <div className={styles.notificationsContainer}>
      <h2 className={styles.heading}>TRANSFER RIGHTS</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={styles.description}>
            This will transfer your super admin rights to the email you enter
            here after the OTP confirmation.
          </p>
        </Grid>
      </Grid>
      <div className="flex flex-col">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <CustomInput
              className="text-xs font-medium leading-6 text-left"
              placeholder="Enter new email address"
              title="New super admin email*"
              type="text"
              size="small"
              name="emailAddress"
              value={emailToTransferRights}
              customcolor="var(--heading-color)"
              fontWeight="500"
              onChange={(e) => {
                if (!e.target.value.startsWith(" ")) {
                  handleEmailChange(e);
                }
              }}
            />
          </Grid>
        </Grid>
        <div className="flex justify-end">
          <Button
            variant="contained"
            onClick={handleOpen}
            disabled={!isEmailValid}
          >
            {`Submit`}
          </Button>
        </div>
      </div>
      <Modal
        className="backdrop-blur-sm "
        hideBackdrop="false"
        open={open}
        onClose={handleClose}
        size="md"
      >
        <Box sx={style}>
          <div className="flex justify-center items-center">
            <div>
              {/* Title */}
              <div className="flex justify-between items-center mb-4">
                <h1>Confirmation</h1>
                <ClearIcon onClick={handleClose} className="cursor-pointer" />
              </div>

              {/* Description */}
              <p className=" mb-6">
                Please enter confirmation code sent on <br />
                <p className="font-bold">{localStorage.getItem("email")}</p>
              </p>

              {/* OTP Input Fields */}
              <div className="flex-col justify-between mb-6 ms:flex-row">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={inputs[index]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={index === 0 ? firstInputRef : null} // Focus the first input
                    className={`w-12 h-12 ${
                      isValidOtp ? "text-var(--heading-color)" : "text-red-600"
                    } ${index !== 0 && index !== 5 ? "mx-2" : ""}
                  border ${
                    isValidOtp ? "border-blue-300" : "border-red-500"
                  } rounded text-center text-lg font-semibold 
                  focus:outline-none focus:ring-2 ${
                    isValidOtp ? "focus:ring-blue-500" : "focus:ring-red-500"
                  }`}
                  />
                ))}
              </div>

              <CustomButton
                type="submit"
                text="Confirm"
                color="var(--heading-color)"
                fontWeight="600"
                className={`w-full ${
                  isVerified ? "bg-blue-500" : "bg-gray-200"
                } text-white font-semibold py-2 rounded-lg mb-4`}
                disabled={!isVerified}
                onClick={verifyCode}
              />
            </div>
          </div>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity} // Automatically includes the appropriate icon (success or error)
          sx={{
            backgroundColor:
              snackbar.severity === "success"
                ? "var(--third-color)"
                : "var(--heading-color)", // Green for success, red for error
            color: "var(--secondary-color)", // White text color for readability
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TransferRight;
