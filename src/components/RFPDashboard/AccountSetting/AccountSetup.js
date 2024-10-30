import React, { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import styles from "./Account.module.css"; // Import the CSS module
import Profile from "./Profile";
import Organisation from "./Organisation";
import Notification from "./Notification";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TransferRight from "./TransferRight";
import DeleteAccount from "./DeleteAccount";
const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("Profile"); // Default tab

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <Profile />;
      case "Organisation":
        return <Organisation />;
      // case "Notification":
      //   return <Notification />;
      case "Rights":
        return <TransferRight />;
      case "Delete":
        return (
          <DeleteAccount onTransferAccount={() => handleTabChange("Rights")} />
        );
      default:
        return <Profile />;
    }
  };

  return (
    <Box className={styles.root}>
      <h1 className="mb-4">Account Setting</h1>
      {/* Header Section */}
      <Box className={styles.header}>
        <img
          src="/assests/clientdashboard/accountsetting/account-img-icon.png" // Replace with your actual profile image
          alt="Profile"
          className={styles.profileImage}
        />
      </Box>

      {/* Scrollable Form Section */}
      <Box className={`shadow-lg ${styles.accountFormContainer}`}>
        <div className="flex justify-between items-center bg-[var(--secondary-color)]">
          <Stack className={styles.buttonContainer} direction="row" spacing={1}>
            <Chip
              label="Profile"
              style={{
                background:
                  activeTab === "Profile"
                    ? "var(--heading-color)"
                    : "var(--empty-color)",
                color:
                  activeTab === "Profile"
                    ? "var(--secondary-color)"
                    : "var(--heading-color)",
              }}
              onClick={() => setActiveTab("Profile")}
            />
            <Chip
              label="Organisation"
              style={{
                background:
                  activeTab === "Organisation"
                    ? "var(--heading-color)"
                    : "var(--empty-color)",
                color:
                  activeTab === "Organisation"
                    ? "var(--secondary-color)"
                    : "var(--heading-color)",
              }}
              onClick={() => setActiveTab("Organisation")}
            />
            {/* <Chip
              label="Notification"
              style={{
                background:
                  activeTab === "Notification"
                    ? "var(--heading-color)"
                    : "var(--empty-color)",
                color:
                  activeTab === "Notification"
                    ? "var(--secondary-color)"
                    : "var(--heading-color)",
              }}
              onClick={() => setActiveTab("Notification")}
            /> */}
            <Chip
              label="Transfer Rights"
              style={{
                background:
                  activeTab === "Rights"
                    ? "var(--heading-color)"
                    : "var(--empty-color)",
                color:
                  activeTab === "Rights"
                    ? "var(--secondary-color)"
                    : "var(--heading-color)",
              }}
              onClick={() => setActiveTab("Rights")}
            />
            <Chip
              label="Delete Account"
              style={{
                background:
                  activeTab === "Delete"
                    ? "var(--heading-color)"
                    : "var(--empty-color)",
                color:
                  activeTab === "Delete"
                    ? "var(--secondary-color)"
                    : "var(--heading-color)",
              }}
              onClick={() => setActiveTab("Delete")}
            />
          </Stack>
          <Stack className={styles.buttonContainer} direction="row" spacing={1}>
            <Chip
              label="Super Admin"
              style={{
                background: "var(--primary-color)",
                color: "var(--secondary-color)",
              }}
            />
          </Stack>
        </div>
        <hr className="mx-2"></hr>
        {/* Render the active component based on selected tab */}
        <div className="bg-[var(--secondary-color)]">{renderContent()}</div>
      </Box>
    </Box>
  );
};

export default AccountSettings;
