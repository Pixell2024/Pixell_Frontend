import React, { useEffect, useState, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import style from "./Campaign.module.css";

const ResponsiveBarChart = () => {
  const [chartDimensions, setChartDimensions] = useState({
    width: 500,
    height: 500,
  });
  const chartContainerRef = useRef(null);

  // Function to update chart size dynamically
  const updateChartSize = () => {
    if (chartContainerRef.current) {
      const { offsetWidth } = chartContainerRef.current;
      const height = Math.min(offsetWidth * 0.9, 300); // Set a proportional height based on width
      setChartDimensions({
        width: offsetWidth,
        height,
      });
    }
  };

  useEffect(() => {
    // Set initial chart size
    updateChartSize();
    // Update chart size on window resize
    window.addEventListener("resize", updateChartSize);
    return () => window.removeEventListener("resize", updateChartSize);
  }, []);

  const xLabels = ["Label 1", "Label 2", "Label 3"];
  const totalProductionData = [500, 600, 700];
  const productionProgressData = [300, 400, 500];

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: "100%",
        padding: "2px",
        backgroundColor: "var(--secondary-color)",
        paddingTop: "40px",
      }}
      className={` shadow-md rounded-md  ${style["custom-scrollbar"]}`}
    >
      <BarChart
        xAxis={[{ data: xLabels, scaleType: "band" }]} // X-axis labels
        barLabel={(item, context) => {
          if ((item.value ?? 0) > 10) {
            return "";
          }
          return context.bar.height < 60 ? null : item.value?.toString();
        }}
        width={chartDimensions.width} // Responsive width
        height={chartDimensions.height} // Responsive height
        legend={{ position: "bottom" }} // Display legend at the bottom
        series={[
          {
            data: totalProductionData,
            label: "Total Production",
            id: "totalProductionId",
            color: "var(--primary-color)", // Blue bars
          },
          {
            data: productionProgressData,
            label: "Production Progress",
            id: "progressId",
            color: "var(--heading-color)", // Dark gray bars
          },
        ]}
        barCategoryGap="30%" // Adjusts the gap between categories/groups
        barGap={2}
        groupMode="grouped" // Bars side by side
        borderRadius={11}
      />
    </div>
  );
};

export default ResponsiveBarChart;
