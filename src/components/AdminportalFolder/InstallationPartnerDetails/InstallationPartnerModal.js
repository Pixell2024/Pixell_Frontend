import React, { useState } from "react";
import {
  Cross,
  LeftArrowDouble,
  RightArrow,
} from "../../../shared/assets/icons";
import Modal from "@mui/material/Modal";

const InstallationPartnerModal = ({
  selectedInstallationPartnerData,
  setIsInstallationPartnerModalOpen,
  setSelectedInstallationPartnerData
}) => {
  // handlers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClose = () => {
    setIsInstallationPartnerModalOpen(false);
  };

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInstallationPartnerData({})
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  // const handleNext = () => {
  //   if (currentIndex < selectedInstallationPartnerData?.imagesUploaded.length - 1) {
  //     setCurrentIndex(currentIndex + 1);
  //   }
  // };
  const InstallationPartnerDetails = [
    { label: 'Name', value: selectedInstallationPartnerData.name },
    { label: 'Gender', value: selectedInstallationPartnerData.gender },
    { label: 'Date of Birth', value: selectedInstallationPartnerData.dateofBirth },
    { label: 'Address', value: selectedInstallationPartnerData.address },
    { label: 'Experience', value: selectedInstallationPartnerData.experience },
    { label: 'Prior Knowledge of Installation', value: selectedInstallationPartnerData.priorKnowledgeOfInstallation?"Yes":"No" },
    { label: 'Phone Number', value: selectedInstallationPartnerData.phoneNumber },
    { label: 'Email', value: selectedInstallationPartnerData.emailAddress },
    { label: 'State', value: selectedInstallationPartnerData.state },
    { label: 'City', value: selectedInstallationPartnerData.city },
    { label: 'Zip Code', value: selectedInstallationPartnerData.zipCode },
    { label: 'Is Test Passed', value: selectedInstallationPartnerData.isTestPassed?"Yes":"No" },
    { label: 'IFSC Code', value: selectedInstallationPartnerData.bankDetails.IFSC },
    { label: 'Bank Name', value: selectedInstallationPartnerData.bankDetails.bankName },
    { label: 'Bank Holder Name', value: selectedInstallationPartnerData.bankDetails.bankHolderName },
    { label: 'Account Number', value: selectedInstallationPartnerData.bankDetails.bankHolderName },
    { label: 'Pan Number', value: selectedInstallationPartnerData.bankDetails.panNumber },
    { label: 'AadhaarCard Number', value: selectedInstallationPartnerData.aadhaarCardNumber },
    // {
    //   label: 'Images Uploaded',
    //   value: selectedInstallationPartnerData?.imagesUploaded?.length > 0 ? (
    //     <ul className="flex flex-wrap gap-2">
    //       {selectedInstallationPartnerData?.imagesUploaded?.map((fileUrl, index) => (
    //         <li
    //           key={index}
    //           className="border p-3 my-2 flex items-center flex-col flex-wrap gap-2"
    //           onClick={() => handleImageClick(index)}
    //         >
    //           {fileUrl.endsWith(".mp4") || fileUrl.endsWith(".mov") ? (
    //             <video
    //               controls
    //               className="h-20 w-20 object-cover rounded"
    //               src={fileUrl}
    //             />
    //           ) : fileUrl.endsWith(".pdf") ? (
    //             <embed
    //               src={fileUrl}
    //               type="application/pdf"
    //               className="h-20 w-20 object-cover rounded"
    //               title={`uploaded-${index}`}
    //             />
    //           ) : (
    //             <img
    //               src={fileUrl}
    //               alt={`uploaded-${index}`}
    //               className="h-20 w-20 object-cover rounded"
    //             />
    //           )}
    //         </li>
    //       ))}
    //     </ul>
    //   ) : "N/A"
    // }
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
          className={`flex  items-center right-0  justify-around min-h-full w-full p-4 backdrop-blur-sm rounded-lg ${isModalOpen ? "block" : "hidden"
            } absolute `}
        >
          <button
            className="px-3 py-2 h-10  w-10  text-var(--disabled-color) bg-[var(--heading-color)] rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900"
            disabled={currentIndex === 0} // Disable if on the first image
            onClick={handlePrevious}
          >
            <LeftArrowDouble color="white" size="16" />
          </button>

          {/* <div className="w-[500px] h-[450px] bg-[var(--disabled-color)]  flex justify-center items-center shadow-[0_0_20px_5px_rgba(255,255,255,0.6)]">
            <div className="w-[480px] h-[430px] flex justify-center items-center">
              {selectedInstallationPartnerData?.imagesUploaded[currentIndex]?.endsWith(
                ".mp4"
              ) ||
                selectedInstallationPartnerData?.imagesUploaded[currentIndex]?.endsWith(
                  ".mov"
                ) ? (
                <video
                  controls
                  className="w-full h-full object-cover"
                  autoPlay
                  src={selectedInstallationPartnerData?.imagesUploaded[currentIndex]}
                />
              ) : (
                <img
                  src={selectedInstallationPartnerData?.imagesUploaded[currentIndex]}
                  alt={`preview-${currentIndex}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div> */}

          <div>
            <div
              className="w-8 h-8  absolute top-5 bg-[var(--disabled-color)] rounded-full flex items-center justify-center"
              onClick={handleCloseModal}
            >
              <Cross color="black" size="30" />
            </div>
            {/* <button
              className="px-3 py-2 h-10  w-10   text-var(--disabled-color) bg-[var(--heading-color)] rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900"
              disabled={
                currentIndex === selectedInstallationPartnerData?.imagesUploaded?.length - 1
              }
              onClick={handleNext}
            >
              <RightArrow color="white" size="16" />
            </button> */}
          </div>
        </div>
      </Modal>
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">InstallationPartner Details</h2>
          <div onClick={handleClose} className="cursor-pointer">
            <Cross />
          </div>
        </div>

        <hr className="my-4 mx-4 ml-0" style={{ border: "1px solid var(--disabled-color)" }} />

        <div className="overflow-auto max-h-96">
          <table className="table-auto border-collapse w-full">
            <tbody>
              {InstallationPartnerDetails.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2" style={{ color: "var(--heading-color)", width: "50%" }}>
                    {item.label}
                  </td>
                  <td className="border px-4 py-2" style={{ color: "var(--para-color)", width: "50%" }}>
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

export default InstallationPartnerModal;






