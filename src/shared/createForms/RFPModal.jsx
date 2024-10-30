import React, { useEffect, useRef, useState } from "react";
import CustomInput from "../../shared/utils/Input";
import CustomButton from "../../shared/utils/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Alert,
  Chip,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  AuditIcon,
  Cross,
  Delivery,
  InstalliationIcons,
  Recce,
  Search,
  Trash,
  UploadRfpIcon,
  ViewIcon,
} from "../../shared/assets/icons";
import axios from "axios";
import Manufacturing from "../assets/icons/Manufacturing";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const SeriveNeeded = [
  { name: "Recce", icon: <Recce size="16" color="var(--primary-color)" /> },
  {
    name: "Manufacturing",
    icon: <Manufacturing size="16" color="var(--primary-color)" />,
  },
  {
    name: "Delivery",
    icon: <Delivery size="16" color="var(--primary-color)" />,
  },
  {
    name: "Installation",
    icon: <InstalliationIcons size="16" color="var(--primary-color)" />,
  },
  { name: "Audit", icon: <AuditIcon size="16" color="var(--primary-color)" /> },
];

const RFPModal = ({ selectedCampaign }) => {
  const [service, setService] = React.useState([]);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const [SelectedCampaignDetails, SetSelectedCampaignDetails] = useState(null);

  const [isId, setId] = useState("");
  const serverURL = process.env.REACT_APP_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    campaignName: selectedCampaign?.campaignName || "",
    emailAddress: selectedCampaign?.emailAddress || "",
    campaignOwnerName: selectedCampaign?.campaignOwnerName || "",
    description: selectedCampaign?.description || "",
    startDate: selectedCampaign?.startDate || null,
    endDate: selectedCampaign?.endDate || null,
    teamMembers: selectedCampaign?.teamMembers || [],

    servicesNeeded: selectedCampaign?.servicesNeeded || "",
    document: selectedCampaign?.document || "",
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [userDomain, setUserDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [teamError, setteamError] = useState(false);

  const [errors, setErrors] = useState({});
  const [documentUrl, setdocumentUrl] = useState("");
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const restrictedDomains = ["gmail", "yahoo", "hotmail"];

  const getSelectedCampaigndetails = async (id) => {
    try {
      const response = await axios.get(
        `${serverURL}/requestForProposal/viewRfp/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success === true) {
        // SetSelectedCampaignDetails(response.data.data);
        const campaignData = response.data.data;
        SetSelectedCampaignDetails(campaignData);

        setFormData({
          campaignName: campaignData.campaignName || "",
          emailAddress: campaignData.campaignOwnerId.emailAddress || "",
          campaignOwnerName: campaignData.campaignOwnerId.name || "",
          description: campaignData.description || "",
          startDate: campaignData.startDate
            ? dayjs(campaignData.startDate)
            : null,
          endDate: campaignData.endDate ? dayjs(campaignData.endDate) : null,
          // teamMembers: campaignData.teamMembers || [],
          servicesNeeded: campaignData.servicesNeeded || "",
          document: campaignData.rfpDocument || "",
        });
        setdocumentUrl(campaignData.rfpDocument);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //useEffects-----------------------------------------------------------------
  useEffect(() => {
    const userMailDomain = localStorage.getItem("email");
    const user_Domain = userMailDomain.split("@")[1];
    setUserDomain(user_Domain);
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (id) {
      setId(id);
      getSelectedCampaigndetails(id);
    }
    return () => {
      setFormData({
        campaignName: "",
        emailAddress: "",
        campaignOwnerName: "",
        description: "",
        startDate: null,
        endDate: null,
        teamMembers: [],
        servicesNeeded: "",
        document: "",
      });
    };
  }, [teamMembers, selectedCampaign]);

  // ---------------------------------------------------------------------------
  //get all client id--------------------------------/client/dashboard
  const fetchAllTeamMembers = async () => {
    try {
      const response = await axios.get(`${serverURL}/client/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTeamMembers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setUploadLoading(true);

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        console.error("File is too large (max size: 2MB)");
        return;
      }

      const formDataNew = new FormData();
      formDataNew.append("files", file);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/upload`,
          formDataNew,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          setUploadLoading(false);
          setFormData({
            ...formData,
            document: response?.data?.data[0],
          });
          setdocumentUrl(response?.data?.data[0]);
        }
      } catch (err) {
        console.error("Error uploading file", err);
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.campaignName)
      newErrors.campaignName = "Campaign Name is required";

    if (!formData.emailAddress) {
      newErrors.emailAddress = "Email is Required";
    } else {
      const emailDomain = formData.emailAddress.split("@")[1];

      // Check if the email's domain matches the required domain
      if (emailDomain !== userDomain) {
        newErrors.emailAddress = `Email domain must match the domain ${userDomain}`;
      }
    }

    if (!formData.campaignOwnerName)
      newErrors.campaignOwnerName = "Campaign owner name is required";
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.endDate) newErrors.endDate = "End Date is required";

    // if (!formData.teamMembers)
    //   newErrors.teamMembers = "Team Member is required";
    // if (!formData.servicesNeeded) newErrors.servicesNeeded = "Select Services";
    if (formData.servicesNeeded.length === 0) {
      newErrors.service = "Please select at least one service.";
    }
    if (!formData.document) newErrors.document = "Upload RFP Document";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTeamMember = (event) => {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      // if (teamMember && !teamMembers.includes(teamMember.trim())) {
      //   const updatedTeamMembers = [...teamMembers, teamMember.trim()];

      //   setTeamMembers(updatedTeamMembers);
      //   setTeamMember("");

      //   setFormData((prevFormData) => ({
      //     ...prevFormData,
      //     teamMembers: updatedTeamMembers,
      //   }));
      // }
      if (teamMembers === "") {
        setteamError(true); // Show error for empty email
      } else if (!validateEmail(teamMembers)) {
        errors.emailAddress = "Please enter correct Domain";
        setteamError(true);
        setSnackbar({
          open: true,
          message:
            "Please enter an email address that matches your business domain",
          severity: "error",
        });
      } else if (teamMembers && !teamMembers.includes(teamMembers.trim())) {
        const updatedTeamMembers = [...teamMembers, teamMembers.trim()];
        setTeamMembers(updatedTeamMembers);
        setteamError(false); // Clear the error message

        setFormData((prevFormData) => ({
          ...prevFormData,
          teamMembers: updatedTeamMembers,
        }));
      }
    }
  };

  const handleDeleteEmail = (emailToDelete) => () => {
    setTeamMembers((emails) =>
      emails.filter((email) => email !== emailToDelete)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // setIsGstVerified(false);
    // Using a single state update with the callback function to ensure state consistency
    if (name === "startDate") {
      setErrors((prev) => ({
        ...prev,
        startDate: !value, // If no value (date not selected), set error to true
      }));
    }
    setFormData((prevFormData) => {
      const updatedData = { ...prevFormData, [name]: value };

      return updatedData;
    });
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleService = (challenge) => {
    setFormData((prevFormData) => {
      const updatedSelectedChallenges = prevFormData.servicesNeeded.includes(
        challenge
      )
        ? prevFormData.servicesNeeded.filter((item) => item !== challenge)
        : [...prevFormData.servicesNeeded, challenge];

      return {
        ...prevFormData,
        servicesNeeded: updatedSelectedChallenges, // Properly update the `service` field in `formData`
      };
    });
  };
  const handleDelete = async (e, id) => {
    Swal.fire({
      customClass: {
        container: "my-swal",
      },
      icon: "warning",
      text: "Do you want to delete this RFP Proposal?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${serverURL}/requestForProposal/deleteRfp/${id}`,

            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.data.success === true) {
            // Show success message
            Swal.fire({
              customClass: {
                container: "my-swal",
              },
              icon: "success",
              text: response.data.message,
              padding: "1em",
              color: "green",
            }).then(() => {
              navigate("/user/RFP");
            });
          }
        } catch (error) {
          console.error("Error deleting client:", error);

          // Show error message if delete fails
          Swal.fire({
            customClass: {
              container: "my-swal",
            },
            icon: "error",
            text: error.response?.data?.message || "An error occurred",
            color: "black",
          });
        }
      }
    });
  };
  const handleDeleteUpload = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      document: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        customClass: {
          container: "my-swal",
        },
        icon: "error",
        text: "Please fill out the required fields correctly",
        color: "black",
      });
    } else {
      // Update or create RFP
      try {
        // Check if we're updating an existing RFP
        if (selectedCampaign) {
          try {
            const response = await axios.put(
              `${serverURL}/requestForProposal/editRfp/${id}`,
              formData,
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
                text: "RFP updated successfully!",
                padding: "1em",
                color: "black",
              }).then(() => {
                navigate("/user/RFP");
              });
            }
          } catch (error) {
            console.error("Error updating RFP:", error);
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
        // New rfp creation
        else {
          try {
            setIsLoading(true);
            const response = await axios.post(
              `${serverURL}/requestForProposal/addRfp`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.data.success === true) {
              Swal.fire({
                customClass: {
                  container: "my-swal",
                },
                icon: "success",
                text: response.data.message,
                padding: "1em",
                color: "green",
              }).then(() => {
                navigate("/user/RFP");
              });
            } else {
              Swal.fire({
                customClass: {
                  container: "my-swal",
                },
                icon: "error",
                text: response.data.message || "Client not found",

                // text: "Error in creating organization",
              });
            }
          } catch (error) {
            Swal.fire({
              customClass: {
                container: "my-swal",
              },
              icon: "error",
              text: error.response.data.message,
              padding: "1em",
              color: "var(--heading-color)",
            });
          }
        }
      } catch (error) {
        console.error("Error creating or updating rfp:", error);
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

  return (
    <div className=" min-h-[670px] mb-8 flex items-center justify-center ml-0 md:ml-3 md:mb-3 relative  ">
      <Grid
        container
        className="flex flex-col md:flex-row max-w-full absolute top-0 rounded-2xl gap-4 px-4 py-2 shadow-lg mb-20 bg-white overflow-auto"
      >
        <div className="md:w-[60%]  px-2 ">
          <div>
            {id !== undefined ? (
              <h1 className="text-[20px]">{formData.campaignName}</h1>
            ) : (
              <div>
                <h1 className="text-[20px]">GENERATE RFP</h1>
                <p className="text-[14px]"> Start you campaign from here</p>
              </div>
            )}
          </div>
          <div className="mt-4 ">
            <Grid item xs={12} md={12} lg={14}>
              <label
                className="text-[12px] font-[500]"
                style={{ marginBottom: "6px", display: "block" }}
              >
                Campaign name*
              </label>
              <CustomInput
                className="text-xs font-medium leading-6 text-left"
                placeholder="Enter Campaign name"
                value={formData?.campaignName}
                type="text"
                size="small"
                name="campaignName"
                customcolor="var(--heading-color)"
                fontWeight="500"
                // errorMessage={"Please Enter Campaign's Name"}
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
                error={errors.campaignName}
                // errorMessage={""}
              />
              {errors.campaignName && (
                <FormHelperText
                  className="text-[var(--error-color)] text-[12px] -mt-3 ml-3"
                  sx={{
                    color: "var(--error-color)",
                    marginTop: -1,
                    marginLeft: 1.5,
                  }}
                >
                  {errors.campaignName}
                </FormHelperText>
              )}
            </Grid>

            <div className="flex flex-col justify-center md:flex-row  items-start gap-2  lg:gap-6">
              <Grid item xs={16} md={6} lg={6}>
                <label
                  className="text-[12px] font-[500]"
                  style={{ marginBottom: "6px", display: "block" }}
                >
                  Campaign owner email *
                </label>
                <CustomInput
                  className="text-xs font-medium leading-6 text-left"
                  placeholder="neerajsingh@astonmartin.com"
                  // title="Campaign owner email *"
                  type="email"
                  // disabled={!isEditable}
                  size="small"
                  name="emailAddress"
                  error={errors.emailAddress}
                  // errorMessage={errors.campaignOwnerEmailAddress}
                  value={formData?.emailAddress}
                  customcolor="var(--heading-color)"
                  fontWeight="500"
                  onChange={handleInputChange}
                  onBlur={() => {
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                />
                {errors.emailAddress && (
                  <FormHelperText
                    className="text-[var(--error-color)] text-[12px] -mt-3 ml-3"
                    sx={{
                      color: "var(--error-color)",
                      marginTop: -1,
                      marginLeft: 1.5,
                    }}
                  >
                    {errors.emailAddress}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <label
                  className="text-[12px] font-[500]"
                  style={{ marginBottom: "6px", display: "block" }}
                >
                  Campaign owner name*
                </label>

                <CustomInput
                  className="text-xs font-medium leading-6 text-left h-30 "
                  placeholder="Enter Owner Name"
                  // title="Campaign owner name*"
                  type="text"
                  size="small"
                  name="campaignOwnerName"
                  value={formData.campaignOwnerName}
                  customcolor="var(--heading-color)"
                  fontWeight="500"
                  error={errors.campaignOwnerName}
                  // errorMessage={errors.campaignOwnerName}
                  onChange={handleInputChange}
                  onBlur={() => {
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                />
                {errors.campaignOwnerName && (
                  <FormHelperText
                    className="text-[var(--error-color)] text-[12px] -mt-3 ml-3"
                    sx={{
                      color: "var(--error-color)",
                      marginTop: -1,
                      marginLeft: 1.5,
                    }}
                  >
                    {errors.campaignName}
                  </FormHelperText>
                )}
              </Grid>
            </div>
            <Grid item xs={12} md={12} lg={14}>
              <label
                className="text-[12px] font-[500]"
                style={{ marginBottom: "6px", display: "block" }}
              >
                Description
              </label>

              <TextField
                className="text-xs font-medium leading-6 text-left w-full "
                placeholder="Enter your description"
                title="Description"
                multiline
                type="text"
                value={formData?.description}
                rows={3} // You can adjust the number of rows as needed
                // disabled={!isEditable}
                size="small"
                name="description"
                // error={errors.name}
                // helperText={errors.name}
                // value={formData.name}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--listdown-color)", // Adjust border color
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--listdown-color)", // Adjust border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--primary-color)", // Adjust border color when focused
                    },
                  },
                }}
                onChange={handleInputChange}
              />
            </Grid>

            <div className="flex  lg:flex-row w-full gap-4 mb-3 mt-4">
              <Grid item xs={12} md={8} lg={10}>
                <div className="flex flex-col ">
                  <label
                    className="text-[12px] font-[500]"
                    style={{ marginBottom: "6px", display: "block" }}
                  >
                    Start Date*
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      // label="Start Date"
                      className="p-20"
                      value={formData.startDate || null}
                      onChange={(date) => {
                        handleInputChange({
                          target: { name: "startDate", value: date },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={errors.startDate} // Show error style if true
                          helperText={errors.startDate && "Select Start Date"}
                        />
                      )}
                      required
                      error={errors.startDate}
                      errorMessage={errors.startDate}
                    />
                  </LocalizationProvider>
                  {errors.startDate && (
                    <FormHelperText
                      className="text-[var(--error-color)] text-[12px] -mt-3 ml-3"
                      sx={{
                        color: "var(--error-color)",
                        marginTop: 1,
                        marginLeft: 1.5,
                      }}
                    >
                      Select Start Date
                    </FormHelperText>
                  )}
                </div>
              </Grid>
              <Grid item xs={12} md={8} lg={10}>
                <div className="flex flex-col   ">
                  <label
                    className="text-[12px] font-[500]"
                    style={{ marginBottom: "6px", display: "block" }}
                  >
                    End Date*
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      // label="Last Date"
                      value={formData.endDate || null} // Controlled value
                      minDate={formData.startDate || null}
                      onChange={(date) =>
                        handleInputChange({
                          target: { name: "endDate", value: date },
                        })
                      }
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                      required
                    />
                  </LocalizationProvider>
                  {errors.endDate && (
                    <FormHelperText
                      className="text-[var(--error-color)] text-[12px] -mt-3 ml-3"
                      sx={{
                        color: "var(--error-color)",
                        marginTop: 1,
                        marginLeft: 1.5,
                      }}
                    >
                      Select End Date
                    </FormHelperText>
                  )}
                </div>
              </Grid>
            </div>

            <div className="mb-2">
              <label
                className="text-[12px] font-[500]"
                style={{ marginBottom: "6px", display: "block" }}
              >
                Service needed*
              </label>

              <Stack direction="row" className="flex-wrap gap-2 mt-2">
                {SeriveNeeded.map((challenge) => (
                  <Chip
                    // value={challengesInCurrentMarketing[challenge]}
                    label={
                      <span className="flex justify-center items-center gap-2">
                        {challenge.icon && (
                          <span
                            style={{
                              marginRight: "2px",
                              verticalAlign: "middle",
                              color: formData.servicesNeeded.includes(
                                challenge.name
                              )
                                ? "#418cff" // Set the icon color to blue when selected
                                : "gray", // Gray when not selected
                            }}
                          >
                            {challenge.icon}
                          </span>
                        )}
                        {challenge.name}
                      </span>
                    }
                    variant={
                      formData.servicesNeeded.includes(challenge.name)
                        ? "outlined"
                        : "outlined"
                    }
                    sx={{
                      cursor: "pointer",
                      backgroundColor: formData.servicesNeeded.includes(
                        challenge.name
                      )
                        ? "#e1ecff"
                        : "white",
                      borderColor: formData.servicesNeeded.includes(
                        challenge.name
                      )
                        ? "#418cff"
                        : "gray",
                      color: formData.servicesNeeded.includes(challenge.name)
                        ? "#418cff"
                        : "gray",
                      ...(!formData.servicesNeeded.includes(challenge.name) && {
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: "#418cff",
                          borderColor: "#418cff",
                        },
                      }),
                      ...(formData.servicesNeeded.includes(challenge.name) && {
                        "&:hover": {
                          backgroundColor: "#e1ecff",
                        },
                      }),
                    }}
                    onClick={(e) => {
                      handleService(e.target.innerText);
                    }}
                  />
                ))}
              </Stack>
              {errors.service && (
                <FormHelperText
                  className="text-[var(--error-color)] text-[12px] -mt-3 ml-3"
                  sx={{
                    color: "var(--error-color)",
                    marginTop: 1,
                    marginLeft: 1.5,
                  }}
                >
                  {errors.service}
                </FormHelperText>
              )}
            </div>
            <Grid item xs={12} md={12} lg={14} className="">
              <label
                className="text-[12px] font-[500]"
                style={{ marginBottom: "6px", display: "block" }}
              >
                Team
              </label>
              <CustomInput
                variant="outlined"
                name="teamMembers"
                value={teamMembers}
                onChange={(e) => setTeamMembers(e.target.value)}
                onKeyDown={handleAddTeamMember}
                placeholder="Email, comma or space"
                fullWidth
                InputProps={{
                  style: { display: "flex", flexWrap: "wrap" },
                  startAdornment: (
                    <div
                      ref={containerRef}
                      className="flex flex-wrap gap-2  max-h-16  overflow-auto items-center "
                    >
                      {teamMembers.map((teamMember, index) => (
                        <Chip
                          key={index}
                          label={teamMember}
                          onDelete={handleDeleteEmail(teamMember)}
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
            </Grid>
          </div>
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
                color: "white",
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
          <div className="flex justify-between items-center w-full">
            {id !== undefined ? (
              <Grid item xs={12} className="text-left">
                <div className="hidden md:block">
                  <button
                    type="Submit"
                    className=" text-[var(--error-color)] rounded-md font-semibold h-10 w-48"
                    style={{ border: "1px solid var(--error-color) " }}
                    onClick={(e) =>
                      handleDelete(e, SelectedCampaignDetails._id)
                    }
                    // isLoading={isLoading}
                  >
                    Delete Proposal
                  </button>
                </div>
              </Grid>
            ) : (
              ""
            )}

            <Grid item xs={12} className="text-right">
              <div className="hidden md:block">
                <CustomButton
                  type="Submit"
                  // isLoading={isLoading}
                  bgcolor="var(--primary-color)"
                  fontWeight="600"
                  className="h-10 w-48 "
                  text={SelectedCampaignDetails ? "Save" : "Submit"}
                  onClick={(e) => {
                    // setIsLoading(true)
                    setSaveButtonClicked(true);
                    handleSubmit(e);
                  }}
                />
              </div>
            </Grid>
          </div>
        </div>
        <div className=" w-full  md:w-[35%] max-h-[560px]  ">
          {SelectedCampaignDetails ? (
            <p className="text-[var(--heading-color)] mb-3"> RFP</p>
          ) : (
            <p className="text-[var(--heading-color)] mb-3">Upload RFP</p>
          )}

          <div
            style={{
              border: "2px dashed var(--primary-color)",
              padding: "10px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              height: "100%",
            }}
            className="w-full bg-[var(--bg-color)] relative rounded-2xl"
          >
            <label className="relative">
              {formData.document ? (
                <div className="w-full ">
                  <iframe
                    src={formData.document}
                    width="100%"
                    height="300px"
                  ></iframe>
                </div>
              ) : formData?.document ? (
                <>
                  <div className="h-52 w-52 object-cover">
                    <div>
                      <iframe
                        src={formData.document}
                        width="100%"
                        height="300px"
                      ></iframe>
                    </div>
                  </div>
                </>
              ) : uploadLoading ? (
                <CircularProgress></CircularProgress>
              ) : (
                <div className="flex flex-col justify-center items-center w-full h-full">
                  <div>
                    <UploadRfpIcon color={"var(--primary-color)"} size="70" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onClick={handleClick}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept=".pdf,.xlsx,.doc" // Accept specific file formats
                  />
                  <span
                    style={{
                      marginTop: "10px",
                      color: "var(--primary-color)",
                      textAlign: "center",
                    }}
                  >
                    Drag your RFP here in .pdf, .xlsx, or .doc format or browse
                    (max size: 2mb)
                  </span>
                </div>
              )}
            </label>
            {formData.document ? (
              <div className="absolute flex top-3 right-5  cursor-pointer ">
                <a
                  href={formData.document}
                  target="_blank"
                  className="cursor-pointer text-center "
                  title="View"
                >
                  <Tooltip title="View Upload">
                    <IconButton>
                      <ViewIcon color="var(--primary-color)" />
                    </IconButton>
                  </Tooltip>
                </a>
                <div onClick={handleDeleteUpload}>
                  <Tooltip title="Delete Upload" onClick={handleDeleteUpload}>
                    <IconButton>
                      <Trash color="red" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          {formData.document && (
            <div className="flex items-center justify-center mt-2">
              {id !== undefined ? (
                ""
              ) : (
                <p className="text-[var(--third-color)]">
                  File uploaded successfully!
                </p>
              )}

              {/* <p>Uploaded file URL: {formData.document}</p> */}
            </div>
          )}
        </div>
        <Grid item xs={12} className="text-right">
          <div className="block md:hidden mt-8 text-center">
            <CustomButton
              // type="Submit"
              // isLoading={isLoading}
              color="var(--heading-color)"
              fontWeight="600"
              className="h-10 w-48 "
              text={SelectedCampaignDetails ? "Save" : "Submit"}
              onClick={(e) => {
                // setIsLoading(true)
                setSaveButtonClicked(true);
                handleSubmit(e);
              }}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default RFPModal;
