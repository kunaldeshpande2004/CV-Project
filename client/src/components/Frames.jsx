//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED ///////////////////////////
///////////////////////////// PREGNANCY TRACKER SOURCE CODE VERSION 2.0 ////////////////////////////
////////////////////////// COMPONENT: FRAMESPREVIEW.JSX ////////////////////////////////////////////
// CODE CLEANED LAST ON : 27-02-2025 //
// CODE LENGTH OF FILE FRAMESPREVIEW LINE 61 - LINE 145 //
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS //
// DATE OF DEVELOPMENT START OF FRAMESPREVIEW.JSX 25/2/2025 - 27/2/2025
//////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component is responsible for displaying ultrasound frames, allowing users to drag 
// and drop annotated frames into a final report preview area. This component supports:
// 
// • Drag-and-drop functionality for frame selection.
// • Display of placental frames and non-detected frames.
// • Image removal from the final report section.
// • Grid-based visual preview of frames.
// 
// FUNCTIONALITY OVERVIEW:
/* 
- Frame Grid Display:
    • Placental and non-detection frames are displayed in a scrollable grid.
    • Frames are draggable into a "Final Frames for Report" area.

- Drag-and-Drop for Report:
    • Users can drag frames into the final report section.
    • Frames in the report section can be removed.

- Dynamic Frame Management:
    • Frames added to the final section are stored in parent state via props.
    • Supports external removal callback to sync with parent state.

- Error Handling:
    • Prevents duplicate frames in the final selection.
    • Ensures safe handling of missing images.
*/
// 
// Key Libraries and Dependencies:
/*
React: Core library for building the UI.

react-router-dom: Provides path-based information for dynamic headings.

Tailwind CSS: Handles styling for responsive and accessible UI.

Custom Components: Uses Grid component for frame display.
*/
// 
// Data Flow:
/*
Frames come from parent component via placentalframes and nodetectionframes.

Selected frames are lifted to the parent via setDraggedFrames.

Removed frames trigger handleRemoveImage callback in parent.
*/
// 
// ENV OF FILE : FRONTEND //
// LANGUAGES USED : REACT JS , TAILWIND CSS //
// SECURITY CODE LEVEL :LOW //
//////////////////////////////////////////////////////////////////////////////////////////////////////
import React, { useState } from "react";
import Grid from "./Grid"; // Import your Grid component
import { useLocation } from "react-router-dom";

function FramesPreview({
  placentalframes,
  nodetectionframes,
  draggedFrames,
  setDraggedFrames,
  handleRemoveImage,
}) {
  const [reportFramesState, setReportFramesState] = useState(draggedFrames);

  const handleDragDrop = (frameData) => {
    setDraggedFrames((prev) => [...prev, frameData]); // Update draggedFrames in main component
  };

  const location = useLocation();
  const path = location.pathname.split("/");

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedImage = event.dataTransfer.getData("image");
    if (droppedImage && !draggedFrames.includes(droppedImage)) {
      setDraggedFrames((prev) => [...prev, droppedImage]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event, frame) => {
    // event.dataTransfer.setData("image", frame.annotated_image);
    handleDragDrop(frame);
  };

  const handleRemoveImages = (imageToRemove) => {
    setDraggedFrames((prev) => prev.filter((image) => image !== imageToRemove));
    handleRemoveImage(imageToRemove);
  };

  return (
    <div className="my-3 bg-gray-900 text-white p-5 w-full">
      <div className="flex">
        <div className="mb-6 w-full sm:w-3/4 lg:w-full pr-4 max-h-[600px] border border-gray-300">
          <h1 className="text-xl font-bold mb-4">{path} Frames</h1>
          <Grid frames={placentalframes} handleDragStart={handleDragStart} />
        </div>
      </div>
      <div
        className="mb-8 w-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h3 className="text-xl text-white mb-4">Final Frames for Report</h3>
        <div className="grid grid-cols-2 gap-4  p-4 w-full rounded-lg shadow overflow-y-auto max-h-[500px]">
          {draggedFrames.length > 0 ? (
            draggedFrames.map((frame, index) => (
              <div key={index} className="relative  mb-36 gap-5 w-full  h-[300px]">
                <img
                  src={`data:image/jpeg;base64,${frame.annotated_image}`}
                  alt={`Frame ${index}`}
                  className="w-100% h-80%  object-contain cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, frame)}
                />
                <button
                  onClick={() => handleRemoveImages(frame)}
                  className="absolute top-1 right-0 text-white bg-red-600 hover:bg-red-800 rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center">No frames available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FramesPreview;
