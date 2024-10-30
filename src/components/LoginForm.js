import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const serverURL = process.env.REACT_APP_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(`${serverURL}/api/auth/login`, {
        email,
        password,
      });
      const { token, role, userId } = response.data;

      // Save the token in local storage (or any other storage)
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // Check the role and navigate accordingly
      if (role === 0) {
        navigate("/adminportal/vendorDetails");
      } else if (role === -1) {
        setIsLoading(false);
        navigate("/adminportal/vendorDetails");
      } else {
        setError("Unauthorized access");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        Swal.fire({
          icon: "error",
          text: err.response.data.message,
        });
        setIsLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          text: err.response.data.message,
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 mt-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 mt-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {isLoading ? (
            <div className="flex justify-center align-center">
              Please Wait ...{" "}
              <CircularProgress className="ml-2" size={20} color="inherit" />
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
