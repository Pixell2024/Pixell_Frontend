import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./AdminportalFolder/Sidebar";
import Navbar from "./AdminportalFolder/Navbar";
import Vendor from "./AdminportalFolder/Vendor";
import Client from "./AdminportalFolder/Client";
import InstallationPartner from "./AdminportalFolder/InstallationPartner";
import axios from "axios";
import CompanyView from "./AdminportalFolder/CompanyView";

const AdminPortal = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const serverURL = process.env.REACT_APP_URL;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token is found, redirect to login
      navigate("/adminportal");
    } else {
      // Verify the token with the backend
      axios
        .get(`${serverURL}/api/auth/protected-route`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data.user); // Store user data if needed
        })
        .catch((error) => {
          console.error("Authentication failed", error);
          navigate("/adminportal"); // Redirect to login if the token is invalid
        });
    }
  }, [navigate]);

  if (!user) {
    return null; // Optionally render a loading spinner or similar here
  }

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-grow max-w-full">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div
          className={` ${isOpen ? `ml-64` : `ml-20`} max-w-full    `}
          style={{ height: "84vh", backgroundColor: "rgb(244, 244, 244)" }}
        >
          <Routes>
            {/* Conditionally render the Vendor route only if user is authenticated */}
            {user && <Route path="vendorDetails" element={<Vendor />} />}
            {user && <Route path="clientDetails" element={<Client />} />}
            {user && (
              <Route
                path="installation-partner"
                element={<InstallationPartner />}
              />
            )}

            {/* You can also add other protected routes here */}
            {/* <Route path="dashboard" element={<Dashboard />} />
            <Route path="installation-partner" element={<InstallationPartner />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
