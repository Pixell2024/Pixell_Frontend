import React from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Navbar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const activeMenu = location.pathname.split("/").pop();
  const serverURL = process.env.REACT_APP_URL;

  const getActiveMenuName = () => {
    switch (activeMenu) {
      case "dashboard":
        return "Dashboard";
      case "installation-partner":
        return "Installation Partner";
      case "vendorDetails":
        return "Vendor Details";
      case "clientDetails":
        return "Client Details";

      default:
        return "";
    }
  };

  const handleLogout = () => {
    Swal.fire({
      text: "Are you sure you want to Logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Hit the logout API using Axios
          const response = await axios.post(`${serverURL}/api/auth/logout`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (response.status === 200) {
            // If the API call was successful, clear local storage
            Swal.fire({
              text: response.data.message,
              icon: "success",
            }).then(() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/adminportal";
            });
          } else {
            // Handle unsuccessful responses
            Swal.fire({
              text: "Failed to logout. Please try again.",
              icon: "error",
            });
          }
        } catch (error) {
          // Handle any network errors or exceptions
          console.error("Logout error:", error);
          Swal.fire({
            text: "An error occurred. Please try again.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div
      className={`flex flex-grow  justify-between items-center max-w-full text-white p-2 ${
        isOpen ? `ml-64 translate-x ` : `ml-20`
      } `}
      style={{ background: "var(--primary-color)", height: "12vh" }}
    >
      {/* <img
        src="/assests/images/Sign Walla logo.png"
        alt="Signwalla_Logo"
        // width={100}
        // height={100}
        className="max-w-[140px] h-auto m-2.5"
      /> */}
      <h1 className="text-[30px] text-black ml-2">Pixell</h1>

      <div className="menu-name text-xl font-semibold">
        {getActiveMenuName()}
      </div>

      <div className="logout">
        <button onClick={handleLogout} className="bg-black p-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
