import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CustomButton from "../../shared/utils/Button";
import { Cross } from "../../shared/assets/icons";
import CustomInput from "../../shared/utils/Input";

const ClientEditAddModal = ({
  setAnchorEl,
  emailDomain,
  updateClientId,
  open,
  selectedClientDetails,
  setarrayOfClients,
  arrayOfClients,
  setselectedCompany,
  setOpen,
  organizationId,
}) => {
  const serverURL = process.env.REACT_APP_URL;
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  // const [organizationId, setOrganizationId] = useState("");

  const [contactDetails, setContactDetails] = useState({
    name: selectedClientDetails?.name || "",
    emailAddress: selectedClientDetails?.emailAddress || "",
    phoneNumber: selectedClientDetails?.phoneNumber || "",
    organizationId: organizationId,
    clientAddress: selectedClientDetails?.clientAddress || "",
    roleInOrganization: selectedClientDetails?.roleInOrganization || "",
    associatedBrands: selectedClientDetails?.associatedBrands || "", // Ensure this is initialized correctly
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const validateForm = () => {
    const newErrors = {};
    // Check required fields
    if (!contactDetails.name) newErrors.name = "Name is required";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // General email pattern
    const restrictedDomains = ["gmail.", "yahoo", "hotmail"]; // Domains you want to restrict

    const enteredEmail = contactDetails.emailAddress || "";

    if (!enteredEmail || !emailPattern.test(enteredEmail)) {
      newErrors.emailAddress = "Enter a valid email address";
    } else {
      const enteredDomain = enteredEmail.split("@")[1]; // Get domain from entered email

      // Check if the entered domain exists and is not in the restricted domains
      if (
        enteredDomain &&
        !restrictedDomains.some((restrictedDomain) =>
          enteredDomain.toLowerCase().includes(restrictedDomain)
        )
      ) {
        // Check if emailDomain is not empty before comparing
        if (emailDomain === "") {
          // Do nothing or set a message if needed
          // e.g., newErrors.emailAddress = ""; // Not needed as emailDomain is empty
        } else if (enteredDomain.toLowerCase() !== emailDomain.toLowerCase()) {
          newErrors.emailAddress = "Please enter the same domain";
        }
      } else {
        newErrors.emailAddress = "Email from this domain is not allowed"; // Custom error for restricted domains
      }
    }
    if (!contactDetails.roleInOrganization) {
      newErrors.roleInOrganization = "Enter Your role";
    }

    if (
      !contactDetails.phoneNumber ||
      !/^\d{10}$/.test(contactDetails.phoneNumber)
    )
      newErrors.phoneNumber = "Valid Contact No is required";

    if (!contactDetails.clientAddress) {
      newErrors.clientAddress = "Address required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };
  const handleKeyPress = (e) => {
    const { name, type } = e.target;
    const charCode = e.keyCode || e.which;

    if (name === "userName") {
      // Block characters that are not letters or spaces for the name input
      if (/[^a-zA-Z\s]/.test(e.key)) {
        e.preventDefault();
      }
    } else if (type === "number" || name === "phoneNumber") {
      // Block 'e', 'E', '-', '+', and '.' for phone number input
      if ([69, 101, 43, 45, 46].includes(charCode)) {
        e.preventDefault();
      }
    }
  };

  const handleSubmit = async (e) => {
    setAnchorEl(null);

    e.preventDefault();

    if (!validateForm()) {
      // Form validation failed
      Swal.fire({
        customClass: {
          container: "my-swal",
        },
        icon: "error",
        text: "Something Went Wrong",
        color: "black",
      });
      return; // Stop further execution if validation fails
    }

    try {
      if (selectedClientDetails && selectedClientDetails._id) {
        // If we're editing an existing client
        const response = await axios.put(
          `${serverURL}/client/edit/${selectedClientDetails._id}`,
          contactDetails,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          Swal.fire({
            customClass: {
              container: "my-swal",
            },
            icon: "success",
            text: response.data.message,
            padding: "1em",
            color: "green",
          }).then(() => {
            const updatedClients = arrayOfClients.map((client) =>
              client._id === updateClientId ? response.data.data : client
            );
            setAnchorEl(null);

            setselectedCompany((prevCompany) => ({
              ...prevCompany,
              clientUsers: updatedClients,
            }));

            // Update the arrayOfClients state
            setarrayOfClients(updatedClients);

            // Close the modal
            setOpen(false); // Close the modal after success
          });
        }
      } else {
        // If we're adding a new client
        const response = await axios.post(
          `${serverURL}/client/create`,
          contactDetails,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          Swal.fire({
            customClass: {
              container: "my-swal",
            },
            icon: "success",
            text: response.data.message,
            padding: "1em",
            color: "green",
          }).then(() => {
            const updatedClients = [...arrayOfClients, response.data.data];
            // setarrayOfClients(updatedClients);

            setselectedCompany((prevCompany) => ({
              ...prevCompany,
              clientUsers: updatedClients,
            }));

            setOpen(false);
            // setIsCompanyDetailsModal(false);
          });
        }
      }
    } catch (error) {
      console.error("Error in client operation:", error);
      Swal.fire({
        customClass: {
          container: "my-swal",
        },
        icon: "error",
        text: error.response?.data?.message || "An error occurred",
        color: "var(--heading-color)",
      });
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <div className="flex justify-between items-center">
        <DialogTitle>
          <h1 className="mt-2">Cilent Details </h1>
        </DialogTitle>
        <div onClick={handleClose} className="mx-5 my-4">
          <Cross />
        </div>
      </div>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2  ml-1">
            <CustomInput
              name="name"
              placeholder="Enter Full Name"
              title="First Name*"
              value={contactDetails?.name}
              size="small"
              required
              onChange={(e) => {
                if (!e.target.value.startsWith(" ")) {
                  handleInputChange(e);
                }
              }}
              onBlur={(e) => {
                if (saveButtonClicked) {
                  validateForm();
                }
              }}
              errorMessage={"Please Enter Full Name"}
              error={errors.name}
            />

            <div className="mb-4">
              <label
                error={errors.roleInOrganization}
                style={{
                  fontWeight: "500",
                  color: errors.roleInOrganization
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
                error={errors.roleInOrganization}
              >
                <Select
                  inputProps={{
                    "aria-label": "Without label",
                  }}
                  displayEmpty
                  name="roleInOrganization"
                  value={contactDetails?.roleInOrganization}
                  onChange={handleInputChange}
                  renderValue={(selected) => {
                    // This renders gray color when no option is selected
                    if (!selected || selected.length === 0) {
                      return (
                        <span
                          className="text-[17px] "
                          style={{
                            color: "var(--listdown-color)",
                          }}
                        >
                          Select Role
                        </span>
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
                    color: contactDetails?.roleInOrganization
                      ? "var(--heading-color)"
                      : "var(--label-color)", // Default gray, selected text turns black
                  }}
                >
                  <MenuItem value="Marketing Manager">
                    Marketing Manager
                  </MenuItem>
                  <MenuItem value="ChiefMarketing Manager">
                    Chief Marketing Manager
                  </MenuItem>
                  <MenuItem value="Client">Client</MenuItem>
                </Select>

                {errors.roleInOrganization && (
                  <FormHelperText>Select Role</FormHelperText>
                )}
              </FormControl>
            </div>

            <CustomInput
              name="emailAddress"
              placeholder="Enter Your Mail"
              title="Company Mail*"
              value={contactDetails?.emailAddress}
              size="small"
              required
              onChange={(e) => {
                if (!e.target.value.startsWith(" ")) {
                  handleInputChange(e);
                }
              }}
              onBlur={(e) => {
                if (saveButtonClicked) {
                  validateForm();
                }
              }}
              errorMessage={"Please Enter Company Email"}
              error={errors.emailAddress}
            />

            <CustomInput
              name="phoneNumber"
              placeholder="Enter Mobile Number"
              title="Mobile Number*"
              value={contactDetails?.phoneNumber}
              size="small"
              type="number"
              required
              onChange={(e) => {
                if (
                  !e.target.value.startsWith(" ") &&
                  e.target.value.length < 11
                ) {
                  handleInputChange(e);
                }
              }}
              onBlur={(e) => {
                if (saveButtonClicked) {
                  validateForm();
                }
              }}
              onKeyPress={(e) => handleKeyPress(e)}
              errorMessage={"Please Enter Mobile Number"}
              error={errors.phoneNumber}
            />
            <CustomInput
              name="clientAddress"
              placeholder="Enter Address"
              title="Address*"
              value={contactDetails?.clientAddress}
              size="small"
              required
              onChange={(e) => {
                if (!e.target.value.startsWith(" ")) {
                  handleInputChange(e);
                }
              }}
              onBlur={(e) => {
                if (saveButtonClicked) {
                  validateForm();
                }
              }}
              errorMessage={"Please Enter Address"}
              error={errors.clientAddress}
            />
            <CustomInput
              title="Associated Brands"
              name="associatedBrands"
              value={contactDetails?.associatedBrands}
              onChange={(e) => {
                if (!e.target.value.startsWith(" ")) {
                  handleInputChange(e); // Update the input field dynamically
                }
              }}
              placeholder="Enter Brand Names split by comma"
              fullWidth
              size="small"
            />
          </div>
          <div className="flex justify-end">
            <CustomButton
              type="submit"
              text={selectedClientDetails.length === 0 ? "SAVE" : "UPDATE"}
              color="primary"
              onClick={(e) => {
                handleSubmit(e);
              }}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientEditAddModal;
