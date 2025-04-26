//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED ///////////////////////
//////////////////// PREGNANCY TRACKER SOURCE CODE VERSION 2.0 (READY FOR DEPLOYMENT) ///////
// CODE CLEANED LAST ON : 27-02-2025
// CODE LENGTH OF FILE SIDEBAR.JSX LINE 61 - LINE 155
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 6 CHECKS
// DATE OF DEVELOPMENT START OF SIDEBAR.JSX : 25/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component represents the sidebar navigation for the Pregnancy Tracker Application. 
// It offers a collapsible sidebar menu with various navigation options and user logout functionality. 
// Below is a detailed breakdown of the code's structure, functionality, and key features:

/* 
Sidebar Features:
- Toggle open/close sidebar using a button.
- Displays logged-in user’s name fetched from sessionStorage.
- Contains navigation links to different pages (Trimester Selection, All Reports, FAQ).
- Provides a logout button that clears user session and redirects to the login page.
- Full-screen overlay applied when sidebar is open for better UX.

State Management:
- isOpen: Tracks whether the sidebar is visible.

Navigation & Redirection:
- Uses react-router-dom for navigation (Link & useNavigate hooks).

Logout Flow:
- Clears localStorage data.
- Redirects user to the login page after a small timeout.

Dynamic UI Components:
- Animated sidebar opening/closing.
- Interactive hover effects on navigation links.
- Responsive layout support for different screen sizes.

Error Handling:
- None explicitly required for this component (relies on parent-level error handling).

*/

// Key Libraries and Dependencies
/*
React: Core library for building UI.
react-router-dom: Provides navigation and redirection functionality.
lucide-react: Provides icons for toggle and close buttons.
Tailwind CSS: Used for styling.
*/

// Data Flow:
/*
- Fetches loggedInuser from sessionStorage.
- Clears user session on logout.
*/

// ENV OF FILE: FRONTEND
// LANGUAGES USED: REACT JS, TAILWIND CSS
// SECURITY CODE LEVEL: HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();


  const toggleSidebar = () => setIsOpen(!isOpen);

  const name = sessionStorage.getItem("loggedInuser");

  const handleLogoutAndNavigate = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInuser');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className='bg-gray-900'>
      {/* Menu Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 text-white z-50"
        aria-label="Toggle Sidebar"
      >
        {!isOpen ? <Menu size={32} /> : null}
      </button>

      {/* Overlay to disable background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
          onClick={toggleSidebar} // Click to close sidebar
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 w-64 shadow-xl flex flex-col transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-centerbg-gray-900">
          <h1 className="text-2xl font-bold text-white">SETV.W</h1>
          <button onClick={toggleSidebar} className="text-white">
            <X size={32} />
          </button>
        </div>

        {/* Display Logged In User */}
        <div className="p-4 border-b border-[#2a2a2a] text-whitebg-gray-900">
          {name ? <p>Welcome, {name}!</p> : <p>Welcome,user!</p>}
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow mt-4bg-gray-900">
          <ul className="space-y-4">
            <li>
              <a href="/" className="block py-2 px-6 text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition-colors">
                Select Trimester
              </a>
            </li>
            
            <li>
              <Link to="/all-reports" className="block py-2 px-6 text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition-colors">
                View All Reports
              </Link>
            </li>
            
            <li>
              <Link to="/faq" className="block py-2 px-6 text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        {/* Log Out Button */}
        <div className="p-6 border-t border-[#2a2a2a]bg-gray-900">
          <button
            onClick={handleLogoutAndNavigate}
            className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-2 rounded-md transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}