import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import {
  Cross,
  LeftArrowDouble,
  RightArrow,
} from "../../../shared/assets/icons";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const VendorModal = ({
  selectedVendorData,
  setIsVendorModalOpen,
  isVendorModalOpen,
  setSelectedVendorData,
}) => {
  // handlers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClose = () => {
    setIsVendorModalOpen(false);
    setSelectedVendorData({});
  };

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleNext = () => {
    if (currentIndex < selectedVendorData?.imagesUploaded.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const vendorDetails = [
    { label: "Owner Name", value: selectedVendorData.ownerName },
    {
      label: "Owner Primary Contact Number",
      value: selectedVendorData.ownerPrimaryContactNo,
    },
    {
      label: "Owner Secondary Phone Number",
      value: selectedVendorData.ownerSecondaryContactNo,
    },
    { label: "Business Name", value: selectedVendorData.vendorBusinessName },
    { label: "Business Address", value: selectedVendorData.address },
    { label: "State", value: selectedVendorData.state },
    { label: "Division", value: selectedVendorData.division },
    { label: "District", value: selectedVendorData.district },
    { label: "Pincode", value: selectedVendorData.pincode },
    { label: "Business Location", value: selectedVendorData.businessLocation },
    { label: "Type of Business", value: selectedVendorData.typeOfBusiness },
    { label: "Website", value: selectedVendorData.website },
    { label: "GSTIN", value: selectedVendorData.GSTIN },
    { label: "Industry", value: selectedVendorData.industry },
    { label: "Reliability", value: selectedVendorData.reliability },
    { label: "Years in Business", value: selectedVendorData.yearsInBusiness },
    {
      label: "Number of Employees",
      value: selectedVendorData.numberOfEmployees,
    },
    {
      label: "Number of Skilled Manpower",
      value: selectedVendorData.numberOfSkilledManpower,
    },
    {
      label: "Number of Unskilled Manpower",
      value: selectedVendorData.numberOfUnskilledManpower,
    },
    {
      label: "Registered in ESIPF",
      value: selectedVendorData.registeredInEsipf,
    },
    { label: "PAN Number", value: selectedVendorData.panNumber },
    {
      label: "Bank Account Number",
      value: selectedVendorData.bankAccountNumber,
    },
    { label: "Bank Name", value: selectedVendorData.bankName },
    { label: "Bank IFSC Code", value: selectedVendorData.bankIfscCode },
    {
      label: "Avg. Turnover in Last 3 Years (in Lakhs)",
      value: selectedVendorData.avgTurnover,
    },
    {
      label: "Production Area (sq. ft)",
      value: selectedVendorData.productionArea,
    },
    { label: "Payment Terms", value: selectedVendorData.paymentTerms },
    {
      label: "Scaling Factors",
      value:
        selectedVendorData.scalingFactors.length > 0
          ? selectedVendorData.scalingFactors.join(", ")
          : "N/A",
    },
    {
      label: "Images Uploaded",
      value:
        selectedVendorData?.imagesUploaded?.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {selectedVendorData?.imagesUploaded?.map((fileUrl, index) => (
              <li
                key={index}
                className="border p-3 my-2 flex items-center flex-col flex-wrap gap-2"
                onClick={() => handleImageClick(index)}
              >
                {fileUrl.endsWith(".mp4") || fileUrl.endsWith(".mov") ? (
                  <video
                    controls
                    className="h-20 w-20 object-cover rounded"
                    src={fileUrl}
                  />
                ) : fileUrl.endsWith(".pdf") ? (
                  <embed
                    src={fileUrl}
                    type="application/pdf"
                    className="h-20 w-20 object-cover rounded"
                    title={`uploaded-${index}`}
                  />
                ) : (
                  <img
                    src={fileUrl}
                    alt={`uploaded-${index}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          "N/A"
        ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <div
          className={`flex  items-center right-0  justify-around min-h-full w-full p-4 backdrop-blur-sm rounded-lg ${
            isModalOpen ? "block" : "hidden"
          } absolute `}
        >
          <button
            className="px-3 py-2 h-10  w-10  text-var(--disabled-color) bg-[var(--heading-color)] rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900"
            disabled={currentIndex === 0} // Disable if on the first image
            onClick={handlePrevious}
          >
            <LeftArrowDouble color="white" size="16" />
          </button>

          <div className="w-[500px] h-[450px] bg-[var(--disabled-color)]  flex justify-center items-center shadow-[0_0_20px_5px_rgba(255,255,255,0.6)]">
            <div className="w-[480px] h-[430px] flex justify-center items-center">
              {selectedVendorData?.imagesUploaded[currentIndex]?.endsWith(
                ".mp4"
              ) ||
              selectedVendorData?.imagesUploaded[currentIndex]?.endsWith(
                ".mov"
              ) ? (
                <video
                  controls
                  className="w-full h-full object-cover"
                  autoPlay
                  src={selectedVendorData?.imagesUploaded[currentIndex]}
                />
              ) : (
                <img
                  src={selectedVendorData?.imagesUploaded[currentIndex]}
                  alt={`preview-${currentIndex}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <div
              className="w-8 h-8  absolute top-5 bg-[var(--disabled-color)] rounded-full flex items-center justify-center"
              onClick={handleCloseModal}
            >
              <Cross color="black" size="30" />
            </div>
            <button
              className="px-3 py-2 h-10  w-10   text-var(--disabled-color) bg-[var(--heading-color)] rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900"
              disabled={
                currentIndex === selectedVendorData?.imagesUploaded?.length - 1
              }
              onClick={handleNext}
            >
              <RightArrow color="white" size="16" />
            </button>
          </div>
        </div>
      </Modal>
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Vendor Details</h2>
          <div onClick={handleClose} className="cursor-pointer">
            <Cross />
          </div>
        </div>

        <hr
          className="my-4 mx-4 ml-0"
          style={{ border: "1px solid var(--disabled-color)" }}
        />

        <div className="overflow-auto max-h-96">
          <table className="table-auto border-collapse w-full">
            <tbody>
              {vendorDetails.map((item, index) => (
                <tr key={index}>
                  <td
                    className="border px-4 py-2"
                    style={{ color: "var(--heading-color)", width: "50%" }}
                  >
                    {item.label}
                  </td>
                  <td
                    className="border px-4 py-2"
                    style={{ color: "var(--para-color)", width: "50%" }}
                  >
                    {item.value || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorModal;
