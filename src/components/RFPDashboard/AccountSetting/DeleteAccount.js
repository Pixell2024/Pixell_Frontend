import React from "react";
import { Grid, Button } from "@mui/material";
import styles from "./Account.module.css"; // Custom CSS for additional styling
import Swal from "sweetalert2";

const DeleteAccount = ({ onTransferAccount }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    Swal.fire({
      html: "First you have to transfer this account to Admin or Team Member!",
      showCancelButton: true,
      confirmButtonText: "Transfer Account",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        onTransferAccount(); // Call the function to change the tab to Transfer Rights
      }
    });
  };
  return (
    <div className={styles.notificationsContainer}>
      <h2 className={styles.heading}>DELETE ACCOUNT</h2>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={styles.description}>
            This will completely remove the organisation data from our server
            after the confirmation of admin(s). You can still recover account
            within 60 days after confirming the account deletion just by logging
            in.
          </p>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} className="text-right">
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete Account
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default DeleteAccount;
