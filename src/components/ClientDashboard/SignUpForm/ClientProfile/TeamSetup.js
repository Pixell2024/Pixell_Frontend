import { React, useEffect, useRef, useState } from "react";
import { Box, Chip, Button } from "@mui/material";
import CustomInput from "../../../../shared/utils/Input";
import CustomButton from "../../../../shared/utils/Button";
import { LeftArrowIcon } from "../../../../shared/assets/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const TeamSetup = ({ handleBack, handleNext, formData, setFormData }) => {
  const navigate = useNavigate();
  const restrictedDomains = ["gmail.", "yahoo", "hotmail"];
  const serverURL = process.env.REACT_APP_URL;

  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [teamMember, setTeamMember] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [emailError, setEmailError] = useState(false);
  const [teamError, setteamError] = useState(false);
  const [userDomain, setUserDomain] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const containerRef = useRef(null);
  const teamMembersRef = useRef(null);

  useEffect(() => {
    const userMailDomain = localStorage.getItem("email");
    const user_Domain = userMailDomain.split("@")[1];
    setUserDomain(user_Domain);
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (teamMembersRef.current) {
      teamMembersRef.current.scrollTop = teamMembersRef.current.scrollHeight;
    }
  }, [emails, teamMembers]);

  const validateEmail = (email) => {
    const domain = email.split("@")[1];

    const re =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      domain &&
      !restrictedDomains.some((restrictedDomain) =>
        domain.toLowerCase().includes(restrictedDomain)
      ) &&
      domain === userDomain;
    return re;
  };
  const handleAddEmail = (event) => {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      if (email === "") {
        setEmailError(true); // Show error for empty email
      } else if (!validateEmail(email)) {
        setEmailError(true); // Show error for invalid format
        setSnackbar({
          open: true,
          message:
            "Please enter an email address that matches your business domain",
          severity: "error",
        });
      } else if (email && !emails.includes(email.trim())) {
        const updatedEmails = [...emails, email.trim()]; // Prepend new email
        setEmails(updatedEmails);
        setEmail(""); // Reset the input
        setEmailError(false); // Clear the error message

        setFormData((prevFormData) => ({
          ...prevFormData,
          admins: updatedEmails,
        }));
      }
    }
  };
  const handleDeleteEmail = (emailToDelete) => () => {
    setEmails((emails) => emails.filter((email) => email !== emailToDelete));
  };

  const handleAddTeamMember = (event) => {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      if (teamMember === "") {
        setteamError(true); // Show error for empty email
      } else if (!validateEmail(teamMember)) {
        setteamError(true);
        setSnackbar({
          open: true,
          message:
            "Please enter an email address that matches your business domain",
          severity: "error",
        });
      } else if (teamMember && !teamMembers.includes(teamMember.trim())) {
        const updatedTeamMembers = [...teamMembers, teamMember.trim()];
        setTeamMembers(updatedTeamMembers);
        setTeamMember(""); // Reset the input
        setteamError(false); // Clear the error message

        setFormData((prevFormData) => ({
          ...prevFormData,
          teamMembers: updatedTeamMembers,
        }));
      }
    }
  };
  const handleDeleteTeamMember = (teamMemberToDelete) => () => {
    setTeamMembers((teamMembers) =>
      teamMembers.filter((teamMember) => teamMember !== teamMemberToDelete)
    );
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new object that includes the updated formData
    const updatedFormData = { ...formData, isClientOnBoarded: true };

    try {
      setIsLoading(true); // Set loading to true before making the request

      const response = await axios.post(
        `${serverURL}/client/form-data`,
        updatedFormData
      );

      // Check if the response indicates success
      if (response.data.success === true) {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "success",
        });

        setTimeout(() => {
          localStorage.setItem("token", response.data.token);
          navigate("/user/dashboard");
        }, 1500);
      } else {
        // If success is false, show error message from the server
        setSnackbar({
          open: true,
          message: response.data.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response.data.error || "catch error occurred.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col  py-0 px-0 md:px-2">
      <div>
        <LeftArrowIcon
          className="hover:cursor-pointer fixed top-[7rem]  md:top-[5.3rem]"
          size="30"
          onClick={handleBack}
        />
      </div>
      <div className="flex flex-col pt-10 gap-2">
        <h1 className="leading-6 ">Collaborate with your team</h1>
        <p className="text-sm font-normal leading-5 text-left">
          Add your team to significantly enhance co-ordination and management.
        </p>
      </div>
      <Box
        // component="form"
        sx={{ mt: 2 }}
        // onSubmit={handleSubmit}
      >
        <CustomInput
          title="Admins"
          variant="outlined"
          name="admins"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleAddEmail}
          placeholder="Email, comma or space"
          font
          customcolor="var(--heading-color)"
          fontWeight="500"
          InputProps={{
            startAdornment: (
              <div
                ref={containerRef}
                className="flex flex-wrap gap-2 max-h-16 overflow-auto items-center "
              >
                {emails.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    onDelete={handleDeleteEmail(email)}
                    className="mt-2"
                    style={{ marginRight: 4, marginTop: 12 }}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "var(--bg-color)",
                      color: "var(--label-color)",
                      borderRadius: "5px",
                    }}
                  />
                ))}
              </div>
            ),
            style: { display: "flex", flexWrap: "wrap" }, // Ensure that the chips wrap within the input
          }}
          sx={{
            "& .MuiInputBase-input": {
              flex: "1 1 auto",
            },
          }}
        />
        <CustomInput
          title="Members"
          variant="outlined"
          name="teamMembers"
          value={teamMember}
          onChange={(e) => setTeamMember(e.target.value)}
          onKeyDown={handleAddTeamMember}
          placeholder="Email, comma or space"
          fullWidth
          InputProps={{
            style: { display: "flex", flexWrap: "wrap" },
            startAdornment: (
              <div
                ref={teamMembersRef}
                className="flex flex-wrap gap-2  max-h-16  overflow-auto items-center "
              >
                {teamMembers.map((teamMember, index) => (
                  <Chip
                    key={index}
                    label={teamMember}
                    onDelete={handleDeleteTeamMember(teamMember)}
                    className="mt-4"
                    style={{ marginRight: 4, marginTop: 12 }}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "var(--bg-color)",
                      color: "var(--label-color)",
                      borderRadius: "5px",
                    }}
                  />
                ))}
              </div>
            ),
          }}
        />
        {/* Error message for email */}

        {/* <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity} 
            sx={{
              backgroundColor:
                snackbar.severity === "success" ? "green" : "red", 
              color: "white", 
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar> */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity} // Automatically includes the appropriate icon (success or error)
            sx={{
              backgroundColor:
                snackbar.severity === "success" ? "green" : "black", // Green for success, red for error
              color: "white", // White text color for readability
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <div className="flex gap-2 justify-end">
          <Button
            type="submit"
            variant="text"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Skip and Save
          </Button>
          <CustomButton
            text={"Save"}
            color="primary"
            onClick={(e) => {
              handleSubmit(e);
            }}
          />
        </div>
      </Box>
    </div>
  );
};
export default TeamSetup;
