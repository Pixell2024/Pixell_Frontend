import React from "react";
import { Grid, Switch, Typography } from "@mui/material";
import styles from "./Account.module.css"; // Custom CSS for additional styling

const Notifications = () => {
  // Manage state for each switch individually
  const [mailSettings, setMailSettings] = React.useState({
    phaseUpdates: true,
    approvals: false,
    rfpChanges: true,
  });

  const [pushSettings, setPushSettings] = React.useState({
    phaseUpdates: false,
    approvals: true,
    rfpChanges: false,
  });

  // Handler function for Mail switches
  const handleMailChange = (setting) => {
    setMailSettings((prevState) => ({
      ...prevState,
      [setting]: !prevState[setting],
    }));
  };

  // Handler function for Push Notifications switches
  const handlePushChange = (setting) => {
    setPushSettings((prevState) => ({
      ...prevState,
      [setting]: !prevState[setting],
    }));
  };

  return (
    <div className={styles.notificationsContainer}>
      <h2 className={styles.heading}>NOTIFICATIONS</h2>
      <div className={styles.section}>
        <Typography variant="body2" className={styles.description}>
          Manage your campaign notification medium. These will only apply to
          those in which you are campaign owner.
        </Typography>
      </div>
      <div className={styles.section}>
        <Typography variant="h6" className={styles.subheading}>
          Mail
        </Typography>
        <Grid container spacing={2} className={styles.notificationItem}>
          <Grid item xs={6}>
            Phase Updates
          </Grid>
          <Grid item xs={6} className={styles.switchContainer}>
            <Switch
              checked={mailSettings.phaseUpdates}
              onChange={() => handleMailChange("phaseUpdates")}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "var(--primary-color)", // Switch knob color when checked
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "var(--info-color)", // Background track color when checked
                },
                "& .MuiSwitch-switchBase": {
                  color: "var(--heading-color)", // Switch knob color when unchecked
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "var(--disabled-color)", // Background track color when unchecked
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            Approvals
          </Grid>
          <Grid item xs={6} className={styles.switchContainer}>
            <Switch
              checked={mailSettings.approvals}
              onChange={() => handleMailChange("approvals")}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "var(--primary-color)", // Switch knob color when checked
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "var(--info-color)", // Background track color when checked
                },
                "& .MuiSwitch-switchBase": {
                  color: "var(--heading-color)", // Switch knob color when unchecked
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "var(--disabled-color)", // Background track color when unchecked
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            RFP Changes
          </Grid>
          <Grid item xs={6} className={styles.switchContainer}>
            <Switch
              checked={mailSettings.rfpChanges}
              onChange={() => handleMailChange("rfpChanges")}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "var(--primary-color)", // Switch knob color when checked
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "var(--info-color)", // Background track color when checked
                },
                "& .MuiSwitch-switchBase": {
                  color: "var(--heading-color)", // Switch knob color when unchecked
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "var(--disabled-color)", // Background track color when unchecked
                },
              }}
            />
          </Grid>
        </Grid>
      </div>

      <div className={styles.section}>
        <Typography variant="h6" className={styles.subheading}>
          Push Notifications
        </Typography>
        <Grid container spacing={2} className={styles.notificationItem}>
          <Grid item xs={6}>
            Phase Updates
          </Grid>
          <Grid item xs={6} className={styles.switchContainer}>
            <Switch
              checked={pushSettings.phaseUpdates}
              onChange={() => handlePushChange("phaseUpdates")}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "var(--primary-color)", // Switch knob color when checked
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "var(--info-color)", // Background track color when checked
                },
                "& .MuiSwitch-switchBase": {
                  color: "var(--heading-color)", // Switch knob color when unchecked
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "var(--disabled-color)", // Background track color when unchecked
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            Approvals
          </Grid>
          <Grid item xs={6} className={styles.switchContainer}>
            <Switch
              checked={pushSettings.approvals}
              onChange={() => handlePushChange("approvals")}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "var(--primary-color)", // Switch knob color when checked
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "var(--info-color)", // Background track color when checked
                },
                "& .MuiSwitch-switchBase": {
                  color: "var(--heading-color)", // Switch knob color when unchecked
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "var(--disabled-color)", // Background track color when unchecked
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            RFP Changes
          </Grid>
          <Grid item xs={6} className={styles.switchContainer}>
            <Switch
              checked={pushSettings.rfpChanges}
              onChange={() => handlePushChange("rfpChanges")}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "var(--primary-color)", // Switch knob color when checked
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "var(--info-color)", // Background track color when checked
                },
                "& .MuiSwitch-switchBase": {
                  color: "var(--heading-color)", // Switch knob color when unchecked
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "var(--disabled-color)", // Background track color when unchecked
                },
              }}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Notifications;
