import React from "react";
import {
  Modal,
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
const PrintMachineModal = ({
  isOpen,
  handleSubmit,
  handleChange,
  handleDateChange,
  handleClose,
  formData,
  printingOptions,
  isEditing,
  error,
}) => {
  return (
    <Modal
      open={isOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
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
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Printing Type"
                name="machinePrintingType"
                value={formData.machinePrintingType || ""}
                onChange={handleChange}
                required
              >
                {printingOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max. Print Size (mm)"
                name="maxPrintSize"
                value={formData.maxPrintSize || ""}
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
                  onChange={handleDateChange}
                  maxDate={dayjs()} // Set maxDate to the current date
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={error} required />
                  )}
                />
              </LocalizationProvider>
              {error && (
                <FormHelperText error>
                  Date of Purchase is required
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Printing Capacity / Day (sq.ft)"
                name="printingCapacityPerDay"
                value={formData.printingCapacityPerDay || ""}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number" // Set input type to number
                value={formData.quantity || ""}
                onChange={handleChange}
                required
                inputProps={{
                  min: 0, // Optional: Prevent negative values
                }}
              />
            </Grid>
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

export default PrintMachineModal;
