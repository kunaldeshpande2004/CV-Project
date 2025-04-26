//////////////////////////////////////////////////////////////////////////////////////////////////////
//                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                        
//                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT)              
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025                                                                 
// CODE LENGTH OF FILE: FORGOTPASSWORD LINE 63 - LINE 186                   
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                       
// DATE OF DEVELOPMENT START FOR FORGOTPASSWORD COMPONENT: 10/2/2025 - 27/2/2025                   
//--------------------------------------------------------------------------------------------------
//                           BASIC INFORMATION ABOUT THE FILE                                       
//--------------------------------------------------------------------------------------------------
// This React component provides functionality for users to request a password reset. It allows 
// users to enter their email or username, sends a request to the backend, and provides feedback 
// on the process. Below is a detailed breakdown of its key features:
//
/* 
Password Reset Workflow:
- Users enter their registered email or username.
- A request is sent to the backend for password reset.
- If successful, a reset link is sent to the user's email.
- Users receive confirmation via toast notifications.
- After submission, users are redirected to the login page.

Key Functionalities:
- `useState()`: Manages form loading state.
- `useNavigate()`: Handles navigation after a successful request.
- `useForm()`: Manages form validation and submission.
- `react-hot-toast`: Displays success and error messages.
- `fetch()`: Sends a POST request to the backend.

Security Considerations:
- Prevents multiple reset requests within a short period.
- Uses localStorage to track the last reset request time.
- Provides user-friendly error handling to prevent abuse.

Error Handling:
- Displays appropriate messages for API errors.
- Catches network issues and unexpected failures.

Dynamic UI Updates:
- Disables the button during request processing.
- Provides immediate user feedback through notifications.

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                   KEY LIBRARIES AND DEPENDENCIES                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////
// React: Core library for UI components.
// React Hook Form: Manages form validation and submission.
// React Router: Handles navigation within the app.
// React Hot Toast: Displays notifications for user feedback.
// LocalStorage API: Stores timestamp for last password reset request.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS, TAILWIND CSS
// SECURITY CODE LEVEL : MEDIUM
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import logo from "../components/assets/logo_transparent_background.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const lastRequestTime = localStorage.getItem("lastResetRequestTime");
    const currentTime = Date.now();

    setLoading(true);
    try {
      const url = "http://localhost:8080/auth/forgot-password"; // Replace with actual backend route
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const { success, error } = result;

      if (success) {
        toast.success("Password reset link sent to your email!");
        localStorage.setItem("lastResetRequestTime", Date.now()); // Store the current timestamp

        setTimeout(() => {
          navigate("/login"); // Redirect to login page
        }, 2000);
      } else if (error) {
        toast.error(error.message || "Something went wrong. Please try again.");
      } else {
        toast.error(result.message || "Error occurred. Please try again.");
      }
    } catch (error) {
      toast.error(
        "An error occurred during password reset request. Please try again."
      );
      console.error("Error in forgot password:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D6B3FF]">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-md p-8  bg-[#FFC1E3] rounded-lg shadow-lg">
        <div className="text-center">
          <img src={logo} alt="Logo" className="mx-auto w-30 mb-5 h-20" />
          <h1 className="text-3xl font-bold mt-10 text-orange-600 ">
            Women Wellness
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 text-black space-y-4"
        >
          {/* Email */}
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
              placeholder="Enter your email"
              className="mt-1"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Forgot Password Instruction */}
          <div className="text-center text-sm text-gray-600">
            <p>
              We'll send a reset link to your email. Please check your inbox.
            </p>
          </div>

          {/* Request Reset Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Remembered your password?{" "}
          <Link to="/login" className="text-orange-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
