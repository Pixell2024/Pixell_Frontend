import React from "react";
import { Box, Button, Modal, Grid, TextField, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const FabricationModal = ({
  isOpen,
  formData,
  handleMainCategoryChange,
  handleChange,
  handleSubmit,
  handleClose,
  isEditing,
}) => {
  const mainCategories = [
    { value: "MS Fabrication", label: "MS Fabrication" },
    {
      value: "3D Letters (Acrylic / Metal)",
      label: "3D Letters (Acrylic / Metal)",
    },
    {
      value: "Flex GSB",
      label: "Flex GSB",
    },
    {
      value: "Fabric GSB",
      label: "Fabric GSB",
    },
    {
      value: "Thermoforming",
      label: "Thermoforming",
    },
    // Add other main categories if needed
  ];

  // Sub-category options based on the main category selection
  const subCategories = {
    "MS Fabrication": [
      { value: "Mig Welding Machine", label: "Mig Welding Machine" },
      { value: "Arc Welding Machine", label: "Arc Welding Machine" },
      { value: "Spray Paint Machine", label: "Spray Paint Machine" },
      { value: "Pipe Cutting Machine", label: "Pipe Cutting Machine" },
    ],
    "3D Letters (Acrylic / Metal)": [
      { value: "CNC Router Machine", label: "CNC Router Machine" },
      {
        value: "3D Channel Letters Bending Machine",
        label: "3D Channel Letters Bending Machine",
      },
    ],
  };

  const currentSubCategories = subCategories[formData.category] || [];

  return (
    <Modal open={isOpen}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Main Category Dropdown */}
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                name="category"
                label="Select Category"
                value={formData.category || ""}
                onChange={handleMainCategoryChange}
                required
              >
                {mainCategories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Sub Category Dropdown */}
            {formData.category && currentSubCategories?.length > 0 && (
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Select Machine Type"
                  name="subCategory"
                  value={formData.subCategory || ""}
                  onChange={handleChange}
                  required
                >
                  {currentSubCategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* Conditional Fields based on Sub-category */}
            {formData.category == "MS Fabrication" && (
              <>
                {/* For example: Machine Wattage */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Machine Wattage"
                    name="wattage"
                    value={formData.wattage || ""}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                {/* Date of Purchase */}
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Purchase"
                      value={formData.dateOfPurchase || null}
                      maxDate={dayjs()} // Set maxDate to the current date
                      onChange={(date) =>
                        handleChange({
                          target: { name: "dateOfPurchase", value: date },
                        })
                      }
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                      required
                    />
                  </LocalizationProvider>
                </Grid>

                {/* Number of Machines */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number" // Set input type to number
                    inputProps={{
                      min: 0, // Optional: Prevent negative values
                    }}
                    label="Number of Machines"
                    name="numMachines"
                    value={formData.numMachines || ""}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </>
            )}
            {formData.category == "3D Letters (Acrylic / Metal)" && (
              <>
                {/* For example: Machine Wattage */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Bed Size"
                    name="bedsize"
                    value={formData.bedsize || ""}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Machine Brand"
                    name="machineBrand"
                    value={formData.machineBrand || ""}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Machine Model No."
                    name="machineModelNo"
                    value={formData.machineModelNo || ""}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Purchase"
                      value={formData.dateOfPurchase || null}
                      maxDate={dayjs()} // Set maxDate to the current date
                      onChange={(date) =>
                        handleChange({
                          target: { name: "dateOfPurchase", value: date },
                        })
                      }
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                      required
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Wattage of Machine"
                    name="wattage"
                    value={formData.wattage || ""}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number" // Set input type to number
                    inputProps={{
                      min: 0, // Optional: Prevent negative values
                    }}
                    label="Number of Machines"
                    name="numMachines"
                    value={formData.numMachines || ""}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </>
            )}
            {formData.category == "Flex GSB" && (
              <>
                {/* numMachines */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number" // Set input type to number
                    inputProps={{
                      min: 0, // Optional: Prevent negative values
                    }}
                    label="Number of Machines"
                    name="numMachines"
                    value={formData.numMachines || ""}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </>
            )}
            {formData.category == "Fabric GSB" && (
              <>
                {/* numMachines */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number" // Set input type to number
                    inputProps={{
                      min: 0, // Optional: Prevent negative values
                    }}
                    label="Number of Machines"
                    name="numMachines"
                    value={formData.numMachines || ""}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </>
            )}
            {formData.category == "Thermoforming" && (
              <>
                {/* numMachines */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number" // Set input type to number
                    inputProps={{
                      min: 0, // Optional: Prevent negative values
                    }}
                    label="Number of Machines"
                    name="numMachines"
                    value={formData.numMachines || ""}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </>
            )}
            {/* Form Buttons */}
            <Grid container spacing={2}>
              <Grid item xs={6} mt={2}></Grid>
              <Grid item xs={3} mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  {isEditing ? "Update" : "Save"}
                </Button>
              </Grid>
              <Grid item xs={3} mt={2}>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={handleClose}
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default FabricationModal;
