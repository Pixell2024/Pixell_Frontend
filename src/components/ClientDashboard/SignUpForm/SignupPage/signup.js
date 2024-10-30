// components/Signup.js
import React, { useEffect, useRef, useState } from "react";
import CustomInput from "../../../../shared/utils/Input";
import CustomButton from "../../../../shared/utils/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Snackbar, Alert, Skeleton } from "@mui/material";

export default function Signup() {
  const navigate = useNavigate();
  const serverURL = process.env.REACT_APP_URL;

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skloading, setSkloading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Simulated array of existing emails
  const existingEmails = ["user@company.com", "client@business.com"];
  const restrictedDomains = ["gmail.", "yahoo", "hotmail"];

  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);

    const domain = enteredEmail.split("@")[1];

    if (
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

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSignupClick = async () => {
    if (validateEmailFormat(email)) {
      setIsLoading(true);

      try {
        const response = await axios.post(`${serverURL}/client/send-otp`, {
          email,
        });

        setSnackbar({
          open: true,
          message: "OTP sent successfully!",
          severity: "success",
        });

        setTimeout(() => {
          if (response.data.success) {
            setIsLoading(false);

            navigate("/user/otp");

            localStorage.setItem("email", response.data.email);
            localStorage.setItem(
              "isClientOnBoarded",
              response.data.isClientOnBoarded
            );
            localStorage.setItem("role", response.data.role);
            setIsEmailValid(true);
          }
        }, 500);
      } catch (error) {
        setIsLoading(false);
        setSnackbar({
          open: true,
          message: "Failed to send OTP. Please try again later.",
          severity: "error",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="relative w-4/12 hidden md:block">
        {skloading && (
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
          className={`h-screen w-full object-cover hidden md:block ${
            skloading ? "hidden" : "block"
          }`}
          onLoad={() => setSkloading(false)}
          onError={() => setSkloading(false)}
        />
      </div>
      <div className="mx-auto flex justify-center items-center md:items-center sm: pl-2 pr-2">
        <div className="max-w-sm w-full">
          <div className="flex justify-center">
            <img
              src="assests/images/SignWalla_Logo.png"
              alt="SignWalla Logo"
              className="h-12 w-auto"
            />
          </div>
          <h1 className="mt-6 text-start">Access with your work email</h1>

          <p className="mt-2 mb-8 text-start">
            Signwalla fills the gap between brands seeking for media marketing
            and clients needing vendors.
          </p>
          <div>
            <img src="assests/clientdashboard/signupGoogle.png" alt="Google" />
          </div>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full border-t "
                style={{ border: "0.4px solid var(--para-color)" }}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="px-2 bg-white sm:mx-0 sm:mt-2 sm:ml-0 mx-[10rem] my-[0.5rem] -mt-[0.5rem]  "
                style={{
                  color: "var(--para-color)",
                  backgroundColor: "var(--secondary-color)",
                }}
              >
                Or
              </span>
            </div>
          </div>
          <div className="mb-6">
            <CustomInput
              type="email"
              placeholder="email@domain.com"
              title=" Work Email *"
              size="small"
              name="email"
              value={email}
              onChange={handleEmailChange}
              ref={emailInputRef} // Pass the ref to the CustomInput component
              required
              customcolor="var(--heading-color)"
              fontWeight="500"
            />
          </div>
          <div>
            <CustomButton
              type="submit"
              text="Sign up"
              color="var(--heading-color)"
              fontWeight="600"
              className="w-full"
              disabled={!isEmailValid || isLoading}
              onClick={handleSignupClick}
            />
          </div>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={7000}
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
          <p className="mt-8 text-start text-sm ">
            Questions? Email us at{" "}
            <a
              href="mailto:manish@signwalla.com"
              className="font-medium  hover:text-blue-500"
            >
              manish@signwalla.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
