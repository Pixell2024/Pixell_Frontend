import React from "react";
import {
  Edit,
  Mail,
  MobileIcons,
  VideoIcon,
} from "../../../shared/assets/icons";
import { Box, Grid } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Manufacturing from "../../../shared/assets/icons/Manufacturing";
import UpdateApprove from "./UpdateApprove";
import ProductionProgress from "./ProductionProgress";
import UpcomingPhases from "./UpcomingPhases";
import Buget from "./Buget";
import Requirements from "./Requirement";
// import Requirements from "./Requirements";

const MainCampaign = () => {
  return (
    <Box container sx={{ padding: 1 }}>
      <div className=" flex justify-between items-center gap-2">
        <div className="sm:w-full">
          <Grid className="flex flex-col md:flex-row items-center justify-start md:space-x-3 space-y-2 md:space-y-0 mb-2">
            <h1 className="text-[24px] md:text-[30px] text-center md:text-left leading-relaxed md:leading-normal">
              Tribal Art Campaign 2024
            </h1>
            <p className="text-[var(--primary-color)] flex items-center justify-center rounded-md bg-white p-2 space-x-1">
              <VideoIcon color="var(--primary-color)" size="15" />
              <span>View RFP</span>
            </p>

            <p className="text-[var(--primary-color)] flex items-center justify-center space-x-1">
              <Edit size="15" color="var(--primary-color)" />
              <span>Edit</span>
            </p>
          </Grid>

          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[auto,auto,auto,auto,auto] items-start justify-start gap-4">
            <Grid>
              <p className="bg-white text-[var(--heading-color)] flex items-center p-1 rounded-md">
                <LocationOnOutlinedIcon fontSize="small" />
                <span>Uttar Pradesh, Lucknow-22603 </span>
              </p>
            </Grid>
            <Grid>
              <p className="bg-[var(--bg-color)] text-[var(--primary-color)] flex items-center py-1 px-2 rounded-2xl">
                Campaign Owner: Neeraj Singh
              </p>
            </Grid>
            <Grid>
              <p className="bg-[var(--bg-color)] text-[var(--primary-color)] flex items-center py-1 px-2 rounded-2xl gap-1">
                11 June 24 - 22 Sep 24
              </p>
            </Grid>
            <Grid>
              <p className="bg-[var(--bg-color)] text-[var(--primary-color)] flex items-center py-1 px-2 rounded-2xl gap-1">
                <Manufacturing color="var(--primary-color)" />
                Manufacturing
              </p>
            </Grid>
            <Grid>
              {/* <p className="bg-[var(--bg-color)] text-[var(--primary-color)] flex items-center py-1 px-2 rounded-2xl gap-1">
                Avatar
              </p> */}
            </Grid>
          </Box>
        </div>
        <div className="space-y-1">
          <p className="flex items-center gap-2 ">
            <span className="bg-[var(--primary-color)] rounded-full flex items-center justify-center  w-7 h-7 text-[var(--secondary-color)]">
              SK
            </span>
            <span className="text-[12px] font-semibold"> SHIV KUMAR </span>
          </p>
          <p className="flex items-center gap-2 text-[12px] ml-1">
            <Mail size="16" /> <span>shivKumar@signwalla.com</span>{" "}
          </p>
          <p className="flex items-center gap-2  text-[12px] ml-1">
            <MobileIcons size="16" /> <span>+91 9123454545</span>{" "}
          </p>
        </div>
      </div>

      <Box sx={{ flexGrow: 1, gap: 1, marginTop: 3 }}>
        <Grid container spacing={2}>
          {/* First Row: Three Columns */}
          <Grid item xs={12} sm={6} md={4}>
            <UpdateApprove />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <ProductionProgress />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <UpcomingPhases />
          </Grid>

          {/* Second Row: Three Columns */}
          <Grid item xs={12} sm={6} md={4}>
            <Buget />
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <Requirements />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4}></Grid> */}
        </Grid>
      </Box>
    </Box>
  );
};

export default MainCampaign;
