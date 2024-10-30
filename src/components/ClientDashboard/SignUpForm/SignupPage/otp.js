import React, { useState, useEffect, useRef } from "react";
import CustomButton from "../../../../shared/utils/Button";
import { useNavigate } from "react-router-dom";
import { LeftArrowIcon } from "../../../../shared/assets/icons";
import axios from "axios";
import { Skeleton } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";

export default function OtpVerification() {
  const navigate = useNavigate();
  const serverURL = process.env.REACT_APP_URL;
  const email = localStorage.getItem("email");

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

  // Reference to the first input field (index 0)
  const firstInputRef = useRef(null);

  useEffect(() => {
    // Auto-focus on the first input field when the component mounts
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }

    // Timer logic
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
  const verifyCode = async () => {
    const otp = inputs.join("");
    try {
      const response = await axios.post(`${serverURL}/client/verify-otp`, {
        email,
        otp,
      });

      setTimeout(() => {
        if (response.data.success) {
          localStorage.setItem("clientId", response?.data?.data?.clientId); // Store the token
          if (response.data.isClientOnBoarded) {
            localStorage.setItem("token", response.data.token);
            navigate("/user/dashboard");
          } else {
            navigate("/user/profile");
          }
        } else {
          // Handle unexpected failure here, if needed
          setSnackbar({
            open: true,
            message: response.data.message || "OTP verification failed.",
            severity: "error",
          });

          setIsValidOtp(false);
        }
      }, 500);
    } catch (error) {
      // Handle error (likely from server)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error verifying OTP.",
        severity: "error",
      });
      setIsValidOtp(false);
      setIsVerified(false);
      setInputs(new Array(6).fill(""));
    }
  };

  const handleResendEmail = async () => {
    if (timer === 0) {
      await axios
        .post(`${serverURL}/client/send-otp`, { email })
        .then((response) => {
          if (response) {
            setSnackbar({
              open: true,
              message: response.data.message || "OTP sent successfully",
              severity: "success",
            });
            setIsVerified(false);
            setInputs(new Array(6).fill(""));
          }
        })
        .catch((error) => console.error("Resend Email API Error:", error));

      setTimer(120);
      setIsResendDisabled(true);

      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="relative w-4/12 hidden md:block">
        {loading && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100vh"
            animation="wave"
          />
        )}
        <img
          src="/assests/clientdashboard/Signupformimg.png"
          alt="Background"
          className={`h-screen w-full object-cover hidden md:block ${loading ? "hidden" : "block"
            }`}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>
      <div className="mx-auto flex justify-center items-center">
        <div>
          {/* Back Button */}
          <button
            className="hover:text-gray-900 mb-4"
            style={{ color: "var(--label-color)" }}
            onClick={() => navigate("/user")}
          >
            <LeftArrowIcon />
          </button>

          {/* Title */}
          <div className="flex justify-between items-center mb-4">
            <h1>Verify E-mail</h1>

            {localStorage.getItem("isClientOnBoarded") === "false" && (
              <button
                className=" bg-blue-100 text-md font-semibold px-3 py-1 rounded-full border-2 "
                style={{
                  color: "var(--primary-color)",
                  border: " 2px solid var(--primary-color)",
                }}
              >
                New User
              </button>
            )}
          </div>

          {/* Description */}
          <p className=" mb-6">
            Please enter your verification code sent on <br />
            <p className="font-bold">{email}</p>
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
                className={`w-12 h-12 ${isValidOtp ? "text-var(--heading-color)" : "text-red-600"
                  } ${index !== 0 && index !== 5 ? "mx-2" : ""}
                  border ${isValidOtp ? "border-blue-300" : "border-red-500"
                  } rounded text-center text-lg font-semibold 
                  focus:outline-none focus:ring-2 ${isValidOtp ? "focus:ring-blue-500" : "focus:ring-red-500"
                  }`}
              />
            ))}
          </div>

          <CustomButton
            type="submit"
            text="Verify"
            color="var(--heading-color)"
            fontWeight="600"
            className={`w-full ${isVerified ? "var(--primary-color)" : "var(--para-color)"
              } text-white font-semibold py-2 rounded-lg mb-4`}
            disabled={!isVerified}
            onClick={verifyCode}
          />

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

          {/* Resend Link */}
          <p className="text-start mt-6">
            Didn’t receive OTP?{" "}
            <a
              className={` ${isResendDisabled ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              onClick={handleResendEmail}
            >
              {isResendDisabled
                ? `Resend email in ${Math.floor(timer / 60)
                  .toString()
                  .padStart(2, "0")}:${(timer % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "Resend email"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
