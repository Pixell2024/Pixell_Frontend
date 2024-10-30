import React from "react";
import {
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  Paper,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import style from "./Campaign.module.css";

const columns = [
  {
    field: "material",
    headerName: "Material",
    width: 10,
  },
  { field: "quantity", headerName: "Quantity", width: 20 },
  { field: "frameMaterial", headerName: "Frame Material", width: 60 },
  { field: "printType", headerName: "Print Type", width: 20 },
];
const rows = [
  {
    material: "Billboards",
    quantity: 1000,
    frameMaterial: "Arclyic",
    printType: "UV",
  },
  {
    material: "Digital Panel",
    quantity: 5000,
    frameMaterial: "Glass",
    printType: "UV",
  },
  {
    material: "Wayfinding Signages",
    quantity: 3000,
    frameMaterial: "Card Board",
    printType: "-",
  },
  {
    material: "Billboards",
    quantity: 1000,
    frameMaterial: "Arclyic",
    printType: "UV",
  },
  {
    material: "Billboards",
    quantity: 1000,
    frameMaterial: "Arclyic",
    printType: "UV",
  },
  {
    material: "Billboards",
    quantity: 1000,
    frameMaterial: "Arclyic",
    printType: "UV",
  },
  {
    material: "Billboards",
    quantity: 1000,
    frameMaterial: "Arclyic",
    printType: "UV",
  },
  {
    material: "Billboards",
    quantity: 1000,
    frameMaterial: "Arclyic",
    printType: "UV",
  },
  {
    material: "Billboards",
    quantity: 1000,
    frameMaterial: "Arclyic",
    printType: "UV",
  },
];

const Requirements = () => {
  return (
    <Grid className="bg-[var(--secondary-color)] min-h-[420px] shadow-md  p-3 rounded-md">
      <div className="flex flex-col   lg:flex-row justify-between items-center gap-7">
        <h1>REQUIREMENTS</h1>
        <div
          className="flex justify-center items-center max-w-[180px]  rounded-lg px-1 py-1 space-x-2  text-sm text-[var(--para-color)] bg-[var(--secondary-color)]"
          style={{ border: "1px solid var(--listdown-color)" }}
        >
          <Search color="var(--listdown-color)" />
          <input
            type="text"
            className="outline-none w-full"
            placeholder={`Search Material`}
            //   onChange={(e) => handleSearchChangeHead(e, columns[0].field)} // Use the handler passed via props
            //   value={searchInputs?.[columns[0].field] || ""} // Access search inputs from props
          />
        </div>
      </div>

      <TableContainer
        sx={{
          height: 360, // Adjust this to control available space for the table
          // Ensures the table won't exceed this height
          overflowY: "auto", // Adds scroll when the content exceeds height
        }}
        className={`mt-2 rounded-lg  ${style["custom-scrollbar"]} `}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    // minWidth: column.width,
                    fontWeight: "bold",
                    position: "relative", // To use absolute positioning for the header name
                  }}
                >
                  <span>{column.headerName}</span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.material}</TableCell>
                <TableCell align="left">{row.quantity}</TableCell>
                <TableCell align="left">{row.frameMaterial}</TableCell>
                <TableCell align="left">{row.printType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default Requirements;
