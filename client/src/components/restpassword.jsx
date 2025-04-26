//////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED ///////////////////////
// ////////////////////// PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT)
// CODE CLEANED LAST ON : 27-02-2025 //
// CODE LENGTH OF FILE RESETPASSWORD LINE 55 - LINE 209 //
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS //
// DATE OF DEVELOPMENT START OF RESETPASSWORD.JSX 26/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component handles the "Reset Password" functionality for the Pregnancy Tracker application.
// It is responsible for verifying a password reset token, collecting the new password from the user, 
// performing client-side validation, and then sending the new password to the backend for final update.

/* Key Functionalities:

- Extracts the password reset token from the URL.
- Provides a form for entering and confirming a new password.
- Validates password strength (length, uppercase, lowercase, number, special character).
- Displays success/failure notifications using react-hot-toast.
- Handles navigation back to the login page upon successful password reset.
- Includes proper error handling for backend failures and network errors.
- Protects sensitive password inputs with show/hide functionality.

*/

// Key Libraries and Dependencies
/*
React: Core library for building the UI.

react-hook-form: Manages form state, validation, and errors.

react-router-dom: Handles URL and navigation.

react-hot-toast: Displays success/error notifications.

lucide-react: Provides icons for password visibility toggle.

Tailwind CSS: For styling the component UI.

*/

// Data Flow:
/*
- Token is extracted from the URL query parameter.
- Password form data is captured and validated.
- Validated data is sent to backend API (/auth/reset-password).
- Backend response is handled to show success/failure messages.
- User is redirected to login page after successful reset.
*/

// ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS, TAILWIND CSS
// SECURITY CODE LEVEL : LOW
//////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../components/assets/logo_transparent_background.png";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // Extract token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const [captchaValue, setCaptchaValue] = useState(null); 
  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    else if (data.newPassword) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#%^~])[A-Za-z\d@$!%*?&_#%^~]{8,}$/;
  
      if (!passwordRegex.test(data.newPassword)) {
          toast.error("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
          return;
      } 
  }

  if (!captchaValue) {
    toast.error("Please verify the reCAPTCHA.");
    return;
  }
  

    try {
      const url = "http://localhost:8080/auth/reset-password";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: data.newPassword , recaptcha: captchaValue }),
      });
      const result = await response.json();
      const { success, message } = result;

      if (success) {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(message || "Password reset failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error in reset password:", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-5 min-h-screen bg-[#D6B3FF]">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-md p-8 bg-[#FFC1E3] rounded-lg shadow-lg">
        <div className="text-center w-50 ">
          <img
            src={logo}
            alt="Logo"
            className="mx-auto w-40 mb-2 h-35"
          />
          <h1 className="text-3xl font-bold mt-4 text-orange-600 mb-6 ">Women Wellness</h1>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-orange-600">Reset Password</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 text-black space-y-4">
          {/* New Password */}
          <div>
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                {...register("newPassword", { required: "New password is required" })}
                placeholder="New Password"
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
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                {...register("confirmPassword", { required: "Confirm password is required" })}
                placeholder="Confirm Password"
                className="mt-1"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

           {/* reCAPTCHA */}
         <div className="flex justify-center mt-4">
            <ReCAPTCHA sitekey='6LcYbOMqAAAAABnhImukf_SpFrE6w7e_y2vdACr3' id='captcha' onChange={(value) => setCaptchaValue(value)} />
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;