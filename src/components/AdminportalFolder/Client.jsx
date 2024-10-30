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
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomLoading from "../../shared/utils/CustomLoading";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import {
  CircularProgress,
  Tooltip,
  IconButton,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Menu,
} from "@mui/material";
import ClientOnboardingform from "../../shared/createForms/ClientOnboarding";

import axios from "axios";
import {
  DownloadIcon,
  Edit,
  Trash,
  Search,
  ViewIcon,
  User_plus,
  BlacklistUser,
  User,
  DownArrow,
  Support,
  RightArrowLink,
  Cross,
} from "../../shared/assets/icons/index";
import VendorModal from "./VendorDetails/vendorModal";
import CustomButton from "../../shared/utils/Button";
import { Height, MoreVert } from "@mui/icons-material";
import CustomInput from "../../shared/utils/Input";
import { Link } from "react-router-dom";
import CompanyView from "./CompanyView";
import FormatTimestamp from "../../helperFunctions/FormatDateTimestamp";
import Swal from "sweetalert2";

// import ImportExport from "./ImportExport";
const columns = [
  {
    field: "companyName",
    headerName: "Company Name",
    width: 20,
  },
  { field: "sector", headerName: "Sector", width: 60 },
  { field: "city", headerName: "City", width: 60 },
  { field: "contactNumber", headerName: "Contact Number", width: 160 },
  { field: "added", headerName: "Added On", width: 200 },
  { field: "action", headerName: "Action", width: 80 },
];

