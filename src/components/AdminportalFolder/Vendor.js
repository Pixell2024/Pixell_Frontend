import React, { useState, useEffect } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";
// import DownloadIcon from "@mui/icons-material/Download";
import { FormControl, InputLabel, Select, Menu, MenuItem } from "@mui/material";
import { CircularProgress, Tooltip, IconButton } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import GetAppIcon from "@mui/icons-material/GetApp";
import FormatDateTimestamp from "../../helperFunctions/FormatDateTimestamp";
import VendorOnboardingForm from "../../shared/createForms/vendorOnboardingForm";
import { downloadData } from "../../shared/downloadData";
import axios from "axios";
import moment from "moment-timezone";
import MenuButtonWithDatePickers from "../../shared/utils/DateFilter";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Styles from "../../styles/vendorDashboard.module.css";
import { handleFileUploadForVendorOnboarding } from "./VendorDetails/uploadExcelSheetForVendorOnboarding";
import { downloadExcelForVendorOnboarding } from "./VendorDetails/downloadExcelSheetForVendorOnboarding";

import {
  DownloadIcon,
  Edit,
  Trash,
  ViewIcon,
  User_plus,
  FileDownloadIcon,
  FileUploadIcon,
  DocumentFile,
} from "../../shared/assets/icons/index";
import VendorModal from "./VendorDetails/vendorModal";
import CustomLoading from "../../shared/utils/CustomLoading";
import VendorPaymentsModal from "../../shared/createForms/VendorPaymentsModal";

const headCells = [
  {
    id: "state",
    label: "State",
    width: 160,
  },
  {
    id: "city",
    label: "City",
    width: 140,
  },
  {
    id: "business name",
    label: "Business name",
    width: 160,
  },
  {
    id: "gst number",
    label: "Gst Number",
    width: 160,
  },
  {
    id: "owner name",
    label: "Owner Name",
    width: 160,
  },
  {
    id: "createdAt",
    label: "Added On",
    width: 200,
  },
  { id: "addedBy", label: "Added By", width: 160 },
  {
    id: "status",
    label: "Status",
    width: 140,
  },
  {
    id: "action",
    label: "Action",
    width: 80,
  },
];

function EnhancedTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            sx={{
              minWidth: headCell.width,
              height: 90,
              backgroundColor: "var(--light-primary-color)",
              fontWeight: "bold",
              borderRight:
                index < headCells.length - 1 ? "1px solid #ccc" : "none",
            }}
          >
            <span className="absolute top-2"> {headCell.label} </span>

            {["state", "city", "owner name", "addedBy", "status"].includes(
              headCell.id
            ) && (
              <input
                type="text"
                className="px-3 w-full py-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 mt-2"
                placeholder={`Search ${headCell.id}`}
                onChange={(e) => props.handleSearchChangeHead(e, headCell.id)} // Use the handler passed via props
                value={props.searchInputs?.[headCell.id] || ""} // Access search inputs from props
              />
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  // Use a ref to target the hidden file input
  const fileInputRef = React.useRef(null);

  const handleIconClick = () => {
    // Trigger the file input click when the icon is clicked
    fileInputRef.current.click();
  };

  const { numSelected } = props;
  const handleDateChange = (e) => {
    if (e?.dateFilter) {
      props.onDateChange(e);
    }
  };

  const handleOpen = (e) => {
    props.OnModalOpen(true);
  };

  return (
    <>
      <Toolbar
        className="mb-2 shadow-lg"
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="p"
          id="tableTitle"
          component="div"
        >
          Total Vendor : {props.totalVendors}
        </Typography>

        <>
          {/* Include the Date Filter Component */}
          <div className="date-filter">
            <MenuButtonWithDatePickers onSubmit={handleDateChange} />
          </div>
          <Tooltip title="Add Vendor" onClick={handleOpen}>
            <IconButton>
              <User_plus />
            </IconButton>
          </Tooltip>
          {localStorage.getItem("role") === "-1" && (
            <Tooltip
              title="Download CSV of Vendor"
              onClick={() => {
                const currentDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
                const fileName = `vendors_data_${currentDate}.csv`;
                downloadData(props.vendors, headersForDownload, fileName);
              }}
              placement="left"
            >
              <IconButton>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip
            title="Download  Excel Template for Vendor Onboarding"
            onClick={downloadExcelForVendorOnboarding}
          >
            <IconButton>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUploadForVendorOnboarding}
              style={{
                display: "none",
              }}
              accept=".xlsx"
            />
            <div onClick={handleIconClick} className="cursor-pointer">
              <FileUploadIcon />
            </div>
          </div>
        </>
      </Toolbar>
    </>
  );
}

var oldData = [];
export default function EnhancedTable() {
  const [pageSize, setPageSize] = useState(20);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const serverURL = process.env.REACT_APP_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedVendorData, setSelectedVendorData] = useState({});
  const [vendorListLoading, setVendorListLoading] = useState(true);
  const [totalVendors, setTotalVendors] = useState("0");
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isVendorPaymentModalOpen, setIsVendorPaymentModalOpen] =
    useState(false);
  const [addedByFilterText, setAddedByFilterText] = useState();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null); // Store the selected row ID
  const [searchInputs, setSearchInputs] = useState({
    state: "",
    city: "",
    "owner name": "",
    addedBy: "",
    status: "",
  });
  const [paymentsModal, setPaymentModal] = useState(false);

  const getVendorList = async (page = 1, limit = 20) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${serverURL}/api/vendors?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response?.data?.success) {
        setTotalVendors(response?.data?.totalVendors);
        setVendors(response?.data?.vendors);
        oldData = response?.data?.vendors;
        setTotalPages(response?.data?.totalPages);
        setVendorListLoading(false);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  useEffect(() => {
    getVendorList(page, pageSize);
  }, [page, pageSize]);

  const handleModalOpen = (value) => {
    setIsModalOpen(value);
  };
  const handleDateChange = (value) => {
    if (value.dateFilter) {
      const filteredData = oldData.filter(
        (data) =>
          moment(data.createdAt)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss") >= value.dateFilter.fromDate &&
          moment(data.createdAt)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss") <= value.dateFilter.toDate
      );
      setVendors(filteredData);
    } else {
      const searchTerm = value.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const searchKeyword = new RegExp(`\\b${searchTerm}\\w*\\b`, "i");

      if (searchKeyword === "") {
        setVendors(oldData);
      } else {
        const filteredData = oldData.filter(
          (data) =>
            searchKeyword.test(data.ownerName.toLowerCase()) ||
            searchKeyword.test(data.GSTIN.toLowerCase()) ||
            searchKeyword.test(data.city.toLowerCase()) ||
            searchKeyword.test(data.vendorBusinessName.toLowerCase())
        );

        setVendors(filteredData);
      }
    }
  };

  const handleEditModal = (e, v, operation) => {
    setIsActionLoading(true);
    setAnchorEl(null);

    axios
      .get(`${serverURL}/api/vendors/${v._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSelectedVendorData(response.data);
          if (operation === "edit") {
            setIsModalOpen(true);
            setIsActionLoading(false);
          } else if (operation === "payments") {
            setIsVendorPaymentModalOpen(true);
            setIsActionLoading(false);
          } else {
            setIsVendorModalOpen(true);
            setIsActionLoading(false);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error);
      });
  };

  const handleDelete = (e, v) => {
    e.preventDefault();
    setAnchorEl(null);

    Swal.fire({
      icon: "error",
      text: "Do you want to delete?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .delete(`${serverURL}/api/vendors/${v._id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((response) => {
              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: `${response.data.message}`,
              }).then(() => {
                getVendorList();
              });
            })
            .catch((error) => {
              console.error("Error deleting vendor:", error);
              Swal.fire("There was an error deleting the vendor.");
            });
        } catch (error) {
          console.error(error);
          Swal.fire("There was an error deleting the vendor.");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not deleted", "", "info");
      }
    });
  };

  const handlePageChange = async (e, value) => {
    await getVendorList(value, pageSize);
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
  };

  const handleIconOpen = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId); // Set the selected row ID
  };
  const handleIconClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null); // Reset the selected row ID
  };
  const handleSearchChangeHead = (e, key) => {
    const value = e.target.value;
    const searchTerm = value.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const searchKeyword = new RegExp(`\\b${searchTerm}\\w*\\b`, "i");

    // Update search inputs state for that particular field
    setSearchInputs((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    // Check if the input is empty and reset the data to oldData
    if (searchKeyword === "") {
      setVendors(oldData);
    } else {
      // Apply filtering based on the column (key)
      const filteredData = oldData.filter((data) => {
        // For each case, check if the key matches and perform filtering
        switch (key) {
          case "addedBy":
            return searchKeyword.test(data?.addedBy?.name.toLowerCase());

          case "state":
            return searchKeyword.test(data?.state?.toLowerCase());

          case "city":
            return searchKeyword.test(data?.city?.toLowerCase());

          case "owner name":
            return searchKeyword.test(data?.ownerName?.toLowerCase());

          case "status":
            return searchKeyword.test(data?.status?.toLowerCase());

          default:
            return true;
        }
      });

      setVendors(filteredData); // Update the vendors with the filtered data
    }
  };

  const handlePayments = () => {};

  return (
    <div className="bg-white h-full">
      <Box>
        {!vendorListLoading ? (
          <Paper
            sx={{ width: "100%", boxShadow: "none" }}
            className="px-10 mt-5 "
          >
            <EnhancedTableToolbar
              userVenderData={getVendorList}
              vendors={vendors}
              OnModalOpen={(value) => handleModalOpen(value)}
              onSearchChange={(value) => handleSearchChangeHead(value)}
              onDateChange={(value) => handleDateChange(value)}
              totalVendors={totalVendors}
            />
            <>
              <TableContainer
                sx={{
                  height: "calc(85vh - 150px)", // Adjust this to control available space for the table
                  maxHeight: "calc(85vh - 150px)", // Ensures the table won't exceed this height
                  overflowY: "auto", // Adds scroll when the content exceeds height
                }}
                className={`mt-2 rounded-lg  ${Styles["custom-scrollbar"]}`}
              >
                <Table
                  stickyHeader
                  // sx={{ minWidth: 750 }}
                  className="rounded-lg "
                >
                  <EnhancedTableHead
                    rowCount={vendors.length}
                    userListData={getVendorList}
                    setSearchInputs={setSearchInputs} // Function to update search inputs
                    handleSearchChangeHead={handleSearchChangeHead}
                    searchInputs={searchInputs}
                  />
                  {vendors && vendors?.length > 0 ? (
                    <TableBody>
                      {vendors.map((v, index) => {
                        return (
                          <TableRow
                            hover
                            sx={{ cursor: "pointer", height: "60px" }}
                            tabIndex={-1}
                            key={v._id}
                          >
                            <TableCell
                              sx={{
                                padding: "4px 8px",
                                borderLeft: "1px solid #ccc",
                                borderRight: "1px solid #ccc",
                              }}
                            >
                              {v.state || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #ccc",
                                padding: "4px 8px",
                              }}
                            >
                              {v.city || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #ccc",
                                padding: "4px 8px",
                              }}
                            >
                              {v.vendorBusinessName.charAt(0).toUpperCase() +
                                v.vendorBusinessName.slice(1).toLowerCase() ||
                                "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #ccc",
                                padding: "4px 8px",
                              }}
                            >
                              {v.GSTIN || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #ccc",
                                padding: "4px 8px",
                              }}
                            >
                              {v.ownerName || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #ccc",
                                padding: "4px 8px",
                              }}
                            >
                              {" "}
                              <FormatDateTimestamp timestamp={v.createdAt} />
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #ccc",
                                padding: "4px 8px",
                              }}
                            >
                              {v?.addedBy?.name || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #ccc",
                                padding: "4px 8px",
                              }}
                            >
                              <Chip
                                label={v?.status || "N/A"}
                                color={
                                  v?.status === "Active"
                                    ? "success"
                                    : v?.status === "Inactive"
                                    ? "primary" // or any other color for inactive
                                    : v?.status === "Blacklisted"
                                    ? "error"
                                    : "default"
                                }
                              />
                            </TableCell>

                            <TableCell
                              sx={{
                                borderRight: "1px solid #ccc",
                                padding: "4px 8px",
                              }}
                            >
                              <Tooltip title="Click">
                                <IconButton
                                  onClick={(e) => handleIconOpen(e, v._id)}
                                >
                                  <MoreVertIcon
                                    style={{ color: "var(--primary-color)" }}
                                  />
                                </IconButton>
                              </Tooltip>
                              <Menu
                                anchorEl={anchorEl}
                                open={
                                  Boolean(anchorEl) && selectedRowId === v._id
                                }
                                onClose={handleIconClose}
                                keepMounted
                              >
                                <MenuItem
                                  onClick={(e) => handleEditModal(e, v, "read")}
                                  disabled={isActionLoading}
                                >
                                  <ViewIcon color="var(--para-color)" />{" "}
                                  <p className="ml-2 font-semibold text-[var(--heading-color)]">
                                    View
                                  </p>
                                </MenuItem>
                                <MenuItem
                                  onClick={(e) => handleEditModal(e, v, "edit")}
                                  disabled={isActionLoading}
                                >
                                  <Edit color="var(--para-color)" />{" "}
                                  <p className="ml-2 font-semibold text-[var(--heading-color)]">
                                    Edit
                                  </p>
                                </MenuItem>
                                <MenuItem
                                  onClick={(e) =>
                                    handleEditModal(e, v, "payments")
                                  }
                                >
                                  <DocumentFile color="var(--para-color)" />{" "}
                                  <p className="ml-2 font-semibold text-[var(--heading-color)]">
                                    Payments
                                  </p>
                                </MenuItem>
                                <MenuItem onClick={(e) => handleDelete(e, v)}>
                                  <Trash color="var(--para-color)" />{" "}
                                  <p className="ml-2 font-semibold text-[var(--heading-color)]">
                                    Delete
                                  </p>
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      No vendors found
                    </div>
                  )}
                </Table>
              </TableContainer>
              <hr
                className="mt-2 bg-gray-200 "
                style={{ border: "0.5px solid var(--light-grey-color)" }}
              />

              <div className="flex items-center justify-between mt-3">
                <FormControl
                  variant="standard"
                  size="small"
                  sx={{ minWidth: 80 }}
                >
                  <InputLabel id="page-size-label">Rows</InputLabel>
                  <Select
                    labelId="page-size-label"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    label="Rows"
                  >
                    {pageSizeOptions.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Pagination
                  className="p-2 flex justify-center"
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#418cff", // Blue background for selected
                      color: "#fff", // White text for selected
                    },
                    "& .MuiPaginationItem-root.Mui-selected:hover": {
                      backgroundColor: "#3366cc", // Darker blue on hover
                    },
                    "& .MuiPaginationItem-root": {
                      "&:hover": {
                        backgroundColor: "#ddd", // Light gray for hovered items
                      },
                    },
                  }}
                />
              </div>
            </>
          </Paper>
        ) : (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        )}
      </Box>

      {isActionLoading ? (
        <CustomLoading />
      ) : (
        isModalOpen && (
          <VendorOnboardingForm
            getVendorList={getVendorList}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            selectedVendorData={selectedVendorData}
            setSelectedVendorData={setSelectedVendorData}
          />
        )
      )}

      {isActionLoading ? (
        <CustomLoading />
      ) : (
        isVendorModalOpen && (
          <VendorModal
            isVendorModalOpen={isVendorModalOpen}
            setIsVendorModalOpen={setIsVendorModalOpen}
            selectedVendorData={selectedVendorData}
            setSelectedVendorData={setSelectedVendorData}
          />
        )
      )}
      {isActionLoading ? (
        <CustomLoading />
      ) : (
        isVendorPaymentModalOpen && (
          <VendorPaymentsModal
            isVendorPaymentModalOpen={isVendorPaymentModalOpen}
            setIsVendorPaymentModalOpen={setIsVendorPaymentModalOpen}
            selectedVendorData={selectedVendorData}
            setSelectedVendorData={setSelectedVendorData}
          />
        )
      )}
    </div>
  );
}

