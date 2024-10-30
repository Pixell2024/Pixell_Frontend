import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Select,
  TablePagination,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomInput from "../../shared/utils/Input";
import CustomButton from "../../shared/utils/Button";
import MenuButtonWithDatePickers from "../../shared/utils/DateFilter";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  RightArrowLink,
  Search,
  UploadRfpIcon,
} from "../../shared/assets/icons";
import axios, { AxiosHeaders } from "axios";
import { Link, useNavigate } from "react-router-dom";
import RFPModal from "../../shared/createForms/RFPModal";

const columns = [
  { field: "campaign", headerName: "CAMPAIGN ", width: 130 },
  { field: "owner", headerName: "CAMPAIGN OWNER", width: 130 },
  { field: "Timeline", headerName: "TIMELINE ", width: 130 },
  { field: "Kam", headerName: "KAM", width: 130 },
  { field: "RfpInitiation", headerName: "KAM EMAIL", width: 130 },
  { field: "Team", headerName: "TEAM", width: 130 },
  { field: "RfpFile", headerName: "RFP FILE", width: 160 },
  { field: "Action", headerName: "ACTION", width: 90 },
];

const Campaigns = () => {
  const navigate = useNavigate();

  const [OrganizationListLoading, setOrganizationListLoading] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // Rows per page
  const [selected, setSelected] = React.useState([]); // State for selected rows
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const pageSizeOptions = [1, 5, 10, 20, 50, 100];
  const [open, setOpen] = React.useState(false);
  const [allRfp, setAllRfp] = useState([]);

  const [searchInputs, setSearchInputs] = useState({
    campaign: "",
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
  const handleClose = () => setOpen(false);

  const fetchAllRFP = async () => {
    try {
      const response = await axios.get(
        `${serverURL}/requestForProposal/viewAllRfp`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success === true) {
        setAllRfp(response.data.data);
        oldData = response?.data?.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log("AllRFp", allRfp);

  const handleModalOpen = (value) => {
    setIsModalOpen(value);
  };
  const fetchCompanyData = async () => {};

  useEffect(() => {
    fetchCompanyData();
    fetchAllRFP();
  }, []);

  const handleEditModal = async (e, v) => {};

  // Paginate the rows
  const paginatedRows = Array.isArray(allRfp)
    ? allRfp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];
  const openCompanyModal = () => {
    setIsCompanyDetailsModal(true);
  };

  const EditRFPForm = (e, id) => {
    navigate(`/user/editRFP/${id}`);
  };
  const handleSearchChangeHead = (e, key) => {
    const value = e.target.value;
    const searchTerm = value.trim().toLowerCase();

    setSearchInputs((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    if (searchTerm === "") {
      setAllRfp(oldData);
    } else {
      const filteredData = oldData.filter((data) => {
        // console.log("data", data);
        switch (key) {
          case "campaign":
            return data?.campaignName?.toLowerCase().includes(searchTerm);

          default:
            return true;
        }
      });

      setAllRfp(filteredData);
    }
  };

  const handlePageChange = async (e, value) => {
    await fetchCompanyData(value, pageSize);
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
  };

  return (
    <Box>
      {!OrganizationListLoading ? (
        <Paper sx={{ overflow: "hidden" }} className="px-6 mt-2">
          <div className="flex justify-between flex-col items-center md:flex-row p-3">
            <h1 className="mb-3"> PENDING PROPOSALS</h1>
            <div
              className="flex justify-center items-center  rounded-lg px-1 py-2 space-x-2  text-sm text-gray-900 bg-gray-50"
              style={{ border: "1px solid var(--listdown-color)" }}
            >
              <Search color="var(--listdown-color)" />
              <input
                type="text"
                className="outline-none"
                placeholder={`Search Campaign`}
                onChange={(e) => handleSearchChangeHead(e, columns[0].field)}
                value={searchInputs?.campaign || ""}
              />
            </div>
          </div>
          <>
            <TableContainer
              sx={{
                height: "calc(85vh - 140px)", // Adjusts the height based on available viewport height
                maxHeight: "calc(85vh - 150px)",
                maxWidth: "calc(88vw - 40px)",
                width: "calc(88vw - 60px)",
                overflowY: "auto",
                overflowX: "auto",
              }}
              className="mt-2 rounded-lg"
            >
              {" "}
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
                          // backgroundColor: "var(--light-primary-color)",
                          fontWeight: "semibold",
                          // border: 2,
                          // borderRight:
                          //   index < columns.length - 1
                          //     ? "1px solid #ccc"
                          //     : "none",
                        }}
                      >
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {allRfp && allRfp.length > 0 ? (
                  <>
                    <TableBody>
                      {allRfp.map((row) => {
                        const isRowSelected = selected.includes(row.id);
                        return (
                          <TableRow
                            key={row.id}
                            selected={isRowSelected}
                            sx={{ borderRadius: "50px", margin: 2 }}
                            className=""
                          >
                            <TableCell>
                              <div className="flex justify-between items-center">
                                <p>{row.campaignName}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p>{row.campaignOwnerId.name} </p>
                            </TableCell>
                            <TableCell>
                              <p>
                                {`${new Date(
                                  row.startDate
                                ).getDate()} ${new Date(
                                  row.startDate
                                ).toLocaleString("default", {
                                  month: "short",
                                })} ${new Date(
                                  row.startDate
                                ).getFullYear()} - ${new Date(
                                  row.endDate
                                ).getDate()} ${new Date(
                                  row.endDate
                                ).toLocaleString("default", {
                                  month: "short",
                                })} ${new Date(row.endDate).getFullYear()}`}
                              </p>
                            </TableCell>
                            <TableCell>
                              {/* {row.clientUsers[0]?.phoneNumber} */}

                              {/* {row.organizationDetail.phoneNumber} */}
                            </TableCell>
                            <TableCell> </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <a
                                href={row.rfpDocument}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-start items-center"
                              >
                                {row.campaignName}...
                                <RightArrowLink
                                  size="15"
                                  color="var(--primary-color)"
                                />
                              </a>
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={(e) => EditRFPForm(e, row._id)}
                                className="text-[var(--primary-color)]"
                              >
                                Edit
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </>
                ) : (
                  <div className="flex justify-center items-center h-64">
                    No RFP found
                  </div>
                )}
              </Table>
            </TableContainer>
            <hr
              className="mt-2 bg-gray-200 "
              style={{ border: "0.5px solid var(--light-grey-color)" }}
            />
            <div className="flex items-center justify-between mt-2  mb-1">
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
    // </div>
  );
};

export default Campaigns;
var oldData = [];
