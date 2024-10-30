import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  MenuItem,
  FormHelperText,
  Select,
  FormControl,
} from "@mui/material";
import styles from "./Account.module.css"; // Custom CSS for additional styling
import CustomInput from "../../../shared/utils/Input";
import CustomButton from "../../../shared/utils/Button";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import axios from "axios";
const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: localStorage.getItem("email") || "",
    role: "",
    phoneNumber: "",
    yourTotalCampaigns: "",
    companyCampaigns: "",
  });

  const [errors, setErrors] = useState({});
  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const [isEditable, setIsEditable] = useState(false); // State to track edit mode
  const serverURL = process.env.REACT_APP_URL;

  // Fetch data when the component mounts
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${serverURL}/client/dashboard/${localStorage.getItem("clientId")}`
      );
      const { data } = response.data;
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: data?.name || "", // Default to empty string if name is undefined
        email: data?.emailAddress || "", // Handle potential undefined emailAddress
        phoneNumber: data?.phoneNumber ? data.phoneNumber.toString() : "", // Only convert to string if phoneNumber is defined
        role: data?.roleInOrganization || "", // Default to empty string if undefined
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // handle input change
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
      if (name === "name" && value) {
        const isValidUserName = /^[a-zA-Z\s]+$/.test(value);

        if (isValidUserName) {
          delete newErrors.name;
        }
        // else {
        //   newErrors.userName =
        //     "Username should not contain numbers or special characters.";
        // }
      }

      // Role validation
      if (name === "role" && value) {
        delete newErrors.role;
      }

      // Phone number validation
      if (
        name === "phoneNumber" &&
        /^[0-9]{10}$/.test(value) &&
        !/[eE.]/.test(value)
      ) {
        delete newErrors.phoneNumber; // Remove error if the phone number is valid
      }
      if (name === "yourTotalCampaigns" && value) {
        delete newErrors.yourTotalCampaigns;
      }
      if (name === "companyCampaigns" && value) {
        delete newErrors.companyCampaigns;
      }
      return newErrors;
    });
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name should only contain letters and spaces.";
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.role) {
      newErrors.role = "Role is required.";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number should be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // No errors
  };

  // handle save button
  const handleSave = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Extract the necessary fields from formData
        const {
          name,
          email,
          phoneNumber,
          role,
          yourTotalCampaigns,
          companyCampaigns,
        } = formData;

        // Make the PUT request
        const response = await axios.put(
          `${serverURL}/client/edit/${localStorage.getItem("clientId")}`,
          {
            name,
            emailAddress: email, // Assuming your backend expects this field as 'emailAddress'
            phoneNumber,
            role,
            yourTotalCampaigns,
            companyCampaigns,
          }
        );

        if (response.data.success) {
          fetchData();
          // You can handle success logic here (e.g., showing a success message, redirecting)
        } else {
          console.log("Error:", response.data.message);
          // Handle the error case if needed
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
        // Handle the error case (e.g., showing an error message to the user)
      }
    }
  };

  const handleEdit = () => {
    setIsEditable(!isEditable); // Toggle edit state
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h2 className={styles.heading}>PROFILE</h2>
        <div className={styles.editButton}>
          <Button
            className="shadow-lg shadow-indigo-500/40"
            variant="outlined"
            size="small"
            style={{ border: 0 }}
            onClick={handleEdit}
          >
            <DriveFileRenameOutlineOutlinedIcon /> Edit
          </Button>
        </div>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <CustomInput
            className="text-xs font-medium leading-6 text-left"
            placeholder="Enter Your Name"
            title="Name *"
            type="text"
            disabled={!isEditable}
            size="small"
            name="name"
            error={errors.name}
            errorMessage={errors.name}
            value={formData.name}
            customcolor="var(--heading-color)"
            fontWeight="500"
            onChange={handleInputChange}
            onBlur={() => {
              if (nextButtonClicked) {
                validateForm();
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CustomInput
            className="text-xs font-medium leading-6 text-left"
            placeholder="Enter Your Email"
            title="Email *"
            type="text"
            disabled
            size="small"
            name="email"
            error={errors.email}
            errorMessage={errors.email}
            value={formData.email}
            customcolor="var(--heading-color)"
            fontWeight="500"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <div className="mb-4">
            <label
              error={errors.role}
              style={{
                fontWeight: "500",
                color: errors.role
                  ? "var(--error-color)"
                  : "var(--heading-color)",
              }}
            >
              Role *
            </label>
            <FormControl
              fullWidth
              size="small"
              disabled={!isEditable}
              sx={{ marginTop: "0.5rem" }}
              error={errors.role}
            >
              <Select
                inputProps={{
                  "aria-label": "Without label",
                }}
                displayEmpty
                name="role"
                value={formData?.role}
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
                  color: formData?.role
                    ? "var(--heading-color)"
                    : "var(--label-color)", // Default gray, selected text turns black
                }}
              >
                <MenuItem value="Vendor">Vendor</MenuItem>
                <MenuItem value="IP">IP</MenuItem>
                <MenuItem value="Client">Client</MenuItem>
              </Select>
              {errors.role && <FormHelperText>Select Role</FormHelperText>}
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CustomInput
            className="text-xs font-medium leading-6 text-left"
            placeholder="Enter Your Phone Number"
            title="Phone Number *"
            type="number"
            disabled={!isEditable}
            size="small"
            name="phoneNumber"
            error={errors.phoneNumber}
            errorMessage={errors.phoneNumber}
            value={formData.phoneNumber}
            customcolor="var(--heading-color)"
            fontWeight="500"
            onChange={(e) => {
              if (
                !e.target.value.startsWith(" ") &&
                e.target.value.length < 11
              ) {
                handleInputChange(e);
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CustomInput
            className="text-xs font-medium leading-6 text-left"
            placeholder="Enter Your Campaigns"
            title="Your Total Campaigns *"
            disabled
            type="number"
            size="small"
            name="yourTotalCampaigns"
            value={formData.yourTotalCampaigns}
            customcolor="var(--heading-color)"
            fontWeight="500"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CustomInput
            className="text-xs font-medium leading-6 text-left"
            placeholder="Enter Your Companies"
            title="Company Campaigns *"
            type="number"
            size="small"
            disabled
            name="companyCampaigns"
            value={formData.companyCampaigns}
            customcolor="var(--heading-color)"
            fontWeight="500"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} className="text-right">
          <CustomButton
            text="Save"
            color="var(--heading-color)"
            fontWeight="600"
            className="w-100 block"
            onClick={handleSave}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileForm;