const headersForDownload = [
  { label: "State", key: "state" },
  { label: "Division", key: "division" },
  { label: "District", key: "district" },
  { label: "City", key: "city" },
  { label: "Vendor Business Name", key: "vendorBusinessName" },
  { label: "Pin Code", key: "pinCode" },
  { label: "Type of Business", key: "typeOfBusiness" },
  { label: "Owner Name", key: "ownerName" },
  { label: "Owner Primary Contact No", key: "ownerPrimaryContactNo" },
  { label: "Owner Secondary Contact No", key: "ownerSecondaryContactNo" },
  { label: "Address", key: "address" },
  { label: "Business Location", key: "businessLocation" },
  { label: "Website", key: "website" },
  { label: "Reliability", key: "reliability" },
  { label: "Years in Business", key: "yearsInBusiness" },
  { label: "Number of Employees", key: "numberOfEmployees" },
  { label: "Number of Skilled Manpower", key: "numberOfSkilledManpower" },
  { label: "Number of Unskilled Manpower", key: "numberOfUnskilledManpower" },
  { label: "Registered in ESI PF", key: "registeredInESIPF" },
  { label: "GSTIN", key: "GSTIN" },
  { label: "PAN Number", key: "PANNumber" },
  { label: "Bank Account Number", key: "bankAccountNumber" },
  { label: "Bank Name", key: "bankName" },
  { label: "Bank IFSC Code", key: "bankIFSCCode" },
  { label: "Avg Turnover Last 3 Years", key: "avgTurnoverLast3Years" },
  { label: "Production Area", key: "productionArea" },
  { label: "Payment Terms", key: "paymentTerms" },
  { label: "Scaling Factors", key: "scalingFactors" },
];
