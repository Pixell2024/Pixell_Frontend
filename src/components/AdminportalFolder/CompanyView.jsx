import React, { useEffect, useState } from "react";
import {
  Cross,
  Edit,
  LeftArrowDouble,
  LeftArrowIcon,
  Mail,
  MobileIcons,
  Trash,
} from "../../shared/assets/icons";
import { Box, IconButton, Menu, MenuItem, Modal, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomInput from "../../shared/utils/Input";
import CustomButton from "../../shared/utils/Button";
import Swal from "sweetalert2";
import axios from "axios";
import ClientOnboardingform from "../../shared/createForms/ClientOnboarding";
import ClientEditAddModal from "./ClientEditAddModal";
// import LocationOnIcon from "@material-ui/icons/LocationOn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
// import AddLocationIcon from "@mui/icons-material/AddLocation";
import "../../shared/createForms/vendorOnboard.css";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { AssociatedBusiness } from "../../shared/assets/icons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CompanyView = ({
  setIsCompanyDetailsModal,
  isCompanyDetailsModal,
  selectedCompany,
  setselectedCompany,
  fetchCompanyData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ClientContactModal, setClientContactModal] = useState(false);
  const [clientSelectedModal, setClientSelectedModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [updateClientId, setUpdateCLientId] = useState("");
  const [arrayOfClients, setarrayOfClients] = useState([]);
  const [selectedClientDetails, setSelectedClientDetails] = useState([]);
  const [organizationId, setOrganizationId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [selectedRowId, setSelectedId] = useState(null);

  const serverURL = process.env.REACT_APP_URL;
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (selectedCompany && selectedCompany.organizationDetail) {
      setOrganizationId(selectedCompany.organizationDetail._id);
    }

    // setarrayOfClients(selectedCompany.clientUsers);
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedCompany && selectedCompany.organizationDetail) {
      setOrganizationId(selectedCompany.organizationDetail._id);
    }

    // Update arrayOfClients when selectedCompany or clientUsers changes
    if (selectedCompany && selectedCompany.clientUsers) {
      setarrayOfClients(selectedCompany.clientUsers);
    }
  }, [selectedCompany, arrayOfClients]);

  const handleModalOpen = (value) => {
    setIsModalOpen(value);
  };
  useEffect(() => {
    const domain = selectedCompany?.clientUsers[0]?.emailAddress
      ? selectedCompany.clientUsers[0].emailAddress.split("@")[1]
      : "";
    setEmailDomain(domain);
    fetchCompanyData();
  }, [selectedCompany]); // Dependency array - triggers on change of selectedCompany

  const handleEditCLient = async (id) => {
    try {
      // setIsLoading(true);
      const response = await axios.get(`${serverURL}/client/dashboard/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setSelectedClientDetails(response.data.data);
        setOpen(true);
      }
      setUpdateCLientId(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddClientOpen = () => {
    setOpen(true);

    setSelectedClientDetails([]);
  };
  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(rowId);
  };
  const handleEditDelete = () => {
    setAnchorEl(null);
  };

  const closeModal = () => {
    setIsCompanyDetailsModal(false);
  };

  const editHandle = () => {
    // ClientOnboardingModalFunction(true);
    setClientSelectedModal(true);
  };

  const editClientHandle = async (e, id) => {
    handleEditCLient(id);
  };

  const DeleteHandle = async (e, id) => {
    setAnchorEl(null);

    Swal.fire({
      customClass: {
        container: "my-swal",
      },
      icon: "warning",
      text: "Do you want to delete this client?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${serverURL}/client/delete/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.data.success) {
            const updatedClientUsers = selectedCompany.clientUsers.filter(
              (client) => client._id !== id
            );
            setAnchorEl(null);

            setselectedCompany((prevCompany) => ({
              ...prevCompany,
              clientUsers: updatedClientUsers,
            }));

            // Show success message
            Swal.fire({
              customClass: {
                container: "my-swal",
              },
              icon: "success",
              text: response.data.message,
              padding: "1em",
              color: "green",
            });
          }
        } catch (error) {
          console.error("Error deleting client:", error);

          // Show error message if delete fails
          Swal.fire({
            customClass: {
              container: "my-swal",
            },
            icon: "error",
            text: error.response?.data?.message || "An error occurred",
            color: "black",
          });
        }
      }
    });
  };
  return (
    isCompanyDetailsModal && (
      <div className="p-1 bg-white ">
        <header className=" bg-[var(--light-primary-color)] h-28 flex items-center justify-between   space-x-3 p-2 mt-1 shadow-md">
          <div className="flex items-center justify-center ">
            {/* <div className="w-20 h-20 flex justify-center items-center ml-3">
              <img src="" alt="logo" />
            </div> */}
            <div className="min-w-56  space-y-2 lg:ml-16">
              <h1>{selectedCompany?.organizationDetail?.name}</h1>
              <div className="flex items-center justify-start ">
                <LocationOnOutlinedIcon fontSize="small" />

                <p className="text-[15px] mt-1">
                  {selectedCompany?.organizationDetail?.organizationAddress ||
                    "N/A"}
                </p>
              </div>
              {/* <h2 className="bg-gray-900 rounded-2xl w-20 flex justify-center items-center px-2 py-0 text-sm text-white">
                Supplier
              </h2> */}
            </div>
          </div>
          <div className="mb-14 cursor-pointer" onClick={closeModal}>
            <Cross size="26" fillColor={"red"} />
          </div>
        </header>

        <section className="min-h-[540px] mb-10 bg-gray-100 max-w-[1400px] mx-auto shadow-sm mt-4 rounded-md  lg:h-[570px]   border px-7 py-4 space-y-3 overflow-auto">
          <div className="flex justify-start items-center space-x-2">
            <p className="text-lg text-gray-700 font-semibold">
              Primary Company Details :
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 mt-6">
            <div className="flex items-center justify-center  mb-3">
              <p className="text-sm text-gray-700 font-semibold">
                {selectedCompany.organizationDetail?.name}:
              </p>
            </div>
            <div className="h-[0.5px] bg-[var(--para-color)] w-[900px] mb-3" />
            <div className="mb-4 cursor-pointer " onClick={editHandle}>
              <p className="text-green-700 text-sm">
                <span className="text-xl">+</span> Edit Company Details Details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center w-full">
            <div className="w-full max-w-xs h-30 bg-[var(--secondary-color)]  rounded-md shadow-sm flex flex-col justify-center p-5 items-start space-y-3   ">
              <p>GSTIN :</p>
              <span className="font-semibold " style={{ lineHeight: "1.5rem" }}>
                {selectedCompany.organizationDetail?.gstin}
              </span>
            </div>
            <div className="w-full max-w-xs max-h-30 bg-[var(--secondary-color)] shadow-sm rounded-md flex flex-col justify-center p-5 items-start space-y-3 h-auto">
              <p>Mobile Number :</p>
              <span
                className="font-semibold  "
                style={{ lineHeight: "1.5rem" }}
              >
                {selectedCompany?.clientUsers[0]?.phoneNumber
                  ? selectedCompany.clientUsers[0]?.phoneNumber
                  : "N/A"}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-center items-center gap-2 space-x-2 mt-8">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <p className="text-[16px] text-[var(--heading-color)] font-semibold">
                  Contact Details:
                </p>
              </div>
              <div className="h-[0.5px] bg-[var(--para-color)] w-[950px] mb-3" />
              <div
                className="mb-4 cursor-pointer"
                onClick={handleAddClientOpen}
              >
                <p className="text-green-700 text-sm">
                  <span className="text-xl">+</span> Add Additional Contact
                  Details
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 justify-items-center w-full mt-2 ">
              {arrayOfClients.map((ele, index) => (
                <div
                  key={index}
                  className="w-full relative h-52 rounded-md  bg-[var(--secondary-color)] shadow-sm  flex  flex-col justify-center p-5  items-start space-y-3 transition-all duration-300 hover:scale-105 hover:shadow-gray-500/50"
                >
                  <div className="flex justify-between w-full mb-7">
                    <div className="flex items-center absolute top-4 justify-start space-x-1">
                      <PersonOutlineOutlinedIcon
                        sx={{
                          fontSize: 40,
                          fontWeight: 200,
                          marginLeft: -1,
                          marginRight: 0.5,
                        }}
                      />
                      <div>
                        <p className="font-semibold mt-1 text-[17px]  text-[var(--all-black)]">
                          {ele?.name
                            ? ele.name.charAt(0).toUpperCase() +
                              ele.name.slice(1)
                            : ""}
                        </p>
                        <p className="text-[12px] text-[var(--para-color)]">
                          {ele.roleInOrganization}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <MoreVertIcon
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={(e) => handleClick(e, ele._id)}
                          style={{
                            cursor: "pointer",
                            color: "var(--primary-color)",
                            position: "absolute",
                            right: "10",
                            top: "15",
                          }} // Change cursor style to pointer
                        />
                        <Menu
                          id="simple-menu"
                          anchorEl={anchorEl}
                          // keepMounted
                          open={Boolean(anchorEl) && selectedRowId === ele._id}
                          onClose={handleEditDelete}
                          PaperProps={{
                            style: {
                              maxHeight: "85px", // Adjust max height if needed
                              width: "100px", // Adjust width for smaller menu
                            },
                          }}
                        >
                          <MenuItem
                            onClick={(e) => editClientHandle(e, ele._id)}
                          >
                            <Tooltip title="Edit Client">
                              <Edit size="16" color="var(--primary-color)" />
                            </Tooltip>
                            <p className="ml-2 font-semibold text-[var(--heading-color)]">
                              Edit
                            </p>
                          </MenuItem>
                          <MenuItem onClick={(e) => DeleteHandle(e, ele._id)}>
                            <Tooltip title="Delete Client">
                              <Trash color="var(--error-color)" size="16" />
                            </Tooltip>
                            <p className="ml-2 font-semibold text-[var(--heading-color)]">
                              Delete
                            </p>
                          </MenuItem>
                        </Menu>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-16 flex flex-col space-y-2.5">
                    <span className="font-semibold inline-flex items-center  space-x-2 text-sm break-all">
                      <div className="mr-1">
                        <Mail color="var(--para-color)" />
                      </div>

                      <span className="break-words text-[var(--para-color)]">
                        {ele?.emailAddress}
                      </span>
                    </span>
                    <span className="font-semibold inline-flex items-center space-x-4 gap-2 text-sm text-[var(--para-color)]">
                      <div className="mr-1">
                        <MobileIcons color="var(--para-color)" />
                      </div>
                      {ele?.phoneNumber}
                    </span>

                    <span className="font-semibold inline-flex items-center space-x-1 text-sm">
                      <LocationOnOutlinedIcon
                        fontSize="small"
                        style={{
                          color: "var(--para-color)",
                          marginRight: "7px",
                        }} // Inline style for custom color
                      />
                      <span
                        className="text-[var(--para-color)]"
                        style={{
                          fontSize: "clamp(12px, 2vw, 14px)", // Adjusts size dynamically based on viewport width
                          wordBreak: "break-word", // Ensures long words break to the next line
                          maxWidth: "100%",
                          overflowWrap: "break-word", // Handles large content
                        }}
                      >
                        {ele?.clientAddress}
                      </span>
                    </span>

                    <span className="font-semibold inline-flex items-center space-x-4 gap-2 text-sm text-[var(--para-color)]">
                      <AssociatedBusiness color="var(--para-color) " />
                      {ele?.associatedBrands}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {clientSelectedModal && (
              <ClientOnboardingform
                SelectedCompanyData={fetchCompanyData}
                selectedCompany={selectedCompany}
                setIsCompanyDetailsModal={setIsCompanyDetailsModal}
                // fetchCompanyData={fetchCompanyData}
                setClientSelectedModal={setClientSelectedModal}
                isModalOpen={clientSelectedModal}
                setIsModalOpen={setIsModalOpen}
              />
            )}
            {
              <Modal open={open} onClose={handleClose}>
                <ClientEditAddModal
                  emailDomain={emailDomain}
                  updateClientId={updateClientId}
                  arrayOfClients={arrayOfClients}
                  setarrayOfClients={setarrayOfClients}
                  setselectedCompany={setselectedCompany}
                  setAnchorEl={setAnchorEl}
                  open={open}
                  setOpen={setOpen}
                  organizationId={organizationId}
                  selectedClientDetails={selectedClientDetails}
                  setIsCompanyDetailsModal={setIsCompanyDetailsModal}
                  // isCompanyDetailsModal={isCompanyDetailsModal}
                  selectedCompany={selectedCompany}
                  fetchCompanyData={fetchCompanyData}
                  ClientOnboardingModalFunction={setIsModalOpen}
                />
              </Modal>
            }
          </div>
        </section>
      </div>
    )
  );
};

export default CompanyView;
