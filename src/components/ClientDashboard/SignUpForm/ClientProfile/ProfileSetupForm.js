import { React, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CustomInput from "../../../../shared/utils/Input";
import CustomButton from "../../../../shared/utils/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { FormHelperText } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSetup = ({ handleNext, formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Validate the input and remove the error if it's valid
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      // Name validation
      if (name === "userName" && value) {
        const isValidUserName = /^[a-zA-Z\s]+$/.test(value);

        if (isValidUserName) {
          delete newErrors.userName;
        }
      }

      // Role validation
      if (name === "userRole" && value) {
        delete newErrors.userRole;
      }

      // Phone number validation
      if (
        name === "userPhoneNumber" &&
        /^[0-9]{10}$/.test(value) &&
        !/[eE.]/.test(value)
      ) {
        delete newErrors.userPhoneNumber; // Remove error if the phone number is valid
      }
      return newErrors;
    });
  };
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const serverURL = process.env.REACT_APP_URL;
  const [onlyUserDetailsNeeded, setOnlyUserDetailsNeeded] = useState(false);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName) {
      newErrors.userName = "Name is required";
    } else {
      // Check if the username contains only letters and spaces
      const isValidUserName = /^[a-zA-Z\s]+$/.test(formData.userName);

      // If username is not valid (contains numbers or special characters), set the error message
      if (!isValidUserName) {
        newErrors.userName =
          "Username should not contain numbers or special characters.";
      }
    }
    if (!formData.userRole) newErrors.userRole = "Role is required";
    if (!formData.userPhoneNumber || !/^\d{10}$/.test(formData.userPhoneNumber))
      newErrors.userPhoneNumber = "Valid Contact No is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleKeyPress = (e) => {
    const { name, type } = e.target;
    const charCode = e.keyCode || e.which;

    if (name === "userName") {
      // Block characters that are not letters or spaces for the name input
      if (/[^a-zA-Z\s]/.test(e.key)) {
        e.preventDefault();
      }
    } else if (type === "number" || name === "userPhoneNumber") {
      // Block 'e', 'E', '-', '+', and '.' for phone number input
      if ([69, 101, 43, 45, 46].includes(charCode)) {
        e.preventDefault();
      }
    }
  };

  const clientDetails = async (clientId) => {
    try {
      const userDetails = await axios.get(
        `${serverURL}/client/dashboard/${clientId}`
      );
      if (userDetails.data.success && userDetails.data.data.organizationId) {
        setOnlyUserDetailsNeeded(true);
      }
    } catch (error) {
      console.error("error in getting user details", error);
    }
  };

  const saveClientUserDetails = async () => {
    let dataToUpdate = {
      name: formData.userName,
      phoneNumber: formData.userPhoneNumber,
      roleInOrganization: formData.userRole,
      isClientOnBoarded: true,
    };
    try {
      const response = await axios.put(
        `${serverURL}/client/edit/${localStorage.getItem("clientId")}`,
        dataToUpdate
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("error in updating", error);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("clientId")) {
      clientDetails(localStorage.getItem("clientId"));
    }
  }, []);

  return (
    <div className="flex flex-col md:pl-10">
      <div className="flex flex-col lg:mt-[3rem] gap-2 pt-4">
        <h1 className="text-lg font-bold leading-6 ">Profile setup</h1>
        <p className="text-sm font-normal leading-5 text-left ">
          Please tell us more about yourself to personalise your data and for
          seamless interaction.
        </p>
      </div>
      <Box
        component="form"
        sx={{ mt: { xs: 2, sm: 6 }, width: "100%", maxWidth: "400px" }}
        // onSubmit={handleSubmit}
      >
        <CustomInput
          className="text-xs font-medium leading-6 text-left"
          placeholder="Enter Full Name"
          title="Full Name *"
          type="text"
          size="small"
          name="userName"
          error={errors.userName}
          errorMessage={errors.userName}
          value={formData?.userName}
          customcolor="var(--heading-color)"
          fontWeight="500"
          onBlur={() => {
            if (nextButtonClicked) {
              validateForm();
            }
          }}
          onChange={(e) => {
            if (!e.target.value.startsWith(" ")) {
              handleInputChange(e);
            }
          }}
          onKeyDown={(e) => {
            handleKeyPress(e);
            // Prevent numbers and special characters from being entered
          }}
        />

        <div className="mb-4">
          <label
            error={errors.userRole}
            style={{
              fontWeight: "500",
              color: errors.userRole
                ? "var(--error-color)"
                : "var(--heading-color)",
            }}
          >
            Role *
          </label>
          <FormControl
            fullWidth
            size="small"
            sx={{ marginTop: "0.5rem" }}
            error={errors.userRole}
          >
            <Select
              inputProps={{
                "aria-label": "Without label",
              }}
              displayEmpty
              name="userRole"
              value={formData?.userRole}
              onChange={handleInputChange}
              renderValue={(selected) => {
                // This renders gray color when no option is selected
                if (!selected || selected.length === 0) {
                  return (
                    <p className="text-[1rem] text-[var(--listdown-color)]">
                      Select Role
                    </p>
                  );
                }
                // When an option is selected, show black
                return (
                  <span style={{ color: "var(--heading-color)" }}>
                    {selected}
                  </span>
                );
              }}
              sx={{
                color: formData?.userRole
                  ? "var(--heading-color)"
                  : "var(--label-color)", // Default gray, selected text turns black
              }}
            >
              <MenuItem value="Vendor">Vendor</MenuItem>
              <MenuItem value="IP">IP</MenuItem>
              <MenuItem value="Client">Client</MenuItem>
            </Select>
            {errors.userRole && <FormHelperText>Select Role</FormHelperText>}
          </FormControl>
        </div>

        <CustomInput
          className="text-[20px]"
          placeholder="Enter Your Phone Number"
          title="Contact Details *"
          type="number"
          size="small"
          name="userPhoneNumber"
          min="1"
          step="1"
          error={errors.userPhoneNumber}
          errorMessage={errors.userPhoneNumber}
          value={formData?.userPhoneNumber}
          customcolor="var(--heading-color)"
          fontWeight="500"
          onBlur={() => {
            if (nextButtonClicked) {
              validateForm();
            }
          }}
          onChange={(e) => {
            if (!e.target.value.startsWith(" ") && e.target.value.length < 11) {
              handleInputChange(e);
            }
          }}
          onKeyPress={
            (e) => handleKeyPress(e)
            // Check for restricted characters and prevent default behavior if matched
          }
          InputProps={{ inputProps: { min: 0 } }}
        />

        <div className="flex gap-4 justify-end mt-10 lg:mt-1">
          <CustomButton
            type="submit"
            text={onlyUserDetailsNeeded ? "Save" : "Next"}
            color="primary"
            className="h-10 w-20"
            onClick={(e) => {
              e.preventDefault();
              if (
                formData.userName &&
                formData.userRole &&
                formData.userPhoneNumber.length === 10
              ) {
                if (onlyUserDetailsNeeded) {
                  saveClientUserDetails();
                } else {
                  handleNext();
                }
              } else validateForm();
            }}
          />
        </div>
      </Box>
    </div>
  );
};
export default ProfileSetup;
