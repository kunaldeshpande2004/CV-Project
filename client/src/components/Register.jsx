//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED///////////////////////
//////////////////////// WOMEN WELLNESS PLATFORM - SIGNUP FORM COMPONENT ////////////////////////
//////////////////////// SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT) ////////////////////////
// CODE CLEANED LAST ON : 27-02-2025
// CODE LENGTH OF FILE SIGNUPFORM.JSX LINE 82 - LINE 389
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 6 CHECKS
// DATE OF DEVELOPMENT START OF SIGNUPFORM.JSX 25/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component is part of the Women Wellness Platform designed for doctors and medical 
// professionals to register on the platform. Below is a detailed breakdown of the code's structure, 
// functionality, and key features:

/* 
User Registration:

Doctors can register by providing personal details such as name, email, specialization, 
hospital name, and medical license/ID.

The component supports selection of predefined specializations, with an "Other" option for flexibility.

Password Validation:

Strong password enforcement (minimum 8 characters, uppercase, lowercase, number, special character).

Dynamic UI Components:

Dynamic input fields based on specialization selection.

Password visibility toggles for both password and confirm password fields.

Notifications and Feedback:

Real-time error handling using react-hot-toast for immediate feedback.

Redirection to login page on successful signup.

Security and Validation:

Form fields validated with react-hook-form.
Password confirmation logic implemented directly in the onSubmit handler.

Error handling for backend API responses (network errors, validation errors, etc.).

*/

// Key Libraries and Dependencies
/*
React: Core library for building the UI.

React Router: Handles navigation within the app.

react-hook-form: Manages form state and validation.

lucide-react: Provides icons for the UI (Eye, EyeClosed).

react-hot-toast: Displays notifications and error messages.

Tailwind CSS: Provides styling and responsive design.

*/

// Data Flow:
/*
User fills the registration form and submits.

Form data is validated locally using react-hook-form.

If valid, data is sent to backend via HTTP POST request to the signup API.

On successful response, user is redirected to login page.

On failure, appropriate error message is shown using react-hot-toast.
*/

// ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Eye, EyeClosed } from "lucide-react";
import logo from "../components/assets/logo_transparent_background.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate , Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  const [captchaValue, setCaptchaValue] = useState(null); 
  const onSubmit = async (data) => {
    const { password, confirmPassword, ...payload } = data;
  
    // Add the password back to the payload
    payload.password = password;
  
    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    if (!captchaValue) {
      toast.error("Please verify the reCAPTCHA.");
      return;
    }
  
    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, recaptcha: captchaValue }), // Send reCAPTCHA token
      });
  
      const result = await response.json();
      const { success, error } = result;
  
      if (success) {
        toast.success("Signup successful! Welcome to Women Welllness.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        
        toast.error("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character." || "Signup failed.");
      } else {
        toast.error(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during signup. Please try again.");
    }
  };

  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherSpecialization, setOtherSpecialization] = useState('');

  const handleSpecializationChange = (value) => {
    if (value === 'Other') {
      setIsOtherSelected(true); // Show the input field for manual entry
      setValue('specialization', ''); // Clear the specialization value
    } else {
      setIsOtherSelected(false); // Hide the input field
      setValue('specialization', value); // Update the form state with the selected value
    }
  };

  const handleOtherSpecializationChange = (e) => {
    const value = e.target.value;
    setOtherSpecialization(value); // Update the local state
    setValue('specialization', value); // Update the form state with the custom specialization
  };
  return (
    <div className="min-h-screen flex p-5 items-center justify-center bg-[#D6B3FF]">
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" p-8 rounded-lg text-black shadow-lg w-full max-w-2xl bg-[#FFC1E3] "
      >
        <div className="flex items-center justify-center space-x-4 mb-7">
          <img
            src={logo}
            alt="SETV Logo"
            className="w-16 h-16 md:w-36 md:h-auto"
          />
          <h2 className="text-center text-4xl font-semibold text-orange-600">
            Women Wellness
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6  ">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="block text-sm font-medium">
              What should we call you?
            </Label>
            <Input
              id="fullName"
              type="text"
              {...register("fullName", { required: "Full name is required" })}
              placeholder="Enter your full name"
              className="mt-1"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium">
              What's your email address?
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email address"
              className="mt-1"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Specialization */}
          <div>
      <Label htmlFor="specialization" className="block text-sm font-medium">
        Your specialization
      </Label>
      <Select
        onValueChange={(value) => {
          setValue('specialization', value); // Update the form state
          handleSpecializationChange(value); // Handle the logic for showing/hiding the input field
        }}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Select your specialization" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Gynaecology">Gynaecology</SelectItem>
          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
          <SelectItem value="Oncology">Oncology</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>

      {isOtherSelected && (
        <input
          type="text"
          id="Other"
          placeholder="Enter your specialization"
          value={otherSpecialization}
          onChange={handleOtherSpecializationChange}
          className="mt-2 p-2 border rounded w-full"
        />
      )}

      {errors.specialization && (
        <p className="text-red-500 mt-2 text-sm">{errors.specialization.message}</p>
      )}
    </div>

          {/* Hospital Name */}
          <div>
            <Label htmlFor="hospitalName" className="block text-sm font-medium">
              Your hospital name
            </Label>
            <Input
              id="hospitalName"
              type="text"
              {...register("hospitalName", { required: "Hospital name is required" })}
              placeholder="Hospital/Clinic name"
              className="mt-1"
            />
            {errors.hospitalName && (
              <p className="text-red-500 text-sm">{errors.hospitalName.message}</p>
            )}
          </div>

          {/* Medical License/ID */}
          <div>
            <Label htmlFor="medicalId" className="block text-sm font-medium">
              Medical License/ID 
            </Label>
            <Input
              id="medicalId"
              type="text"
              {...register("medicalId",{ required: "MedicalId is required" })}
              placeholder="Enter your license ID"
              className="mt-1"
            />
             {errors.medicalId && <p className="text-red-500 text-sm">{errors.medicalId.message}</p>}
          </div>

          {/* Experience */}
          <div>
            <Label htmlFor="yearsOfExperience" className="block text-sm font-medium">
              Years of Experience 
            </Label>
            <Input
              id="yearsOfExperience"
              type="number"
              {...register("yearsOfExperience",{ required: "Years of Experience  is required" })}
              placeholder="Enter your experience"
              className="mt-1"
            />
             {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience.message}</p>}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="block text-sm font-medium">
              Create a password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                placeholder="Enter your password"
                className="mt-1"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirm your password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                placeholder="Re-enter your password"
                className="mt-1"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

         {/* reCAPTCHA */}
         <div className="flex justify-center mt-4">
            <ReCAPTCHA sitekey='6LcYbOMqAAAAABnhImukf_SpFrE6w7e_y2vdACr3' id='captcha' onChange={(value) => setCaptchaValue(value)} />
          </div>
          

        {/* Submit Button */}
        <Button
          type="submit"
          className="bg-orange-500 text-white py-2 rounded w-full mt-6 hover:bg-orange-600"
        >
          Sign Up
        </Button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;