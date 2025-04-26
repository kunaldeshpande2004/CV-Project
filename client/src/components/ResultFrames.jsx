//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED///////////////////////
////////////////////PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT)
//CODE CLEANED LAST ON : 27-02-2025//
//CODE LENGTH OF FILE RESULTFRAMES LINE 55 - LINE 120
//NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS//
// DATE OF DEVELOPMENT START OF RESULTFRAMES.JSX 26/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component is responsible for displaying extracted and analyzed ultrasound frames received from the backend server. 
// Below is a detailed breakdown of the code's structure, functionality, and key features:

/*Frame Retrieval and Display:

Frames are fetched from a backend endpoint based on the selected report folder.

Fetched frames (image URLs) are displayed in a grid format.

Interactive UI Elements:

A floating close button allows navigation back to the reports page.

Dynamic grid adapts to display scanned images with responsive layout.

Header displays component title along with company logo.

Error Handling:

Catches and logs errors in case of failed image retrieval.

UI gracefully handles the case where no images are found. */

// Key Libraries and Dependencies
/*
React: Core library for building the UI.

React Router: Handles navigation within the app.

Tailwind CSS: Handles component styling and responsive design.
*/

//Data Flow:
/*
Session storage holds the folder name for the selected report.

This folder name is used in an API call to retrieve images from the backend.

Retrieved images are displayed dynamically in a responsive grid.
*/
//ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
//SECURITY CODE LEVEL : MEDIUM
/////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////
import React, { useEffect, useState } from "react";
import logo from '../components/assets/setVlogo.png'
import { useNavigate } from "react-router-dom";
const ResultFrames = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      const folder = sessionStorage.getItem("folder");
      try {
        const response = await fetch(
          `http://localhost:8080/auth/get-frames/${folder}`
        );
        const data = await response.json();
    
        setImages(data.images); // Set image URLs in state
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="bg-gray-900 h-full w-full ">
      <div
        className="flex ml-10 mt-10 items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full"
        onClick={() => navigate("/all-reports")}
      >
        {" "}
        X{" "}
      </div>
      <div className="p-4 flex justify-evenly">
        <h1 className="text-3xl text-center mt-10">Scanned Images</h1>
        <img
          src={logo}
          alt="logo"
          className="absolute top-0 right-4 w-20 h-20 sm:w-32 mt-10 sm:h-20 object-contain"
        />
      </div>
      <div className="h-full w-full  overflow-y-auto  grid grid-cols-2 items-center gap-16 p-24 bg-gray-900 rounded-lg shadow-lg">
        {images && images.length >= 0 ? (
          images.map((img, index) => {
        
            return (
              <img
                key={index}
                src={img}
                alt={`Frame ${index + 1}`}
                className="w-84 h-84 object-cover rounded-lg shadow-md border-2 border-gray-700"
              />
            );
          })
        ) : (
          <div className="item-center text-center w-full h-full">
            <p className="text-gray-500 text-center ">No images available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultFrames;
