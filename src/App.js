import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import AdminPortal from "./components/AdminPortal";
import ClientSignup from "./components/ClientDashboard/SignUpForm/SignupPage/signup";
import ClientOtp from "./components/ClientDashboard/SignUpForm/SignupPage/otp";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientProtectedRoute from "./components/ClientDashboard/SignUpForm/ClientProtectedRoute";
import OrganizationSetupForm from "./components/ClientDashboard/SignUpForm/ClientProfile/Setup";
import MainDashBoard from "./components/RFPDashboard/MainDashBoard";
import ComingSoon from "./components/LandingPages/Comingsoon";
// import Campaigns from "./components/RFPDashboard/Campaigns";
import CompanyView from "./components/AdminportalFolder/CompanyView";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<ComingSoon />} />
        <Route path="/adminportal" element={<LoginForm />} />
        <Route
          path="/adminportal/*"
          element={
            <ProtectedRoute>
              <AdminPortal />
            </ProtectedRoute>
          }
        />
        <Route path="/user" element={<ClientSignup />} />

        <Route path="/user/otp" element={<ClientOtp />} />

        <Route path="/user/profile" element={<OrganizationSetupForm />} />

        <Route
          path="/user/*"
          element={
            <ClientProtectedRoute>
              <MainDashBoard />
            </ClientProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