export default function CustomTable() {
  // const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // Rows per page
  const [selected, setSelected] = React.useState([]); // State for selected rows
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionLoading,setIsActionLoading] = useState(false)
  const [OrganizationListLoading, setOrganizationListLoading] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const pageSizeOptions = [1, 5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedId] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedCompany, setselectedCompany] = useState([]);
  // const [allUserDetails, setAllUserDetails] = useState([]);
  // const [allCompanyDetails, setAllCompanyDetails] = useState([]);
  const [allDetails, setAllDetails] = useState([]);
  const [searchInputs, setSearchInputs] = useState({
    companyName: "",
    city: "",
    contactNumber: "",
    sector: "",
  });
  const [isCompanyDetailsModal, setIsCompanyDetailsModal] = useState(false);
  const serverURL = process.env.REACT_APP_URL;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleModalOpen = (value) => {
    setIsModalOpen(value);
  };

  const fetchCompanyData = async (page = 1, limit = 20) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${serverURL}/organization/view?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.success) {
        // setTotalCompanies(response?.data?.totalOrganizations); // Assuming totalOrganizations is returned from backend
        setAllDetails(response?.data?.data); // Assuming this holds paginated organization data
        oldData = response?.data?.data; // Save current data to oldData
        setTotalPages(response?.data?.totalPages); // Assuming totalPages is returned from backend
        setOrganizationListLoading(false);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanyData(page, pageSize);
  }, [page, pageSize]);

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (anchorEl && !anchorEl.contains(e.target)) {
        handleClose();
      }
    };

    window.addEventListener("click", handleClickOutside);

    // Cleanup event listener when component unmounts or menu is closed
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [anchorEl]);
  useEffect(() => {
    fetchCompanyData();
  }, []);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(rowId);
  };

  const handleEditModal = async (e, v) => {
    setAnchorEl(null);
    setIsActionLoading(true)

    try {
      const response = await axios.get(
        `${serverURL}/organization/view/${v}
    `,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setselectedCompany(response.data);
      }
      setIsActionLoading(false)

      setIsCompanyDetailsModal(true);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const handleSearchChange = (value) => {
    const searchTerm = value.trim().toLowerCase(); // Convert to lowercase for case-insensitive comparison

    if (searchTerm === "") {
      // If search input is cleared, reset to the original data
      setAllDetails(oldData);
    } else {
      const filteredData = oldData.filter(
        (data) =>
          data.organizationDetail.name.toLowerCase().includes(searchTerm) ||
          data.organizationDetail.sector.toLowerCase().includes(searchTerm) ||
          data.organizationDetail.city.toLowerCase().includes(searchTerm)
      );

      // Update the state with the filtered results
      setAllDetails(filteredData);
    }
  };
  const handlePageChange = async (e, value) => {
    await fetchCompanyData(value, pageSize);
    setPage(value);
  };

  const DeleteHandle = async (id) => {
    setAnchorEl(null);

    Swal.fire({
      customClass: {
        container: "my-swal",
      },
      icon: "warning",
      text: "Do you want to delete?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Perform the delete operation
          const response = await axios.delete(
            `${serverURL}/organization/delete/${id}`,
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
              // Refresh company data after deletion
              fetchCompanyData();
              setAnchorEl(null);
            });
          }
        } catch (error) {
          console.error("Error during deletion:", error);
          Swal.fire({
            icon: "error",
            text: error.response?.data?.message || "An error occurred",
            color: "black",
          });
        }
      }
      setAnchorEl(null);
    });
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
    if (searchTerm === "") {
      setAllDetails(oldData); // Reset to original data if search is cleared
    } else {
      // Apply filtering based on the column (key)
      const filteredData = oldData.filter((data) => {
        // For each case, check if the key matches and perform filtering
        switch (key) {
          case "companyName": // Make sure the case matches what you're passing
            return searchKeyword.test(
              data?.organizationDetail?.name?.toLowerCase() || ""
            );

          case "sector":
            return searchKeyword.test(
              data?.organizationDetail?.sector?.toLowerCase() || ""
            );

          case "city":
            return searchKeyword.test(
              data?.organizationDetail?.city?.toLowerCase() || ""
            );

          default:
            return true;
        }
      });

      setAllDetails(filteredData); // Update the state with filtered data
    }
  };

  return (
    <Box>
      {!OrganizationListLoading ? (
        <Paper
          sx={{ overflow: "hidden", boxShadow: "none" }}
          className="px-10 mt-5"
        >
          <EnhancedTableToolbar
            organizationData={fetchCompanyData}
            allDetails={allDetails}
            OnModalOpen={(value) => handleModalOpen(value)}
            onSearchChange={(value) => handleSearchChange(value)}
          />

          <TableContainer
            sx={{
              height: "calc(85vh - 150px)", // Adjust this to control available space for the table
              maxHeight: "calc(85vh - 150px)", // Ensures the table won't exceed this height
              overflowY: "auto", // Adds scroll when the content exceeds height
            }}
            className="mt-2 rounded-lg "
          >
            <Table
              stickyHeader
              aria-label="customized table"
              className="rounded-lg "
            >
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.field}
                      sx={{
                        minWidth: column.width,
                        backgroundColor: "var(--light-primary-color)",
                        fontWeight: "bold",
                        height: 90,
                        // borderLeft: index === 0 && "1px solid #ccc",
                        borderRight:
                          index < columns.length - 1
                            ? "1px solid #ccc"
                            : "none",
                      }}
                    >
                      <span className="absolute top-2">
                        {column.headerName}
                      </span>
                      {["companyName", "sector", "city"].includes(
                        column.field
                      ) && (
                        <input
                          type="text"
                          className="px-3 w-40 py-1 text-sm text-gray-900 border border-gray-300  rounded-lg mt-3  bg-gray-50"
                          placeholder={`Search ${column.field}`}
                          onChange={(e) =>
                            handleSearchChangeHead(e, column.field)
                          } // Use the handler passed via props
                          value={searchInputs?.[column.field] || ""} // Access search inputs from props
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {allDetails && allDetails.length > 0 ? (
                <TableBody>
                  {allDetails.map((row,i) => {
                    const isRowSelected = selected.includes(row.id);
                    return (
                      <TableRow
                        key={i}
                        hover
                        selected={isRowSelected}
                        sx={{
                          borderRight: "1px solid #ccc",
                          cursor: "pointer",
                        }}
                      >
                        <TableCell
                          sx={{
                            borderRight: "1px solid #ccc",
                            padding: "4px 8px",
                            borderLeft: "1px solid #ccc",
                          }}
                        >
                          {row.organizationDetail.name}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid #ccc",
                            padding: "4px 8px",
                          }}
                        >
                          {row.organizationDetail.sector}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid #ccc",
                            padding: "4px 8px",
                          }}
                        >
                          {row.organizationDetail.city}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid #ccc",
                            padding: "4px 8px",
                          }}
                        >
                          {row.clientUsers[0]?.phoneNumber
                            ? row.clientUsers[0]?.phoneNumber
                            : "N/A"}

                          {/* {row.organizationDetail.phoneNumber} */}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid #ccc",
                            padding: "4px 8px",
                          }}
                        >
                          {/* {row.organizationDetail.createdAt} */}
                          <FormatTimestamp
                            timestamp={row.organizationDetail.createdAt}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid #ccc",
                            padding: "4px 8px",
                          }}
                        >
                          <>
                            <Tooltip title="Click">
                              <IconButton
                                onClick={(e) =>
                                  handleClick(e, row.organizationDetail._id)
                                }
                              >
                                <MoreVertIcon
                                  aria-controls="simple-menu"
                                  aria-haspopup="true"
                                  style={{
                                    cursor: "pointer",
                                    color: "var(--primary-color)",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>

                            <Menu
                              id="simple-menu"
                              anchorEl={anchorEl}
                              open={
                                Boolean(anchorEl) &&
                                selectedRowId === row.organizationDetail._id
                              }
                              // onClose={DeleteHandle}
                              PaperProps={{
                                style: {
                                  maxHeight: "100px", // Adjust max height if needed
                                  width: "100px", // Adjust width for smaller menu
                                },
                              }}
                            >
                              <MenuItem
                                onClick={(e) =>
                                  handleEditModal(e, row.organizationDetail._id)
                                }
                                disabled = {isActionLoading}

                              >
                                <ViewIcon color={"var(--para-color)"} />
                                <p className="ml-2 font-semibold text-[var(--heading-color)]">
                                  View
                                </p>
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  DeleteHandle(row.organizationDetail._id)
                                }
                              >
                                <Tooltip title="Delete Client">
                              
                                  <Trash color="var(--para-color)"  />
                                </Tooltip>
                                <p className="ml-2 font-semibold text-[var(--heading-color)]">
                                  Delete
                                </p>
                              </MenuItem>
                            </Menu>
                          </>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <div className="flex justify-center items-center h-96 w-[100px]">
                  No Organization found
                </div>
              )}
            </Table>
          </TableContainer>
          <hr
            className="mt-2 bg-gray-200 "
            style={{ border: "0.5px solid var(--light-grey-color)" }}
          />
          <div className="flex items-center justify-between mt-3 ">
            <FormControl variant="standard" size="small" sx={{ minWidth: 80 }}>
              <InputLabel id="page-size-label">Rows</InputLabel>
              <Select
                labelId="page-size-label"
                value={pageSize}
                onChange={handlePageSizeChange}
                label="Rows"
              >
                {pageSizeOptions.map((size,i) => (
                  <MenuItem key={i} value={size}>
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

           {isActionLoading ? (
        <CustomLoading/>
   
) : (isModalOpen && (
            <ClientOnboardingform
              fetchCompanyData={fetchCompanyData}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          ))}
          {
            <Modal
              open={isCompanyDetailsModal}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="relative"
            >
              <Box>
                <CompanyView
                  setIsCompanyDetailsModal={setIsCompanyDetailsModal}
                  isCompanyDetailsModal={isCompanyDetailsModal}
                  selectedCompany={selectedCompany}
                  fetchCompanyData={fetchCompanyData}
                  ClientOnboardingModalFunction={setIsModalOpen}
                  setselectedCompany={setselectedCompany}
                />
              </Box>
            </Modal>
          }
        </Paper>
      ) : (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      )}
    </Box>
  );
}
var oldData = [];

function EnhancedTableToolbar(props) {
  const [searchInput, setSearchInput] = useState("");
  const { numSelected } = props;
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    props.onSearchChange(e.target.value);
  };

  const handleOpen = (e) => {
    props.OnModalOpen(true);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

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
          Total Client : {props.allDetails.length}{" "}
        </Typography>

        <>
          <div className="ml-2">
            <Tooltip title="Add Client" onClick={handleOpen}>
              <IconButton>
                <User_plus />
              </IconButton>
            </Tooltip>
          </div>
        </>
      </Toolbar>
    </>
  );
}

var oldData = [];
