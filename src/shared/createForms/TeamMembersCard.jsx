import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Avatar from "../utils/Avatar";

import Trash from "../assets/icons/Trash";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { FiMail, FiPhone, FiBriefcase, FiSearch } from "react-icons/fi";

const TeamMembersCard = ({
  admin,
  onDelete,
  members,
  setAnchorEl,
  anchorEl,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(admin);
    setIsMenuOpen(false);
  };
  const handleIconClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };
  const handleIconOpen = (e, admin) => {
    e.preventDefault();
    setSelectedId(admin._id);
    setAnchorEl(e.currentTarget);
  };

  return (
    <div className="bg-[var(--secondary-color)] shadow-md rounded-lg p-4 border border-[var(--para-color:)] flex flex-col items-start justify-start h-full w-full">
      <div className="flex items-center justify-between mb-2 relative  w-full">
        <div className="flex gap-2">
          <Avatar name={admin.name} color="navy" />
          <div className="flex flex-col">
            <h3 className="flex items-center text-sm font-medium sm:gap-4 whitespace-nowrap">
              {admin.name}{" "}
              {admin.userRoleId === 1 && (
                <span className="text-xs text-[var(--primary-color)] border p-1 rounded-2xl bg-[var(--light-info)]  absolute right-0">
                  Super Admin
                </span>
              )}
              {/* {admin.userRoleId === 2 && (
                <span className="text-xs text-[var(--primary-color)] border p-1 rounded-2xl bg-[var(--light-info)]">
                  Admin
                </span>
              )} */}
            </h3>
            <div className="flex-col text-xs text-gray-500">
              {admin.roleInOrganization || "No role specified"}
            </div>
          </div>
        </div>
        <div className="flex justify-end absolute right-[-1rem]">
          <div className="flex items-center space-x-2">
            {admin.userRoleId === 2 && (
              <span className="text-xs text-[var(--primary-color)] border p-1 rounded-2xl bg-[var(--light-info)]">
                Admin
              </span>
            )}
          </div>

          {(admin.userRoleId === 3 || admin.userRoleId === 2) && (
            <div key={admin._id}>
              <Tooltip title="Click">
                <IconButton onClick={(e) => handleIconOpen(e, admin)}>
                  <MoreVertIcon
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    style={{
                      cursor: "pointer",
                      color: "var(--primary-color)",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && selectedId === admin._id}
                onClose={handleIconClose}
                keepMounted
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <MenuItem onClick={handleDelete}>
                  <Trash style={{ color: "var(--para-color)" }} />
                  <p
                    className="ml-2 font-semibold"
                    style={{ color: "var(--heading-color)" }}
                  >
                    Delete
                  </p>
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>

        <div className="flex">
          {(admin.adminType === "Super Admin" ||
            admin.adminType === "Admin") && (
            <>
              <span className="px-2 py-1 text-xs rounded-lg ml-2 mb-4 whitespace-nowrap text-[var(--primary-color)]">
                {admin.adminType}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="w-full mt-1 space-y-1">
        <div
          className="flex items-center text-sm bg-[var(--secondary-color)] rounded-lg p-2 border border-customGray"
          style={{ color: "var(--para-color)" }}
        >
          <FiMail className="w-5 h-5 mr-2 text-[var(--para-color)]" />
          <span>{admin.emailAddress}</span>
        </div>

        {admin?.phoneNumber && (
          <div className="flex items-center text-sm bg-[var(--secondary-color)] border border-customGray rounded-lg p-2 text-[var(--para-color)]">
            <FiPhone
              className="w-5 h-5 mr-2 text-[var(--primary-color)]"
              style={{ color: "var(--para-color)" }}
            />
            <span>{admin.phoneNumber}</span>
          </div>
        )}
        {admin?.phoneNumber && (
          <div className="flex items-center text-sm bg-[var(--secondary-color)] border border-customGray rounded-lg p-2 text-[var(--para-color)]">
            <FiBriefcase className="w-5 h-5 mr-2 text-[var(--para-color)]" />
            <span>Campaigns done: {admin.campaignsDone}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembersCard;
