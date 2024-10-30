import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // For saving the file
import { IndiaState } from "../../../shared/enums";

// Function to download Excel
export const downloadExcelForVendorOnboarding = async () => {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Vendors");

  // Define headers
  worksheet.columns = [
    { header: "State", width: 20 }, //A
    { header: "District", width: 20 }, //B
    { header: "City", width: 20 }, //C
    { header: "GSTIN", width: 20 }, //D
    { header: "Vendor Business Name", width: 20 }, //E
    { header: "PinCode", width: 15 }, //F
    { header: "Type Of Business", width: 20 }, //G
    { header: "Address", width: 25 }, //H
    { header: "Contact Number", width: 15 }, //I
    { header: "Owner Name", width: 20 },
    { header: "Division", width: 20 },
  ];
  const typeOfBusiness = [
    "Limited Company",
    "Private Limited Company",
    "LLP",
    "Foreign Company",
    "Partnership",
    "Sole Proprietor",
    "One Person Company",
  ];

  // Set data validation for mandatory fields
  const mandatoryColumns = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
  ];

  mandatoryColumns.forEach((column, index) => {
    const cell = `${column}2`; // Assuming the first row is headers
    worksheet.getCell(cell).dataValidation = {
      type: "custom",
      allowBlank: false,
      showErrorMessage: true,
      errorTitle: "Mandatory Field",
      error: `Please fill in the ${worksheet.columns[index].header} field.`,
      formulae: [`LEN(${cell})>0`], // Ensure the length of the input is greater than 0
    };
  });

  const typeOfBusinessList = [`"${typeOfBusiness.join(",")}"`];

  const states = Object.keys(IndiaState.India);
  // Create a string list for the formula
  const stateList = [`"${states.join(",")}"`];

  // Add a hidden worksheet to store districts
  const hiddenSheetForDistricts = workbook.addWorksheet("Districts");
  //   hiddenSheetForDistricts.state = "hidden";

  const hiddenSheetForCities = workbook.addWorksheet("Cities");
  // Populate the hidden sheet with state and district data
  let currentRow = 1;
  let currentRowForCities = 1;
  states.forEach((state) => {
    const districts = Object.keys(IndiaState.India[state].districts);
    districts.forEach((district) => {
      hiddenSheetForDistricts.getCell(`A${currentRow}`).value = state;
      hiddenSheetForDistricts.getCell(`B${currentRow}`).value = district;
      currentRow++;

      // add cities
      const cities = Object.values(
        IndiaState.India[state].districts[district].cities
      );

      cities.forEach((city) => {
        hiddenSheetForCities.getCell(`A${currentRowForCities}`).value =
          district;
        hiddenSheetForCities.getCell(`B${currentRowForCities}`).value = city;
        currentRowForCities++;
      });
    });
  });

  // Add dropdown validation for the "State" column (1st column)
  for (let i = 2; i <= 100; i++) {
    // Limiting rows to 100 for demonstration
    worksheet.getCell(`A${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: stateList, // Directly add the states list here
      showErrorMessage: true,
      errorTitle: "Invalid State",
      error: "Please select a valid state from the dropdown list.",
    };

    // Add district dropdown validation that uses INDIRECT to refer to the named range
    worksheet.getCell(`B${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [
        `INDIRECT("Districts!B" & MATCH(A${i}, Districts!A:A, 0) & ":B" & MATCH(A${i}, Districts!A:A, 0) + COUNTIF(Districts!A:A, A${i}) - 1)`,
      ],
      showErrorMessage: true,
      errorTitle: "Invalid District",
      error: "Please select a valid district based on the state.",
    };

    worksheet.getCell(`C${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [
        `INDIRECT("Cities!B" & MATCH(B${i}, Cities!A:A, 0) & ":B" & MATCH(B${i}, Cities!A:A, 0) + COUNTIF(Cities!A:A, B${i}) - 1)`,
      ],
      showErrorMessage: true,
      errorTitle: "Invalid City",
      error: "Please select a valid city based on the district.",
    };
    worksheet.getCell(`D${i}`).dataValidation = {
      type: "custom",
      showErrorMessage: true,
      errorTitle: "Invalid GSTIN",
      error: "Please enter a valid 15-character GSTIN without",
      allowBlank: false,
      formulae: [`AND(LEN(D${i})=15, ISERROR(FIND(" ",D${i})))`],
    };
    worksheet.getCell(`F${i}`).dataValidation = {
      type: "whole",
      operator: "between",
      showErrorMessage: true,
      errorTitle: "Invalid Pincode",
      error: "Please enter a valid 6-digit Pincode.",
      allowBlank: false,
      formulae: [100000, 999999],
    };

    worksheet.getCell(`I${i}`).dataValidation = {
      type: "whole",
      operator: "between",
      showErrorMessage: true,
      errorTitle: "Invalid Phone number",
      error: "Please enter a valid Phone Number.",
      allowBlank: false,
      formulae: [1000000000, 9999999999],
    };
    worksheet.getCell(`G${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: typeOfBusinessList,
      showErrorMessage: true,
      errorTitle: "Invalid Input",
      error: "Please select a valid business from the dropdown list.",
    };
  }

  // Generate Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Create a Blob from the buffer
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Save the Excel file
  saveAs(blob, "vendors_template.xlsx");
};
