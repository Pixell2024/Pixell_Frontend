import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./sidebarClient.css";
import {
  Database,
  DoubleArrowDown,
  Logout,
  Music,
  Setting,
  Support,
  Users,
  VideoIcon,
  Volume,
} from "../../shared/assets/icons";
import img1 from "../../shared/assets/icons/aston_martin_icon.jpeg.png";
const Sidebar = ({ isOpen, toggleSidebar, setIsOpen }) => {
  const ulRef = useRef(null);
  const navigate = useNavigate();

  const [isArrow, setIsArrow] = useState(true);
  const location = useLocation();
  const activeMenu = location.pathname.split("/").pop();

  const scrollToLastItem = () => {
    if (ulRef.current) {
      const lastItem = ulRef.current.lastElementChild;
      lastItem?.scrollIntoView({ behavior: "smooth", block: "end" });

      // Check if the element has scrolled to the bottom
      const { scrollTop, scrollHeight, clientHeight } = ulRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        setIsArrow(false); // Hide the arrow immediately after scrolling to the bottom
      }
    }
  };
  const handleScroll = () => {
    if (ulRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = ulRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 1) {
        setIsArrow(false);
      } else {
        setIsArrow(true);
      }
    }
  };

  useEffect(() => {
    const ulElement = ulRef.current;
    if (ulElement) {
      ulElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (ulElement) {
        ulElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      className={`bg-white text-black h-full fixed flex flex-col justify-between   shadow-xl ${
        isOpen ? "w-64 flex justify-between" : "w-20"
      } transition-all duration-300  sm:relative z-20 ${
        isOpen ? "sm:absolute sm:top-0 sm:left-0" : ""
      }`}
    >
      <div className="p-4 flex flex-col justify-between items-center">
        <div className="flex justify-evenly  items-center   ">
          <h2
            className={`text-xl font-bold mr-28 ${isOpen ? "block" : "hidden"}`}
          >
            Tools
          </h2>

          <button
            onClick={toggleSidebar}
            className="focus:outline-none h-10 w-10 "
          >
            {isOpen ? (
              <FaTimes className="h-6 w-6 ml-8 " />
            ) : (
              <img src={img1} alt="logo" className="h-10 w-10" />
            )}
          </button>
        </div>
        <div className={`h-80`}>
          {/* ----------------------------------------------------------------------------------------------------------- */}
          <ul
            ref={ulRef}
            className={`mt-8 border-b-2 overflow-y-scroll max-h-full scrollBarHide space-y-3  `}
          >
            <Tooltip title="Dashboard" placement="right-start" arrow={true}>
              <Link to="dashboard">
                <li
                  className={`py-2 px-4 flex items-center cursor-pointer my-2 ${
                    activeMenu === "dashboard"
                      ? "bg-[var(--bg-color)]  rounded-md "
                      : ""
                  }`}
                >
                  <Database
                    color={
                      activeMenu === "dashboard"
                        ? "var(--primary-color)"
                        : "grey"
                    }
                    className="ml-3"
                  />{" "}
                  <span
                    className={` ml-3  mr-20  ${isOpen ? "block" : "hidden"}  ${
                      activeMenu === "dashboard"
                        ? `text-[var(--primary-color)]`
                        : `text-[var(--para-color)] `
                    }`}
                  >
                    {" "}
                    Campaigns
                  </span>
                </li>
              </Link>
            </Tooltip>
            <Tooltip title="RFPs" placement="right-start" arrow={true}>
              <Link to="RFP">
                <li
                  className={`py-2 px-4 flex items-center cursor-pointer my-2 ${
                    activeMenu === "RFP"
                      ? "bg-[var(--bg-color)]  rounded-md "
                      : ""
                  }`}
                >
                  <VideoIcon
                    color={
                      activeMenu === "RFP" ? "var(--primary-color)" : "grey"
                    }
                    className="mr-3"
                  />
                  <span
                    className={` ml-3  mr-20  ${isOpen ? "block" : "hidden"}  ${
                      activeMenu === "RFP"
                        ? `text-[var(--primary-color)]`
                        : `text-[var(--para-color)] `
                    }`}
                  >
                    RFP
                  </span>
                </li>
              </Link>
            </Tooltip>
            <Tooltip title="Campaign" placement="right-start" arrow={true}>
              <Link to="Campaign">
                <li
                  className={`py-2 px-4 flex items-center cursor-pointer my-2 ${
                    activeMenu === "Campaign"
                      ? "bg-[var(--bg-color)]  rounded-md "
                      : ""
                  }`}
                >
                  <Volume
                    color={
                      activeMenu === "Campaign"
                        ? "var(--primary-color)"
                        : "grey"
                    }
                    className="mr-3"
                  />
                  <span
                    className={` ml-3  mr-20  ${isOpen ? "block" : "hidden"}  ${
                      activeMenu === "Campaign"
                        ? `text-[var(--primary-color)]`
                        : `text-[var(--para-color)] `
                    }`}
                  >
                    Campaign
                  </span>
                </li>
              </Link>
            </Tooltip>

            <Tooltip title="Users">
              <Link to="Users">
                <li
                  className={`py-2 px-4 flex items-center cursor-pointer my-2 ${
                    activeMenu === "Users" ? "bg-blue-100  rounded-md " : ""
                  }`}
                >
                  <Users
                    color={activeMenu === "Users" ? "#418cff" : "grey"}
                    className="mr-3"
                  />
                  <span
                    className={` ml-3  mr-20  ${isOpen ? "block" : "hidden"}  ${
                      activeMenu === "Users"
                        ? `text-[var(--primary-color)]`
                        : `text-[var(--para-color)] `
                    }`}
                  >
                    Users
                  </span>
                </li>
              </Link>
            </Tooltip>
          </ul>
          <div
            className={` mt-2 ${isArrow ? "block" : "hidden"}
            ${isOpen ? "ml-24" : "ml-3.5 mt-2"}`}
            onClick={scrollToLastItem}
            title="Scroll Down"
          >
            <DoubleArrowDown size="22" />
          </div>
        </div>
      </div>

      <ul className="mb-4 flex flex-col justify-center items-center">
        <Tooltip title="Account Setting" placement="right-start" arrow={true}>
          <Link to="account">
            <li
              className={`py-2 px-4 flex items-center cursor-pointer ${
                activeMenu === "account"
                  ? "bg-[var(--bg-color)]  rounded-md "
                  : ""
              }`}
            >
              <Setting
                color={
                  activeMenu === "account" ? "var(--primary-color)" : "grey"
                }
              />
              <span
                className={` ml-3  mr-20  ${isOpen ? "block" : "hidden"}  ${
                  activeMenu === "account"
                    ? `text-[var(--primary-color)]`
                    : `text-[var(--para-color)] `
                }`}
              >
                {" "}
                Setting
              </span>
            </li>
          </Link>
        </Tooltip>
        {/* <Link to="">
          <li
            className={`py-2 px-4 flex items-center cursor-pointer ${activeMenu === "vendor" ? "bg-gray-900" : ""
              }`}
          >
            <Support color="grey" />
            <span
              className={` ml-3  mr-20  ${isOpen ? "block" : "hidden"}  ${
                activeMenu === "support"
                  ? `text-[var(--primary-color)]`
                  : `text-[var(--para-color)] `
              }`}
            >
              Support
            </span>
          </li>
        </Link> */}
        <Tooltip title="Logout" placement="right-start" arrow={true}>
          <li
            className={`py-2 px-4 flex text-sm items-center cursor-pointer ${
              activeMenu === "vendor" ? "bg-gray-900" : ""
            }`}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("email");
              localStorage.removeItem("isClientOnBoarded");
              navigate("/user");
            }}
          >
            <Logout color="grey" />
            <span
              className={` ml-3  mr-20  ${isOpen ? "block" : "hidden"}  ${
                activeMenu === "Logout"
                  ? `text-[var(--primary-color)]`
                  : `text-[var(--para-color)] `
              }`}
            >
              Logout
            </span>
          </li>
        </Tooltip>
      </ul>
    </div>
  );
};

export default Sidebar;
