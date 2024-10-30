import React, { useEffect, useState } from "react";
import { Cross } from "../assets/icons";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Styles from "../../styles/vendorDashboard.module.css";

// import FormatTimestamp from "./FormatTimestamp"; // Adjust as necessary

const columns = [
  {
    field: "serial",
    headerName: "NO. ",
    width: 20,
  },
  { field: "campaign", headerName: "CAMPAIGN", width: 40 },
  { field: "jobId", headerName: "JOB ID", width: 60 },
  { field: "KAM", headerName: "KAM", width: 120 },
  { field: "delivery", headerName: "DELIVERY ADDRESS", width: 160 },
  { field: "jobTimeline", headerName: "JOB TIMELINE", width: 190 },
  { field: "buget", headerName: "BUDGET", width: 80 },
  { field: "advanceAmount", headerName: "ADVANCE AMOUNT", width: 80 },
  { field: "balanceAmount", headerName: "BALANCE AMOUNT ", width: 80 },
  { field: "pdiStatus", headerName: "PDI STATUS", width: 70 },
  { field: "paymentStatus", headerName: "PAYMENT STATUS", width: 70 },
  { field: "action", headerName: "ACTION", width: 60 },
];

const data = [
  {
    no: 1,
    campagin: "Campaign Name 2024",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    DeliveryAddress: "Ramseh Store Name, Plot no.1, Sector 7/D FBD| HR",
    jobTimeLine: "10 OCT 24 - 24 DEC 24 ",
    buget: "100000",
    advanceAmount: " 300000",
    balance: " 70000",
    pdiStatus: "Pending",
    paymentStatus: "Pending",
  },
  {
    no: 2,
    campagin: "Campaign Name 2024",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    DeliveryAddress: "Ramseh Store Name",
    jobTimeLine: "10 OCT 24 - 24 DEC 24 ",
    buget: "100000",
    advanceAmount: "300000",
    balance: " 70000",
    pdiStatus: "Pending",
    paymentStatus: "Pending",
  },
  {
    no: 3,
    campagin: "Campaign Name 2024",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    DeliveryAddress: "Ramseh Store Name",
    jobTimeLine: "10 OCT 24 - 24 DEC 24 ",
    buget: "100000",
    advanceAmount: "300000",
    balance: "70000",
    pdiStatus: "Done",
    paymentStatus: "Paid",
  },
  {
    no: 4,
    campagin: "Campaign Name 2024",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    DeliveryAddress: "Ramseh Store Name",
    jobTimeLine: "10 OCT 24 - 24 DEC 24 ",
    buget: "100000",
    advanceAmount: " 300000",
    balance: "70000",
    pdiStatus: "Pending",
    paymentStatus: "Pending",
  },
  {
    no: 4,
    campagin: "Campaign Name 2024",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    DeliveryAddress: "Ramseh Store Name",
    jobTimeLine: "10 OCT 24 - 24 DEC 24 ",
    buget: "100000",
    advanceAmount: " 300000",
    balance: "70000",
    pdiStatus: "Pending",
    paymentStatus: "Pending",
  },
  {
    no: 4,
    campagin: "Campaign Name 2024",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    DeliveryAddress: "Ramseh Store Name",
    jobTimeLine: "10 OCT 24 - 24 DEC 24 ",
    buget: "100000",
    advanceAmount: " 300000",
    balance: "70000",
    pdiStatus: "Pending",
    paymentStatus: "Pending",
  },
  {
    no: 4,
    campagin: "Campaign Name 2024",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    DeliveryAddress: "Ramseh Store Name",
    jobTimeLine: "10 OCT 24 - 24 DEC 24 ",
    buget: "100000",
    advanceAmount: " 300000",
    balance: "70000",
    pdiStatus: "Pending",
    paymentStatus: "Pending",
  },
  {
    no: 4,
    campagin: "Campaign Name 2024",
    jobId: "#12345",
    KAM: "Neeraj Singh",
    DeliveryAddress: "Ramseh Store Name",
    jobTimeLine: "10 OCT 24 - 24 DEC 24 ",
    buget: "100000",
    advanceAmount: " 300000",
    balance: "70000",
    pdiStatus: "Pending",
    paymentStatus: "Pending",
  },
];

