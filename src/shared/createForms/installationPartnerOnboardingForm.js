import React, { useState } from "react";
import { statecityData } from "../../shared/enums";
import CustomButton from "../../shared/utils/Button";
import dayjs from "dayjs";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { Cross } from "../../shared/assets/icons/index";
import CustomInput from "../../shared/utils/Input";
import axios from "axios";
import Swal from "sweetalert2";
import "./vendorOnboard.css";
import { validate } from "../utils/validation";
import FileUploader from "../utils/galleryUpload";
import MinMaxFileUploader from "../utils/minmaxFileUploader";

const InstallationPartnerOnboardingForm = ({
  isModalOpen,
  setIsModalOpen,
  selectedInstallationPartnerData,
  setSelectedInstallationPartnerData,
  getInstallationPartnerList
}) => {
  const [formData, setFormData] = useState({
    name: selectedInstallationPartnerData?.name || "",
    gender: selectedInstallationPartnerData?.gender || "",
    dateOfBirth:
      selectedInstallationPartnerData?.dateOfBirth?.split("T")[0] || "",

    address: selectedInstallationPartnerData?.address || "",
    experience: selectedInstallationPartnerData?.experience || "",
    priorKnowledgeOfInstallation:
      selectedInstallationPartnerData?.priorKnowledgeOfInstallation || false,
    phoneNumber: selectedInstallationPartnerData?.phoneNumber || "",
    emailAddress: selectedInstallationPartnerData?.emailAddress || "",
    city: selectedInstallationPartnerData?.city || "",
    state: selectedInstallationPartnerData?.state || "",
    zipCode: selectedInstallationPartnerData?.zipCode || "",
    isTestPassed: selectedInstallationPartnerData?.isTestPassed || false,
    bankDetails: {
      IFSC: selectedInstallationPartnerData?.bankDetails?.IFSC || "",
      bankName: selectedInstallationPartnerData?.bankDetails?.bankName || "",
      bankHolderName:
        selectedInstallationPartnerData?.bankDetails?.bankHolderName || "",
      cancelledCheque:
        selectedInstallationPartnerData?.bankDetails?.cancelledCheque || "",
      accountNumber:
        selectedInstallationPartnerData?.bankDetails?.accountNumber || "",
      panNumber: selectedInstallationPartnerData?.bankDetails?.panNumber || "",
    },
    // bankDetails: selectedInstallationPartnerData?.bankDetails || {},
    aadhaarCardNumber: selectedInstallationPartnerData?.aadhaarCardNumber || "",
    profilePhoto: selectedInstallationPartnerData?.profilePhoto || "",
  });
  const [requiredFields, setRequiredFields] = useState({
    name: false,
    gender: false,
    address: false,
    phoneNumber: false,
    emailAddress: false,
    experience: false,
    state: false,
    city: false,
    zipCode: false,
  });

  // other
  const [disableSaveButton, setDisableSaveButton] = useState();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const serverURL = process.env.REACT_APP_URL;


  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0]; // Format the date in YYYY-MM-DD

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);

    setFormData((prevFormData) => {
      // Split the name by dot to handle nested objects (like "bankDetails.IFSC")
      const nameParts = name.split(".");

      // If name refers to a nested object, handle it differently
      if (nameParts.length === 2) {
        const [objectName, key] = nameParts;
        return {
          ...prevFormData,
          [objectName]: {
            ...prevFormData[objectName], // Keep existing data for bankDetails or other nested objects
            [key]: value, // Update the specific nested key (e.g., "IFSC")
          },
        };
      } else {
        // Handle top-level fields normally
        return {
          ...prevFormData,
          [name]: value,
        };
      }
    });

    // Reset errors or perform validation here if needed
    setErrors({ ...errors });
  };

  const emptyInputCheck = (fieldName, value) => {
    if (value === "") {
      setRequiredFields({ ...requiredFields, [fieldName]: true });
    } else {
      setRequiredFields({ ...requiredFields, [fieldName]: false });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "State is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (
      !formData.emailAddress ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)
    ) {
      newErrors.emailAddress = "Valid Email is required";
    }

    if (!formData.aadhaarCardNumber)
      newErrors.aadhaarCardNumber = "Experience is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.zipCode) newErrors.zipCode = "Zip Code is required";

    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Valid Contact No is required";
    if (formData.zipCode && !/^\w{6}$/.test(formData.zipCode))
      newErrors.zipCode = "PAN Number is not valid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedInstallationPartnerData({})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("skjfakj");

    if (!validateForm()) {
      Swal.fire({
        customClass: {
          container: "my-swal",
        },
        icon: "error",
        text: "Something Went Wrong in Validation",
        color: "black",
      });
    } else {
      try {
        if (selectedInstallationPartnerData._id) {
          // Update existing vendor
          try {
            const updatedFormData = {
              ...formData,
            };
            setIsLoading(true);
            const response = await axios.patch(
              `${serverURL}/installationPartner/edit/${selectedInstallationPartnerData._id}`,
              updatedFormData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.status === 200) {
              Swal.fire({
                customClass: {
                  container: "my-swal",
                },
                icon: "success",

                text: "Installation Partner Update Successfully!",
                padding: "1em",
                color: "black", // Corrected color value
              }).then(() => {setIsModalOpen(false);getInstallationPartnerList()});
            }
          } catch (error) {
            console.error("Error updating vendor:", error);
            Swal.fire({
              customClass: {
                container: "my-swal",
              },
              icon: "error",
              title: error.response.data.message,
              text: `Error in updating vendor: ${formData.vendorBusinessName}!`,
              padding: "1em",
            });
          }
        } else {
          // Create new vendor
          try {
            const updatedFormData = {
              ...formData,
            };
            setIsLoading(true);
            const response = await axios.post(
              `${serverURL}/installationPartner/add`,
              updatedFormData,
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
                setIsModalOpen(false);
                getInstallationPartnerList()
              });
            } else {
              console.log(response.data);
            }
          } catch (error) {
            console.error("Error creating Installation Partner:", error);
            setIsLoading(true);
            Swal.fire({
              customClass: {
                container: "my-swal",
              },
              icon: "error",
              title: error.response.data.message,
              text: `Error in creating Installation Partner !`,

              color: "black",
            });
          }
        }
      } catch (globalError) {
        setIsLoading(true);
        console.error("Unexpected error:", globalError);
        Swal.fire({
          customClass: {
            container: "my-swal",
          },
          icon: "error",
          title: "Oops...",
          text: "An unexpected error occurred!",
          padding: "1em",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div>
      <Dialog
        open={isModalOpen}
        // maxWidth="xl"
        fullScreen
        fullWidth
      >
        <div className="flex justify-between">
          <DialogTitle>Installation Partner Form</DialogTitle>
          <div
            onClick={handleClose}
            className="mx-5 my-4"
            style={{ cursor: "pointer" }}
          >
            <Cross />
          </div>
        </div>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="name"
                  placeholder="Enter Name"
                  title="Name *"
                  size="small"
                  required
                  onChange={(e) => handleInputChange(e)}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) validateForm();
                  }}
                  errorMessage={errors.name ? "Please Enter Name" : null}
                  error={errors.name}
                  value={formData?.name}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputLabel
                  className={`${errors.gender && "text-[var(--error-color)]"}`}
                >
                  Gender *
                </InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                  error={!!errors.gender} // Boolean for error state
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="gender"
                    value={formData?.gender || ""}
                    onChange={handleInputChange}
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <p className="text-[1rem] text-[var(--light-gray)]">
                            Select Gender
                          </p>
                        );
                      }
                      return selected;
                    }}
                  >
                    {/* Gender options */}
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>

                {errors.gender && (
                  <p className="font-normal text-[0.75rem] leading-[1.66] tracking-[0.03em] text-left mt-[4px] mr-[14px] mb-0 ml-[14px] text-[var(--error-color)]">
                    {errors.gender}
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="dateOfBirth"
                  placeholder="Enter Date of Birth"
                  title="Date of Birth *"
                  size="small"
                  type="date"
                  onChange={(e) => handleInputChange(e)}
                  value={formData?.dateOfBirth}
                  max={maxDate}
                  errorMessage={
                    errors.dateOfBirth ? "Please Enter Your Date" : null
                  }
                  error={errors.dateOfBirth}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) validateForm();
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="address"
                  placeholder="Enter Address"
                  title="Address *"
                  size="small"
                  onChange={(e) => handleInputChange(e)}
                  value={formData?.address}
                  errorMessage={
                    errors.address ? "Please Enter Your Address" : null
                  }
                  error={errors.address}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) validateForm();
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputLabel
                  className={`${errors.experience && "text-[var(--error-color)]"}`}
                >
                  Experience *
                </InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                  error={!!errors.experience} // Boolean for error state
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="experience"
                    value={formData?.experience || ""}
                    onChange={handleInputChange}
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <p className="text-[1rem] text-[var(--light-gray)]">
                            Select Your Experience
                          </p>
                        );
                      }
                      return selected;
                    }}
                  >
                    {/* Gender options */}
                    <MenuItem value="0-5">0-5</MenuItem>
                    <MenuItem value="6-10">6-10</MenuItem>
                    <MenuItem value="11-15">11-15</MenuItem>
                    <MenuItem value="16-20">16-20</MenuItem>
                  </Select>
                </FormControl>

                {errors.experience && (
                  <p className="font-normal text-[0.75rem] leading-[1.66] tracking-[0.03em] text-left mt-[4px] mr-[14px] mb-0 ml-[14px] text-[var(--error-color)]">
                    {errors.experience}
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputLabel style={{ color: "var(--heading-color)" }}>
                  Prior Knowledge of Installation *
                </InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="priorKnowledgeOfInstallation"
                    value={
                      formData?.priorKnowledgeOfInstallation ? true : false
                    } // Convert Boolean to string for Select
                    onChange={handleInputChange}
                    renderValue={(selected) => {
                      if (selected === false) return "No";
                      if (selected === true) return "Yes";
                      return (
                        <p className="text-[1rem] text-[var(--light-gray)]">
                          Select
                        </p>
                      );
                    }}
                  >
                    <MenuItem value={false}>No</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="phoneNumber"
                  placeholder="Enter Phone Number"
                  title="Phone Number *"
                  type="number"
                  size="small"
                  onChange={(e) => {
                    if (
                      !e.target.value.startsWith(" ") &&
                      e.target.value.length < 11
                    ) {
                      handleInputChange(e);
                    }
                  }}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) validateForm();
                  }}
                  value={formData?.phoneNumber}
                  errorMessage={
                    errors.phoneNumber ? "Please Enter Phone Number" : null
                  }
                  error={errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  type="email"
                  name="emailAddress"
                  placeholder="Enter Email Address"
                  title="Email Address *"
                  size="small"
                  onChange={(e) => handleInputChange(e)}
                  value={formData?.emailAddress}
                  errorMessage={
                    errors.emailAddress ? "Please Enter Email" : null
                  }
                  error={errors.emailAddress}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) validateForm();
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputLabel
                  className={`${errors.state && "text-[var(--error-color)]"}`}
                >
                  State *
                </InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                  error={errors.state}
                  errorMessage={
                    errors.state ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter State
                      </span>
                    ) : null
                  }
                  value={formData?.state}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="state"
                    onBlur={(e) => {
                      emptyInputCheck(e.target.name, e.target.value);
                      if (saveButtonClicked) {
                        validateForm();
                      }
                    }}
                    value={formData?.state}
                    onChange={handleInputChange}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <p className="text-[1rem] text-[var(--light-gray)]">
                            State
                          </p>
                        );
                      }

                      return selected;
                    }}
                  >
                    {Object.keys(statecityData).map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.state && (
                  <p className="font-normal text-[0.75rem] leading-[1.66] tracking-[0.03em] text-left mt-[4px] mr-[14px] mb-0 ml-[14px] text-[var(--error-color)]">
                    {errors.state}
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputLabel
                  className={`${errors.city && "text-[var(--error-color)]"}`}
                >
                  City *
                </InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                  error={errors.city}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="city"
                    //-------------------------------------------------------
                    value={formData?.city || ""}
                    onChange={handleInputChange}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <p className="text-[1rem]  text-[var(--light-gray)]">
                            City
                          </p>
                        );
                      }
                      return selected;
                    }}
                  >
                    {statecityData?.[formData?.state]?.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.city && (
                  <p className="font-normal text-[0.75rem] leading-[1.66] tracking-[0.03em] text-left mt-[4px] mr-[14px] mb-0 ml-[14px] text-[var(--error-color)]">
                    {errors.city}
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="zipCode"
                  placeholder="Enter Zip Code"
                  title="Zip Code *"
                  type="number"
                  size="small"
                  onChange={(e) => {
                    if (
                      !e.target.value.startsWith(" ") &&
                      e.target.value.length < 7
                    ) {
                      handleInputChange(e);
                    }
                  }}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) validateForm();
                  }}
                  value={formData?.zipCode}
                  errorMessage={
                    errors.zipCode ? "Please Enter Your Zip Code" : null
                  }
                  error={errors.zipCode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputLabel style={{ color: "var(--heading-color)" }}>
                  Test Passed *
                </InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="isTestPassed"
                    value={formData?.isTestPassed ? true : false} // Convert Boolean to string for Select
                    onChange={handleInputChange}
                    renderValue={(selected) => {
                      if (selected === false) return "No";
                      if (selected === true) return "Yes";
                      return (
                        <p className="text-[1rem] text-[var(--light-gray)]">
                          Select
                        </p>
                      );
                    }}
                  >
                    <MenuItem value={false}>No</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="aadhaarCardNumber"
                  placeholder="Enter Aadhaar Card Number"
                  title="Aadhaar Card Number *"
                  size="small"
                  onChange={(e) => {
                    if (
                      !e.target.value.startsWith(" ") &&
                      e.target.value.length < 13
                    ) {
                      handleInputChange(e);
                    }
                  }}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) validateForm();
                  }}
                  value={formData?.aadhaarCardNumber}
                  required
                  type="number"
                  errorMessage={
                    errors.aadhaarCardNumber
                      ? "Please Enter Your Aadhaar"
                      : null
                  }
                  error={errors.aadhaarCardNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="bankDetails.IFSC"
                  placeholder="IFSC Code"
                  title="IFSC Code"
                  size="small"
                  onChange={(e) => handleInputChange(e)}
                  value={formData.bankDetails.IFSC}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="bankDetails.bankName"
                  placeholder="Bank Name"
                  title="Bank Name"
                  size="small"
                  onChange={(e) => handleInputChange(e)}
                  value={formData.bankDetails.bankName}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="bankDetails.bankHolderName"
                  placeholder="Bank Holder Name"
                  title="Bank Holder Name"
                  size="small"
                  onChange={(e) => handleInputChange(e)}
                  value={formData.bankDetails.bankHolderName}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="bankDetails.accountNumber"
                  placeholder="Enter Account Number"
                  title="Bank Account Number"
                  type="number"
                  size="small"
                  onChange={(e) => {
                    if (
                      !e.target.value.startsWith(" ") &&
                      e.target.value.length < 17
                    ) {
                      handleInputChange(e);
                    }
                  }}
                  value={formData.bankDetails.accountNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomInput
                  name="bankDetails.panNumber"
                  placeholder="Enter Pan Number"
                  title="Pan Number"
                  type="number"
                  size="small"
                  onChange={(e) => {
                    if (
                      !e.target.value.startsWith(" ") &&
                      e.target.value.length < 11
                    ) {
                      handleInputChange(e);
                    }
                  }}
                  value={formData.bankDetails.panNumber}
                />
              </Grid>
             
            </Grid>
          </form>
        </DialogContent>
        <div className="flex justify-around">
          <div className="pl-[20px] pr-[20px] py-0">
            <span
              style={{ color: "gray", fontSize: "20px", fontWeight: "bold" }}
            >
              Profile Photo
            </span>
            <MinMaxFileUploader
              initialFiles={formData.profilePhoto} // Prepopulate with profile photo
              onFilesUpload={(urls) =>
                setFormData({
                  ...formData,
                  profilePhoto: urls, // Store the image as a Data URL for preview
                })
              }
              typeOfFilesAllowed={"image/*"} // Specify allowed file types (only images)
              maxFiles={1} // Limit to only 1 file
            />
          </div>
          <div className="pl-[20px] pr-[20px] py-0">
            <span
              style={{ color: "gray", fontSize: "20px", fontWeight: "bold" }}
            >
              Cheque Photo
            </span>
            <MinMaxFileUploader
              initialFiles={formData.bankDetails.cancelledCheque} // Prepopulate with cheque photo
              onFilesUpload={(urls) =>
                setFormData({
                  ...formData,
                  bankDetails: {
                    ...formData.bankDetails,
                    cancelledCheque: urls,
                  },
                })
              } // Update formData with uploaded cheque photo
              typeOfFilesAllowed={"image/*,video/*"} // Allow images and videos
              maxFiles={1} // Limit to only 1 file
            />
          </div>
        </div>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <CustomButton
            type="submit"
            isLoading={isLoading}
            disabled={disableSaveButton}
            text={selectedInstallationPartnerData._id ? "Update" : "Save"}
            color="primary"
            onClick={(e) => {
              // setIsLoading(true)
              setSaveButtonClicked(true);
              handleSubmit(e);
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InstallationPartnerOnboardingForm;
