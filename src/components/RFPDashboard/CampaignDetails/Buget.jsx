import React, { useState } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Grid } from "@mui/material";
import { Printing, Recce } from "../../../shared/assets/icons";
import Manufacturing from "../../../shared/assets/icons/Manufacturing";

import style from "./Campaign.module.css";
const BugetArray = [
  {
    icon: <Recce color="var(--primary-color)" size="25" />,
    Title: "Recce",
    max: 1200,
    value: 600,
  },
  {
    icon: <Printing color="var(--primary-color)" size="25" />,
    Title: "Printing",
    max: 1500,
    value: 300,
  },
  {
    icon: <Recce color="var(--primary-color)" size="25" />,
    Title: "Frame Production",
    max: 1500,
    value: 400,
  },
  {
    icon: <Manufacturing color="var(--primary-color)" size="25" />,
    Title: "Manufacturing",
    max: 1500,
    value: 600,
  },
  {
    icon: <Recce color="var(--primary-color)" size="25" />,
    Title: "Recce",
    max: 2000,
    value: 600,
  },
  {
    icon: <Recce color="var(--primary-color)" size="25" />,
    Title: "Recce",
    max: 1000,
    value: 600,
  },
];

const Buget = () => {
  const [value, setValue] = useState(500);
  const [maxvalue, setMaxValue] = useState(null);

  const max = 1200;

  return (
    <Grid className="bg-[var(--secondary-color)]  shadow-md   relative p-3 rounded-md">
      <h1>BUDGET</h1>
      <h1 className="text-[30px] text-[var(--primary-color)] text-bold mt-2  mb-2 flex items-center">
        <CurrencyRupeeIcon /> 37.40 Cr.{" "}
      </h1>
      <p className="flex  items-center">
        Spent:{" "}
        <CurrencyRupeeIcon style={{ fontSize: "15px", marginBottom: 2 }} />
        16.10 Cr.
      </p>
      <Grid
        className={`h-80 max-h-80 overflow-auto px-1 rounded-md custom-scrollbar ${style["custom-scrollbar"]}`}
      >
        {BugetArray.map((ele, index) => {
          const percentage = (ele.value / ele.max) * 100;
          return (
            <>
              <div className=" border max-w-[400px] flex gap-2 items-center p-2  rounded-md  my-2">
                <div className="bg-[var(--bg-color)] h-[42px] w-[42px] flex items-center justify-center rounded-md">
                  {ele.icon}
                </div>
                <div className="w-full">
                  <div className="text-[12px] w-full">
                    <p className="text-[var(--heading-color)]">{ele.Title}</p>
                    <div className="flex justify-between  items-center w-full">
                      <p>
                        <CurrencyRupeeIcon
                          style={{ fontSize: "10px", marginBottom: 2 }}
                        />
                        1.00 Cr
                      </p>
                      <p>
                        <CurrencyRupeeIcon
                          style={{ fontSize: "10px", marginBottom: 2 }}
                        />
                        1.00 Cr
                      </p>
                    </div>
                    <div style={styles.container}>
                      <div
                        style={{
                          ...styles.filler,
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </Grid>
    </Grid>
  );
};

const styles = {
  container: {
    height: "6px", // Bar height
    width: "100%", // Full width
    backgroundColor: "#e0e0df", // Light gray background
    borderRadius: "5px", // Rounded corners
    overflow: "hidden", // Prevent overflow of inner bar
  },
  filler: {
    height: "100%", // Full height
    backgroundColor: "var(--primary-color)", // Blue fill
    transition: "width 0.5s ease-in-out", // Smooth transition for fill
  },
};

export default Buget;
