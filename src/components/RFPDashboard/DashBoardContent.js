import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import img from "../../shared/assets/icons/empty.png";
import { PlusIcon } from "../../shared/assets/icons";
import CustomButton from "../../shared/utils/Button";

const SideContent = () => {
  const [data, setData] = useState(false);
  return (
    <>
      {data ? (
        <h2>Here is the Data</h2>
      ) : (
        <div
          className="m-auto"
          style={{
            height: "85vh",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="min-h-[405px] max-w-[305px]  flex flex-col p-5 items-center justify-center shadow-lg">
            <div className="min-h-[200px] max-w-[250px]">
              <img src={img} alt="empty Dashboard"></img>
            </div>
            <h1 className="mt-2 ">Generate Your first RFP</h1>
            <p className="text-[12px] text-center">
              Streamline your process, make it easier than ever to manage and
              execute your advertising strategy.
            </p>
            <a
              className="btn flex items-center mt-5 gap-2 rounded-lg shadow-lg text-white px-4 py-2 "
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <PlusIcon color="white" size="14px" /> Add New Campaign
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default SideContent;
