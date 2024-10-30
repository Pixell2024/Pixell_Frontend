import React, { useState } from "react";
import { verifyGST } from "../../shared/utils/gstInfoApi";
import CircularProgress from "@mui/material/CircularProgress"; // Material-UI spinner
import VerifiedTick from "../../shared/assets/icons/VerifiedTick";
import AddIcon from "@mui/icons-material/Add";
import { Edit, Delete } from "@mui/icons-material"; // Importing MUI Edit and Delete icons
import { IconButton } from "@mui/material";
import PrintMachineModal from "./printMachineModal";
import FabricationModal from "./FabricationModal";
import ProductsServicesModal from "./ProductServiceModal";
// import Cross from "path/to/your/icons/Cross";
import { States, IndiaState } from "../../shared/enums";
import CustomButton from "../../shared/utils/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { Cross } from "../../shared/assets/icons/index";
import CustomInput from "../../shared/utils/Input";
import axios from "axios";
import Swal from "sweetalert2";
import "./vendorOnboard.css";
import { validate } from "../utils/validation";
import FileUploader from "../utils/galleryUpload";
import dayjs from "dayjs";

const printingOptions = [
  { value: "Ecosolvent", label: "Ecosolvent Printing" },
  { value: "DigitalUV", label: "Digital UV Printing" },
  { value: "FlatbedUV", label: "Flatbed UV Printing" },
  { value: "HybridUV", label: "Hybrid UV Printing" },
];

