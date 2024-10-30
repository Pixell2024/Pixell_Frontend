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
import { FormControl, InputLabel, Select, Menu, MenuItem } from "@mui/material";
import { CircularProgress, Tooltip, IconButton } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import moment from "moment-timezone";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Styles from "../../styles/vendorDashboard.module.css";
import FormatDateTimestamp from "../../helperFunctions/FormatDateTimestamp";
import InstallationPartnerOnboardingForm from "../../shared/createForms/installationPartnerOnboardingForm";
import InstallationPartnerModal from "./InstallationPartnerDetails/InstallationPartnerModal";
import CustomLoading from "../../shared/utils/CustomLoading";

import {
  Edit,
  Trash,
  ViewIcon,
  User_plus,
  DocumentFile,
} from "../../shared/assets/icons/index";
import IpPaymentsModal from "../../shared/createForms/IpPaymentsModal";
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
    id: "email",
    label: "Email",
    width: 160,
  },
  {
    id: "phoneNumber",
    label: "Phone Number",
    width: 160,
  },
  {
    id: "createdAt",
    label: "Added On",
    width: 200,
  },
  {
    id: "name",
    label: "Name",
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
            // align={headCell.numeric ? "right" : "left"}
            // padding={headCell.disablePadding ? "none" : "normal"}
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

            {["state", "city", "phoneNumber", "name"].includes(headCell.id) && (
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
  const { numSelected } = props;
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
          Total Installation Partner : {props.totalInstallationPartner}
        </Typography>

        <>
          <Tooltip title="Add Installation Partner" onClick={handleOpen}>
            <IconButton>
              <User_plus />
            </IconButton>
          </Tooltip>
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
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isInstallationPartnerModalOpen, setIsInstallationPartnerModalOpen] =
    useState(false);
  const [installationPartner, setInstallationPartner] = useState([]);
  const [selectedInstallationPartnerData, setSelectedInstallationPartnerData] =
    useState({});
  const [installationPartnerListLoading, setInstallationPartnerLoading] =
    useState(true);
  const [totalInstallationPartner, setTotalInstallationPartner] = useState("0");

  const [ipModalOpen, setIpModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null); // Store the selected row ID
  const [searchInputs, setSearchInputs] = useState({
    state: "",
    city: "",
    phoneNumber: "",
    name: "",
  });

  const getInstallationPartnerList = async (page = 1, limit = 20) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${serverURL}/installationPartner/view?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response?.data?.success) {
        // console.log(response.data.data);
        setTotalInstallationPartner(response?.data?.data.length);
        setInstallationPartner(response?.data?.data);
        oldData = response?.data?.data;
        // setTotalPages(response?.data?.totalPages);
        setInstallationPartnerLoading(false);
      }
    } catch (error) {
      console.error("Error fetching InstallationPartner:", error);
    }
  };

  useEffect(() => {
    getInstallationPartnerList(page, pageSize);
  }, [page, pageSize]);

  const handleModalOpen = (value) => {
    setIsModalOpen(value);
  };

  const handleEditModal = (e, v, operation) => {
    setIsActionLoading(true);
    setAnchorEl(null);
    axios
      .get(`${serverURL}/installationPartner/view/${v._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSelectedInstallationPartnerData(response.data.data);
          if (operation === "edit") {
            setIsModalOpen(true);
            setIsActionLoading(false);
          } else if (operation === "payments") {
            setIsActionLoading(false);
            setIpModalOpen(true);
          } else {
            setIsInstallationPartnerModalOpen(true);
            setIsActionLoading(false);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching InstallationPartner:", error);
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
            .delete(`${serverURL}/installationPartner/delete/${v._id}`, {
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
                getInstallationPartnerList();
              });
            })
            .catch((error) => {
              console.error("Error deleting InstallationPartner:", error);
              Swal.fire("There was an error deleting the InstallationPartner.");
            });
        } catch (error) {
          console.error(error);
          Swal.fire("There was an error deleting the InstallationPartner.");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not deleted", "", "info");
      }
    });
  };

  const handlePageChange = async (e, value) => {
    await getInstallationPartnerList(value, pageSize);
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
      setInstallationPartner(oldData);
    } else {
      // Apply filtering based on the column (key)
      const filteredData = oldData.filter((data) => {
        // For each case, check if the key matches and perform filtering
        switch (key) {
          case "state":
            return searchKeyword.test(data?.state?.toLowerCase());

          case "city":
            return searchKeyword.test(data?.city?.toLowerCase());

          case "phoneNumber":
            return searchKeyword.test(data?.phoneNumber);

          case "name":
            return searchKeyword.test(data?.name?.toLowerCase());

          default:
            return true;
        }
      });

      setInstallationPartner(filteredData); // Update the InstallationPartner with the filtered data
    }
  };

  return (
    <div className="bg-white h-full">
      <Box>
        {!installationPartnerListLoading ? (
          <Paper
            sx={{ width: "100%", boxShadow: "none" }}
            className="px-10 mt-5 "
          >
            <EnhancedTableToolbar
              userVenderData={getInstallationPartnerList}
              // InstallationPartner={InstallationPartner}
              OnModalOpen={(value) => handleModalOpen(value)}
              onSearchChange={(value) => handleSearchChangeHead(value)}
              totalInstallationPartner={totalInstallationPartner}
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
                    rowCount={installationPartner.length}
                    userListData={getInstallationPartnerList}
                    setSearchInputs={setSearchInputs} // Function to update search inputs
                    handleSearchChangeHead={handleSearchChangeHead}
                    searchInputs={searchInputs}
                  />
                  {installationPartner && installationPartner?.length > 0 ? (
                    <TableBody>
                      {installationPartner.map((v, index) => {
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
                              {v.emailAddress || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #ccc",
                                padding: "4px 8px",
                              }}
                            >
                              {v.phoneNumber || "N/A"}
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
                              {v?.name || "N/A"}
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
                      No InstallationPartner found
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
        ipModalOpen && (
          <IpPaymentsModal
            ipModalOpen={ipModalOpen}
            setIpModalOpen={setIpModalOpen}
            selectedInstallationPartnerData={selectedInstallationPartnerData}
            setSelectedInstallationPartnerData={
              setSelectedInstallationPartnerData
            }
          />
        )
      )}
      {isActionLoading ? (
        <CustomLoading />
      ) : (
        isModalOpen && (
          <InstallationPartnerOnboardingForm
            getInstallationPartnerList={getInstallationPartnerList}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            selectedInstallationPartnerData={selectedInstallationPartnerData}
            setSelectedInstallationPartnerData={
              setSelectedInstallationPartnerData
            }
          />
        )
      )}
      {isActionLoading ? (
        <CustomLoading />
      ) : (
        isInstallationPartnerModalOpen && (
          <InstallationPartnerModal
            isInstallationPartnerModalOpen={isInstallationPartnerModalOpen}
            setIsInstallationPartnerModalOpen={
              setIsInstallationPartnerModalOpen
            }
            selectedInstallationPartnerData={selectedInstallationPartnerData}
            setSelectedInstallationPartnerData={
              setSelectedInstallationPartnerData
            }
          />
        )
      )}
    </div>
  );
}
