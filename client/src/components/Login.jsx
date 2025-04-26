//////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED //////////////////////
// /////////////////// PREGNANCY TRACKER SOURCE CODE VERSION 2.0 (READY FOR DEPLOYMENT)
// CODE CLEANED LAST ON : 27-02-2025 //
// CODE LENGTH OF FILE LOGIN.JSX LINE 54 - LINE 228
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS //
// DATE OF DEVELOPMENT START OF LOGIN.JSX 26/2/2025 - 27/2/2025
// ///////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component serves as the login interface for the Pregnancy Tracker application. 
// It handles user authentication through a medical portal where healthcare professionals can log in
// to access critical data related to patients, reports, and analysis.
// 
// The form includes username/email and password inputs with validation and error handling.
// Upon successful login, user session data (JWT Token, Full Name, Medical ID) is stored
// in session storage and the user is redirected to the dashboard.
//
// Features:
// 1. Secure credential input with toggle visibility for passwords.
// 2. Form validation with error messages.
// 3. API call to backend authentication service.
// 4. Toast notifications for success and error messages.
// 5. Navigation to Forgot Password and Sign Up pages.
//
// Key Libraries and Dependencies:
/*
React: Core library for building the UI.

react-hook-form: Manages form validation and state.

react-router-dom: Handles navigation between screens.

lucide-react: Provides eye icon for password visibility toggle.

react-hot-toast: Displays success and error notifications.

Tailwind CSS: Handles component styling.
*/
// Data Flow:
/*
User credentials are sent to backend API at /auth/login.

Backend returns success status, JWT token, and user information.

Token and user data are saved to session storage for later requests.

User is redirected to the main dashboard after successful login.
*/
// ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS, TAILWIND CSS
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import logo from "../components/assets/logo_transparent_background.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./auth";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const { login } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [captchaValue, setCaptchaValue] = useState(null); // Store reCAPTCHA response
  const onSubmit = async (data) => {
    if (!captchaValue) {
      toast.error("Please verify the reCAPTCHA.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptcha: captchaValue }), // Send reCAPTCHA token
      });

      const result = await response.json();
      const { success, jwttoken, fullName, medicalId, specialization } = result;

      if (success) {
        toast.success("Login successful!");
        login(fullName);
        sessionStorage.setItem("token", jwttoken);
        sessionStorage.setItem("loggedInuser", fullName);
        sessionStorage.setItem("sp", specialization);
        sessionStorage.setItem("medicalId", medicalId);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(result.message || "Login failed.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5  bg-[#D6B3FF]">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full h-[650px] max-w-md p-8  bg-[#FFC1E3] rounded-lg shadow-lg">
        <div className="text-center w-50">
          <img
            src={logo} // Replace with your logo path
            alt="Logo"
            className="mx-auto w-40 mb-3 h-35"
          />
          <h1 className="text-3xl font-bold mt-5 text-orange-600 ">
            Women Wellness
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 text-black space-y-4"
        >
          {/* Username/Email */}
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Username/Email
            </Label>
            <Input
              type="text"
              id="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Username/Email"
              className="mt-1"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password", { required: "Password is required" })}
                placeholder="Password"
                className="mt-1"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LcYbOMqAAAAABnhImukf_SpFrE6w7e_y2vdACr3"
              id="captcha"
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>

          {/* Forgot Password */}
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-bold  text-orange-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
