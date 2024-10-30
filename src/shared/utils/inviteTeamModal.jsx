import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";

const InviteTeamModal = ({
  open,
  inviteType,
  setOpenModal,
  fetchTeamMembers,
  isorganizationId,
}) => {
  const [email, setEmail] = useState("");
  const [AdminDataPost, setAdminDataPost] = useState({
    adminEmail: [],
    organizationId: isorganizationId,
    userRoleId: 2,
  });
  const [MemberDataPost, setMemberDataPost] = useState({
    memberEmail: [],
    organizationId: isorganizationId,
    userRoleId: 3,
  });
  const [Domain, setDomain] = useState("");

  useEffect(() => {
    const emailDomain = localStorage.getItem("email");
    const DomainCheck = emailDomain.split("@")[1];
    setDomain(DomainCheck);
  }, []);

  useEffect(() => {
    setAdminDataPost((prev) => ({
      ...prev,
      adminEmail: AdminDataPost.adminEmail,
    }));
  }, [AdminDataPost.adminEmail]);

  const serverURL = process.env.REACT_APP_URL;

  const allowedDomain = Domain;
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isDomainAllowed = (email) => {
    const domain = email.split("@")[1];
    return domain === allowedDomain;
  };

  const handleAddEmail = () => {
    if (isValidEmail(email)) {
      if (!isDomainAllowed(email)) {
        Swal.fire({
          customClass: {
            container: "my-swal",
          },
          icon: "error",
          text: "Use Business Domain",
          color: "black",
        });
        return;
      }

      if (inviteType === "Admin" && !AdminDataPost.adminEmail.includes(email)) {
        setAdminDataPost((prev) => ({
          ...prev,
          adminEmail: [...prev.adminEmail, email],
        }));
      } else if (
        inviteType === "Member" &&
        !MemberDataPost.memberEmail.includes(email)
      ) {
        setMemberDataPost((prev) => ({
          ...prev,
          memberEmail: [...prev.memberEmail, email],
        }));
      } else {
        alert("This email has already been added.");
      }
      setEmail("");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleDeleteEmail = (emailToDelete) => {
    if (inviteType === "Admin") {
      setAdminDataPost((prev) => ({
        ...prev,
        adminEmail: prev.adminEmail.filter((e) => e !== emailToDelete),
      }));
    } else if (inviteType === "Member") {
      setMemberDataPost((prev) => ({
        ...prev,
        memberEmail: prev.memberEmail.filter((e) => e !== emailToDelete),
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };
  const handleClose = () => {
    setOpenModal(false);
    setAdminDataPost((prev) => ({
      ...prev,
      adminEmail: [],
    }));
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSendInvite = async () => {
    if (inviteType === "Admin") {
      try {
        const token = localStorage.getItem("token");

        // Check if token exists
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await axios.post(
          `${serverURL}/client/create`, // URL
          AdminDataPost, // Data to send
          {
            // Config object
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchTeamMembers();
      } catch (err) {
        console.log(err);
      }

      setAdminDataPost((prev) => ({
        ...prev,
        adminEmail: [],
      }));
      // Clear the Admin email list
    } else if (inviteType === "Member") {
      try {
        const token = localStorage.getItem("token");

        // Check if token exists
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await axios.post(
          `${serverURL}/client/create`, // URL
          MemberDataPost, // Data to send
          {
            // Config object
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchTeamMembers();
      } catch (err) {
        console.log(err);
      }

      setAdminDataPost((prev) => ({
        ...prev,
        adminEmail: [],
      }));
      setMemberDataPost((prev) => ({
        ...prev,
        memberEmail: [],
      }));
      // setMemberEmails([]); // Clear the Member email list
    }
    handleCloseModal();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Invite {inviteType === "Admin" ? "Admins" : "Members"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <TextField
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Box mt={2}>
          {inviteType === "Admin" &&
            AdminDataPost.adminEmail.map((adminEmail) => (
              <Chip
                key={adminEmail}
                label={adminEmail}
                onDelete={() => handleDeleteEmail(adminEmail)}
                color="primary"
                sx={{ margin: "4px" }}
              />
            ))}
          {inviteType === "Member" &&
            MemberDataPost.memberEmail.map((memberEmail) => (
              <Chip
                key={memberEmail}
                label={memberEmail}
                color="primary"
                onDelete={() => handleDeleteEmail(memberEmail)}
                sx={{ margin: "4px" }}
              />
            ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSendInvite} color="primary">
          Send Invite
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteTeamModal;
