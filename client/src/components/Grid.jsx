//////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED///////////////////////
// /////////////////////PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT)
// CODE CLEANED LAST ON : 27-02-2025//
// CODE LENGTH OF FILE GRID COMPONENT LINE 67 - LINE 193//
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS//
// DATE OF DEVELOPMENT START OF GRID.JSX 12/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component is responsible for displaying a grid of ultrasound video frames extracted during analysis.
// It allows users to preview annotated images and open them in a zoomable and draggable modal for closer inspection.
// The component supports both dragging frames for reordering or external handling, and zoom/pan functionality for high-resolution review.

/* Key Functionalities:

Frame Display Grid:
- Displays extracted frames in a 2-column responsive grid.
- Each frame includes the annotated ultrasound image.

Image Preview Modal:
- Clicking on an image opens a full-screen modal for detailed viewing.
- Modal allows zooming using mouse wheel.
- Image can be dragged (panned) when zoomed.

Drag & Drop Support:
- Each frame can be dragged to allow future reordering or categorization.
- DragStart event sends frame data for external state handling.

Dynamic UI Features:
- Responsive grid with adaptive layout.
- Modal prevents body scrolling when open.
- Smooth zoom/pan behavior with clear image rendering.

Error Handling:
- Graceful handling of empty frame list.
- Prevents invalid interactions if images are not present.

*/

// Key Libraries and Dependencies
/*
React: Core UI library.

@shadcn/ui Card: Frame container styling.

Tailwind CSS: Handles all responsive and layout styling.

React Hooks: State management for modal, zoom, and drag states.

*/

// Data Flow:
/*
Frames passed as props from parent component (usually frame extraction module).

Frames contain base64-encoded images and optional metadata.

Parent can also handle handleDragStart to capture dragged frame details.

*/

// ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
// SECURITY CODE LEVEL : LOW
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////
import React, { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";

function Grid({ frames, title, handleDragStart }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Disable body scrolling when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalOpen]);

  // Handle image click to open modal
  const openModal = (image) => {
    setCurrentImage(image);
    setModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentImage(null);
    setZoomLevel(1); // Reset zoom
    setDragStart({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Handle zoom using mouse wheel
  const handleWheel = (e) => {
    e.preventDefault(); // Prevent page scrolling while zooming
    if (e.deltaY < 0) {
      setZoomLevel((prevZoom) => prevZoom + 0.1); // Zoom In
    } else {
      setZoomLevel((prevZoom) => (prevZoom > 0.1 ? prevZoom - 0.1 : 0.1)); // Zoom Out
    }
  };

  // Handle mouse down event to start panning
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move event to drag image (pan)
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    imageRef.current.style.transform = `scale(${zoomLevel}) translate(${deltaX}px, ${deltaY}px)`;
  };

  // Handle mouse up event to stop panning
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Close modal when clicking outside the image
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  return (
    <div className="mb-6 w-full sm:w-1/2 lg:w-full pr-2 overflow-y-auto overflow-x-hidden max-h-[400px] border border-gray-300 my-1">
      <div className="grid grid-cols-2 gap-4">
        {frames.length > 0 ? (
          frames.map((frame, index) => (
            <Card
              key={index}
              className="border border-gray-700 rounded overflow-hidden"
            >
              <img
                src={`data:image/jpeg;base64,${frame.annotated_image}`}
                alt={`Frame ${index + 1}`}
                className="w-full h-auto object-contain cursor-pointer"
                draggable
                onClick={() => openModal(frame.annotated_image)} // Open modal on click
                onDragStart={(e) => handleDragStart(e, frame)} // Drag start handler
              />
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center">No frames available.</div>
        )}
      </div>

      {/* Modal for displaying the image */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
          onClick={handleOverlayClick} // Close modal if clicked outside the image
        >
          <div
            className="relative max-w-3xl max-h-[80vh] overflow-hidden"
            onWheel={handleWheel} // Handle zoom using mouse scroll
            onMouseDown={handleMouseDown} // Start panning
            onMouseMove={handleMouseMove} // Pan image
            onMouseUp={handleMouseUp} // Stop panning
            onMouseLeave={handleMouseUp} // Stop panning if mouse leaves
          >
            <img
              ref={imageRef}
              src={`data:image/jpeg;base64,${currentImage}`}
              alt="Zoomed Image"
              className="w-full h-auto object-contain"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.3s ease",
                cursor: isDragging ? "grabbing" : "grab",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Grid;
