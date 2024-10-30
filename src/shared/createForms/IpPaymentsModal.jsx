import {
  Chip,
  Dialog,
  Grid,
  IconButton,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { Cross, Recce } from "../assets/icons";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Styles from "../../styles/vendorDashboard.module.css";
import { Link } from "react-router-dom";

const columns = [
  {
    field: "serial",
    headerName: "NO. ",
    width: 20,
  },
  { field: "campaign", headerName: "CAMPAIGN", width: 100 },
  { field: "service", headerName: "SERVICE", width: 80 },
  { field: "jobId", headerName: "JOB ID", width: 60 },
  { field: "KAM", headerName: "KAM", width: 120 },
  { field: "storeDetail", headerName: "STORE DETAILS", width: 200 },
  { field: "jobDate", headerName: "JOB DATE", width: 120 },
  { field: "completionDate", headerName: "COMPLETION DATE", width: 120 },
  { field: "buget", headerName: "BUDGET", width: 70 },
  { field: "images", headerName: "IMAGES  ", width: 120 },
  { field: "paymentStatus", headerName: "PAYMENT STATUS", width: 50 },
  { field: "action", headerName: "ACTION", width: 60 },
];
const data = [
  {
    no: 1,
    campagin: "Campaign Name 2024",
    service: "Recce",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    storeDetail: "Ramseh Store Name, Plot no.1, Sector 7/D FBD| HR",
    jobDate: "10 Oct 2024",
    completionDate: "12 Oct 24",
    buget: "100000",
    images: [],

    paymentStatus: "Paid",
  },
  {
    no: 2,
    campagin: "Campaign Name 2024",
    service: "Recce",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    storeDetail: "Ramseh Store Name, Plot no.1, Sector 7/D FBD| HR",
    jobDate: "10 Oct 2024",
    completionDate: "12 Oct 24",
    buget: "100000",
    images: [],

    paymentStatus: "Pending",
  },
  {
    no: 3,
    campagin: "Campaign Name 2024",
    service: "Recce",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    storeDetail: "Ramseh Store Name, Plot no.1, Sector 7/D FBD| HR",
    jobDate: "10 Oct 2024",
    completionDate: "12 Oct 24",
    buget: "100000",
    images: [],

    paymentStatus: "Pending",
  },
  {
    no: 4,
    campagin: "Campaign Name 2024",
    service: "Recce",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    storeDetail: "Ramseh Store Name, Plot no.1, Sector 7/D FBD| HR",
    jobDate: "10 Oct 2024",
    completionDate: "12 Oct 24",
    buget: "100000",
    images: [],

    paymentStatus: "Pending",
  },
  {
    no: 4,
    campagin: "Campaign Name 2024",
    service: "Recce",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    storeDetail: "Ramseh Store Name, Plot no.1, Sector 7/D FBD| HR",
    jobDate: "10 Oct 2024",
    completionDate: "12 Oct 24",
    buget: "100000",
    images: [],

    paymentStatus: "Pending",
  },
  {
    no: 4,
    campagin: "Campaign Name 2024",
    service: "Recce",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    storeDetail: "Ramseh Store Name, Plot no.1, Sector 7/D FBD| HR",
    jobDate: "10 Oct 2024",
    completionDate: "12 Oct 24",
    buget: "100000",
    images: [],

    paymentStatus: "Pending",
  },
  {
    no: 4,
    campagin: "Campaign Name 2024",
    service: "Recce",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    storeDetail: "Ramseh Store Name, Plot no.1, Sector 7/D FBD| HR",
    jobDate: "10 Oct 2024",
    completionDate: "12 Oct 24",
    buget: "100000",
    images: [],

    paymentStatus: "Pending",
  },
];

const IpPaymentsModal = ({
  selectedInstallationPartnerData,
  ipModalOpen,
  setIpModalOpen,
}) => {
  console.log(selectedInstallationPartnerData);
  const [allDetails, setAllDetails] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setAllDetails(data);
  }, []);

  const handleClose = () => {
    setIpModalOpen(false);
  };

  return (
    <Dialog open={ipModalOpen} fullScreen fullWidth>
      <div className=" px-16 md:px-24 py-5 relative">
        <div className="flex justify-between gap-3 mt-5">
          <div className="flex items-start justify-center gap-4 rounded-xl ">
            <div className=" h-[110px] w-[110px] object-contain">
              <img
                src={selectedInstallationPartnerData.profilePhoto}
                alt="profilePic"
                className="rounded-md"
              />
            </div>
            <div>
              <h1 className="tex-[20px] font-bold">
                {selectedInstallationPartnerData.name}
              </h1>

              <p>
                {selectedInstallationPartnerData.address},{" "}
                {selectedInstallationPartnerData.city},{" "}
                {selectedInstallationPartnerData.state},{" "}
                {selectedInstallationPartnerData.zipCode}
              </p>
              <p>{selectedInstallationPartnerData.emailAddress}</p>
              <p>{selectedInstallationPartnerData.phoneNumber}</p>
            </div>
          </div>

          <div>
            <div
              onClick={handleClose}
              className="mx-5 my-4 flex justify-end absolute right-1 top-1"
              style={{ cursor: "pointer" }}
            >
              <Cross />
            </div>
            <p>
              Total Campaigns :{" "}
              <span className="text-[var(--heading-color)] font-semibold">
                {" "}
                1023{" "}
              </span>
            </p>
            <p>
              Pending Campaigns :{" "}
              <span className="text-[var(--heading-color)] font-semibold">
                {" "}
                2
              </span>
            </p>
            <p>
              Total Earned :{" "}
              {
                <CurrencyRupeeIcon
                  style={{
                    fontSize: "12px",
                    marginBottom: 2,
                    color: "var(--heading-color)",
                  }}
                />
              }
              <span className="text-[var(--heading-color)] font-semibold">
                {" "}
                3.64 Cr.{" "}
              </span>
            </p>
          </div>
        </div>
      </div>
      <Grid>
        <>
          <TableContainer
            sx={{
              height: "calc(85vh - 97px)",
              maxHeight: "calc(85vh - 97px)",
              maxWidth: "calc(88vw - 0px)",
              width: "calc(88vw - 0px)",

              overflowY: "auto",
            }}
            className={`mt-2  border rounded-md mx-auto ${Styles["custom-scrollbar"]}`}
          >
            <Table
              stickyHeader
              aria-label="customized table"
              className="rounded-lg"
            >
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.field}
                      sx={{
                        minWidth: column.width,
                        // backgroundColor: "var(--light-primary-color)",
                        fontWeight: "bold",
                        // height: 90,
                        // borderRight:
                        //   index < columns.length - 1
                        //     ? "1px solid #ccc"
                        //     : "none",
                      }}
                    >
                      <span className="text-[12px]">{column.headerName}</span>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allDetails && allDetails.length > 0 ? (
                  allDetails.map((row, index) => {
                    // const isRowSelected = selected.includes(row.id);
                    return (
                      <TableRow
                        key={index}
                        hover
                        // selected={isRowSelected}
                        sx={{
                          // borderRight: "1px solid #ccc",
                          cursor: "pointer",
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell
                        // sx={{
                        //   borderRight: "1px solid #ccc",
                        //   padding: "4px 8px",
                        // }}
                        >
                          <p className="text-[12px]"> {row.campagin} </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px] flex justify-start items-center gap-2">
                            {row.service && row.service === "Recce" && (
                              <Recce size="16" color="var(--para-color)" />
                            )}
                            {row.service}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]"> {row.jobId} </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]"> {row.KAM || "N/A"} </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]">
                            {row.storeDetail ? (
                              <>
                                {row.storeDetail.split(",")[0]}{" "}
                                {/* Store Name */}
                                <br />
                                <span className="text-[10px]">
                                  {row.storeDetail
                                    .split(",")
                                    .slice(1)
                                    .join(", ")}{" "}
                                  {/* Remaining address */}
                                </span>
                              </>
                            ) : (
                              "N/A"
                            )}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]">{row.jobDate || "N/A"}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]">
                            {row.completionDate || "N/A"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]">₹ {row.buget || "N/A"}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]">
                            {" "}
                            <Link to={""}>View Images</Link>
                          </p>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={row.paymentStatus || "N/A"}
                            sx={{
                              backgroundColor:
                                row?.paymentStatus === "Pending"
                                  ? "var(--yellow-bgChip-color)" // Light yellow background similar to bg-yellow-100
                                  : row?.paymentStatus === "Paid"
                                  ? "var(--green-bgChip-color)"
                                  : "var(--para-color)", // Default color for other statuses
                              color:
                                row?.paymentStatus === "Pending"
                                  ? "var(--textChip-yellow-color)" // Text color similar to text-yellow-500
                                  : "var(--textChip-green-color)",
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Tooltip title="Click">
                            <IconButton
                            // onClick={(e) => handleIconOpen(e, v._id)}
                            >
                              <MoreVertIcon
                                style={{ color: "var(--primary-color)" }}
                              />
                            </IconButton>
                          </Tooltip>
                          <Menu
                            anchorEl={anchorEl}
                            // open={Boolean(anchorEl) && selectedRowId === v._id}
                            // onClose={handleIconClose}
                            keepMounted
                          >
                            {/* <MenuItem
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
                              onClick={(e) => handleEditModal(e, v, "payments")}
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
                            </MenuItem> */}
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <div className="flex justify-center items-center h-96 w-full">
                        No Payments found
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      </Grid>
    </Dialog>
  );
};

export default IpPaymentsModal;
