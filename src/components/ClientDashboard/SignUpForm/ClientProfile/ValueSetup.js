import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Stack,
  Chip,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CustomButton from "../../../../shared/utils/Button";
import { LeftArrowIcon } from "../../../../shared/assets/icons";
import Styles from "../../../../styles/setup.module.css";

const ValueSetup = ({ handleBack, handleNext, formData, setFormData }) => {
  const [selectedInterestedProducts, setSelectedInterestedProducts] =
    React.useState([]);
  const [selectedRegionsCampaigns, setSelectedRegionsCampaigns] =
    React.useState([]);

  const [
    selectedMarketingCampaignFrequency,
    setSelectedMarketingCampaignFrequency,
  ] = useState("");

  useEffect(() => {
    if (formData) {
      if (formData.interestedProducts) {
        setSelectedInterestedProducts(formData.interestedProducts);
      }
      if (formData.regionsTargetedByCampaigns) {
        setSelectedRegionsCampaigns(formData.regionsTargetedByCampaigns);
      }
      if (formData.challengesFacedInMarketing) {
        setSelectedChallengesInCurrentMarketing(
          formData.challengesFacedInMarketing
        );
      }
      if (formData.marketingCampaignsRunningPerYear) {
        setSelectedMarketingCampaignFrequency(
          formData.marketingCampaignsRunningPerYear
        );
      }
    }
  }, [formData]);

  const [
    selectedChallengesInCurrentMarketing,
    setSelectedChallengesInCurrentMarketing,
  ] = React.useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the formData with the input's name and value
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // If the input is related to marketing campaign frequency, handle it separately
    if (name === "marketingCampaignsRunningPerYear") {
      handleSelectMarketingCampaignFrequency(value);
    }
  };

  // const handleSelectRegionsCampaigns = (interest) => {
  //   setSelectedRegionsCampaigns((prevRegionsCampaigns) => {
  //     const updatedRegionsCampaigns = prevRegionsCampaigns.includes(interest)
  //       ? prevRegionsCampaigns.filter((item) => item !== interest)
  //       : [...prevRegionsCampaigns, interest];

  //     // Update the formData with the latest selected products
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       regionsTargetedByCampaigns: updatedRegionsCampaigns,
  //     }));

  //     return updatedRegionsCampaigns;
  //   });
  // };
  const handleSelectRegionsCampaigns = (product) => {
    setSelectedRegionsCampaigns((prevRegionsCampaigns) => {
      const updatedRegionsCampaigns = prevRegionsCampaigns.includes(product)
        ? prevRegionsCampaigns.filter((item) => item !== product)
        : [...prevRegionsCampaigns, product];

      // Update the formData with the latest selected regions
      setFormData((prevFormData) => ({
        ...prevFormData,
        regionsTargetedByCampaigns: updatedRegionsCampaigns,
      }));

      return updatedRegionsCampaigns;
    });
  };

  const handleSelectInterestedProducts = (interest) => {
    setSelectedInterestedProducts((prevSelectedProducts) => {
      const updatedSelectedProducts = prevSelectedProducts.includes(interest)
        ? prevSelectedProducts.filter((item) => item !== interest)
        : [...prevSelectedProducts, interest];

      // Update the formData with the latest selected products
      setFormData((prevFormData) => ({
        ...prevFormData,
        interestedProducts: updatedSelectedProducts,
      }));

      return updatedSelectedProducts;
    });
  };

  const handleSelectChallengesInMarketing = (challenge) => {
    setSelectedChallengesInCurrentMarketing((prevSelectedChallenges) => {
      const updatedSelectedChallenges = prevSelectedChallenges.includes(
        challenge
      )
        ? prevSelectedChallenges.filter((item) => item !== challenge)
        : [...prevSelectedChallenges, challenge];

      // Update the formData with the latest selected challenges
      setFormData((prevFormData) => ({
        ...prevFormData,
        challengesFacedInMarketing: updatedSelectedChallenges,
      }));

      return updatedSelectedChallenges;
    });
  };
  // const handleInputChange = (event) => {
  //   const selectedFrequency = event.target.value;
  //   handleSelectMarketingCampaignFrequency(selectedFrequency);
  // };

  const handleSelectMarketingCampaignFrequency = (frequency) => {
    setSelectedMarketingCampaignFrequency(frequency);

    // Update the formData with the latest selected marketing campaign frequency
    setFormData((prevFormData) => ({
      ...prevFormData,
      marketingCampaignsRunningPerYear: frequency,
    }));
  };
  return (
    <div
      className={`flex flex-col pl-3 py-0 px-0 md:px-2  ${Styles["custom-scrollbar"]}`}
      style={{
        maxHeight: "78vh",
        overflowY: "auto",
      }}
    >
      <div>
        <LeftArrowIcon
          className="hover:cursor-pointer fixed  top-[7rem]  md:top-[5.3rem]"
          size="30"
          onClick={handleBack}
        />
      </div>
      <div className="flex flex-col pt-4 gap-2">
        <h1 className="leading-6 ">Value Setup</h1>
        <p className="text-sm font-normal leading-5 text-left ">
          Please tell us more about yourself to personalise your data and for
          seamless interaction.
        </p>
      </div>
      <Box
        component="form"
        sx={{
          mt: 4,
          width: "100%",
          maxWidth: "500px",
          gap: 2,
          display: "flex",
          flexDirection: "column",
        }}
        // onSubmit={handleSubmit}
      >
        <FormControl>
          <label
            style={{
              color: "var(--heading-color)",
              fontWeight: "500",
              marginBottom: "1rem",
            }}
          >
            How many marketing campaigns do you typically run in a year?
          </label>
          <RadioGroup
            row
            name="marketingCampaignsRunningPerYear"
            value={selectedMarketingCampaignFrequency} // Ensures the selected value reflects the state
            onChange={handleInputChange} // Calls the combined handler
            className="gap-[14px]"
          >
            {Object.keys(marketingCampaignsRunningFrequencyPerYear).map(
              (frequency) => (
                <FormControlLabel
                  key={frequency}
                  className="!text-[#6B7280] "
                  value={marketingCampaignsRunningFrequencyPerYear[frequency]}
                  control={<Radio size="small" className="!px-2" />}
                  label={frequency}
                />
              )
            )}
          </RadioGroup>
        </FormControl>

        <div>
          <label
            style={{
              color: "var(--heading-color)",
              fontWeight: "500",
              marginBottom: "1rem",
            }}
          >
            What major regions do you target for your campaigns?
          </label>
          <Stack direction="row" className="flex-wrap break-normal gap-2 mt-2">
            {Object.keys(regionsCampaigns).map((product, index) => (
              <Chip
                key={index}
                s
                label={product}
                onClick={() => handleSelectRegionsCampaigns(product)}
                variant={
                  selectedRegionsCampaigns.includes(product)
                    ? "filled"
                    : "outlined"
                }
                sx={{
                  cursor: "pointer",
                  backgroundColor: selectedRegionsCampaigns.includes(product)
                    ? "#e1ecff"
                    : "white",
                  color: selectedRegionsCampaigns.includes(product)
                    ? "#418cff"
                    : "gray",
                  ...(!selectedRegionsCampaigns.includes(product) && {
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "var(--primary-color)", // Blue text on hover
                      borderColor: "#418cff", // Blue border on hover
                    },
                  }),
                }}
              />
            ))}
          </Stack>
        </div>

        <div>
          <label
            style={{
              color: "var(--heading-color)",
              fontWeight: "500",
              marginBottom: "1rem",
            }}
          >
            Mostly interested in
          </label>
          <Stack direction="row" className="flex-wrap gap-2 mt-2">
            {Object.keys(interestedProductsList).map((product, index) => (
              <Chip
                key={index}
                label={product}
                onClick={() => handleSelectInterestedProducts(product)}
                variant={
                  selectedInterestedProducts.includes(product)
                    ? "filled"
                    : "outlined"
                }
                sx={{
                  cursor: "pointer",
                  backgroundColor: selectedInterestedProducts.includes(product)
                    ? "#e1ecff"
                    : "white",
                  color: selectedInterestedProducts.includes(product)
                    ? "#418cff"
                    : "gray",
                  ...(!selectedInterestedProducts.includes(product) && {
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#418cff", // Blue text on hover
                      borderColor: "#418cff", // Blue border on hover
                    },
                  }),
                }}
              />
            ))}
          </Stack>
        </div>

        <div>
          <label
            style={{
              color: "var(--heading-color)",
              fontWeight: "500",
              marginBottom: "1rem",
            }}
          >
            Main challenges faces with current marketing efforts
          </label>
          <Stack direction="row" className="flex-wrap gap-2 mt-2">
            {Object.keys(challengesInCurrentMarketing).map((challenge) => (
              <Chip
                value={challengesInCurrentMarketing[challenge]}
                label={challenge}
                variant={
                  selectedChallengesInCurrentMarketing.includes(challenge)
                    ? "filled"
                    : "outlined"
                }
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedChallengesInCurrentMarketing.includes(challenge)
                      ? "#e1ecff"
                      : "white",
                  color: selectedChallengesInCurrentMarketing.includes(
                    challenge
                  )
                    ? "#418cff"
                    : "gray",
                  ...(!selectedChallengesInCurrentMarketing.includes(
                    challenge
                  ) && {
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#418cff", // Blue text on hover
                      borderColor: "#418cff", // Blue border on hover
                    },
                  }),
                  ...(selectedChallengesInCurrentMarketing.includes(
                    challenge
                  ) && {
                    "&:hover": {
                      backgroundColor: "#e1ecff",
                    },
                  }),
                }}
                onClick={(e) => {
                  handleSelectChallengesInMarketing(e.target.innerText);
                }}
              />
            ))}
          </Stack>
        </div>

        <div>
          <label
            style={{
              color: "var(--heading-color)",
              fontWeight: "500",
              marginBottom: "1rem",
            }}
          >
            How do you hear about us
          </label>
          <FormControl fullWidth size="small" sx={{ marginTop: "0.5rem" }}>
            <Select
              inputProps={{
                "aria-label": "Without label",
              }}
              displayEmpty
              name="reviewHeardFrom"
              value={formData?.reviewHeardFrom}
              onChange={handleInputChange}
              // onBlur={(e) => {
              //   emptyInputCheck(e.target.name, e.target.value);
              //   if (saveButtonClicked) {
              //     validateForm();
              //   }
              // }}
              renderValue={(selected) => {
                if (!selected || selected.length === 0) {
                  return (
                    <p className="text-[1rem] text-[var(--listdown-color)]">
                      Select Role
                    </p>
                  );
                }
                // When an option is selected, show black
                return <span style={{ color: "#000" }}>{selected}</span>;
              }}
              sx={{
                color: formData?.userRole ? "#000" : "var(--heading-color)", // Default gray, selected text turns black
              }}
            >
              <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              <MenuItem value="Social Media">Social Media</MenuItem>
              <MenuItem value="Newspaper">Newspaper</MenuItem>
              <MenuItem value="Website">Website</MenuItem>
              <MenuItem value="Previous Clients">Previous Clients</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="flex gap-2 justify-end mt-2">
          <CustomButton
            type="submit"
            // isLoading={loading}
            text={"Next"}
            color="primary"
            onClick={handleNext}
          />
        </div>
      </Box>
    </div>
  );
};
export default ValueSetup;

const marketingCampaignsRunningFrequencyPerYear = {
  "Very Often": "Very Often",
  Frequently: "Frequently",
  Occasionally: "Occasionally",
  Rarely: "Rarely",
};
const regionsCampaigns = {
  North: "North",
  South: "South",
  East: "East",
  West: "West",
  Central: "Central",
};
const interestedProductsList = {
  "Poster Ads": "Poster Ads",
  "Building Wraps": "Building Wraps",
  Wallscapes: "Wallscapes",
  "Transit Ads": "Transit Ads",
  Billboards: "Billboards",
  "Flex Boards": "Flex Boards",
  "Digital Panels": "Digital Panels",
};
const challengesInCurrentMarketing = {
  Logistics: "Logistics",
  "Vendor Management": "Vendor Management",
  "Tracking Issues": "Tracking Issues",
  "Ineffective Report": "Ineffective Report",
  "Time Consumption": "Time Consumption",
  "Communication Issue": "Communication Issue",
  "Operational Chaos": "Operational Chaos",
  "High Cost": "High Cost",
};