const VendorPaymentsModal = ({
  isVendorPaymentModalOpen,
  setIsVendorPaymentModalOpen,
  selectedVendorData,
}) => {
  // console.log(selectedVendorData);
  const [allDetails, setAllDetails] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    setAllDetails(data);
  }, []);
  const handleClick = () => {};

  const handleClose = () => {
    setIsVendorPaymentModalOpen(false);
  };

  return (
    <Dialog open={isVendorPaymentModalOpen} fullScreen fullWidth>
      <div className=" px-16 md:px-24 py-5 relative">
        <div className="flex justify-between gap-3 mt-5">
          <div>
            <div className="flex justify-start items-center  gap-2">
              <h1 className="tex-[20px] font-bold  ">
                {selectedVendorData.vendorBusinessName &&
                  selectedVendorData.vendorBusinessName
                    .charAt(0)
                    .toUpperCase() +
                    selectedVendorData.vendorBusinessName.slice(1)}
              </h1>
              <Chip
                label={selectedVendorData?.status || "N/A"}
                color={
                  selectedVendorData?.status === "Active"
                    ? "success"
                    : selectedVendorData?.status === "Inactive"
                    ? "primary" // or any other color for inactive
                    : selectedVendorData?.status === "Blacklisted"
                    ? "error"
                    : "default"
                }
              />
            </div>

            <p>{selectedVendorData.ownerName}</p>
            <p className="flex items-center justify-start">
              {selectedVendorData.address}, {selectedVendorData.city},{" "}
              {selectedVendorData.state}, {selectedVendorData.pinCode}
            </p>
            <p></p>
            <p className="flex items-center justify-start">
              {selectedVendorData.ownerPrimaryContactNo}
              {selectedVendorData.ownerSecondaryContactNo && (
                <p>, {selectedVendorData.ownerSecondaryContactNo}</p>
              )}
            </p>
            <p className="font-semibold text-[var(--heading-color)]">
              GSTIN: {selectedVendorData.GSTIN}
            </p>
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
              <span className="text-[var(--heading-color)]"> 1023 </span>
            </p>
            <p>
              Pending Campaigns :{" "}
              <span className="text-[var(--heading-color)]"> 1023 </span>
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
              <span className="text-[var(--heading-color)]"> 3.64 Cr. </span>
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
            className={`mt-2  border rounded-xl mx-auto ${Styles["custom-scrollbar"]}`}
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
                  allDetails.map((row, i) => {
                    // const isRowSelected = selected.includes(row.id);
                    return (
                      <TableRow
                        key={i}
                        hover
                        // selected={isRowSelected}
                        sx={{
                          // borderRight: "1px solid #ccc",
                          cursor: "pointer",
                        }}
                      >
                        <TableCell>{i + 1}</TableCell>
                        <TableCell
                        // sx={{
                        //   borderRight: "1px solid #ccc",
                        //   padding: "4px 8px",
                        // }}
                        >
                          <p className="text-[12px]"> {row.campagin} </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]"> {row.jobId} </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]"> {row.KAM || "N/A"} </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]">
                            {row.DeliveryAddress ? (
                              <>
                                {row.DeliveryAddress.split(",")[0]}{" "}
                                {/* Store Name */}
                                <br />
                                <span className="text-[9px]">
                                  {row.DeliveryAddress.split(",")
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
                          <p className="text-[12px]">
                            {row.jobTimeLine || "N/A"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]">₹ {row.buget || "N/A"}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]">
                            ₹ {row.advanceAmount || "N/A"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px]">
                            ₹ {row.balance || "N/A"}
                          </p>
                        </TableCell>

                        <TableCell className="flex justify-start items-center">
                          <Chip
                            label={row.pdiStatus || "N/A"}
                            sx={{
                              backgroundColor:
                                row?.pdiStatus === "Pending"
                                  ? "var(--yellow-bgChip-color)" // Light yellow background similar to bg-yellow-100
                                  : row?.pdiStatus === "Done"
                                  ? "var(--green-bgChip-color)"
                                  : "var(--para-color)", // Default color for other statuses
                              color:
                                row?.pdiStatus === "Pending"
                                  ? "var(--textChip-yellow-color)"
                                  : "var(--textChip-green-color)", // Text color similar to text-yellow-500
                              fontWeight: "bold",
                            }}
                          />
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

export default VendorPaymentsModal;
