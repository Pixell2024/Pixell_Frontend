import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ProfileSetup from "./ProfileSetupForm";
import TeamSetup from "./TeamSetup";
import ValueSetup from "./ValueSetup";
import OrganizationDetailsForm from "./OrganizationDetailsForm";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { CircleInfo } from "../../../../shared/assets/icons"; // Assuming you use a custom icon
import useMediaQuery from "@mui/material/useMediaQuery";
import { StepConnector } from "@mui/material";
import Styles from "../../../../styles/setup.module.css";
// import "../../../../styles/setup.css";

// Steps array for the stepper
const steps = [
  { label: "Profile Setup" },
  { label: "Organization Setup" },
  { label: "Value Setup" },
  { label: "Team Setup" },
];

const OrganizationSetupForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false); // Tooltip state
  const [isMdUp, setIsMdUp] = useState(window.innerWidth >= 768);

  // Handle window resize for responsive design
  React.useEffect(() => {
    const handleResize = () => setIsMdUp(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const [formData, setFormData] = useState({
    organizationName: "",
    userName: "",
    userRole: "",
    userPhoneNumber: "",
    selectedImage: null,
    gstin: "",
    sector: "",
    organizationSize: "",
    organizationAddress: "",
    city: "",
    state: "",
    zipCode: "",
    marketingCampaignsRunningPerYear: "",
    regionsTargetedByCampaigns: "",
    interestedProducts: "",
    challengesFacedInMarketing: "",
    reviewHeardFrom: "",
    admins: "",
    teamMembers: "",
    email: localStorage.getItem("email"),
  });

  // Toggle tooltip visibility on click
  const handleTooltipClick = () => setIsTooltipOpen(!isTooltipOpen);

  const CustomConnector = (props) => (
    <StepConnector
      {...props}
      sx={{
        "@media (max-width: 600px)": {
          height: "2.5rem", // Apply height only for mobile
          width: "7rem", // Apply width only for mobile
          "& .MuiStepConnector-line": {
            borderColor: "white",
            borderWidth: 0.5,
          },
        },
      }}
    />
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div
        className={`${Styles.imgSize} bg-cover pt-20 px-10 flex flex-col justify-between`}
      >
        <div>
          <span className="font-[Inter] text-[20px] md:text-2xl md:mb-5 font-extrabold leading-8 text-center text-white flex justify-start">
            Quick & Easy Setup
          </span>

          {/* Tooltip with click functionality */}
          <span className="block group absolute top-3 right-10 md:hidden">
            <Tooltip
              title="NeedSupportInfo@signwall.com"
              placement="left-start"
              open={isTooltipOpen} // Controlled by state
              onClose={() => setIsTooltipOpen(false)}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <IconButton onClick={handleTooltipClick}>
                <CircleInfo color={"white"} size={"16"} />
              </IconButton>
            </Tooltip>
          </span>

          <div>
            <Box
              sx={{
                width: isMdUp ? "80%" : "80%",
                height: isMdUp ? "50vh" : "auto",
                "@media (max-width: 600px)": {
                  width: "100%",
                  height: "auto",
                },
              }}
            >
              <Stepper
                activeStep={activeStep}
                orientation={isMdUp ? "vertical" : "horizontal"}
                connector={<CustomConnector />}
              >
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <CustomStepLabel
                      sx={{
                        fontSize: "11px",
                        padding: 0,
                        "@media (max-width: 600px)": {
                          fontSize: "11px",
                          padding: 0,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        },
                      }}
                      active={activeStep === index}
                      completed={activeStep > index}
                    >
                      {step.label}
                    </CustomStepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </div>
        </div>

        <div className={`p-2 mb-4  ${!isMdUp ? "hidden" : "block"}`}>
          <p className="text-xs text-white">
            Need Help? Contact&nbsp;
            <a
              href="mailto:admin@signwalla.com"
              className="text-white underline"
            >
              admin@signwalla.com
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto pt-3 md:pt-20 flex justify-center w-[87%] md:w-8/12 mt-4 md:mt-7 ">
        {activeStep === 0 ? (
          <ProfileSetup
            handleNext={handleNext}
            handleBack={handleBack}
            formData={formData}
            setFormData={setFormData}
          />
        ) : activeStep === 1 ? (
          <OrganizationDetailsForm
            handleNext={handleNext}
            handleBack={handleBack}
            formData={formData}
            setFormData={setFormData}
          />
        ) : activeStep === 2 ? (
          <ValueSetup
            handleBack={handleBack}
            handleNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        ) : (
          <TeamSetup
            handleBack={handleBack}
            handleNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </div>
    </div>
  );
};

export default OrganizationSetupForm;

// Custom Step Label for Stepper
const CustomStepLabel = styled(StepLabel)(({ theme, active, completed }) => ({
  ".MuiStepLabel-label": {
    color: active ? "#FFFFFF" : completed ? "#FFFFFF" : "#5CA5FF",
    fontSize: active ? "1.2rem" : "0.85rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: active ? "0.9rem" : "0.75rem",
    },
  },
  ".MuiStepLabel-label.Mui-active": {
    color: "#FFFFFF",
  },
  ".MuiSvgIcon-root": {
    color: active || completed ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
    fontSize: completed ? "1.2rem" : "1.2rem",
    marginLeft: completed ? "0.25rem" : "0.15rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
}));
