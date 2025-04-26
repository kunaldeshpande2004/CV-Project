//////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED ///////////////////////
// //////////////////// PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT)
// CODE CLEANED LAST ON : 27-02-2025 //
// CODE LENGTH OF FILE ALLREPORTS LINE 76 - LINE 353
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 6 CHECKS //
// DATE OF DEVELOPMENT START OF ALLREPORTS.JSX 10/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component handles the display and management of all generated ultrasound scan reports. 
// The component supports features like search, sort, date filtering, pagination, and direct navigation to 
// detailed frame analysis for each report.

/* Report Management Features:

Fetches all reports from the backend API.

Provides search functionality by visit ID, patient ID, and patient name.

Supports sorting reports by date (newest/oldest).

Date filter allows narrowing reports to a specific day.

Pagination supports smooth navigation across multiple pages.

User can directly open frame analysis of any report by selecting it.

UI/UX Enhancements:

Search bar with real-time filtering.

Date picker for quick date selection.

Pagination for better report navigation.

Dynamic sidebar and navbar for seamless navigation across the app.

Error Handling and Validation:

Handles API errors gracefully with console logs (can be improved with user notifications).

Validates existence of folder before navigating to frame analysis.
*/

// Key Libraries and Dependencies
/*
React: Core library for building the UI.

React Router: Handles navigation within the app.

lucide-react: Provides icons for search and calendar.

Tailwind CSS: Handles styling and responsiveness.

React Hook Form: Planned future enhancement for managing filters and inputs (optional).

*/

// Data Flow:
/*
Reports fetched from backend via API call (/auth/api/reports).

Reports are stored in state and filtered based on search term, date, and sort order.

Filtered reports are paginated for display.

Selecting a report saves its folder to sessionStorage and navigates to frame analysis.
*/

// ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar } from "lucide-react"; // Import Calendar icon
import SideBar from "./SideBar";
import logo from "../components/assets/setVlogo.png";


export default function AllReports({ logoutFunction }) {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' or 'oldest'
  const [selectedDate, setSelectedDate] = useState(null); // For calendar filter
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of reports per page
  const navigate = useNavigate();

  const ResultFrames = (e) => {
    sessionStorage.setItem("folder", e);
    const folder = sessionStorage.getItem("folder");
    if (folder) {
      navigate("/analyze-frames");
    }
  };

  // Fetch reports from the API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/api/reports"); // Adjust URL if needed
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
         const data = await response.json();
    
       
         const reversedData = [...data].reverse(); // Reverse only for initial display
         setReports(data); // Store original data
         setFilteredReports(reversedData); // Show reversed data initially

      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  // Function to parse custom date format
  const parseCustomDate = (dateTimeString) => {
    const [datePart, timePart] = dateTimeString.split(" ");
    const [day, month, year] = datePart.split("/");
    const formattedDate = `${year}-${month}-${day} ${timePart}`;
    return new Date(formattedDate).getTime();
  };

  // Update filteredReports based on searchTerm, sortOrder, and selectedDate
  useEffect(() => {
    let filtered = reports.filter(
      (report) =>
        (report.visitId?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (report.patientId?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (report.patientName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        )
    );

    // Filter by selected date if applicable taken from java point 
    if (selectedDate) {
      filtered = filtered.filter((report) => {
        const reportTime = parseCustomDate(
          `${report.visitDate} ${report.visitTime}`
        );
        const reportDateOnly = new Date(reportTime).toDateString();
        return reportDateOnly === selectedDate.toDateString();
      });
    }

    
    if (sortOrder === "newest") {
      filtered = [...filtered].reverse(); // Reverse order (latest first)
    } else {
      filtered = [...filtered]; // Keep the original order
    }
  
    setFilteredReports(filtered);
    setCurrentPage(1);


    
  }, [searchTerm, reports, sortOrder, selectedDate]);

  // Pagination logic
  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  return (
    <>
      <nav className="h-16 w-full bg-gray-900  fixed top-0 z-20">
        <img
          src={logo}
          alt="Logo"
          className="absolute top-0 right-4 w-16 h-16 sm:w-20 sm:h-20 object-contain"
        />

        {/* Sidebar */}
        <SideBar
          logoutFunction={logoutFunction}
          className="lg:static lg:flex-shrink-0"
        />
      </nav>
      <div className="bg-gray-800 text-white h-screen relative">
        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto ml-20 mt-10">
            {/* Header */}
            <div className="mb-6 mt-4">
              <h1 className="text-3xl font-bold mb-4">All Reports</h1>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Add New Scan
              </button>
            </div>
            <div className="border-b border-gray-600 mb-4"></div>

            {/* Search and Filter Section */}
            <div className="mb-4 flex justify-between items-center">
              {/* Search Box */}
              <div className="flex items-center bg-gray-700 rounded p-2 flex-grow mr-4">
                <Search className="text-white mr-2" />
                <input
                  type="text"
                  placeholder="Search by Visit ID, Patient ID, or Name..."
                  className="w-full bg-gray-700 text-white outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Button */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-700 text-white py-2 px-4 rounded">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-gray-700 text-white outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                <div className="flex items-center bg-gray-700 text-white py-2 px-4 rounded">
                  <Calendar className="text-white mr-2" />
                  <input
                    type="date"
                    className="bg-gray-700 text-white outline-none"
                    onChange={(e) =>
                      setSelectedDate(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                  />
                  {selectedDate && (
                    <button
                      onClick={clearDateFilter}
                      className="ml-2 text-red-500 hover:text-red-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-auto bg-gray-700 rounded p-4">
              <table className="w-full text-left">
                <thead className="bg-gray-900 text-gray-300">
                  <tr>
                    <th className="py-2 px-4">Patient Name</th>
                    <th className="py-2 px-4">Patient ID</th>
                    <th className="py-2 px-4">Visit ID</th>
                    <th className="py-2 px-4">Date/Time</th>
                    <th className="py-2 px-60">View details</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReports.map((report, index) => (
                    <tr key={index} className="border-b border-gray-600">
                      <td className="py-2 px-4">{report.patientName}</td>
                      <td className="py-2 px-4">{report.patientId}</td>
                      <td className="py-2 px-4">{report.visitId}</td>
                      <td className="py-2 px-4">
                        {report.visitDate} {report.visitTime}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex flex-wrap justify-end space-x-4 gap-2 sm:gap-7">
                          <button
                            onClick={() => ResultFrames(report.visitId)}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                          >
                            Analyze Frames
                          </button>

                          <a
                            target="_blank"
                            href={`${report.video}`}
                            rel="noopener noreferrer"
                          >
                            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition">
                              View Video
                            </button>
                          </a>
                          <a
                            target="_blank"
                            href={`${report.report}`}
                            rel="noopener noreferrer"
                          >
                            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition">
                              View Report
                            </button>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredReports.length === 0 && (
                <p className="text-center text-gray-400 mt-4">
                  No reports found
                </p>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              {Array.from(
                { length: Math.ceil(filteredReports.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
