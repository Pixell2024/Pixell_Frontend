import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const ProductsServicesModal = ({
  isOpen,
  formData,
  handleChange,
  handleClose,
  handleSubmit,
  isEditing,
}) => {
  // Multi-select options
  const storeFrontSignagesOptions = [
    { value: "Non-lit – Flex Signage", label: "Non-lit – Flex Signage" },
    { value: "Backlit – GSB", label: "Backlit – GSB" },
    {
      value: "Backlit – 3D Letter Signage",
      label: "Backlit – 3D Letter Signage",
    },
    {
      value: "Backlit – Lollipop Signage",
      label: "Backlit – Lollipop Signage",
    },
  ];

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
            {/* Store Front Signages checkbox */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.provideStoreFrontSignages || false}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "provideStoreFrontSignages",
                          value: e.target.checked,
                        },
                      })
                    }
                    name="provideStoreFrontSignages"
                  />
                }
                label="Store Front Signages"
              />
            </Grid>

            {/* Store Front Signages Multi-select */}
            {formData.provideStoreFrontSignages && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="storeFrontSignages-select-label">
                    Select Signage Types
                  </InputLabel>
                  <Select
                    labelId="storeFrontSignages-select-label"
                    id="storeFrontSignages-select"
                    multiple
                    value={formData.typeofStoreFrontSignages || []}
                    onChange={handleChange}
                    name="typeofStoreFrontSignages"
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {storeFrontSignagesOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Printed Materials checkbox */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.providePrintedMaterials || false}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "providePrintedMaterials",
                          value: e.target.checked,
                        },
                      })
                    }
                    name="providePrintedMaterials"
                  />
                }
                label="Printed Materials"
              />
            </Grid>

            {/* Vinyl In-Store Branding checkbox */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.provideVinylInStoreBranding || false}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "provideVinylInStoreBranding",
                          value: e.target.checked,
                        },
                      })
                    }
                    name="provideVinylInStoreBranding"
                  />
                }
                label="Vinyl In-Store Branding"
              />
            </Grid>

            {/* Submit and Close buttons */}
            <Grid container spacing={2}>
              <Grid item xs={6} mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  {isEditing ? "Update" : "Save"}
                </Button>
              </Grid>
              <Grid item xs={6} mt={2}>
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

export default ProductsServicesModal;
