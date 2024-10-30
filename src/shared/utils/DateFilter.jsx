import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Tooltip } from "@mui/material";

function DatePickerValue({ onSubmit }) {
  const [fromDate, setFromDate] = React.useState(dayjs("2024-04-17"));
  const [toDate, setToDate] = React.useState(dayjs("2024-04-17"));
  const [error, setError] = React.useState("");

  const handleButtonClick = () => {
    if (fromDate.isAfter(toDate)) {
      setError("From date cannot be after To date.");
      return;
    }
    setError("");
    onSubmit(fromDate, toDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <DatePicker
          label="From"
          value={fromDate}
          onChange={(newValue) => {
            if (newValue) {
              setFromDate(newValue);
            }
          }}
        />
        <DatePicker
          label="To"
          value={toDate}
          onChange={(newValue) => {
            if (newValue) {
              setToDate(newValue);
            }
          }}
        />
        {error && <Box sx={{ color: "red" }}>{error}</Box>}{" "}
        <Button
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
          style={{ width: "50%", padding: "8px 8px", marginLeft: "4rem" }}
        >
          Filter Date
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default function MenuButtonWithDatePickers({ onSubmit }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmitDates = (fromDate, toDate) => {
    const toDateEndOfDay = toDate.endOf("day"); // This ensures toDate is end of day

    // Now we format it correctly, keeping the time for toDate
    const formattedFromDate = fromDate.format("YYYY-MM-DD 00:00:00");
    const formattedToDate = toDateEndOfDay.format("YYYY-MM-DD HH:mm:ss");

    if (toDateEndOfDay) {
      setAnchorEl(null);
      onSubmit({
        dateFilter: {
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        },
      });
    } else {
      console.error("To Date is not selected.");
    }
  };

  return (
    <div>
      <Tooltip title="Filter">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleClick}
        >
          <FilterAltOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        <MenuItem>
          <DatePickerValue onSubmit={handleSubmitDates} />
        </MenuItem>
      </Menu>
    </div>
  );
}
