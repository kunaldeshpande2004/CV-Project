//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED///////////////////////
////////////////////PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT)
//CODE CLEANED LAST ON : 27-02-2025//
//CODE LENGTH OF FILE TRIMESTERSELECTION LINE 72 - LINE 248//
//NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 6 CHECKS//
// DATE OF DEVELOPMENT START OF TRIMESTERSELECTION.JSX 10/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component is a key selection interface for the Pregnancy Tracker application.
// It allows users to select a trimester and corresponding fetal analysis options.
// Based on user selection, the component navigates to specialized diagnostic components.

// Key Features:
/*
Trimester Selection:

Users can choose between First, Second, and Third Trimesters.

Each trimester displays analysis options relevant to that stage of pregnancy.

Dynamic UI with Expand/Collapse Cards:

Each trimester section expands to show its options.

The selected trimester is highlighted with a border glow effect.

Navigation to Diagnostic Modules:

Upon selecting an analysis option, the user is redirected to a dedicated route (e.g., Placental Detection, Fetal Echocardiography).

Patient Information:

This component does not handle patient data directly but is expected to be part of a flow where patient details are already captured.

Error Handling:

Basic error handling for unexpected UI states (e.g., no options available).

Responsive Design:

Optimized for both mobile and desktop users.

Hover effects, responsive paddings, and accessible text sizes.
*/

// Key Libraries and Dependencies:
/*
React: Core library for building the UI.

React Router: Handles programmatic navigation to diagnostic routes.

@/components/ui/button and card: Custom UI components using Tailwind + ShadCN.

Tailwind CSS: For styling and responsive design.

Lucide React (indirectly via button/card components): Provides icons and consistent design language.
*/

//Data Flow:
/*
User selects trimester > User selects analysis type > Component navigates to appropriate diagnostic page.

Selected trimester and analysis type are passed via React Router state.
*/
//ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
//SECURITY CODE LEVEL :LOW
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SideBar from "@/components/SideBar";
import logo from '../components/assets/setVlogo.png'

const TrimesterSelection = () => {
  const navigate = useNavigate();
  const [expandedTrimester, setExpandedTrimester] = useState(null);

  const trimesterOptions = {
    1: ["Fetal Echocardioghraphy", "Fetal Brain Abnormality"],
    2: ["Placenta Position", "Organ Assessment"],
    3: ["Fetus Location", "Organ Location"],
  };

  const handleOptionSelect = (trimester, option) => {
    if (option === "Placenta Position") {
      navigate("/Placental-Detection", {
        state: {
          trimester,
          selectedOption: option,
        },
      });
    } else if (option === "Fetus Location") {
      navigate("/Fetus-Location", {
        state: {
          trimester,
          selectedOption: option,
        },
      });
    } else if (option === "Organ Location") {
      navigate("/Organ-Location", {
        state: {
          trimester,
          selectedOption: option,
        },
      });
    } else if (option === "Organ Assessment") {
      navigate("/Organ-Assessment", {
        state: {
          trimester,
          selectedOption: option,
        },
      });
    } else if (option === "Fetal Echocardioghraphy") {
      navigate("/Fetal-Echocardioghraphy", {
        state: {
          trimester,
          selectedOption: option,
        },
      });
    } else if (option === "Fetal Brain Abnormality") {
      navigate("/Fetal-Brain-Abnormality", {
        state: {
          trimester,
          selectedOption: option,
        },
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row relative bg-gray-900 min-h-screen">
      <img
        src={logo}
        alt="Logo"
        className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 object-contain"
      />

      {/* Sidebar */}
      <SideBar className="lg:static lg:flex-shrink-0" />

      {/* Main Content */}
      <div className="flex-1 mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Pregnancy Tracker Fetal Analysis Selection
          </h1>

          <div className="space-y-6">
            {[1, 2, 3].map((trimester) => (
              <Card
                key={trimester}
                className={`bg-gray-800 border-0 shadow-lg transition-all duration-300 ${
                  expandedTrimester === trimester
                    ? "ring-2 ring-blue-500"
                    : "hover:shadow-xl"
                }`}
              >
                <CardContent className="p-4 md:p-6">
                  <button
                    className="w-full text-left"
                    onClick={() =>
                      setExpandedTrimester(
                        expandedTrimester === trimester ? null : trimester
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl md:text-2xl font-semibold text-white">
                        {trimester === 1
                          ? "First"
                          : trimester === 2
                          ? "Second"
                          : "Third"}{" "}
                        Trimester
                      </h2>
                      <svg
                        className={`w-5 h-5 md:w-6 md:h-6 transform transition-transform duration-300 ${
                          expandedTrimester === trimester ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      expandedTrimester === trimester
                        ? "opacity-100 max-h-48 mt-6"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
                      {trimesterOptions[trimester].map((option, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className={`
                            flex-1 py-6 px-4
                            bg-gray-700/50 hover:bg-blue-600 
                            text-gray-100 hover:text-white
                            text-base md:text-lg
                            rounded-lg transition-all duration-200
                            hover:scale-105 hover:shadow-lg
                            flex items-center justify-center
                            text-center min-h-[80px]
                            font-medium
                            border border-transparent
                            hover:border-blue-400
                          `}
                          onClick={() => handleOptionSelect(trimester, option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center text-gray-400">
            <p className="text-sm md:text-base">
              Select a trimester and choose the appropriate analysis type for
              your examination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrimesterSelection;