const VendorOnboardingForm = ({
  isModalOpen,
  setIsModalOpen,
  selectedVendorData,
  setSelectedVendorData,
  getVendorList,
}) => {
  // console.log(selectedVendorData)
  const [formData, setFormData] = useState({
    state: selectedVendorData?.state || "",
    division: selectedVendorData?.division || "",
    district: selectedVendorData?.district || "",
    city: selectedVendorData?.city || "",
    vendorBusinessName: selectedVendorData?.vendorBusinessName || "",
    pinCode: selectedVendorData?.pinCode || "",
    typeOfBusiness: selectedVendorData?.typeOfBusiness || "",
    ownerName: selectedVendorData?.ownerName || "",
    ownerPrimaryContactNo: selectedVendorData?.ownerPrimaryContactNo || "",
    ownerSecondaryContactNo: selectedVendorData?.ownerSecondaryContactNo || "",
    address: selectedVendorData?.address || "",
    businessLocation: selectedVendorData?.businessLocation || "",
    website: selectedVendorData?.website || "",
    reliability: selectedVendorData?.reliability || "",
    yearsInBusiness: selectedVendorData?.yearsInBusiness || "",
    numberOfEmployees: selectedVendorData?.numberOfEmployees || "",
    numberOfSkilledManpower: selectedVendorData?.numberOfSkilledManpower || "",
    numberOfUnskilledManpower:
      selectedVendorData?.numberOfUnskilledManpower || "",
    registeredInESIPF: selectedVendorData?.registeredInESIPF || false,
    GSTIN: selectedVendorData?.GSTIN || "",
    PANNumber: selectedVendorData?.PANNumber || "",
    bankAccountNumber: selectedVendorData?.bankAccountNumber || "",
    bankName: selectedVendorData?.bankName || "",
    bankIFSCCode: selectedVendorData?.bankIFSCCode || "",
    avgTurnoverLast3Years: selectedVendorData?.avgTurnoverLast3Years || "",
    productionArea: selectedVendorData?.productionArea || "",
    paymentTerms: selectedVendorData?.paymentTerms || "",
    status: selectedVendorData?.status || "Active",
    scalingFactors: selectedVendorData?.scalingFactors || [],
    imagesUploaded: selectedVendorData?.imagesUploaded || [],
    addedBy: localStorage.getItem("userId"),
    updatedBy: localStorage.getItem("userId"),
  });
  const [requiredFields, setRequiredFields] = useState({
    state: false,
    division: false,
    district: false,
    city: false,
    vendorBusinessName: false,
    pinCode: false,
    typeOfBusiness: false,
    ownerName: false,
    ownerPrimaryContactNo: false,
    address: false,
    GSTIN: false,
    website: false,
    PANNumber: false,
  });

  // print machine data
  const [PmformData, setPmFormData] = useState({
    machinePrintingType: "",
    maxPrintSize: "",
    machineBrand: "",
    machineModelNo: "",
    dateOfPurchase: null,
    printingCapacityPerDay: "",
    quantity: "",
  });
  const [printMachineArray, setPrintMachineArray] = useState(
    selectedVendorData?.printingMachines || []
  );
  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);
  const [isprintMachineEditing, setIsPrintMachineEditing] = useState(false);
  const [printmachineeditIndex, setPrintMachineEditIndex] = useState(null);
  const [pmerror, setPmError] = useState(false);

  // Fabrication state data

  const [FabformData, setFabFormData] = useState({
    category: "",
    subCategory: "",
    wattage: "",
    dateOfPurchase: null,
    numMachines: "",
    bedsize: "",
    machineBrand: "",
    machineModelNo: "",
  });

  const [fabArray, setFabArray] = useState(
    selectedVendorData?.fabricationMachines || []
  );
  const [isfabModalOpen, setIsFabModalOpen] = useState(false);
  const [isfabEditing, setIsFabEditing] = useState(false);
  const [fabeditIndex, setFabEditIndex] = useState(null);

  // product and Services
  const [ProductformData, setProductFormData] = useState({
    provideStoreFrontSignages: false,
    typeofStoreFrontSignages: [],
    providePrintedMaterials: false,
    provideVinylInStoreBranding: false,
  });
  const [productArray, setProductArray] = useState(
    selectedVendorData?.productAndServices || []
  );
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isProductEditing, setIsProductEditing] = useState(false);
  const [productEditIndex, setProductEditIndex] = useState(null);

  // other

  const validateForm = () => {
    const newErrors = {};

    if (!formData.state) newErrors.state = "State is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.vendorBusinessName)
      newErrors.vendorBusinessName = "Business Name is required";
    if (!formData.pinCode || !/^\d{6}$/.test(formData.pinCode))
      newErrors.pinCode = "Valid Pin Code is required";
    if (!formData.typeOfBusiness)
      newErrors.typeOfBusiness = "Business Type is required";
    if (!formData.ownerName) newErrors.ownerName = "Owner Name is required";
    if (
      !formData.ownerPrimaryContactNo ||
      !/^\d{10}$/.test(formData.ownerPrimaryContactNo)
    )
      newErrors.ownerPrimaryContactNo = "Valid Contact No is required";
    if (
      formData.ownerSecondaryContactNo &&
      !/^\d{10}$/.test(formData.ownerSecondaryContactNo)
    )
      newErrors.ownerSecondaryContactNo =
        "Valid Secondary Contact No is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (
      formData.website &&
      !/^(https?:\/\/)?([\w\d]+\.)?[\w\d]+\.\w+/.test(formData.website)
    )
      newErrors.website = "Valid Website URL is required";
    if (!formData.GSTIN || formData.GSTIN.length < 15)
      newErrors.GSTIN = "Enter the valid GSTIN ";

    if (formData.PANNumber && !/^\w{10}$/.test(formData.PANNumber))
      newErrors.PANNumber = "PAN Number is not valid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [loading, setLoading] = useState(false); // loading state for API calls
  // const [isGstVerified, setIsGstVerified] = useState(false);
  const [isGstVerified, setIsGstVerified] = useState(
    formData?.GSTIN?.length === 15
  );

  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const serverURL = process.env.REACT_APP_URL;

  const fetchDetailsThroughGSTIN = async (gstNumber) => {
    setLoading(true);
    const responseData = await verifyGST(gstNumber);
    setLoading(false);

    if (responseData.error) {
      setErrors({ ...errors, GSTIN: "Enter valid GSTIN" });
      setIsGstVerified(false);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData, // Keep previous form data, including `gstin`
        GSTIN: gstNumber, // Ensure `gstin` remains intact
        // state: responseData?.taxpayerInfo?.pradr?.addr?.stcd || "",
        pinCode: responseData?.taxpayerInfo?.pradr?.addr?.pncd || "",
        vendorBusinessName: responseData?.taxpayerInfo?.tradeNam || "",
      }));
      setIsGstVerified(true);
    }
  };

  // handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...errors, GSTIN: "" });
    // setIsGstVerified(false);
    // Using a single state update with the callback function to ensure state consistency
    setFormData((prevFormData) => {
      const updatedData = { ...prevFormData, [name]: value };

      // Handle clearing related fields based on the current input
      if (name === "state") {
        updatedData.city = "";
        updatedData.district = "";
      } else if (name === "district") {
        updatedData.city = "";
      }

      return updatedData;
    });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      // Gst validation
      if (name === "GSTIN" && value.length === 15) {
        fetchDetailsThroughGSTIN(value.toUpperCase());
      }

      return newErrors;
    });
  };

  const emptyInputCheck = (fieldName, value) => {
    if (value === "") {
      setRequiredFields({ ...requiredFields, [fieldName]: true });
    } else {
      setRequiredFields({ ...requiredFields, [fieldName]: false });
    }
  };
  //-------------------------------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        customClass: {
          container: "my-swal",
        },
        icon: "error",
        text: "Something Went Wrong",
        color: "black",
      });
    } else {
      try {
        if (selectedVendorData._id) {
          // Update existing vendor
          try {
            const updatedFormData = {
              ...formData,
              // Here you can add any additional fields or modifications needed
              printingMachines: printMachineArray, // Assuming you want to update who made the change
              productAndServices: productArray,
              fabricationMachines: fabArray,
            };
            setIsLoading(true);
            const response = await axios.put(
              `${serverURL}/api/vendors/${selectedVendorData._id}`,
              updatedFormData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.status === 200) {
              Swal.fire({
                customClass: {
                  container: "my-swal",
                },
                icon: "success",

                text: "Vendor Update Successfully!",
                padding: "1em",
                color: "black", // Corrected color value
              }).then(() => {
                setIsModalOpen(false);
                getVendorList();
              });
            }
          } catch (error) {
            console.error("Error updating vendor:", error);
            Swal.fire({
              customClass: {
                container: "my-swal",
              },
              icon: "error",
              title: error.response.data.message,
              text: `Error in updating vendor: ${formData.vendorBusinessName}!`,
              padding: "1em",
            });
          }
        } else {
          // Create new vendor
          try {
            const updatedFormData = {
              ...formData,
              // Here you can add any additional fields or modifications needed
              printingMachines: printMachineArray, // Assuming you want to update who made the change
              productAndServices: productArray,
              fabricationMachines: fabArray,
            };
            setIsLoading(true);
            const response = await axios.post(
              `${serverURL}/api/vendors`,
              updatedFormData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            if (response.data.success) {
              Swal.fire({
                customClass: {
                  container: "my-swal",
                },
                icon: "success",
                text: response.data.message,
                padding: "1em",
                color: "green",
              }).then(() => {
                setIsModalOpen(false);
                getVendorList();
              });
            } else {
              console.log(response.data);
            }
          } catch (error) {
            console.error("Error creating vendor:", error);
            setIsLoading(true);
            Swal.fire({
              customClass: {
                container: "my-swal",
              },
              icon: "error",
              title: error.response.data.message,
              text: `Error in creating vendor !`,

              color: "black",
            });
          }
        }
      } catch (globalError) {
        setIsLoading(true);
        console.error("Unexpected error:", globalError);
        Swal.fire({
          customClass: {
            container: "my-swal",
          },
          icon: "error",
          title: "Oops...",
          text: "An unexpected error occurred!",
          padding: "1em",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Callback to handle uploaded file URLs
  const handleFilesUpload = (urls) => {
    setFormData({
      ...formData,
      imagesUploaded: urls, // Store the image as a Data URL for preview
    });
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedVendorData({});
  };
  const handleModalOpen = (e) => {
    e.preventDefault();
    setIsMachineModalOpen(true);
  };

  // printing machine
  const handleMachineModalClose = () => {
    setPmFormData({
      machinePrintingType: "",
      maxPrintSize: "",
      machineBrand: "",
      machineModelNo: "",
      dateOfPurchase: null,
      printingCapacityPerDay: "",
      quantity: "",
    });
    setIsPrintMachineEditing(null);
    setIsMachineModalOpen(false);
  };

  // Handle input changes
  const handleMachineChange = (e) => {
    setPmFormData({
      ...PmformData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Date Change (for Date of Purchase)
  const handleMachineDateChange = (newValue) => {
    setPmFormData({
      ...PmformData,
      dateOfPurchase: newValue,
    });
  };

  const handleMachineEdit = (e, index, item) => {
    const machineToEdit = printMachineArray[index];
    setPmFormData({
      machinePrintingType: machineToEdit.machinePrintingType,
      maxPrintSize: machineToEdit.maxPrintSize,
      machineBrand: machineToEdit.machineBrand,
      machineModelNo: machineToEdit.machineModelNo,
      dateOfPurchase: machineToEdit.dateOfPurchase
        ? dayjs(machineToEdit.dateOfPurchase)
        : null, // Ensure it's a Dayjs object
      printingCapacityPerDay: machineToEdit.printingCapacityPerDay,
      quantity: machineToEdit.quantity,
    });
    setIsPrintMachineEditing(true);
    setPrintMachineEditIndex(index);
    // Open the modal if you are using one for editing
    setIsMachineModalOpen(true);
  };
  const handleMachineDelete = (e, index, item) => {
    const updatedArray = [...printMachineArray]; // Copy the array
    updatedArray.splice(index, 1); // Remove the item at the specified index
    setPrintMachineArray(updatedArray);
  };

  const handleMachineSubmit = (e) => {
    e.preventDefault();

    // Check if the dateOfPurchase field is empty
    if (!PmformData.dateOfPurchase) {
      setPmError(true);
    } else {
      // Safely format the date if it exists
      const newDate = PmformData.dateOfPurchase.format("YYYY-MM-DD");

      const newMachine = {
        machinePrintingType: PmformData.machinePrintingType,
        maxPrintSize: PmformData.maxPrintSize,
        machineBrand: PmformData.machineBrand,
        machineModelNo: PmformData.machineModelNo,
        dateOfPurchase: newDate, // This can be null if no date is selected
        printingCapacityPerDay: PmformData.printingCapacityPerDay,
        quantity: PmformData.quantity,
      };

      if (isprintMachineEditing) {
        // Update the existing machine in the array
        const updatedMachines = [...printMachineArray];
        updatedMachines[printmachineeditIndex] = newMachine;
        setPrintMachineArray(updatedMachines);
        setIsPrintMachineEditing(false);
        setPrintMachineEditIndex(null);
      } else {
        // Add a new machine to the array
        setPrintMachineArray([...printMachineArray, newMachine]);
      }

      // Clear form fields after submission
      setPmFormData({
        machinePrintingType: "",
        maxPrintSize: "",
        machineBrand: "",
        machineModelNo: "",
        dateOfPurchase: null, // Reset date to null
        printingCapacityPerDay: "",
        quantity: "",
      });

      // Optionally close the modal if you're using one
      setIsMachineModalOpen(false);
      setPmError(false);
    }
  };

  // fabrication

  const handleFabModalOpen = () => {
    setIsFabModalOpen(true);
  };
  const handleFabChange = (e) => {
    setFabFormData({
      ...FabformData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFabSubmit = (e) => {
    e.preventDefault();
    const newDate = FabformData.dateOfPurchase
      ? FabformData.dateOfPurchase.format("YYYY-MM-DD")
      : null;
    const newFabrication = {
      category: FabformData.category,
      subCategory: FabformData.subCategory,
      wattage: FabformData.wattage,
      dateOfPurchase: newDate,
      numMachines: FabformData.numMachines,
      bedsize: FabformData.bedsize,
      machineBrand: FabformData.machineBrand,
      machineModelNo: FabformData.machineModelNo,
    };

    if (isfabEditing) {
      // Update the existing machine in the array
      const updatedFabrication = [...fabArray];
      updatedFabrication[fabeditIndex] = newFabrication;
      setFabArray(updatedFabrication);
      setIsFabEditing(false);
      setFabEditIndex(null);
    } else {
      // Add a new machine to the array
      setFabArray([...fabArray, newFabrication]);
    }

    // Optionally close the modal if you're using one

    setFabFormData({
      category: "",
      subCategory: "",
      wattage: "",
      dateOfPurchase: null,
      numMachines: "",
      bedsize: "",
      machineBrand: "",
      machineModelNo: "",
    });
    setIsFabModalOpen(false);
  };
  const handleFabModalClose = () => {
    setFabFormData({
      category: "",
      subCategory: "",
      wattage: "",
      dateOfPurchase: null,
      numMachines: "",
      bedsize: "",
      machineBrand: "",
      machineModelNo: "",
    });
    setIsFabModalOpen(false);
  };
  const handleMainCategoryChange = (e) => {
    setFabFormData((prevData) => ({
      ...prevData,
      category: e.target.value,
      subCategory: "", // Reset sub-category when main category changes
      wattage: "",
      dateOfPurchase: null,
      numMachines: "",
      bedsize: "",
      machineBrand: "",
      machineModelNo: "",
    }));
  };
  const handleFabricationEdit = (e, index, item) => {
    const fabToEdit = fabArray[index];
    setFabFormData({
      category: fabToEdit.category,
      numMachines: fabToEdit.numMachines,
      subCategory: fabToEdit.subCategory,
      wattage: fabToEdit.wattage,
      dateOfPurchase: fabToEdit.dateOfPurchase
        ? dayjs(fabToEdit.dateOfPurchase)
        : null, // Ensure it's a Dayjs object
      bedsize: fabToEdit.bedsize,
      machineBrand: fabToEdit.machineBrand,
      machineModelNo: fabToEdit.machineModelNo,
    });
    setIsFabEditing(true);
    setFabEditIndex(index);
    // Open the modal if you are using one for editing
    setIsFabModalOpen(true);
  };
  const handleFabricationDelete = (e, index, item) => {
    const updatedArray = [...fabArray]; // Copy the array
    updatedArray.splice(index, 1); // Remove the item at the specified index
    setFabArray(updatedArray);
  };

  // product and services
  const handleProductChange = (event) => {
    const { name, value, checked } = event.target;
    // If provideStoreFrontSignages is being updated
    if (name === "provideStoreFrontSignages") {
      setProductFormData((prevData) => ({
        ...prevData,
        provideStoreFrontSignages: value, // Update provideStoreFrontSignages
        typeofStoreFrontSignages: value
          ? prevData.typeofStoreFrontSignages
          : [], // Empty typeofStoreFrontSignages if unchecked
      }));
    } else {
      // Update other fields
      setProductFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleProductModalOpen = () => {
    setIsProductModalOpen(true);
  };
  const handleProductModalClose = () => {
    setProductFormData({
      provideStoreFrontSignages: false,
      typeofStoreFrontSignages: [],
      providePrintedMaterials: false,
      provideVinylInStoreBranding: false,
    });
    setIsProductEditing(false);
    setIsProductModalOpen(false);
  };
  const handleProductEdit = (e, index, item) => {
    const productToEdit = productArray[index];
    setProductFormData({
      provideStoreFrontSignages: productToEdit.provideStoreFrontSignages,
      typeofStoreFrontSignages: productToEdit.typeofStoreFrontSignages,
      providePrintedMaterials: productToEdit.providePrintedMaterials,
      provideVinylInStoreBranding: productToEdit.provideVinylInStoreBranding,
    });
    setIsProductEditing(true);
    setProductEditIndex(index);
    // Open the modal if you are using one for editing
    setIsProductModalOpen(true);
  };
  const handleProductDelete = (e, index, item) => {
    const updatedArray = [...productArray]; // Copy the array
    updatedArray.splice(index, 1); // Remove the item at the specified index
    setProductArray(updatedArray);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      provideStoreFrontSignages: ProductformData.provideStoreFrontSignages,
      typeofStoreFrontSignages: ProductformData.typeofStoreFrontSignages,
      providePrintedMaterials: ProductformData.providePrintedMaterials,
      provideVinylInStoreBranding: ProductformData.provideVinylInStoreBranding,
    };

    if (isProductEditing) {
      const updatedProduct = [...productArray];
      updatedProduct[productEditIndex] = newProduct;
      setProductArray(updatedProduct);
      setIsProductEditing(false);
      setProductEditIndex(null);
    } else {
      // Add a new machine to the array
      setProductArray([...productArray, newProduct]);
    }

    setProductFormData({
      provideStoreFrontSignages: false,
      typeofStoreFrontSignages: [],
      providePrintedMaterials: false,
      provideVinylInStoreBranding: false,
    });

    setIsProductModalOpen(false);
  };
  return (
    <div>
      <Dialog
        open={isModalOpen}
        // maxWidth="xl"
        fullScreen
        fullWidth
      >
        <div className="flex justify-between">
          <DialogTitle>Vendor Form</DialogTitle>
          <div
            onClick={handleClose}
            className="mx-5 my-4"
            style={{ cursor: "pointer" }}
          >
            <Cross />
          </div>
        </div>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <CustomInput
                    placeholder="Enter GSTIN"
                    title="GSTIN *"
                    size="small"
                    name="GSTIN"
                    required
                    value={formData?.GSTIN.toUpperCase()}
                    onChange={(e) => {
                      if (
                        !e.target.value.startsWith(" ") &&
                        e?.target?.value.length < 16
                      ) {
                        handleInputChange(e);
                      }
                    }}
                    errorMessage={
                      errors.GSTIN ? (
                        <span style={{ color: "var(--error-color)" }}>
                          Please Enter GSTIN
                        </span>
                      ) : null
                    }
                    error={errors.GSTIN}
                  />

                  {loading ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "60%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress color="inherit" size={20} />
                    </div>
                  ) : errors.GSTIN ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "47%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Cross
                        color="var(--error-color)"
                        fillcolor="var(--error-color)"
                      />
                    </div>
                  ) : isGstVerified ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "60%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <VerifiedTick
                        color="var(--third-color)"
                        fillcolor="var(--third-color)"
                      />
                    </div>
                  ) : null}
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel className={`${errors.state && "text-red-500"}`}>
                  State *
                </InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                  error={errors.state}
                  errorMessage={
                    errors.state ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter State
                      </span>
                    ) : null
                  }
                  value={formData?.state}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="state"
                    onBlur={(e) => {
                      emptyInputCheck(e.target.name, e.target.value);
                      if (saveButtonClicked) {
                        validateForm();
                      }
                    }}
                    value={formData?.state}
                    onChange={handleInputChange}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <p className="text-[1rem] text-[var(--light-gray)]">
                            State
                          </p>
                        );
                      }

                      return selected;
                    }}
                  >
                    {Object.keys(IndiaState["India"]).map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.state && (
                  <p className="font-normal text-[0.75rem] leading-[1.66] tracking-[0.03em] text-left mt-[4px] mr-[14px] mb-0 ml-[14px] text-red-500">
                    {errors.state}
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel className={`${errors.district && "text-red-500"}`}>
                  District *
                </InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                  error={errors.district}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="district"
                    onBlur={(e) => {
                      emptyInputCheck(e.target.name, e.target.value);
                      if (saveButtonClicked) {
                        validateForm();
                      }
                    }}
                    value={formData?.district}
                    onChange={handleInputChange}
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <p className="text-[1rem] text-[var(--light-gray)]">
                            District
                          </p>
                        );
                      }
                      return selected;
                    }}
                  >
                    {Object.keys(
                      IndiaState["India"]?.[formData?.state]?.districts || {}
                    ).map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.district && (
                  <p className="font-normal text-[0.75rem] leading-[1.66] tracking-[0.03em] text-left mt-[4px] mr-[14px] mb-0 ml-[14px] text-red-500">
                    {errors.district}
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel className={`${errors.city && "text-red-500"}`}>
                  City *
                </InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                  error={errors.city}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="city"
                    //-------------------------------------------------------
                    value={formData?.city || ""}
                    onChange={handleInputChange}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <p className="text-[1rem]  text-[var(--light-gray)]">
                            City
                          </p>
                        );
                      }
                      return selected;
                    }}
                  >
                    {IndiaState["India"]?.[formData?.state]?.districts?.[
                      formData?.district
                    ]?.cities?.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.city && (
                  <p className="font-normal text-[0.75rem] leading-[1.66] tracking-[0.03em] text-left mt-[4px] mr-[14px] mb-0 ml-[14px] text-red-500">
                    {errors.city}
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  name="division"
                  placeholder="Enter Division"
                  title="Division"
                  size="small"
                  onChange={(e) => {
                    if (!e.target.value.startsWith(" ")) {
                      handleInputChange(e);
                    }
                  }}
                  value={formData?.division}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  name="vendorBusinessName"
                  placeholder="Enter Vendor Business Name"
                  title="Vendor Business Name *"
                  size="small"
                  required
                  onChange={(e) => {
                    if (!e.target.value.startsWith(" ")) {
                      handleInputChange(e);
                    }
                  }}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                  errorMessage={
                    errors.vendorBusinessName ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter Vendor's Business Name
                      </span>
                    ) : null
                  }
                  error={errors.vendorBusinessName}
                  value={formData?.vendorBusinessName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter pincode"
                  name="pinCode"
                  title="Pin Code *"
                  type="number"
                  size="small"
                  required
                  value={formData?.pinCode}
                  onChange={(e) => {
                    if (
                      !e.target.value.startsWith(" ") &&
                      e.target.value.length < 7
                    ) {
                      handleInputChange(e);
                    }
                  }}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                  errorMessage={
                    errors.pinCode ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter PinCode
                      </span>
                    ) : null
                  }
                  error={errors.pinCode}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel
                  className={`${errors.typeOfBusiness && "text-red-500"}`}
                >
                  Type Of Business *
                </InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                >
                  <Select
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    displayEmpty
                    name="typeOfBusiness"
                    value={formData?.typeOfBusiness}
                    onChange={handleInputChange}
                    onBlur={(e) => {
                      emptyInputCheck(e.target.name, e.target.value);
                      if (saveButtonClicked) {
                        validateForm();
                      }
                    }}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <p className="text-[1rem]  text-[var(--light-gray)]">
                            Type Of Business
                          </p>
                        );
                      }

                      return selected;
                    }}
                  >
                    <MenuItem value="One Person Company">
                      One Person Company
                    </MenuItem>
                    <MenuItem value="Sole Proprietor">Sole Proprietor</MenuItem>
                    <MenuItem value="Partnership">Partnership</MenuItem>
                    <MenuItem value="Foreign Company">Foreign Company</MenuItem>
                    <MenuItem value="LLP">LLP</MenuItem>
                    <MenuItem value="Private Limited Company">
                      Private Limited Company
                    </MenuItem>
                    <MenuItem value="Limited Company">Limited Company</MenuItem>
                  </Select>
                </FormControl>
                {errors.typeOfBusiness && (
                  <p className="font-normal text-[0.75rem] leading-[1.66] tracking-[0.03em] text-left mt-[4px] mr-[14px] mb-0 ml-[14px] text-red-500">
                    {/* Please Select a Business Type */}
                    {errors.typeOfBusiness}
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Owner's Name"
                  title="Owner Name *"
                  size="small"
                  name="ownerName"
                  required
                  value={formData?.ownerName}
                  onChange={(e) => {
                    if (!e.target.value.startsWith(" ")) {
                      handleInputChange(e);
                    }
                  }}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                  errorMessage={
                    errors.ownerName ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter Owner's Name
                      </span>
                    ) : null
                  }
                  error={errors.ownerName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Owner's Primary Contact Number"
                  title="Owner Primary Contact Number *"
                  type="number"
                  name="ownerPrimaryContactNo"
                  size="small"
                  required
                  value={formData?.ownerPrimaryContactNo}
                  onChange={(e) => {
                    if (
                      !e.target.value.startsWith(" ") &&
                      e.target.value.length < 11
                    ) {
                      handleInputChange(e);
                    }
                  }}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                  errorMessage={
                    errors.ownerPrimaryContactNo ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter a valid Phone Number
                      </span>
                    ) : null
                  }
                  error={errors.ownerPrimaryContactNo}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Owner Secondary Contact Number"
                  title="Owner Secondary Contact No"
                  type="number"
                  size="small"
                  name="ownerSecondaryContactNo"
                  error={errors.ownerSecondaryContactNo}
                  errorMessage={
                    errors.ownerSecondaryContactNo ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter a valid Phone Number
                      </span>
                    ) : null
                  }
                  value={formData?.ownerSecondaryContactNo}
                  onBlur={() => {
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                  onChange={(e) => {
                    if (
                      !e.target.value.startsWith(" ") &&
                      e.target.value.length < 11
                    ) {
                      handleInputChange(e);
                    }
                  }}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Address"
                  name="address"
                  title="Address *"
                  size="small"
                  multiline
                  required
                  value={formData?.address}
                  onChange={(e) => {
                    if (!e.target.value.startsWith(" ")) {
                      handleInputChange(e);
                    }
                  }}
                  onBlur={(e) => {
                    emptyInputCheck(e.target.name, e.target.value);
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                  errorMessage={
                    errors.address ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter Address
                      </span>
                    ) : null
                  }
                  error={errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Business Location"
                  title="Business Location"
                  name="businessLocation"
                  size="small"
                  value={formData?.businessLocation}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Website URL"
                  title="Website"
                  name="website"
                  size="small"
                  value={formData?.website}
                  onChange={handleInputChange}
                  errorMessage={
                    errors.website ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please Enter Valid URL
                      </span>
                    ) : null
                  }
                  error={errors.website}
                  onBlur={(e) => {
                    if (saveButtonClicked) {
                      validateForm();
                    }
                    setRequiredFields({
                      ...requiredFields,
                      website: validate(e.target.value, "url"),
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Reliability</InputLabel>
                <div className="mt-2">
                  <FormControl fullWidth size="small">
                    <Select
                      inputProps={{
                        "aria-label": "Without label",
                        color: "#e5e7eb",
                      }}
                      displayEmpty
                      name="reliability"
                      value={formData?.reliability}
                      onChange={handleInputChange}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return (
                            <p className="text-[1rem]  text-[var(--light-gray)]">
                              Choose reliability
                            </p>
                          );
                        }

                        return selected;
                      }}
                    >
                      <MenuItem value="5">5 Star</MenuItem>
                      <MenuItem value="4">4 Star</MenuItem>
                      <MenuItem value="3">3 Star</MenuItem>
                      <MenuItem value="2">2 Star</MenuItem>
                      <MenuItem value="1">1 Star</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Years Spent In This Business"
                  title="Total Years in Business"
                  name="yearsInBusiness"
                  type="number"
                  size="small"
                  value={formData?.yearsInBusiness}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Number Of Employees"
                  name="numberOfEmployees"
                  title="Number of Employees"
                  type="number"
                  size="small"
                  value={formData?.numberOfEmployees}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Number Of Skilled Manpower"
                  title="Number of Skilled Manpower"
                  type="number"
                  name="numberOfSkilledManpower"
                  size="small"
                  value={formData?.numberOfSkilledManpower}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Number Of Unskilled Manpower"
                  title="Number of Unskilled Manpower"
                  type="number"
                  name="numberOfUnskilledManpower"
                  size="small"
                  value={formData?.numberOfUnskilledManpower}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Registered in ESI/PF</InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                >
                  <Select
                    name="registeredInESIPF"
                    value={formData?.registeredInESIPF}
                    onChange={(e) =>
                      handleInputChange({
                        target: {
                          name: e.target.name,
                          value: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter PAN Number"
                  name="PANNumber"
                  title="PAN Number"
                  size="small"
                  value={formData?.PANNumber}
                  error={errors.PANNumber}
                  errorMessage={
                    errors.PANNumber ? (
                      <span style={{ color: "var(--error-color)" }}>
                        Please enter a valid pan number
                      </span>
                    ) : null
                  }
                  onChange={(e) => {
                    if (e.target.value.length < 11) handleInputChange(e);
                  }}
                  onBlur={(e) => {
                    if (saveButtonClicked) {
                      validateForm();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Bank Account Number"
                  name="bankAccountNumber"
                  title="Bank Account Number"
                  size="small"
                  value={formData?.bankAccountNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Bank Name"
                  name="bankName"
                  title="Bank Name"
                  size="small"
                  value={formData?.bankName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Bank IFSC Code"
                  name="bankIFSCCode"
                  title="Bank IFSC Code"
                  size="small"
                  value={formData?.bankIFSCCode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Avg Turnover of last 3 Years in lakhs"
                  title="Avg. Turnover in Lakhs(last 3 years)"
                  name="avgTurnoverLast3Years"
                  type="number"
                  size="small"
                  value={formData?.avgTurnoverLast3Years}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  placeholder="Enter Production Area"
                  title="Production Area (in sq. ft)"
                  name="productionArea"
                  type="number"
                  size="small"
                  value={formData?.productionArea}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Factors that will help you scale?</InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                >
                  <Select
                    name="scalingFactors"
                    value={formData?.scalingFactors || []}
                    displayEmpty
                    multiple={true}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <p className="text-[1rem]  text-[var(--light-gray)]">
                            Choose Scaling factors
                          </p>
                        );
                      }

                      return selected.join(",");
                    }}
                    onChange={(e) =>
                      handleInputChange({
                        target: {
                          name: e.target.name,
                          value: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value="Skilled manpower">
                      <Checkbox
                        checked={formData?.scalingFactors.includes(
                          "Skilled manpower"
                        )}
                      />
                      <ListItemText primary="Skilled manpower" />
                    </MenuItem>
                    <MenuItem value="Capital">
                      <Checkbox
                        checked={formData?.scalingFactors.includes("Capital")}
                      />
                      <ListItemText primary="Capital" />
                    </MenuItem>
                    <MenuItem value="Marketing">
                      <Checkbox
                        checked={formData?.scalingFactors.includes("Marketing")}
                      />
                      <ListItemText primary="Marketing" />
                    </MenuItem>
                    <MenuItem value="Mfg. Capability">
                      <Checkbox
                        checked={formData?.scalingFactors.includes(
                          "Mfg. Capability"
                        )}
                      />
                      <ListItemText primary="Mfg. Capability" />
                    </MenuItem>
                    <MenuItem value="Machinery">
                      <Checkbox
                        checked={formData?.scalingFactors.includes("Machinery")}
                      />
                      <ListItemText primary="Machinery" />
                    </MenuItem>
                    <MenuItem value="Personal Factors">
                      <Checkbox
                        checked={formData?.scalingFactors.includes(
                          "Personal Factors"
                        )}
                      />
                      <ListItemText primary="Personal Factors" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Status</InputLabel>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ marginTop: "0.5rem" }}
                >
                  <Select
                    name="status"
                    value={formData?.status}
                    onChange={(e) =>
                      handleInputChange({
                        target: {
                          name: e.target.name,
                          value: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Blacklisted">Blacklisted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <hr className="m-2"></hr>
            {/* printing machine */}
            <div>
              <div className="flex justify-between items-center bg-blue-500 p-2">
                <h4 className="mx-2 font-bold text-lg">Printing</h4>
                <AddIcon
                  onClick={handleModalOpen}
                  className="mx-2 font-bold text-lg cursor-pointer"
                />
              </div>
              <div className="w-full bg-gray-100 py-6 px-4">
                {printMachineArray && printMachineArray.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {printMachineArray.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="relative rounded-xl bg-white p-6 shadow-lg"
                        >
                          {/* Card Content */}
                          <h2 className="text-xl font-bold mt-6 mb-2">
                            {item.machinePrintingType}
                          </h2>
                          <p className="text-gray-600 mb-1">
                            <strong>Max. Print Size:</strong>{" "}
                            {item.maxPrintSize}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <strong>Machine Brand:</strong> {item.machineBrand}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <strong>Machine Model No.:</strong>{" "}
                            {item.machineModelNo}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <strong>Date of Purchase:</strong>{" "}
                            {item.dateOfPurchase.split("T")[0]}
                          </p>
                          <p className="text-gray-600">
                            <strong>Printing Capacity / Day:</strong>{" "}
                            {item.printingCapacityPerDay}
                          </p>
                          <p className="text-gray-600">
                            <strong>Quantity:</strong> {item.quantity}
                          </p>
                          {/* Edit and Delete Buttons */}
                          <div className="absolute top-3 right-3 flex space-x-2">
                            <IconButton
                              size="small"
                              color="primary"
                              aria-label="edit"
                              onClick={(e) => handleMachineEdit(e, index, item)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              aria-label="delete"
                              onClick={(e) =>
                                handleMachineDelete(e, index, item)
                              }
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center mt-4">
                    No machine data available
                  </p>
                )}
              </div>
            </div>
            {/* fabrication */}
            <div>
              <div className="flex justify-between items-center bg-blue-300 p-2 mt-4">
                <h4 className="mx-2 font-bold text-lg">Fabrication</h4>
                <AddIcon
                  onClick={handleFabModalOpen}
                  className="mx-2 font-bold text-lg cursor-pointer"
                />
              </div>
              <div className="w-full bg-gray-100 py-6 px-4">
                {fabArray && fabArray.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {fabArray.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="relative rounded-xl bg-white p-6 shadow-lg"
                        >
                          {/* Card Content */}
                          <h2 className="text-xl font-bold mt-6 mb-2">
                            {item.category}
                          </h2>
                          {item.subCategory && (
                            <p className="text-gray-600 mb-1">
                              <strong>Sub Category:</strong> {item.subCategory}
                            </p>
                          )}
                          {item.numMachines && (
                            <p className="text-gray-600 mb-1">
                              <strong>No of Machine:</strong> {item.numMachines}
                            </p>
                          )}
                          {item.wattage && (
                            <p className="text-gray-600 mb-1">
                              <strong>Machine Wattage:</strong> {item.wattage}
                            </p>
                          )}
                          {item.dateOfPurchase && (
                            <p className="text-gray-600 mb-1">
                              <strong>Date of Purchase:</strong>{" "}
                              {item.dateOfPurchase.split("T")[0]}
                            </p>
                          )}
                          {item.bedsize && (
                            <p className="text-gray-600 mb-1">
                              <strong>Bed Size:</strong> {item.bedsize}
                            </p>
                          )}
                          {item.machineBrand && (
                            <p className="text-gray-600 mb-1">
                              <strong>Machine Brand:</strong>{" "}
                              {item.machineBrand}
                            </p>
                          )}
                          {item.machineModelNo && (
                            <p className="text-gray-600 mb-1">
                              <strong>Machine Model No:</strong>{" "}
                              {item.machineModelNo}
                            </p>
                          )}
                          <div className="absolute top-3 right-3 flex space-x-2">
                            <IconButton
                              size="small"
                              color="primary"
                              aria-label="edit"
                              onClick={(e) =>
                                handleFabricationEdit(e, index, item)
                              }
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              aria-label="delete"
                              onClick={(e) =>
                                handleFabricationDelete(e, index, item)
                              }
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center mt-4">
                    No Fabrication data available
                  </p>
                )}
              </div>
            </div>
            {/* product and services */}
            <div>
              <div className="flex justify-between items-center bg-blue-100 p-2 mt-4">
                <h4 className="mx-2 font-bold text-lg">Product and Services</h4>
                <AddIcon
                  onClick={handleProductModalOpen}
                  className="mx-2 font-bold text-lg cursor-pointer"
                />
              </div>
              <div className="w-full bg-gray-100 py-6 px-4">
                {productArray && productArray.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {productArray.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="relative rounded-xl bg-white p-6 shadow-lg"
                        >
                          {/* Example of conditional rendering for fields */}
                          {item.provideStoreFrontSignages && (
                            <div className="mb-4">
                              <p className="font-semibold">
                                Store Front Signages: Yes
                              </p>
                              <p>{item.typeofStoreFrontSignages.join(", ")}</p>
                            </div>
                          )}

                          {item.providePrintedMaterials && (
                            <div className="mb-4">
                              <p className="font-semibold">
                                Printed Materials: Yes
                              </p>
                            </div>
                          )}

                          {item.provideVinylInStoreBranding && (
                            <div className="mb-4">
                              <p className="font-semibold">
                                Vinyl In-Store Branding: Yes
                              </p>
                            </div>
                          )}

                          <div className="absolute top-3 right-3 flex space-x-2">
                            <IconButton
                              size="small"
                              color="primary"
                              aria-label="edit"
                              onClick={(e) => handleProductEdit(e, index, item)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              aria-label="delete"
                              onClick={(e) =>
                                handleProductDelete(e, index, item)
                              }
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center mt-4">
                    No Product and Services data available
                  </p>
                )}
              </div>
            </div>
          </form>
        </DialogContent>
        <div className="pl-[20px] pr-[20px] py-0">
          <FileUploader
            initialFiles={formData.imagesUploaded}
            onFilesUpload={handleFilesUpload}
            typeOfFilesAllowed={"image/*,video/*"}
          />
        </div>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <CustomButton
            type="submit"
            isLoading={isLoading}
            disabled={!isGstVerified}
            text={selectedVendorData._id ? "Update" : "Save"}
            color="primary"
            style={{ cursor: !isGstVerified ? "not-allowed" : "pointer" }}
            onClick={(e) => {
              // setIsLoading(true)
              setSaveButtonClicked(true);
              handleSubmit(e);
            }}
          />
        </DialogActions>
      </Dialog>
      {/* PrintMachine */}
      <PrintMachineModal
        isOpen={isMachineModalOpen}
        handleSubmit={handleMachineSubmit}
        handleChange={handleMachineChange}
        handleDateChange={handleMachineDateChange}
        handleClose={handleMachineModalClose}
        formData={PmformData}
        printingOptions={printingOptions}
        isEditing={isprintMachineEditing}
        error={pmerror}
      />
      {/* Fabrication */}
      <FabricationModal
        isOpen={isfabModalOpen}
        handleSubmit={handleFabSubmit}
        handleChange={handleFabChange}
        handleClose={handleFabModalClose}
        handleMainCategoryChange={handleMainCategoryChange}
        formData={FabformData}
        setFormData={setFabFormData}
        isEditing={isfabEditing}
      />
      {/* ProductsServicesModal */}
      <ProductsServicesModal
        isOpen={isProductModalOpen}
        formData={ProductformData}
        handleChange={handleProductChange}
        handleClose={handleProductModalClose}
        handleSubmit={handleProductSubmit}
        isEditing={isProductEditing}
      />
    </div>
  );
};

export default VendorOnboardingForm;
