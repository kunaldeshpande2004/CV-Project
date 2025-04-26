//////////////////////////////////////////////////////////////////////////////////////////////////////
//                          SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                          
//                      PREGNANCY TRACKER SOURCE CODE VERSION 2.0 (READY FOR DEPLOYMENT)         
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025                                                                 
// CODE LENGTH OF FILE: APP.JSX LINE 57 - LINE 198                        
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                       
// DATE OF DEVELOPMENT START FOR ROUTING SYSTEM: 10/2/2025 - 27/2/2025                             
//--------------------------------------------------------------------------------------------------
//                          BASIC INFORMATION ABOUT THE FILE                                       
//--------------------------------------------------------------------------------------------------
// This file contains the **React Router** configuration for the Pregnancy Tracker application.    
// It manages navigation between various routes, ensuring secure access via authentication.        
// Below is a detailed breakdown of the structure and functionality:                              
/*
Routing and Authentication:
- Uses **React Router** to define and manage application routes.
- Implements **Protected Routes** to restrict unauthorized access.
- Uses **sessionStorage** and **Auth Context** to verify user authentication.

Key Features:
1. **Authentication Handling**:
   - Protects sensitive routes using a higher-order component **ProtectedRoute**.
   - Redirects unauthenticated users to the login page.

2. **Route Management**:
   - Manages navigation for **Disease Detection**, **Report Management**, **Trimester Selection**, and more.
   - Routes for **Forgot Password** and **Reset Password** functionalities.

3. **Component Structure**:
   - Loads **Login**, **Signup**, **Disease Detection**, and **Reports** dynamically.
   - Ensures a **black-themed UI** using Tailwind CSS.

Security Considerations:
- Uses sessionStorage to validate logged-in users before accessing protected routes.
- Implements **React Context API** for managing authentication state.
- Prevents unauthorized access by redirecting users to **//*login** if they are not authenticated.

Error Handling:
- Displays a **Loading...** message if authentication status is still being determined.
- Redirects users if login credentials are invalid.
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////

//                                   KEY LIBRARIES & DEPENDENCIES                                 //
//--------------------------------------------------------------------------------------------------
// React Router DOM        : Handles routing between different components.
// React Context API       : Manages global authentication state.
// Tailwind CSS            : Provides UI styling for the app layout.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : FRONTEND (REACT, CLIENT-SIDE ROUTING)
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////// CODE STARTS HERE //////////////////////////////////////////////

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignupForm from "./components/Register";
import Login from "./components/Login";
import AllReports from "@/components/AllReports";
import ForgotPassword from "./components/forgotpassword";
import ResetPassword from "./components/restpassword";
import { AuthProvider, useAuth } from "./components/auth";
import TrimesterSelection from "./components/TrimesterSelection";
import DiseaseDetection from "./components/DiseaseDetection";
import FAQ from "./components/FAQ";
import ResultFrames from "./components/ResultFrames";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const name = sessionStorage.getItem('loggedInuser')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn || !name) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-black min-h-screen min-w-full text-white flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupForm />} />
            
            <Route
              path="/Fetus-Location"
              element={
                <ProtectedRoute>
                  <DiseaseDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Organ-Location"
              element={
                <ProtectedRoute>
                  <DiseaseDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Organ-Assessment"
              element={
                <ProtectedRoute>
                  <DiseaseDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Fetal-Echocardioghraphy"
              element={
                <ProtectedRoute>
                  <DiseaseDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Fetal-Brain-Abnormality"
              element={
                <ProtectedRoute>
                  <DiseaseDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-reports"
              element={
                <ProtectedRoute>
                  <AllReports />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TrimesterSelection />
                </ProtectedRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/Placental-Detection"
              element={
                <ProtectedRoute>
                  <DiseaseDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faq"
              element={
                <ProtectedRoute>
                  <FAQ />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyze-frames"
              element={
                <ProtectedRoute>
                  <ResultFrames/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;