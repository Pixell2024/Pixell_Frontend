import { Box, Chip, Grid } from "@mui/material";
import React from "react";
import style from "./Campaign.module.css";
import {
  DocumentFile,
  ScenView,
  Clock,
  UpperRightArrow,
} from "../../../shared/assets/icons";
// import { Clock } from "@mui/x-date-pickers/TimeClock/Clock";

const meetingArray = [
  {
    Timing: "Vendor has been finalised as per your requirements",
  },
  {
    Timing:
      "Account Manager has scheduled a meeting on 26 Jun 2024 at 10:00 AM.",
  },
  {
    Timing: "Account Manager has scheduled a meeting today at 10:00 AM.",
  },
  {
    Timing: "Account Manager has scheduled a meeting today at 10:00 AM.",
  },
  {
    Timing: "Vendor has been finalised as per your requirements",
  },
];

const UpdateApprove = () => {
  return (
    <>
      <Grid
        className=" bg-white  relative p-3 rounded-md shadow-md  "
        style={{ borderRadius: "15px 0px 15px 15px " }}
      >
        <div className="flex items-center justify-between w-full  overflow-x-auto">
          <Grid className="flex   overflow-x-auto min-w-[110px]   flex-shrink-0">
            <Chip
              label="Updates"
              style={{
                background: "var(--primary-color)",
                color: "var(--secondary-color)",
              }}
            />
            <Chip
              label="Approval"
              variant="outlined"
              style={{
                borderColor: "var(--heading-color)",
                color: "var(--heading-color)", // Text color
                marginLeft: "10px", // Custom margin
              }}
            />
          </Grid>

          {/* View button */}
          <p
            className="bg-[var(--dashboard-bg-color)] text-[var(--primary-color)] px-3 pt-9  mb-7 text-[14px] flex gap-2 items-center"
            style={{
              borderRadius: "0px 10px 10px 15px",
              position: "absolute",
              right: "0",
              top: "3",
            }}
          >
            View
            <UpperRightArrow color="var(--primary-color)" size="11" />
          </p>
        </div>

        <p className="mt-2 text-[12px]">24 Jun 2024 </p>

        <Grid
          className={`h-80 max-h-80 overflow-auto ${style["custom-scrollbar"]} `}
        >
          {meetingArray.map((ele, index) => {
            return (
              <>
                <div className="w-full my-2 border py-1 px-2 rounded-md ">
                  <p className="text-[var(--heading-color)] text-[12px]">
                    {ele.Timing}
                  </p>
                  <div className=" my-1 mx-2 border "></div>

                  <div className="flex items-center justify-between">
                    <div className="flex justify-center items-center space-x-2">
                      <p className="text-[var(--para-color)] text-[10px] flex gap-1 item-center">
                        <DocumentFile size="15" color="var(--para-color)" /> 2
                      </p>
                      <p className="text-[var(--para-color)] text-[10px] flex gap-1 item-center ">
                        <ScenView size="15" color="var(--para-color)" /> 5
                      </p>
                      <p className="text-[var(--para-color)] text-[10px]  flex gap-1 item-center">
                        <Clock size="15" color="var(--para-color)" />
                        10:00 Am
                      </p>
                    </div>

                    <p className="text-[var(--primary-color)] text-[10px]  ">
                      <ul
                        style={{ listStyleType: "disc", paddingLeft: "20px" }}
                      >
                        <li>New</li>
                      </ul>
                    </p>
                  </div>
                </div>
              </>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
};

export default UpdateApprove;
