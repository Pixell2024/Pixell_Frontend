import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserCog } from "react-icons/fa";
import { IpIcon, Users, VendorIcon } from "../../shared/assets/icons";
import Client from "../../shared/assets/icons/Client";
import { IconButton, Tooltip } from "@mui/material";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const activeMenu = location.pathname.split("/").pop();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        className={`bg-gray-950 text-white fixed h-full z-50
          ${isOpen ? "w-64" : "w-20"}
          transition-all duration-300`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className={`text-xl font-bold ${isOpen ? "block" : "hidden"}`}>
            Admin
          </h2>
          <button onClick={toggleSidebar} className="focus:outline-none">
            {isOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
        <ul className="mt-4 space-y-4 ">
          <Link to="/adminportal/vendorDetails">
            <li
              className={`py-2 px-4 flex items-center cursor-pointer mb-3  ${
                activeMenu === "vendorDetails"
                  ? "bg-[var(--heading-color)]"
                  : ""
              }`}
            >
              <Tooltip title="Vendor">
                <IconButton>
                  <VendorIcon color="white" size="25" />
                </IconButton>
              </Tooltip>

              {/* <FaUserCog className="mr-3" size="21" /> */}
              <span className={`${isOpen ? "block" : "hidden"} ml-3`}>
                Vendor Details
              </span>
            </li>
          </Link>
          <Link to="/adminportal/clientDetails">
            <li
              className={`py-2 px-4 flex items-center cursor-pointer mb-3 ${
                activeMenu === "clientDetails"
                  ? "bg-[var(--heading-color)]"
                  : ""
              }`}
            >
              <Tooltip title="Client">
                <IconButton>
                  <Client color="white" size="25" />
                </IconButton>
              </Tooltip>
              {/* <Users
                fillColor="var(--primary-color)"
                className="mr-3"
                size="21"
                color="var(--primary-color)"
              /> */}
              <span className={`${isOpen ? "block" : "hidden"} ml-3`}>
                Client Details
              </span>
            </li>
          </Link>

          <Link to="/adminportal/installation-partner">
            <li
              className={`py-2 px-4 flex items-center cursor-pointer mb-3 ${
                activeMenu === "installation-partner"
                  ? "bg-[var(--heading-color)]"
                  : ""
              }`}
            >
              <Tooltip title="Installation Partner">
                <IconButton>
                  <IpIcon color="white" size="25" />
                </IconButton>
              </Tooltip>
              {/* <Users
                fillColor="var(--primary-color)"
                className="mr-3"
                size="21"
                color="var(--primary-color)"
              /> */}
              <span className={`${isOpen ? "block" : "hidden"} ml-3`}>
                IP Details
              </span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
