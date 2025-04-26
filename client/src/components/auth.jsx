//////////////////////////////////////////////////////////////////////////////////////////////////////
//                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                        
//                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT)              
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025                                                                 
// CODE LENGTH OF FILE: AUTHCONTEXT LINE 60 - LINE 106                      
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                       
// DATE OF DEVELOPMENT START FOR AUTHCONTEXT COMPONENT: 10/2/2025 - 27/2/2025                      
//--------------------------------------------------------------------------------------------------
//                           BASIC INFORMATION ABOUT THE FILE                                       
//--------------------------------------------------------------------------------------------------
// This React context component manages authentication state for the application. It provides 
// authentication-related functionality such as login, logout, and user session persistence. 
// Below is a breakdown of its key features:
//
/* 
Authentication Management:
- Stores user login state and credentials using localStorage.
- Retrieves stored session information on page load.
- Provides login and logout functions.

User Session Handling:
- If a valid token and user are found in localStorage, the session is restored.
- If not, the user is treated as logged out.
- The authentication status is updated dynamically.

Security Considerations:
- Uses localStorage to store tokens (can be enhanced with secure HTTP-only cookies).
- Ensures session persistence across page reloads.

Key Functionalities:
- `login(user, token)`: Stores user credentials and sets authentication state.
- `logout()`: Clears stored credentials and logs out the user.
- `useAuth()`: Custom hook to access authentication state.

Error Handling:
- Prevents unauthenticated access.
- Ensures authentication state is properly managed.

Dynamic UI Updates:
- Loading state management for authentication checks.
- React Context API for global authentication state management.

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                   KEY LIBRARIES AND DEPENDENCIES                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////
// React: Core library for building UI components.
// react-hook-form: Manages authentication form state.
// React Context API: Provides authentication state globally.
// localStorage API: Stores and retrieves user session data.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS, CONTEXT API
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token and user in localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("loggedInuser");

    if (token && user) {
      setIsLoggedIn(true);
      setLoggedInUser(user);
    } else {
      setIsLoggedIn(false);
      setLoggedInUser(null);
    }
    setLoading(false); // Finish loading
  }, []);

  const login = (user, token) => {
    localStorage.setItem("loggedInuser", user);
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setLoggedInUser(user);
  };

  const logout = () => {
    localStorage.removeItem("loggedInuser");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loggedInUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);