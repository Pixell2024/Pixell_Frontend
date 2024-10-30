import { React, useState } from "react";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CustomInput from "../../../../shared/utils/Input";
import CustomButton from "../../../../shared/utils/Button";
import {
  BlacklistUser,
  Cross,
  LeftArrowIcon,
  User,
  VerifiedTick,
} from "../../../../shared/assets/icons";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Grid from "@mui/material/Grid";
import { verifyGST } from "../../../../shared/utils/gstInfoApi";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Styles from "../../../../styles/setup.module.css";

const OrganizationDetailsForm = ({
  handleBack,
  handleNext,
  formData,
  setFormData,
}) => {
  const [loading, setLoading] = useState(false); // loading state for API calls
  const [errors, setErrors] = useState({});
  const [isGstVerfied, setIsGstVerified] = useState(false);

  const handleInputChange = async (e) => {
    const { name, value, files } = e.target;
    setErrors({ ...errors, gstin: "" });
    setIsGstVerified(false);
    if (files?.length > 0) {
      let file = files[0];
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
          setFormData({
            ...formData,
            brandLogo: response?.data?.data[0], // Store the image as a Data URL for preview
            // binaryImage: file, // Store the original binary file
          });
        }
      } catch (err) {
        console.error("Error uploading file", err);
      }
    } else {
      // Handle text input logic
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value, // Update only the input field that has changed
      }));
      // Validate the input and remove the error if it's valid
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };

        // Gst validation
        if (name === "gstin" && value.length === 15) {
          fetchDetailsThroughGSTIN(value);
        }

        // Organization validation
        if (name === "organizationSize" && value) {
          delete newErrors.organizationSize;
        }

        // Sector validation
        if (name === "sector" && value) {
          delete newErrors.sector;
        }

        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.gstin || formData.gstin.length < 15)
      newErrors.gstin = "Enter the valid GSTIN ";

    if (!formData.organizationSize)
      newErrors.organizationSize = "Organisation Size is required";
    if (!formData.sector) newErrors.sector = "Industry Sector is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchDetailsThroughGSTIN = async (gstNumber) => {
    setLoading(true);
    const responseData = await verifyGST(gstNumber);
    setLoading(false);

    if (responseData.error) {
      setErrors({ ...errors, gstin: "Enter valid GSTIN" });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData, // Keep previous form data, including `gstin`
        gstin: gstNumber, // Ensure `gstin` remains intact
        state: responseData?.taxpayerInfo?.pradr?.addr?.stcd || "",
        city: responseData?.taxpayerInfo?.pradr?.addr?.dst || "",
        organizationName: responseData?.taxpayerInfo?.tradeNam || "",
        zipCode: responseData?.taxpayerInfo?.pradr?.addr?.pncd || "",
        organizationAddress: responseData?.taxpayerInfo?.stj || "",
      }));
      setIsGstVerified(true);
    }
  };
  return (
    <div
      className={`flex flex-col py-0 px-0 md:px-2 ${Styles["custom-scrollbar"]}`}
      style={{
        maxHeight: "78vh",
        overflowY: "auto",
      }}
    >
      <div>
        <LeftArrowIcon
          size="30"
          onClick={handleBack}
          className="hover:cursor-pointer fixed top-[7rem]  md:top-[5.3rem]  "
        />
      </div>
      <div className="flex flex-col pt-4 gap-2 ">
        <h1 className="leading-6 ">Organisation setup</h1>
        <p className="text-sm font-normal leading-5 text-left">
          Please tell us more about your organisation to personalise your data
          and for seamless interaction.
        </p>
      </div>
      <Box
        component="form"
        sx={{ mt: 3, width: "100%" }}
      // onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center justify-center">
          {/* Logo Upload Circle */}
          <label className="relative">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
              {formData?.brandLogo ? (
                <img
                  src={formData?.brandLogo}
                  alt="Uploaded Logo"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <CameraAltIcon className="text-gray-500" fontSize="medium" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleInputChange(e)}
            />
          </label>

          {/* Label */}
          <a className=" mt-2 cursor-pointer ">Upload Logo</a>
        </div>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "100%",
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
                value={formData?.gstin}
                customcolor="var(--heading-color)"
                fontWeight="500"
                onChange={(e) => {
                  if (
                    !e.target.value.startsWith(" ") &&
                    e.target.value.length < 16
                  ) {
                    handleInputChange(e);
                  }
                }}
              />

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
              ) : isGstVerfied ? (
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
                  <VerifiedTick
                    color="var(--third-color)"
                    fillcolor="var(--third-color)"
                  />
                </div>
              ) : null}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>

            <CustomInput
              className="text-xs font-medium leading-6 text-left"
              placeholder="Enter Your Organisation Name"
              title="Organisation Name *"
              type="text"
              size="small"
              // disabled
              name="organizationName"
              error={errors.organizationName}
              customcolor="var(--heading-color)"
              fontWeight="500"
              errorMessage={errors.organizationName}
              value={formData?.organizationName}
              onChange={(e) => {
                if (!e.target.value.startsWith(" ")) {
                  handleInputChange(e);
                }
              }}
            />
          </Grid>

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
            <FormControl fullWidth size="small" sx={{ marginTop: "0.5rem" }}>
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
                      <p className="text-sm" style={{ color: "#B0B0B0" }}>
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
                <MenuItem value="Banking & Finance">Banking & Finance</MenuItem>
                <MenuItem value="Hospitality & Travel">
                  Hospitality & Travel
                </MenuItem>
                <MenuItem value="Entertainment & Media">
                  Entertainment & Media
                </MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Textile Industry">Textile Industry</MenuItem>
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
          <Grid item xs={12} md={6}>
            <label
              style={{
                fontWeight: "500",
                color: errors.organizationSize
                  ? "var(--error-color)"
                  : "var(--heading-color)",
              }}
            >
              Organisation Size *
            </label>
            <FormControl fullWidth size="small" sx={{ marginTop: "0.5rem" }}>
              <Select
                inputProps={{
                  "aria-label": "Without label",
                }}
                displayEmpty
                name="organizationSize"
                value={formData?.organizationSize}
                onChange={handleInputChange}
                renderValue={(selected) => {
                  // This renders gray color when no option is selected
                  if (!selected || selected.length === 0) {
                    return (
                      <p className="text-sm" style={{ color: "#B0B0B0" }}>
                        Size of your organisation
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
                <MenuItem value="1-10">1-10</MenuItem>
                <MenuItem value="11-50">11-50</MenuItem>
                <MenuItem value="51-200">51-200</MenuItem>
                <MenuItem value="201-500">201-500</MenuItem>
                <MenuItem value="501-1000">501-1000</MenuItem>
                <MenuItem value="1001-5000">1001-5000</MenuItem>
                <MenuItem value="5000+">5000+</MenuItem>
              </Select>
            </FormControl>
            {errors.organizationSize && (
              <p
                className=" leading-[1.66] tracking-[0.03em] text-left mt-[4px] mr-[14px] mb-0 ml-[14px]"
                style={{ color: "var(--error-color)" }}
              >
                {errors.organizationSize}
              </p>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomInput
              className="text-xs font-medium leading-6 text-left"
              placeholder="Enter Your Organisation Address"
              title="Address *"
              type="text"
              size="small"
              name="organizationAddress"
              error={errors.organizationAddress}
              errorMessage={errors.organizationAddress}
              value={formData?.organizationAddress}
              customcolor="var(--heading-color)"
              fontWeight="500"
              // disabled
              onChange={(e) => {
                if (!e.target.value.startsWith(" ")) {
                  handleInputChange(e);
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomInput
              className="text-xs font-medium leading-6 text-left"
              placeholder="Enter Your City"
              title="City *"
              type="text"
              size="small"
              name="city"
              error={errors.city}
              errorMessage={errors.city}
              value={formData?.city}
              customcolor="var(--heading-color)"
              fontWeight="500"
              disabled
              onChange={(e) => {
                if (!e.target.value.startsWith(" ")) {
                  handleInputChange(e);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomInput
              className="text-xs font-medium leading-6 text-left"
              placeholder="Enter Your State"
              title="State *"
              type="text"
              size="small"
              name="state"
              error={errors.state}
              errorMessage={errors.state}
              value={formData?.state}
              customcolor="var(--heading-color)"
              fontWeight="500"
              disabled
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomInput
              className="text-xs font-medium leading-6 text-left"
              placeholder="Enter Your Pincode"
              title="ZIP/Postcode *"
              type="number"
              size="small"
              name="zipCode"
              error={errors.zipCode}
              errorMessage={errors.zipCode}
              customcolor="var(--heading-color)"
              fontWeight="500"
              value={formData?.zipCode}
              // disabled
              onChange={(e) => {
                if (!e.target.value.startsWith(" ")) {
                  handleInputChange(e);
                }
              }}
            />
          </Grid>
        </Grid>
        <div className="flex justify-end ">
          <CustomButton
            type="submit"
            // isLoading={loading}
            text={"Next"}
            color="primary"
            // onClick={handleNext}
            onClick={(e) => {
              e.preventDefault();
              if (
                formData.gstin &&
                formData.organizationSize &&
                formData.organizationAddress &&
                formData.state &&
                formData.city &&
                formData.zipCode
              ) {
                handleNext();
              } else validateForm();
            }}
          />
        </div>
      </Box>
    </div>
  );
};
export default OrganizationDetailsForm;
