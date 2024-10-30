import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { BellAlert, PlusIcon } from "../../shared/assets/icons";
import img1 from "../../shared/assets/icons/image 12.png";

import { useState } from "react";
import { FiMenu } from "react-icons/fi"; // Importing the burger menu icon
import RFPModal from "../../shared/createForms/RFPModal";
import { Box, Modal } from "@mui/material";

const Header = ({ isOpen }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const Email = localStorage.getItem("email");
    if (Email) {
      setEmail(Email);
      const DisplayName = Email.split("@")[0]; // Get the part before the '@'
      const formattedName =
        DisplayName.charAt(0).toUpperCase() + DisplayName.slice(1);

      setName(formattedName);
    }
  }, []); // Empty dependency array means this runs only once when the component mounts

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rfpModalOpen, setRfpModalOpen] = useState(false);

  // Toggle the visibility of the small screen menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openModalRfp = () => {
    setRfpModalOpen(true);
  };

  const GenerateRFPForm = () => {
    navigate("/user/createRFP");
    <RFPModal selectedCampaign={null}></RFPModal>;
  };

  return (
    <div
      className={`flex justify-between items-center text-black p-2 ml-2  border-b-2 bg-[var(--dashboard-bg-color)] z-30`}
    >
      {/* First Div with User Info */}
      <div className="firstDiv flex items-center">
        <div className="m-2" style={{ width: "43px", height: "43px" }}>
          <img src={img1} alt="User" className="w-full h-full" />
        </div>
        <div className="font-semi text-lg ml-2">
          <h1>
            Hey ! <span className="text-black font-semibold"> {name}</span>
          </h1>
          <h3 className="text-sm text-gray-500">{email}</h3>
        </div>
      </div>

      {/* Second Div with Buttons */}
      <div className="secondDiv  space-x-5 items-center mx-5 hidden md:flex">
        <button
          className="btn flex items-center gap-2 rounded-lg shadow-lg text-white px-4 py-2 bg-[var(--primary-color)]"
          onClick={GenerateRFPForm}
        >
          <PlusIcon color="white" size="14px" /> Generate RFP
        </button>
        <div className="text-gray-400 flex items-center justify-center bg-slate-100 relative h-10 w-10 rounded-full shadow-2xl">
          <BellAlert color="#6b7280" />
          <div className="h-2.5 w-2.5 rounded-full bg-[var(--primary-color)] absolute top-0 right-0"></div>
        </div>
      </div>

      {/* Burger Icon for Small Screens */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center p-2 bg-white shadow-md rounded-full sm:block md:hidden"
      >
        <FiMenu className="text-2xl" />
      </button>

      {/* Responsive Menu */}
      {isMenuOpen && (
        <div className="fixed top-16 right-4 bg-white shadow-md rounded-md p-4 flex flex-col space-y-3 items-center space-x-2 z-40 md:hidden">
          <BellAlert className="text-red-500 text-xl" />
          <button
            className="btn flex items-center gap-2 rounded-lg shadow-lg text-white px-4 py-2 bg-blue-500"
            onClick={GenerateRFPForm}
          >
            <PlusIcon color="white" size="14px" /> Generate RFP
          </button>
        </div>
      )}

      {
        <Modal
          open={rfpModalOpen}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="relative"
        >
          <Box className="h-full w-full bg-white">
            <RFPModal
              setRfpModalOpen={GenerateRFPForm}
              rfpModalOpen={rfpModalOpen}
            />
          </Box>
        </Modal>
      }
    </div>
  );
};

export default Header;
