import React from "react";

import { useState } from "react";
import { verifyGST } from "../utils/gstInfoApi";

import CustomButton from "../utils/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormHelperText,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { Cross, VerifiedTick, ViewIcon } from "../assets/icons/index";

import CustomInput from "../utils/Input";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// import "../styles/ClientOnboarding.module.css"

const ClientOnboardingform = ({
  isModalOpen,
  setIsModalOpen,
  setClientSelectedModal,
  setIsCompanyDetailsModal,
  fetchCompanyData,
  SelectedCompanyData,
  selectedCompany,
}) => {
  const [formData, setFormData] = useState({
    userName: selectedCompany?.userName || "",
    clientEmail: "",
    userRole: "",
    organizationName: selectedCompany?.organizationDetail?.name || "",
    state: selectedCompany?.organizationDetail?.state || "",
    city: selectedCompany?.organizationDetail?.city || "",
    gstin: selectedCompany?.organizationDetail.gstin || "",
    pinCode: selectedCompany?.organizationDetail?.zipCode || "",
    phoneNumber: "",
    address: selectedCompany?.organizationDetail?.organizationAddress || "",
    sector: selectedCompany?.organizationDetail?.sector || "",
    clientAddress: "",
    associatedBrands: [],
  });

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(false); // loading state for API calls
  // const [isGstVerified, setIsGstVerified] = useState(false);
  const [isGstVerified, setIsGstVerified] = useState(
    selectedCompany?.organizationDetail?.gstin?.length === 15
  );

  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [openToast, setOpenToast] = React.useState(false);
  const serverURL = process.env.REACT_APP_URL;

  const validateForm = () => {
    const newErrors = {};

    if (!selectedCompany || !selectedCompany.organizationDetail) {
      if (!formData.userName) newErrors.userName = "Name is required";
      if (!formData.userRole) newErrors.userRole = "Enter Role";
      if (!formData.clientAddress)
        newErrors.clientAddress = "Enter Client Address";
      if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Valid Contact No is required";
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // General email pattern
      const restrictedDomains = ["gmail", "yahoo", "hotmail"]; // Domains you want to restrict

      const enteredEmail = formData.clientEmail || "";

      if (!enteredEmail || !emailPattern.test(enteredEmail)) {
        newErrors.clientEmail = "Enter a valid email address";
      } else {
        const domain = enteredEmail.split("@")[1];

        if (
          domain &&
          !restrictedDomains.some((restrictedDomain) =>
            domain.toLowerCase().includes(restrictedDomain)
          )
        ) {
        } else {
          newErrors.clientEmail = "Email from this domain is not allowed";
        }
      }
    }

    if (!formData.pinCode || !/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Valid Pin Code is required";
    }

    if (!formData.address) newErrors.address = "Address is required";

    if (!selectedCompany?.organizationDetail?.organizationName) {
      if (!formData.organizationName)
        newErrors.organizationName = "Enter company name";
    }

    if (!formData.city) newErrors.city = "Enter City";
    if (!formData.state) newErrors.state = "Enter State";
    if (!formData.sector) newErrors.sector = "Enter Sector";

    if (!formData.gstin || formData.gstin.length < 15) {
      newErrors.gstin = "Enter the valid GSTIN ";
      setIsGstVerified(false);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "gstin") {
      setErrors({ ...errors, gstin: "" });
      setIsGstVerified(false);
    }

    if (name === "gstin" && value.length === 15) {
      fetchDetailsThroughGSTIN(value.toUpperCase());
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    if (!validateForm()) {
      Swal.fire({
        customClass: {
          container: "my-swal",
        },
        icon: "error",
        text: "Please fill out the required fields correctly",
        color: "black",
      });
      setSubmitLoading(false);
    } else {
      // Update or create organization
      try {
        // Check if we're updating an existing organization
        if (selectedCompany?.organizationDetail?._id) {
          try {
            const response = await axios.put(
              `${serverURL}/organization/update/${selectedCompany.organizationDetail._id}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            setSubmitLoading(false);
            if (response.status === 200) {
              Swal.fire({
                customClass: {
                  container: "my-swal",
                },
                icon: "success",
                text: "Organization updated successfully!",
                padding: "1em",
                color: "black",
              }).then(async () => {
                try {
                  await axios.get(`${serverURL}/organization/view`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                  SelectedCompanyData();
                  fetchCompanyData();
                } catch (error) {
                  console.log(error);
                }
                setIsModalOpen(false);
                setClientSelectedModal(false);
                setIsCompanyDetailsModal(false);
                // window.location.reload();
              });
            }
          } catch (error) {
            setSubmitLoading(false);

            console.error("Error updating organization:", error);
            Swal.fire({
              customClass: {
                container: "my-swal",
              },
              icon: "error",
              title: error.response?.data?.message || "Update failed",
              padding: "1em",
            });
          }
        }
        // New organization creation
        else {
          try {
            setIsLoading(true);
            const response = await axios.post(
              `${serverURL}/organization/adds`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            setSubmitLoading(false);

            if (response.data.success) {
              Swal.fire({
                customClass: {
                  container: "my-swal",
                },
                icon: "success",
                text: response.data.message,
                padding: "1em",
                color: "green",
              }).then(async () => {
                try {
                  await axios.get(`${serverURL}/organization/view`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                  fetchCompanyData();
                } catch (error) {
                  console.log(error);
                }
                setIsModalOpen(false);
                if (setClientSelectedModal) {
                  setClientSelectedModal(false);
                }
              });
            } else {
              setSubmitLoading(false);

              Swal.fire({
                customClass: {
                  container: "my-swal",
                },
                icon: "error",
                text: response.data.error,

                // text: "Error in creating organization",
              });
            }
          } catch (error) {
            setSubmitLoading(false);
            Swal.fire({
              customClass: {
                container: "my-swal",
              },
              icon: "error",
              text: error.response.data.error,
              padding: "1em",
              color: "var(--heading-color)",
            });
          }
        }
      } catch (error) {
        setSubmitLoading(false);

        console.error("Error creating or updating organization:", error);
        setIsLoading(false);
        Swal.fire({
          customClass: {
            container: "my-swal",
          },
          icon: "error",
          title: error.response?.data?.message || "Operation failed",
          text: `Error in processing the organization details`,
          color: "black",
        });
      }
    }
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

  const fetchDetailsThroughGSTIN = async (gstNumber) => {
    setLoading(true);
    const responseData = await verifyGST(gstNumber);
    setLoading(false);

    if (responseData.error) {
      setErrors({ ...errors, gstin: "Enter valid GSTIN" });
      setIsGstVerified(false)
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        gstin: gstNumber,
        state: responseData?.taxpayerInfo?.pradr?.addr?.stcd || "",
        city: responseData?.taxpayerInfo?.pradr?.addr?.dst || "",
        organizationName: responseData?.taxpayerInfo?.tradeNam || "",
        pinCode: responseData?.taxpayerInfo?.pradr?.addr?.pncd || "",
        organizationAddress: responseData?.taxpayerInfo?.stj || "",
      }));
      setIsGstVerified(true); // This should set the value to true

    }
  };

  const handleClose = () => {
    setIsModalOpen(false);

    if (setClientSelectedModal) {
      setClientSelectedModal(false);
    }
  };
  return (
    <div>
      <Dialog open={isModalOpen} maxWidth="md" fullWidth>
        <div className="flex justify-between">
          <DialogTitle>
            {selectedCompany ? (
              <h1>Organization Personal Details</h1>
            ) : (
              <h1 className="mt-2">Company Details</h1>
            )}
          </DialogTitle>
          <div onClick={handleClose} className="mx-5 my-4 cursor-pointer">
            <Cross />
          </div>
        </div>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            {!selectedCompany && (
              <div className="flex flex-col justify-start  space-x-5">
                <div className="grid grid-cols-1 gap-4 mt-2 ml-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Grid item xs={12} sm={6}>
                    <CustomInput
                      name="userName" // Make sure the name matches the state property
                      placeholder="Enter Full Name"
                      title="Representative Name*"
                      size="small"
                      required
                      value={formData.userName} // Bind value to the state
                      onChange={(e) => {
                        if (!e.target.value.startsWith(" ")) {
                          handleInputChange(e);
                        }
                      }}
                      onBlur={(e) => {
                        if (saveButtonClicked) {
                          validateForm(); // Perform validation if save button was clicked
                        }
                      }}
                      errorMessage={
                        errors.userName ? (
                          <span style={{ color: "var(--error-color)" }}>
                            Please Enter Your Name
                          </span>
                        ) : null
                      }
                      error={errors.userName} // Show error message if there is a validation error
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomInput
                      name="clientEmail" // Ensure the name matches the formData key (lowercase 'email')
                      placeholder="Enter Your Email"
                      title="Business Email *"
                      size="small"
                      required
                      value={formData.clientEmail}
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
                      errorMessage={
                        errors.clientEmail ? (
                          <span style={{ color: "var(--error-color)" }}>
                            Enter Business Email
                          </span>
                        ) : null
                      }
                      error={errors.clientEmail}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomInput
                      name="phoneNumber"
                      placeholder="Enter Your Phone Number"
                      title="Phone Number *"
                      size="small"
                      required
                      type="number"
                      value={formData.phoneNumber}
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
                      onKeyPress={
                        (e) => handleKeyPress(e)
                        // Check for restricted characters and prevent default behavior if matched
                      }
                      errorMessage={
                        errors.phoneNumber ? (
                          <span style={{ color: "var(--error-color)" }}>
                            Enter Your Phone Number
                          </span>
                        ) : null
                      }
                      error={errors.phoneNumber}
                    />
                  </Grid>

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
                          color: formData?.userRole
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

                      {errors.userRole && (
                        <FormHelperText style={{ color: "var(--error-color)" }}>
                          Select Role
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>
                  <CustomInput
                    name="clientAddress"
                    placeholder="Enter Address"
                    title="Client Address*"
                    // value={clientAddress}
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
                    errorMessage={
                      errors.clientAddress ? (
                        <span style={{ color: "var(--error-color)" }}>
                          Please Enter Address
                        </span>
                      ) : null
                    }
                    error={errors.clientAddress}
                  />
                  <CustomInput
                    name="associatedBrands"
                    placeholder="Enter Brand Names split by comma"
                    title="Associated Brands"
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
                    errorMessage={
                      errors.associatedBrands ? (
                        <span style={{ color: "var(--error-color)" }}>
                          Please Enter Associated Brands
                        </span>
                      ) : null
                    }
                    error={errors.associatedBrands}
                  />
                </div>
              </div>
            )}
            <hr className="bg-[var(--secondary-color)]" />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "80%",
                    marginLeft: "20px",
                    marginTop: "20px",
                  }}
                >
                  <CustomInput
                    className="text-xs font-medium leading-6 text-left"
                    placeholder="Enter Your GSTIN"
                    title="GSTIN *"
                    type="text"
                    size="small"
                    name="gstin"
                    error={errors.gstin}
                    errorMessage={errors.gstin}
                    value={formData?.gstin.toUpperCase()}
                    // customcolor="var(--heading-color)"
                    fontWeight="500"
                    onChange={(e) => {
                      if (
                        !e.target.value.startsWith(" ") && // Prevent leading space
                        e.target.value.length < 16 // Limit GSTIN input to 15 characters
                      ) {
                        handleInputChange(e); // Handle input change
                      }
                    }}
                  />

                  {/* Conditional Rendering of Loading, Error or Verified Icon */}
                  {loading ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "60%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress color="inherit" size={20} />
                    </div>
                  ) : errors.gstin ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "47%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Cross
                        color="var(--error-color)"
                        fillcolor="var(--error-color)"
                      />
                    </div>
                  ) : isGstVerified ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "60%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        zIndex: 99999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <VerifiedTick
                        color="var(--third-color)"
                        fillcolor="var(--third-color)"
                      />
                      <p className="text-green-600 mr-5 text-2xl mb-2  rounded-full">
                        ✔
                      </p>
                    </div>
                  ) : null}
                </div>
              </Grid>
            </Grid>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 justify-center items-start p-5">
              <Grid item xs={12} sm={6}>
                <CustomInput
                  name="organizationName"
                  placeholder="Enter Company Name"
                  title="Company Name*"
                  value={formData?.organizationName}
                  size="small"
                  required
                  // value={formData?.vendorBusinessName}
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
                  errorMessage={
                    errors.organizationName ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter Organization Name
                      </span>
                    ) : null
                  }
                  error={errors.organizationName}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <CustomInput
                  name="sector"
                  placeholder="Sector"
                  title="Sector*"
                  value={formData?.sector}
                  size="small"
                  required
                  
                  // value={formData?.vendorBusinessName}
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
                  errorMessage={"Please Enter Sector"}
                  error={errors.sector}
                />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <label
                  style={{
                    fontWeight: "500",
                    color: errors.sector
                      ? "var(--error-color)"
                      : "var(--heading-color)",
                  }}
                >
                  Sector *
                </label>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="sector"
                    value={formData?.sector}
                    onChange={handleInputChange}
                    renderValue={(selected) => {
                      // This renders gray color when no option is selected
                      if (!selected || selected.length === 0) {
                        return (
                          <p
                            className="text-sm"
                            style={{ color: "var(--listdown-color)" }}
                          >
                            Industry Sector
                          </p>
                        );
                      }
                      // When an option is selected, show black
                      return <span style={{ color: "#000" }}>{selected}</span>;
                    }}
                    sx={{
                      color: formData?.userRole ? "#000" : "#B0B0B0", // Default gray, selected text turns black
                    }}
                  >
                    <MenuItem value="FMCG">FMCG</MenuItem>
                    <MenuItem value="Agricultural">Agricultural</MenuItem>
                    <MenuItem value="Automotive">Automotive</MenuItem>
                    <MenuItem value="Banking & Finance">
                      Banking & Finance
                    </MenuItem>
                    <MenuItem value="Hospitality & Travel">
                      Hospitality & Travel
                    </MenuItem>
                    <MenuItem value="Entertainment & Media">
                      Entertainment & Media
                    </MenuItem>
                    <MenuItem value="Healthcare">Healthcare</MenuItem>
                    <MenuItem value="Textile Industry">
                      Textile Industry
                    </MenuItem>
                    <MenuItem value="Energy">Energy</MenuItem>
                    <MenuItem value="Tele Communication">
                      Tele Communication
                    </MenuItem>
                  </Select>
                </FormControl>
                {errors.sector && (
                  <p
                    className=" leading-[1.66] tracking-[0.03em] text-left mt-[4px] mr-[14px] mb-0 ml-[14px]"
                    style={{ color: "var(--error-color)" }}
                  >
                    {errors.sector}
                  </p>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomInput
                  name="address"
                  placeholder="Address"
                  title="Address*"
                  value={formData?.address}
                  size="small"
                  required
                  // value={formData?.vendorBusinessName}
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
                  errorMessage={
                    errors.address ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter Address
                      </span>
                    ) : null
                  }
                  error={errors.address}
                />
              </Grid>
       

              <Grid item xs={12} sm={6}>
                <CustomInput
                  name="state"
                  placeholder="Enter State"
                  title="State *"
                  size="small"
                  value={formData?.state}
                  required
                  // value={formData?.vendorBusinessName}
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
                  errorMessage={
                    errors.state ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter State
                      </span>
                    ) : null
                  }
                  error={errors.state}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomInput
                  name="city"
                  placeholder="Enter City"
                  title="City *"
                  size="small"
                  value={formData?.city}
                  required
                  // value={formData?.vendorBusinessName}
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
                  errorMessage={
                    errors.city ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter City
                      </span>
                    ) : null
                  }
                  error={errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  name="pinCode"
                  placeholder="Enter Pin Code"
                  title="Pin Code*"
                  size="small"
                  type="number"
                  value={formData?.pinCode}
                  required
                  // value={formData?.vendorBusinessName}
                  onChange={(e) => {
                    if (
                      !e.target.value.startsWith(" ") &&
                      e.target.value.length < 7
                    ) {
                      handleInputChange(e);
                    }
                  }}
                  onBlur={(e) => {
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                  errorMessage={
                    errors.pinCode ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter pinCode
                      </span>
                    ) : null
                  }
                  error={errors.pinCode}
                />
              </Grid>
            </div>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>

          <CustomButton
            disabled={!isGstVerified}
            isLoading={submitloading}
            type="submit"
            text={selectedCompany ? "Update" : "Save"}
            style={{cursor:!isGstVerified?"not-allowed":"pointer"}}
            color="primary"
            onClick={(e) => {
              setSaveButtonClicked(true);
              handleSubmit(e);
            }}
            style={{
              cursor: !isGstVerified ? "not-allowed" : "pointer", // Conditionally change cursor
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClientOnboardingform;
