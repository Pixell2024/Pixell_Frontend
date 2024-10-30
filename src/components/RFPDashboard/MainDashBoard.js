import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./MainSidebar";
import Header from "./MainHeader";
import { useEffect, useState } from "react";
import ProductTourCard from "./ProductTourCard";
import SideContent from "./DashBoardContent";
import Campaigns from "./Campaigns";
import AccountSetup from "./AccountSetting/AccountSetup";
import { Routes, Route, useNavigate } from "react-router-dom";
import RFPModal from "../../shared/createForms/RFPModal";
import TeamMembers from "../ClientDashboard/TeamMember/TeamMembers";
import MainCampaign from "./CampaignDetails/MainCampaign";

const MainDashBoard = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isClientOnBoarded, setIsClientOnboarded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("isClientOnBoarded") == "false") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutsideSidebar = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex md:h-screen relative bg-white z-0">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toggleSidebar={toggleSidebar}
        className="fixed h-full"
      />

      <div
        className={`flex-grow flex flex-col  `}
        onClick={handleClickOutsideSidebar}
      >
        <div className="max-w-full ml-[86px]  md:ml-0">
          <Header isOpen={isOpen} />
        </div>
        {isModalOpen ? (
          <div className="absolute inset-0 backdrop-blur-sm z-50">
            <ProductTourCard
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
            />
          </div>
        ) : (
          <div className="absolute  z-50">
            <ProductTourCard
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
            />
          </div>
        )}

        <div className=" ml-[86px] md:ml-0 h-full py-4 bg-[var(--dashboard-bg-color)] p-2 overflow-y-auto">
          <Routes>
            <Route path="dashboard" element={<SideContent />} />
            <Route path="RFP" element={<Campaigns />} />
            <Route path="account" element={<AccountSetup />} />
            <Route
              path="createRFP"
              element={<RFPModal selectedCampaign={null} />}
            />
            <Route
              path="editRFP/:id"
              element={<RFPModal selectedCampaign={selectedCampaign} />}
            />
            <Route path="Users" element={<TeamMembers />} />
            <Route path="Campaign" element={<MainCampaign />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MainDashBoard;
