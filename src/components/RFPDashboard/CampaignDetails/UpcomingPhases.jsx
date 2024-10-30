// import { Grid } from "@mui/material";
// import React from "react";
// import {
//   AuditIcon,
//   Delivery,
//   InstalliationIcons,
//   Recce,
//   VendorIcon,
//   VideoIcon,
// } from "../../../shared/assets/icons";
// import Manufacturing from "../../../shared/assets/icons/Manufacturing";

// const Phases = [
//   {
//     Topic: "RFP",
//     icon: <VideoIcon color="var(--para-color)" />,
//   },
//   {
//     Topic: "Manager Assigned",
//     icon: <VendorIcon color="var(--para-color)" />,
//   },
//   {
//     Topic: "Vendor Selection",
//     icon: <VideoIcon color="var(--para-color)" />,
//   },
//   {
//     Topic: "Recce",
//     icon: <Recce color="var(--para-color)" />,
//   },
//   {
//     Topic: "Manufacturing",
//     icon: <Manufacturing color="var(--para-color)" />,
//   },
//   {
//     Topic: "Delivery",
//     icon: <Delivery color="var(--para-color)" />,
//   },
//   {
//     Topic: "Installation",
//     icon: <InstalliationIcons color="var(--para-color)" />,
//   },
//   {
//     Topic: "Audit",
//     icon: <AuditIcon color="var(--para-color)" />,
//   },
// ];

// const UpcomingPhases = () => {
//   return (
//     <Grid className="bg-[var(--secondary-color)]   shadow-md relative p-3 rounded-md">
//       <h1>UPCOMING PHASE</h1>
//       {Phases.map((ele, index) => {
//         return (
//           <>
//             <div className="flex justify-start mx-6 items-center space-x-2 my-3">
//               <p className="bg-[var(--light-grey-color)] rounded-full p-1">
//                 {ele.icon}
//               </p>
//               <p>{ele.Topic}</p>
//             </div>
//           </>
//         );
//       })}
//     </Grid>
//   );
// };

// export default UpcomingPhases;
import { Grid } from "@mui/material";
import React, { useState } from "react";
import {
  AuditIcon,
  Delivery,
  InstalliationIcons,
  Recce,
  VendorIcon,
  VideoIcon,
} from "../../../shared/assets/icons";
import Manufacturing from "../../../shared/assets/icons/Manufacturing";
import style from "./Campaign.module.css";

// Phases data with icons and topics
const Phases = [
  {
    Topic: "RFP",
    icon: (color) => <VideoIcon color={color} />,
  },
  {
    Topic: "Manager Assigned",
    icon: (color) => <VendorIcon color={color} />,
  },
  {
    Topic: "Vendor Selection",
    icon: (color) => <VideoIcon color={color} />,
  },
  {
    Topic: "Recce",
    icon: (color) => <Recce color={color} />,
  },
  {
    Topic: "Manufacturing",
    icon: (color) => <Manufacturing color={color} />,
  },
  {
    Topic: "Delivery",
    icon: (color) => <Delivery color={color} />,
  },
  {
    Topic: "Installation",
    icon: (color) => <InstalliationIcons color={color} />,
  },
  {
    Topic: "Audit",
    icon: (color) => <AuditIcon color={color} />,
  },
];

const UpcomingPhases = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Set active phase index

  return (
    <Grid className="bg-[var(--secondary-color)] shadow-md relative px-2 py-7 rounded-md">
      <h1 className="font-bold mb-3">UPCOMING PHASE</h1>
      <Grid
        className={`h-80 max-h-80 overflow-auto px-1 rounded-md custom-scrollbar ${style["custom-scrollbar"]}`}
      >
        {Phases.map((ele, index) => {
          const isActive = index === activeIndex; // Check if the current phase is active
          const isPrevious = index < activeIndex; // Check if the element is before the active one
          const color = isActive
            ? "var(--secondary-color)"
            : isPrevious
            ? "var(--secondary-color)"
            : "var(--para-color)";

          return (
            <div
              key={index}
              className={`relative flex justify-start mx-3 items-center space-x-2 my-1 cursor-pointer ${
                isActive
                  ? "bg-[var(--primary-color)] text-[var(--secondary-color)] rounded-md  p-2 text-[16px]" // Active phase
                  : isPrevious
                  ? " text-[var(--primary-color)] rounded-md py-1" // Previous phases
                  : "rounded-full p-2" // Future phases
              }`}
              onClick={() => setActiveIndex(index)} // Click to set active phase
            >
              {/* Chain Line for Previous Phases */}
              {isPrevious && (
                <span className="absolute left-5 top-6 h-full w-2 border-l-[3px] border-[var(--primary-color)]" />
              )}

              <p
                className={`p-1 relative ${
                  isActive
                    ? "bg-[var(--primary-color)] text-[var(--secondary-color)] rounded-md"
                    : isPrevious
                    ? "bg-[var(--primary-color)]  rounded-full "
                    : "bg-[var(--bg-color)] rounded-full "
                }`}
              >
                {ele.icon(color)}
              </p>

              <p
                className={`${
                  isActive
                    ? "text-[var(--secondary-color)] rounded-md text-[16px] "
                    : isPrevious
                    ? "text-[var(--primary-color)] rounded-md "
                    : "text-[var(--heading-color)] rounded-full "
                }`}
              >
                {ele.Topic}
              </p>
            </div>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default UpcomingPhases;
