import ExcelJS from "exceljs";
import axios from "axios";

export const handleFileUploadForVendorOnboarding = async (e) => {
  const file = e?.target?.files[0];
  const formData = new FormData();
  formData.append("file", file);

  const validateExcelData = (data) => {
    if (!data || data.length === 0) {
      // setErrorMessage("No data found in the Excel file.");
      return { isValid: false, error: "No data found in the Excel file." };
    }

    let isValid = true;
    let error = "";

    const requiredColumns = [
      "State",
      "District",
      "City",
      "Vendor Business Name",
      "PinCode",
      "Type Of Business",
      "Owner Name",
      "Contact Number",
      "Address",
      "GSTIN",
    ];
    if (!data[0]) {
      // setErrorMessage("Excel file is empty or has no valid rows.");
      return {
        isValid: false,
        error: "Excel file is empty or has no valid rows.",
      };
    }

    data.forEach((row, index) => {
      requiredColumns.forEach((field) => {
        if (!row[field] || row[field].toString().trim() === "") {
          isValid = false;
          error = `Missing or invalid value for '${field}' at row ${
            index + 1
          }.`;
        }
      });
      // if (
      //   !row.ownerPrimaryContactNo ||
      //   isNaN(row.ownerPrimaryContactNo) ||
      //   row.ownerPrimaryContactNo.toString().length !== 10
      // ) {
      //   isValid = false;
      //   error = `Invalid Primary phone number at row ${
      //     index + 1
      //   }. It should be a 10-digit number.`;
      // }
      // if (
      //   row.numberOfSkilledManpower === "" ||
      //   row.numberOfSkilledManpower === undefined ||
      //   row.numberOfSkilledManpower === null
      // ) {
      //   row.numberOfSkilledManpower = null;
      // }
      // if (
      //   row.avgTurnoverLast3Years === "" ||
      //   row.avgTurnoverLast3Years === undefined ||
      //   row.avgTurnoverLast3Years === null
      // ) {
      //   row.avgTurnoverLast3Years = null;
      // }

      // if (
      //   !row.ownerSecondaryContactNo ||
      //   isNaN(row.ownerSecondaryContactNo) ||
      //   row.ownerSecondaryContactNo.toString().length !== 10
      // ) {
      //   isValid = false;
      //   error = `Invalid ownerSecondary phone number at row ${
      //     index + 1
      //   }. It should be a 10-digit number.`;
      // }
      // if (
      //   row.productionArea === "" ||
      //   row.productionArea === undefined ||
      //   row.productionArea === null
      // ) {
      //   row.productionArea = null;
      // }

      // if (
      //   !row.pinCode ||
      //   isNaN(row.pinCode) ||
      //   row.pinCode.toString().length !== 6
      // ) {
      //   isValid = false;
      //   error = `Invalid pin code at row ${
      //     index + 1
      //   }. It should be a 6-digit number.`;
      // }

      // if (!row["Address"] || row["address"].trim().length < 2) {
      //   isValid = false;
      //   error = `Invalid address at row ${index + 1}.`;
      // }

      // if (
      //   !row["Vendor Business Name"]
      //   // ||
      //   // row.vendorBusinessName.trim().length < 3 ||
      //   // row.vendorBusinessName.length > 100 ||
      //   // !/^[a-zA-Z0-9\s&.,'-]+$/.test(row.vendorBusinessName)
      // ) {
      //   isValid = false;
      //   error = `Invalid vendor business name at row ${index + 1}.`;
      // }

      // if (
      //   !row["PAN Number"] ||
      //   row["PAN Number"].toString().length !== 10 ||
      //   !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(row["PAN Number"])
      // ) {
      //   isValid = false;
      //   error = `Invalid PAN Number at row ${
      //     index + 1
      //   }. It should be exactly 10 characters long, consisting of 5 letters, 4 digits, and 1 letter.`;
      // }

      // if (
      //   row.yearsInBusiness === "" ||
      //   row.yearsInBusiness === undefined ||
      //   row.yearsInBusiness === null
      // ) {
      //   row.yearsInBusiness = null;
      // } else if (isNaN(row.yearsInBusiness) || row.yearsInBusiness < 0) {
      //   isValid = false;
      //   error = `Invalid number of years in business at row ${
      //     index + 1
      //   }. It should be a non-negative number.`;
      // }
      // if (
      //   row.numberOfEmployees === "" ||
      //   row.numberOfEmployees === undefined ||
      //   row.numberOfEmployees === null
      // ) {
      //   row.numberOfEmployees = null;
      // } else if (isNaN(row.numberOfEmployees) || row.numberOfEmployees < 0) {
      //   isValid = false;
      //   error = `Invalid number of employees at row ${
      //     index + 1
      //   }. It should be a non-negative number.`;
      // }

      // if (
      //   row.numberOfUnskilledManpower === "" ||
      //   row.numberOfUnskilledManpower === undefined ||
      //   row.numberOfUnskilledManpower === null
      // ) {
      //   row.numberOfUnskilledManpower = null;
      // } else if (
      //   isNaN(row.numberOfUnskilledManpower) ||
      //   row.numberOfUnskilledManpower < 0
      // ) {
      //   isValid = false;
      //   error = `Invalid number of unskilled manpower employees at row ${
      //     index + 1
      //   }. It should be a non-negative number.`;
      // }
      // if (
      //   row.bankAccountNumber === undefined ||
      //   row.bankAccountNumber === null
      // ) {
      //   row.bankAccountNumber = "";
      // } else if (typeof row.bankAccountNumber !== "string") {
      //   isValid = false;
      //   error = `Invalid bank Acccount at row ${
      //     index + 1
      //   }. It should be a valid string.`;
      // }
      // if (row.businessLocation === undefined || row.businessLocation === null) {
      //   row.businessLocation = "";
      // } else if (typeof row.businessLocation !== "string") {
      //   isValid = false;
      //   error = `Invalid business loc. at row ${
      //     index + 1
      //   }. It should be a valid string.`;
      // }
      // if (row.bankName === undefined || row.bankName === null) {
      //   row.bankName = "";
      // } else if (typeof row.bankName !== "string") {
      //   isValid = false;
      //   error = `Invalid bank name at row ${
      //     index + 1
      //   }. It should be a valid string.`;
      // }

      // if (row.bankIFSCCode === undefined || row.bankIFSCCode === null) {
      //   row.bankIFSCCode = "";
      // } else if (typeof row.bankIFSCCode !== "string") {
      //   isValid = false;
      //   error = `Invalid BankIFSCode at row ${
      //     index + 1
      //   }. It should be a valid string.`;
      // }
      // if (row.paymentTerms === undefined || row.paymentTerms === null) {
      //   row.paymentTerms = "";
      // } else if (typeof row.paymentTerms !== "string") {
      //   isValid = false;
      //   error = `Invalid payment at row ${
      //     index + 1
      //   }. It should be a valid string.`;
      // }
      // if (row.scalingFactors === undefined || row.scalingFactors === null) {
      //   row.scalingFactors = "";
      // } else if (typeof row.scalingFactors !== "string") {
      //   isValid = false;
      //   error = `Invalid Scaling factors at row ${
      //     index + 1
      //   }. It should be a valid string.`;
      // }

      // if (row.website === undefined || row.website === null) {
      //   row.website = "";
      // } else if (typeof row.website !== "string") {
      //   isValid = false;
      //   error = `Invalid website format at row ${
      //     index + 1
      //   }. It should be a valid string.`;
      // }
      // if (row.businessLocation === undefined || row.businessLocation === null) {
      //   row.businessLocation = "";
      // } else if (typeof row.businessLocation !== "string") {
      //   isValid = false;
      //   error = `Invalid business location at row ${
      //     index + 1
      //   }. It should be a valid string.`;
      // }

      // if (row.reliability === undefined || row.reliability === null) {
      //   row.reliability = "";
      // } else if (typeof row.reliability !== "string") {
      //   isValid = false;
      //   error = `Invalid reliability value at row ${
      //     index + 1
      //   }. It should be a valid string.`;
      // }

      // if (!row.GSTIN || row.GSTIN.length !== 15) {
      //   isValid = false;
      //   error = `Invalid GSTIN at row ${
      //     index + 1
      //   }. It must be exactly 15 characters long.`;
      // }
    });

    if (!isValid) {
      // setErrorMessage(error); // Set the error message for display
      return { isValid: false, error };
    }

    // setJsonData(data);
    // setErrorMessage(null);
    return { isValid: true };
  };

  const readExcelFile = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        const buffer = event.target.result;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer); // Load the Excel file buffer

        const worksheet = workbook.worksheets[0]; // Assuming you want the first sheet
        const rows = [];

        worksheet.eachRow((row, rowNumber) => {
          const rowValues = row.values; // row.values gives an array of cell values
          // Remove the first empty element (ExcelJS starts rows with an empty index)
          rows.push(rowValues.slice(1));
        });

        resolve(rows);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file); // Read the file as an array buffer
    });
  };

  // Convert the Excel sheet into a JSON array
  const processExcelDataToJson = (rows) => {
    const headers = rows[0]; // First row as headers
    const data = rows.slice(1).map((row) => {
      const rowData = {};
      row.forEach((value, index) => {
        rowData[headers[index]] = value;
      });
      return rowData;
    });

    return data; // Return the JSON array
  };

  try {
    const rows = await readExcelFile(file);
    const jsonData = processExcelDataToJson(rows);

    // Validate the Excel data
    const validationResult = validateExcelData(jsonData);

    if (!validationResult.isValid) {
      alert(validationResult.error); // Display validation error
      return;
    }
    const response = await axios.post(
      `${process.env.REACT_APP_URL}/upload-template`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      alert("File uploaded and data saved successfully.");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("There was an error uploading the file.");
  }
};
