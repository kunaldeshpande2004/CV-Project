//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED///////////////////////
////////////////////PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT)
//CODE CLEANED LAST ON : 27-02-2025//
//CODE LENGTH OF FILE DISEASEDETECTION LINE 16 - LINE 1642//
//NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 8 CHECKS//
// DATE OF DEVELOPMENT START OF DISEASEDETECTION.JSX 10/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component is designed for a medical application that analyzes ultrasound videos to detect placental positioning and other related features. Below is a detailed breakdown of the code's structure, functionality, and key features:
/*Video Upload and Processing:

Users can upload ultrasound video files.

The video is processed to extract frames at a specified frame rate.

Frames are sent to a backend server for AI-based analysis.

AI-Based Analysis:

Extracted frames are analyzed using a machine learning model to detect specific classes (e.g., placenta, fetal skull, etc.).

Results include annotated images, detected classes, and confidence scores.

Report Generation:

Users can generate a detailed medical report based on the analysis.

The report includes patient information, findings, recommendations, and annotated images.

Reports are saved as PDFs and can be downloaded.

Dynamic UI Components:

Progress bars for frame extraction and analysis.

Interactive forms for patient information.

Modals for confirmation and report preview.

Error Handling and Validation:

Input validation for patient details (e.g., age, name, etc.).

Error handling for file uploads and backend requests. */

// Key Libraries and Dependencies
/*
React: Core library for building the UI.

React Router: Handles navigation within the app.

react-hook-form: Manages form state and validation.

jsPDF: Generates PDF reports.

lucide-react: Provides icons for the UI.

react-hot-toast: Displays notifications and error messages.

@uiw/react-md-editor: Provides a markdown editor for comments (not fully utilized in this code).
*/
//Data Flow:
/*
Video files and frames are sent to the backend for processing.

Annotated images and analysis results are returned and displayed in the UI.
*/
//ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
//SECURITY CODE LEVEL : HIGH
/////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////

import React, {
  lazy,
  Suspense,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { File, X } from "lucide-react"; // Importing the cross icon from lucide-react
import toast, { Toaster } from "react-hot-toast";
import { Button } from "./ui/button";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import SideBar from "@/components/SideBar"; // Import the custom sidebar

import logo from "../components/assets/setVlogo.png";
import logo2 from "../components/assets/setvlogo.jpeg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; //import card from from the component library for react shadcn ui
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import FramesPreview from "./Frames";
import { image } from "@uiw/react-md-editor";
const MDEditor = lazy(() => import("@uiw/react-md-editor"));

// Arrays to store processed frames
const placentalframes = [];
const nodetectionframes = [];
let findings = "";

export default function DiseaseDetection({ logoutFunction }) {
  // State variables for managing analysis results and form data
  const [analysisResult, setAnalysisResult] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      gender: "female", // Set "female" as the default value
    },
  });

  // State variables for managing UI components and data
  const navigate = useNavigate();
  const [reportFrames, setReportFrames] = useState([]);
  const [aiData, setAiData] = useState([]); // Stores AI analysis results
  const [uploadedFile, setUploadedFile] = useState(null); // Stores uploaded video file
  const [frames, setFrames] = useState([]); // Stores extracted video frames
  const [commentText, setCommentText] = useState("");

  // Refs for video and canvas elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = React.useRef(null);

  const generateRandomString = (length = 10) => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "!@#$%^&*()-";
    const allCharacters = uppercase + lowercase + numbers + specials;

    // Ensure at least one of each required character type
    let result = [
      uppercase[Math.floor(Math.random() * uppercase.length)],
      lowercase[Math.floor(Math.random() * lowercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specials[Math.floor(Math.random() * specials.length)],
    ];

    // Fill the remaining length with random characters from allCharacter
    result = result.concat(
      Array.from(
        { length: length - 4 },
        () => allCharacters[Math.floor(Math.random() * allCharacters.length)]
      )
    );

    // Shuffle the result array to randomize character positions
    return result.sort(() => Math.random() - 0.5).join("");
  };

  // Handle file upload event
  const [visitId, setVisitId] = useState("");
  let temp = "";
  const [count, setCount] = useState(0);
  const handleFileUpload = async (event) => {
    if (count > 0) return;

    let randString = await generateRandomString(12);
    const file = event.target.files[0]; // Get the uploaded file

    if (!file) return;

    const now = new Date();
    temp = `TEMPSETV_ULTS_${randString}_${String(now.getDate()).padStart(
      2,
      "0"
    )}${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}${now.getFullYear()}${String(now.getHours()).padStart(2, "0")}${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    setVisitId(temp);

    // Extract the file extension
    const fileExtension = file.name.split(".").pop(); // Get file extension
    const newFileName = `${temp}.${fileExtension}`; // Append extension to new name

    try {
      // ✅ Use `await` to ensure buffer is available before creating the Blob
      const buffer = await file.arrayBuffer();
      const renamedFile = new Blob([buffer], { type: file.type });

      // Append to FormData
      const formData = new FormData();
      formData.append("file", renamedFile, newFileName);
      formData.append("pdfFile", pdfBlob);
      formData.append("temp", temp);

      const response = await fetch("http://localhost:8080/auth/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setVideoLink(data.url);

      setUploadedFile(file);
      toast.success("File uploaded successfully!");

      const video = videoRef.current;
      if (video) {
        video.src = URL.createObjectURL(file);
        video.onloadeddata = () => {
          handleAnalyze();
        };
      }
    } catch (err) {}
  };

  // Create video source URL using useMemo for performance
  const videoSrc = useMemo(() => {
    return uploadedFile ? URL.createObjectURL(uploadedFile) : null;
  }, [uploadedFile]);

  // Clear uploaded file and reset states
  const clearFile = () => {
    setUploadedFile(null);
    setFrames([]);
    setAiData([]);
    toast.success("File cleared!");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    navigate(0);
  };

  // Extract frames from uploaded video using frame rate and canvas took refrence rfrom javat point
  const [framerate, setFramerate] = useState(30);
  const [flag, setFlag] = useState(false);

  const extractFrames = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!video.duration || video.duration === Infinity) {
      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
      });
    }
    const frameRate = 1 / framerate; // Use the selected framerate
    const duration = video.duration;
    let currentTime = 0;
    const extractedFrames = [];
    const progressBar = document.getElementById("progress-bar");
    const progressValue = document.getElementById("progress-value");

    const captureFrame = async () => {
      return new Promise((resolve) => {
        video.currentTime = currentTime;
        video.onseeked = async () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL("image/png");
          extractedFrames.push(frameData);
          await sendFrameToBackend(frameData);
          setFlag(true);

          // Ensure progress is 100% when the loop ends
          if (currentTime >= duration) {
            progressBar.style.width = `100%`;
            progressValue.textContent = `100%`;

            resolve();
          } else {
            const progress = Math.min((currentTime / duration) * 100, 100);
            progressBar.style.width = `${progress}%`;
            progressValue.textContent = `${Math.floor(progress)}%`;
            currentTime += frameRate;
            resolve(await captureFrame());
          }
        };
      });
    };

    await captureFrame();
    setFrames(extractedFrames);
  };

  // State variables for managing report generation
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [images, setImages] = useState([]);

  // Handle report generation confirmation

  const uploadFrameToAzure = async (base64Image, idx, visitId) => {
    try {
      const response = await fetch("http://localhost:8080/auth/upload-frame", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          annotated_image: base64Image,
          idx: idx,
          visitId: visitId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        return null;
      }

      const data = await response.json();

      return data.blobUrl; // This is the Azure Blob Storage URL
    } catch (error) {
      return null;
    }
  };

  const [videoLink, setVideoLink] = useState("");

  const confirmGenerateReport = async (confirmed) => {
    if (confirmed) {
      try {
        // Create FormData with patient info and files
        const formData = new FormData();
        formData.append("patientId", patientInfo.patientId);
        formData.append("patientName", patientInfo.patientName);
        formData.append("patientAge", patientInfo.patientAge);
        formData.append("patientNumber", patientInfo.patientNumber);
        formData.append("gender", patientInfo.gender);
        formData.append("video", videoLink);
        formData.append("visitId", visitId);
        formData.append("report", reportContent);
        formData.append("pdfFile", pdfBlob);

        // Send to backend to store the visit data
        const response = await fetch(
          "http://localhost:8080/auth/api/submit-visit",
          {
            method: "POST",
            body: formData,
          }
        );

        // Handle response
        const result = await response.json();
        if (response.ok) {
          //toast.success("Report successfully generated and sent to backend.");
        } else {
          // toast.error("Failed to send the report to the backend.");
        }
      } catch (error) {
        toast.error("An error occurred while sending the data.");
      }
    }
    setShowConfirmation(false);
  };

  const [draggedFrames, setDraggedFrames] = useState([]); // State to store dragged frame data

  const handleFrameDrop = (newFrameData) => {
    setDraggedFrames((prev) => [...prev, newFrameData]); // Add the new frame data to the state

    // Update findings and recommendations when two frames are selected
    if (draggedFrames) {
      for (let i = 0; i < draggedFrames.length; i++) {
        findings += `
      The UltraSound scan ${i} demonstrates ultrasound findings consistent with second trimester placental detection and has detected the following classes: ${
          draggedFrames[i].class_name.map((class_n) => class_n) || "N/A"
        }.
     
    `;
        setFindingsText(findings);

        const recommendations = `
      Recommendations:
      - Doppler Ultrasound
      - Fetal MRI
      - Placental Biopsy
      - Non-Stress Test (NST)
      - Amniocentesis
      - Ultrasound (2D/3D Imaging)
      Correlation:
      We recommend correlating with clinical history, maternal conditions such as preeclampsia or gestational diabetes, previous pregnancy history, and routine ultrasound findings.
      Additionally, consider prenatal blood tests and genetic screening for further assessment of placental and fetal health.
    `;
        setRecommendationsText(recommendations);
      }
    }
  };
  const location = useLocation();

  const path = location.pathname.split("/").pop();
  sessionStorage.setItem("page", path);
  let idx = 0;
  let results = [];
  const sendFrameToBackend = async (frame) => {
    try {
      const response = await fetch(`http://localhost:5000/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frames: [frame] }), // Expecting a single frame as input
      });

      if (!response.ok) {
        const errorData = await response.json();

        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let dataBuffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        dataBuffer += decoder.decode(value, { stream: true });

        const parts = dataBuffer.split("\n\n");
        for (let i = 0; i < parts.length - 1; i++) {
          const message = parts[i].trim();
          if (message.startsWith("data:")) {
            try {
              const jsonString = message.slice(5).trim();
              const parsedData = JSON.parse(jsonString);

              if (parsedData.success) {
                const frameData = parsedData.result;

                if (
                  frameData &&
                  frameData.class_name &&
                  Array.isArray(frameData.class_name)
                ) {
                  let validClassNames = [];
                  if (path === "Placental-Detection") {
                    validClassNames = ["baby", "feto", "placenta", "tip"];
                  } else if (path === "Fetus-Location") {
                    validClassNames = ["fetal skull", "abnormality"];
                  } else if (path === "Organ-Assessment") {
                    validClassNames = [
                      "Aorta",
                      "Confluence",
                      "Rib",
                      "Spine",
                      "Stomach",
                    ];
                  } else if (path === "Organ-Location") {
                    validClassNames = [
                      "CM",
                      "IT",
                      "NT",
                      "midbrain",
                      "nasal bone",
                      "nasal skin",
                      "nasal tip",
                      "palate",
                    ];
                  } else if (path === "Fetal-Brain-Abnormality") {
                    validClassNames = [
                      "anold chiari malformation",
                      "arachnoid cyst",
                      "cerebellah hypoplasia",
                      "cisterna magna",
                      "colphocephaly",
                      "encephalocele",
                      "holoprosencephaly",
                      "hydracenphaly",
                      "intracranial hemorrdge",
                      "intracranial tumor",
                      "mild ventriculomegaly",
                      "moderate ventriculomegaly",
                      "polencephaly",
                      "severe ventriculomegaly",
                    ];
                  } else if (path === "Fetal-Echocardioghraphy") {
                    validClassNames = ["Aorta", "Flows", "Other", "V sign"];
                  }

                  const containsValidClass = frameData.class_name.some((cls) =>
                    validClassNames.includes(cls)
                  );

                  if (containsValidClass) {
                    placentalframes.push(frameData);
                    results.push(frameData);

                    setAiData((prev) => [...prev, frameData]);

                    setReportFrames((prev) => [
                      ...prev,
                      frameData.annotated_image,
                    ]);

                    idx += 1;
                    //azure original
                    if (frameData && frameData.annotated_image) {
                      // Upload the annotated image to Azure Blob Storage

                      const azureBlobUrl = await uploadFrameToAzure(
                        frameData.annotated_image,
                        idx,
                        temp
                      );

                      if (azureBlobUrl) {
                        frameData.annotated_image_url = azureBlobUrl;
                        setReportFrames((prev) => [...prev, azureBlobUrl]);
                      }
                    }
                  }
                } else {
                  console.warn(
                    "Invalid frameData or class_name missing:",
                    frameData
                  );
                }
              }
            } catch (error) {}
          }
        }

        // Keep the last incomplete part in the buffer
        dataBuffer = parts[parts.length - 1];
      }

      // Finalize results and set top frames
      if (results.length > 0) {
        const sortedFrames = results.sort(
          (a, b) => b.confidence - a.confidence
        );

        const topFrames = sortedFrames.slice(0, 2);

        setDraggedFrames((prev) => {
          // Keep only unique frames (avoid adding duplicates)
          const uniqueFrames = [...prev, ...topFrames].reduce((acc, frame) => {
            if (
              !acc.some(
                (existing) => existing.annotated_image === frame.annotated_image
              )
            ) {
              acc.push(frame);
            }
            return acc;
          }, []);

          // Sort and keep only the top 2 by confidence
          return uniqueFrames
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 2);
        });
      } else {
        console.warn("No valid detections in this frame.");
      }
    } catch (error) {
      toast.error("Error from the server please try again later");
    }
  };

  const [pdfBlob, setPdfBlob] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [patientInfo, setPatientInfo] = useState({
    patientName: "",
    patientId: "",
    patientAge: "",
    patientNumber: "",
    gender: "",
  });

  const onSubmit = async (data) => {
    const name = sessionStorage.getItem("loggedInuser");
    const id = sessionStorage.getItem("medicalId");

    if (
      !data.patientName ||
      !data.patientId ||
      !data.patientAge ||
      !data.patientNumber
    ) {
      toast.error("Fill all the details first");
      return;
    } else if (
      isNaN(data.patientAge) ||
      data.patientAge <= 0 ||
      data.patientAge > 150
    ) {
      toast.error(
        "Enter a correct age (greater than 0 and realistic, less than 150)"
      );
      return;
    } else if (data.patientName.length < 3) {
      toast.error("name must be greater than 2 letters ");
      return;
    } else {
      setShowConfirmation(true);
    }

    setPatientInfo({
      patientName: data.patientName,
      patientId: data.patientId,
      patientAge: data.patientAge,
      patientNumber: data.patientNumber,
      gender: data.gender,
    });

    try {
      //  19-feb
      const doc = new jsPDF();

      // Add logo if available
      if (logo2) {
        doc.addImage(logo2, "JPEG", 10, 10, 25, 20);
      }

      // Header Section
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text("THE SETV.G HOSPITAL", 105, 15, { align: "center" });
      doc.setFontSize(12);
      doc.text("Accurate | Caring | Instant", 105, 22, { align: "center" });
      doc.text("Phone: 040-XXXXXXXXX / +91 XX XXX XXX", 105, 30, {
        align: "center",
      });
      doc.text("Email: setvgbhospital@gmail.com", 105, 37, { align: "center" });
      doc.text(
        "SETV.ASRV LLP, Avishkaran, NIPER, Balanagar, Hyderabad, Telangana, 500037.",
        105,
        44,
        { align: "center" }
      );

      // Header Border
      doc.setFillColor(255, 0, 0);
      doc.rect(0, 47, 210, 3, "F");
      doc.setFillColor(0, 0, 255);
      doc.rect(0, 50, 210, 3, "F");

      // Report Title
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Patient Scan Report", 75, 60);

      // Patient Details
      doc.setFontSize(12);
      doc.text(`Patient Name: ${data.patientName}`, 10, 70);
      doc.text(`Patient ID: ${data.patientId}`, 10, 80);
      doc.text(`Age: ${data.patientAge}`, 10, 90);
      doc.text(`Radiologist Name: ${name}`, 120, 70);
      doc.text(`Radiologist ID: ${id}`, 120, 80);
      doc.text(
        `Date: ${data.date || new Date().toLocaleDateString()}`,
        120,
        90
      );
      doc.text(`Gender: ${data.gender}`, 10, 100);
      doc.text(
        `Time: ${data.time || new Date().toLocaleTimeString()}`,
        120,
        100
      );

      // Ultrasound Scan Images Section
      doc.text("Ultrasound Scan Images:", 10, 110);

      let imageX = 10;
      let imageY = 120;
      const imageWidth = 90;
      const imageHeight = 60;
      const imagesPerRow = 2;
      const imageSpacing = 10;
      const maxImageYPosition = 230;

      // Process images and findings

      draggedFrames.forEach((frame, index) => {
        if (frame.annotated_image) {
          if (imageY + imageHeight > maxImageYPosition) {
            doc.addPage();
            imageX = 10;
            imageY = 40;
          }
          doc.addImage(
            frame.annotated_image,
            "JPEG",
            imageX,
            imageY,
            imageWidth,
            imageHeight
          );
          imageX += imageWidth + imageSpacing;
          if ((index + 1) % imagesPerRow === 0) {
            imageX = 10;
            imageY += imageHeight + imageSpacing;
          }

          // Insert Findings after every 2 images
          if ((index + 1) % imagesPerRow === 0) {
            let findingsStartY = imageY + 10;

            // Reset findings for the current two images
            let currentFindings = `
        The UltraSound scan ${
          index - 1
        } demonstrates ultrasound findings consistent with second trimester placental detection and has detected the following classes: ${
              draggedFrames[index - 1].class_name.map((class_n) => class_n) ||
              "N/A"
            }.
        The UltraSound scan ${index} demonstrates ultrasound findings consistent with second trimester placental detection and has detected the following classes: ${
              draggedFrames[index].class_name.map((class_n) => class_n) || "N/A"
            }.
      `;

            // const findingsLines = doc.splitTextToSize(currentFindings, 190);
            const maxWidth = 180; // Ensure text fits inside page width (210 - margins)

            const findingsLines = doc.splitTextToSize(findingsText, maxWidth);
            const lineHeight = 7; // Adjust line spacing

            // Check if findings exceed available space
            if (findingsStartY + findingsLines.length * lineHeight > 280) {
              doc.addPage();
              //addHeader();
              findingsStartY = 40; // Reset position after page break
            }

            doc.text("Findings:", 10, findingsStartY);
            doc.text(findingsLines, 10, findingsStartY + 5); // Properly formatted text
          }
        }
      });

      // Footer for Page 1
      doc.setFillColor(24, 185, 232);
      doc.rect(0, 280, 210, 10, "F");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(
        "Page 1 || THE SETV.G HOSPITAL || EMERGENCY CONTACT - +91 XXXXXXXXXX",
        105,
        286,
        { align: "center" }
      );

      doc.addPage();
      if (logo2) {
        doc.addImage(logo2, "JPEG", 10, 10, 25, 20);
      }

      // Header for Page 2
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text("THE SETV.G HOSPITAL", 105, 15, { align: "center" });
      doc.setFontSize(12);
      doc.text("Accurate | Caring | Instant", 105, 22, { align: "center" });
      doc.text("Phone: 040-XXXXXXXXX / +91 XX XXX XXX", 105, 30, {
        align: "center",
      });
      doc.text("Email: setvgbhospital@gmail.com", 105, 37, { align: "center" });
      doc.text(
        "SETV.ASRV LLP, Avishkaran, NIPER, Balanagar, Hyderabad, Telangana, 500037.",
        105,
        44,
        { align: "center" }
      );

      // Header Border
      doc.setFillColor(255, 0, 0);
      doc.rect(0, 47, 210, 3, "F");
      doc.setFillColor(0, 0, 255);
      doc.rect(0, 50, 210, 3, "F");

      // Recommendations Section

      //doc.text("Recommendations:", 10, 60);
      doc.text(doc.splitTextToSize(recommendationsText, 190), 10, 65);
      //doc.text(doc.splitTextToSize(recommendations, 190), 10, 50);

      // Disclaimer Section
      let disclaimer = "";
      if (path === "Placental-Detection") {
        disclaimer = `
    - The observations from the scans do not indicate any immediate placental abnormalities, including placental insufficiency, abnormal placental position, or abnormal attachment to the uterine wall.
    - Clinical correlation with the patient's medical history, physical examination, and additional diagnostic tests, such as Doppler ultrasound and fetal MRI, is essential to confirm the presence of placental-related issues.
    - Further investigations, including amniocentesis or placental biopsy, may be required for a more detailed diagnosis in cases of suspected placental abnormalities or fetal complications.
  `;
      } else if (path === "Fetus-Location") {
        disclaimer = `The observations indicate fetal abnormalities that require immediate clinical attention. Follow-up diagnostic tests and maternal history correlation are essential to confirm findings and plan appropriate interventions`;
      } else if (path === "Organ-Location") {
        disclaimer = `The observations indicate fetal abnormalities that require immediate clinical attention. Follow-up diagnostic tests and maternal history correlation are essential to confirm findings and plan appropriate interventions`;
      } else if (path === "Organ-Assessment") {
        disclaimer = `The observations indicate fetal abnormalities that require immediate clinical attention. Follow-up diagnostic tests and maternal history correlation are essential to confirm findings and plan appropriate interventions`;
      } else if (path === "Fetal-Echocardioghraphy") {
        disclaimer = `The observations indicate fetal abnormalities that require immediate clinical attention. Follow-up diagnostic tests and maternal history correlation are essential to confirm findings and plan appropriate interventions`;
      } else if (path === "Fetal-Brain-Abnormality") {
        disclaimer = `The observations indicate fetal abnormalities that require immediate clinical attention. Follow-up diagnostic tests and maternal history correlation are essential to confirm findings and plan appropriate interventions`;
      } else {
        disclaimer = "no abnormalities found";
      }
      let disclaimerStartY =
        50 + doc.splitTextToSize(recommendationsText, 190).length * 5 + 20;
      doc.text("Disclaimer:", 10, disclaimerStartY);
      doc.text(doc.splitTextToSize(disclaimer, 190), 10, disclaimerStartY + 5);

      // Doctor's Comments Section
      let commentsStartY =
        disclaimerStartY + doc.splitTextToSize(disclaimer, 190).length * 5 + 20;
      doc.text(`Doctor's Comments : ${commentText}`, 10, commentsStartY);
      doc.text("__", 10, commentsStartY + 10);

      // Signature Section
      let signatureStartY = commentsStartY + 30;
      doc.text(`Name of Doctor:${name}`, 10, signatureStartY);
      doc.text(`Medical Id:${id}`, 10, signatureStartY + 10);

      // Footer for Page 2
      doc.setFillColor(24, 185, 232);
      doc.rect(0, 280, 210, 10, "F");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(
        "Page 2 || THE SETV.G HOSPITAL || EMERGENCY CONTACT - +91 XXXXXXXXXX",
        105,
        286,
        { align: "center" }
      );

      // Save and Show the Report
      const pdfBlob1 = doc.output("blob");
      const pdfUrl1 = URL.createObjectURL(pdfBlob1);

      setPdfBlob(pdfBlob1);
      setPdfUrl(pdfUrl1);

      const formData = new FormData();
      formData.append("pdfFile", pdfBlob1, `report-${data.patientId}.pdf`);
      formData.append("patientName", data.patientName);
      formData.append("patientId", data.patientId);
      formData.append("patientAge", data.patientAge);
      formData.append("patientNumber", data.patientNumber);
      formData.append("gender", data.gender);
      formData.append("visitId", visitId);
      setReportContent(pdfUrl1);

      if (!showConfirmation) {
        setShowReport(true);
      }
      // Reset form fields
      // reset();
    } catch (error) {}
  };
  const [isHovered, setIsHovered] = useState(false);
  const [showFindings, setShowFindings] = useState(false);

  const [recommendationsText, setRecommendationsText] = useState("");

  const [findingsText, setFindingsText] = useState("");

  const handleAnalyze = async () => {
    const video = videoRef.current;

    if (!video) {
      toast.error("Video element is missing. Please try again.");
      return;
    }

    // Wait for the video metadata to load
    if (!video.duration || video.duration === Infinity) {
      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
      });
    }

    if (video.duration === 0) {
      toast.error(
        "The uploaded video has no duration. Please upload a valid video file."
      );
      return;
    }

    try {
      toast.success("Analyzing video...");
      await extractFrames(); // Extract frames and send them to the backend
      setShowFindings(true); // Show findings immediately
    } catch (error) {
      toast.error("An error occurred while analyzing the video.");
    }
  };

  const clearprocess = () => {
    setAnalysisResult(null);
  };

  const handleGenerateReport = () => {
    // Toggle the report visibility when the button is clicked
    setShowReport(true);
  };
  const [showReports, setShowReports] = useState(false);
  const [viewPdf, setViewPdf] = useState(false);
  //const report = "URL_TO_YOUR_REPORT"; // Replace with your actual PDF URL

  useEffect(() => {
    if (draggedFrames.length === 0) {
      setFindingsText("No abnormalities detected");
      // findings="";
      setRecommendationsText(
        "No definitive findings were identified during the current evaluation.  Clinical correlation is recommended.  Physician validation and further investigation, as deemed necessary, should be pursued."
      );
    }
  }, [draggedFrames]);

  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event) => {
      // Make sure the message is from the iframe (security check)
      if (event.origin !== window.location.origin) return;

      // Check for the message indicating the download button was clicked
      if (event.data === "downloadClicked") {
        // Trigger re-render and scroll to top
        setReRender((prev) => !prev);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [reRender]);

  const [currentItem, setCurrentItem] = useState(null); // Store the currently displayed item

  useEffect(() => {
    let timer;
    if (aiData.length) {
      aiData.forEach((item, idx) => {
        timer = setTimeout(() => {
          setCurrentItem(item); // Update currentItem with the latest detection
        }, idx * 2000); // Display the next item after 2 seconds
      });
    }

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [aiData]); // Ensure this effect runs whenever aiData changes

  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current frame index

  useEffect(() => {
    if (frames.length > 0) {
      // Start a timer when frames are available
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          // Loop through frames and reset to 0 after the last frame
          return prevIndex + 1 < frames.length ? prevIndex + 1 : 0;
        });
      }, 2000);

      return () => clearInterval(interval); // Clear interval on component unmount or when frames change
    }
  }, [frames]);

  //const[finalFrames,setFinalframes] = useState([]);

  const handleRemoveImage = (imageToRemove) => {
    setDraggedFrames((prev) => prev.filter((frame) => frame !== imageToRemove));
  };

  // Add useEffect to update findings and recommendations when draggedFrames changes
  useEffect(() => {
    findings = "";
    for (let i = 0; i < draggedFrames.length; i++) {
      if (path === "Placental-Detection") {
        findings += `The UltraSound scan ${
          i + 1
        } demonstrates ultrasound findings consistent with second trimester placental detection and has detected the following classes: ${
          draggedFrames[i].class_name.map((class_n) => class_n) || "N/A"
        }\n\n`;
      } else if (path === "Fetus-Location") {
        findings += `The  ${
          i + 1
        } ultrasound cross-section view demonstrates radiological findings indicative of Normalize Features as fetal skull type: ${
          draggedFrames[i].class_name.map((class_n) => class_n) || "N/A"
        }\n\n`;
      } else if (path === "Organ-Location") {
        findings += `The ${
          i + 1
        } ultrasound cross-section view demonstrates radiological findings indicative of [Normal/Abnormal] features.for Oragan Location : ${
          draggedFrames[i].class_name.map((class_n) => class_n) || "N/A"
        }\n\n`;
      } else if (path === "Organ-Assessment") {
        findings += `The ${
          i + 1
        } ultrasound cross-section view demonstrates radiological findings indicative of [Normal/Abnormal] features.for Oragan Assesement : ${
          draggedFrames[i].class_name.map((class_n) => class_n) || "N/A"
        }\n\n`;
      } else if (path === "Fetal-Echocardioghraphy") {
        findings += `The ${
          i + 1
        } ultrasound cross-section view demonstrates radiological findings indicative of Normalize Features in the aortic arch, as visualized by fetal echocardiography : ${
          draggedFrames[i].class_name.map((class_n) => class_n) || "N/A"
        }\n\n`;
      } else if (path === "Fetal-Brain-Abnormality") {
        findings += `The  ${
          i + 1
        } ultrasound cross-section view demonstrates radiological findings indicative of Normalize Features as fetal skull type: ${
          draggedFrames[i].class_name.map((class_n) => class_n) || "N/A"
        }\n\n`;
      } else {
        findings += "No abnormalities detected";
      }

      setFindingsText(findings);
      let recommendations = "";
      if (path === "Placental-Detection") {
        recommendations = `Recommendations:\n\n1. Ultrasound (Transabdominal & Transvaginal) - Determines placental location and detects placenta previa.\n\n2. Doppler Ultrasound – Assesses placental blood flow and function.`;
      } else if (path === "Fetus-Location") {
        recommendations = `Recommendations:\n\n1. Ultrasound (Obstetric Sonography) – Determines fetal position and detects abnormalities.\n\n2. Transvaginal Ultrasound – More precise for early pregnancy fetal location.\n\n3. MRI (Magnetic Resonance Imaging) – Used when ultrasound findings are unclear.`;
      } else if (path === "Organ-Location") {
        recommendations = `Recommendations:\n\n1. Detailed Anomaly Scan (Level 2 Ultrasound / Targeted Ultrasound) – Performed at 18-22 weeks to assess fetal organ placement.\n\n2. 3D/4D Ultrasound – Provides a more detailed anatomical view.
`;
      } else if (path === "Organ-Assessment") {
        recommendations = `Recommendations:\n\n1. Fetal MRI – Provides detailed imaging of fetal organs when ultrasound is inconclusive.\n\n2. Doppler Ultrasound – Evaluates blood flow in organs like the liver, kidneys, and brain.`;
      } else if (path === "Fetal-Echocardioghraphy") {
        recommendations = `Recommendations:\n\n1. Fetal Echocardiogram (Fetal Echo) – Specialized ultrasound for assessing the fetal heart.\n\n2. Doppler Ultrasound – Assesses blood flow in the fetal heart and major vessels.\n\n3. MRI (Fetal Cardiac MRI, if needed) – Used in rare cases for additional cardiac imaging.`;
      } else if (path === "Fetal-Brain-Abnormality") {
        recommendations = `Recommendations:\n\n1. Neurosonography (Fetal Brain Ultrasound) – Detailed assessment of brain structures.\n\n2. Fetal MRI – Provides high-resolution images of fetal brain abnormalities (e.g., ventriculomegaly, hydrocephalus).\n\n3. Doppler Ultrasound – Evaluates blood flow in cerebral arteries.`;
      } else {
        recommendations = `No definitive findings were identified during the current evaluation.Clinical correlation is recommended.Physician validation and further investigation, as deemed necessary, should be pursued.`;
      }
      if (draggedFrames.length > 0) {
        recommendations += `\n
Correlation:\n\nWe always recommend correlating with clinical history,maternal conditions such as preeclampsia or gestational diabetes, previous pregnancy history, and routine ultrasound findings.Additionally, consider prenatal blood tests and genetic screening for further assessment of placental and fetal health.\nIF REQUIRED`;
      }

      setRecommendationsText(recommendations);
    }
  }, [draggedFrames]);

  return (
    <>
      <nav className="h-16 w-full bg-gray-900  fixed top-0 z-20">
        <img
          src={logo}
          alt="Logo"
          className="absolute top-0 right-4 w-20 h-20 sm:w-32 mt-2 sm:h-20 object-contain"
        />

        {/* Sidebar */}
        <SideBar
          logoutFunction={logoutFunction}
          className="lg:static lg:flex-shrink-0"
        />
      </nav>
      <div className="flex flex-col lg:flex-row relative bg-gray-900">
        {/* Main Content */}
        <div className="flex-1 mx-auto p-4 sm:p-8 flex flex-col items-center justify-center bg-gray-800 rounded-lg shadow-lg w-full max-w-screen-lg mt-20">
          <Toaster position="top-right" />
          <h1 className="text-2xl font-semibold mb-6 text-center md:text-3xl lg:text-4xl">
            {path}
          </h1>

          <div className="w-full">
            <div className="w-full">
              {/* File Upload Section  frame divison code asli wala upar h */}
              <div className="flex flex-wrap items-center bg-gray-800 rounded-md shadow-md">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-l-md text-xs sm:text-sm font-medium flex-shrink-0 flex items-center space-x-2"
                >
                  <File size={16} className="text-gray-300" />
                  <span>Upload Video</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="video/*"
                  onClick={(e) => {
                    if (count !== 0) {
                      e.preventDefault(); // Prevent file picker from opening
                      navigate(0); // Refresh the page
                    }
                  }}
                  onChange={(e) => {
                    setCount(1); // Set count when the first file is uploaded
                    handleFileUpload(e);
                  }}
                  ref={fileInputRef} // Attach the ref here
                  className="hidden"
                />

                <video ref={videoRef} className="hidden" />
                <div className="flex-1 px-4 py-2 text-xs sm:text-sm truncate">
                  {uploadedFile ? uploadedFile.name : "No file selected"}
                </div>
                {uploadedFile && (
                  <div className="flex items-center px-4 py-2">
                    <Link
                      to="#"
                      className="text-blue-500 text-xs sm:text-sm pr-4"
                      download={uploadedFile.name}
                    >
                      {`${(uploadedFile.size / 1024).toFixed(1)} KB`}
                    </Link>
                  </div>
                )}
              </div>

              {/* Video Player */}
              {uploadedFile && (
                <div>
                  <video
                    style={{ display: "none" }}
                    ref={videoRef}
                    src={URL.createObjectURL(uploadedFile)}
                    controls
                    onLoadedMetadata={() => {
                      const canvas = canvasRef.current;
                      const video = videoRef.current;
                      canvas.width = video.videoWidth;
                      canvas.height = video.videoHeight;
                    }}
                  ></video>
                </div>
              )}

              {/* Canvas for Frame Extraction */}
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>

            {/*extract frame code khatam/}

          {/* Shaded Box Display */}
            {uploadedFile && (
              <div className="mt-4 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-md shadow-lg border border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm sm:text-base font-medium truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {`${(uploadedFile.size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                  <button
                    onClick={clearFile}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            )}
            <div className="mt-4">
              <Label htmlFor="framerate">Framerate (frames per second)</Label>
              <Input
                disabled={!!uploadedFile}
                id="framerate"
                type="number"
                min="1"
                max="60"
                step="1"
                defaultValue="30"
                onChange={(e) => {
                  if (e.target.value < 1) {
                    toast.error("enter a frame rate greater than 0");
                    return;
                  }
                  setFramerate(parseFloat(e.target.value));
                }}
                onMouseEnter={() => setIsHovered(true)} // Show note on hover
                onMouseLeave={() => setIsHovered(false)} // Hide note when not hovering
                className="mt-2  bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter framerate (e.g., 30)"
              />

              {/* Hover note */}
              {isHovered && (
                <p className=" absolute right-20 mt-1 text-red-500 text-sm bg-gray-800 p-2 rounded-md shadow-md w-[250px]">
                  Note: Frame rate can be set only before uploading the video.
                  Once uploaded, you must clear or reupload the video to change
                  the frame rate.
                </p>
              )}
            </div>

            {uploadedFile && (
              <div className="mt-6">
                {/* Video Element */}
                <div className="mb-4">
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    controls
                    className="w-full h-[360px] object-contain rounded-lg shadow-lg"
                    onLoadedMetadata={(e) => {
                      if (e.target.duration === 0) {
                        toast.error(
                          "Invalid video file. Please upload a valid video."
                        );
                      }
                    }}
                  />
                </div>

                {/* Progress Bar and Value */}
                <div className="relative mt-4">
                  <div className="relative h-4 w-full bg-gray-300 rounded">
                    <div
                      id="progress-bar"
                      className="absolute h-full bg-green-500 rounded "
                      style={{ width: "0%" }} // Initial width
                    ></div>
                  </div>
                  <p
                    id="progress-value"
                    className="text-center mt-2 text-white font-medium"
                  >
                    0%
                  </p>
                </div>
              </div>
            )}

            {flag && (
              <div className="w-full flex flex-wrap gap-5 max-w-6xl mt-10  mx-auto p-4 sm:justify-center md:justify-start">
                {/* Processed Video Section */}
                <Card className="bg-white-800 flex-1  mb-6 my-2">
                  <CardHeader className="flex items-center justify-between ">
                    <h2 className="text-lg text-white font-medium">
                      Processed Video
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-black  rounded-md overflow-hidden ">
                      {currentItem ? (
                        <img
                          className="w-full h-full"
                          src={`data:image/jpeg;base64,${currentItem.annotated_image}`}
                        />
                      ) : (
                        <div> No Frames To Show </div>
                      )}
                    </div>
                    {path === "Fetus-Location" && (
                      <p className="mt-4 text-sm text-center text-gray-300">
                        Detection of placental positioning for classes: 'fetal
                        skull', and 'abnormality' to identify their locations
                        and characteristics.
                      </p>
                    )}

                    {path === "Placental-Detection" && (
                      <p className="mt-4 text-sm text-center text-gray-300">
                        Detection of placental positioning for classes: 'baby',
                        'feto', 'placenta', and 'tip' to identify their
                        locations and characteristics.
                      </p>
                    )}
                    {path === "Organ-Assessment" && (
                      <p className="mt-4 text-sm text-center text-gray-300">
                        Detection of placental positioning for classes:
                        'Aorta','Confluence','Rib','Spine','Stomach' to identify
                        their locations and characteristics.
                      </p>
                    )}
                    {path === "Organ-Location" && (
                      <p className="mt-4 text-sm text-center text-gray-300">
                        Detection of placental positioning for classes:
                        'CM','IT','NT','midbrain','nasal bone','nasal
                        skin','nasal tip','palate' to identify their locations
                        and characteristics.
                      </p>
                    )}
                    {path === "Fetal-Echocardioghraphy" && (
                      <p className="mt-4 text-sm text-center text-gray-300">
                        Detection of placental positioning for classes: 'Aorta',
                        'Flows', 'Other', 'V sign' to identify their locations
                        and characteristics.
                      </p>
                    )}
                    {path === "Fetal-Brain-Abnormality" && (
                      <p className="mt-4 text-sm text-center text-gray-300">
                        Detection of placental positioning for classes: 'anold
                        chiari malformation', 'arachnoid cyst', 'cerebellah
                        hypoplasia', 'cisterna magna', 'colphocephaly',
                        'encephalocele', 'holoprosencephaly', 'hydracenphaly',
                        'intracranial hemorrdge', 'intracranial tumor', 'mild
                        ventriculomegaly', 'moderate ventriculomegaly',
                        'polencephaly', 'severe ventriculomegaly' to identify
                        their locations and characteristics.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {flag && (
              <>
                {" "}
                <div className="mt- ">
                  <FramesPreview
                    placentalframes={placentalframes}
                    nodetectionframes={nodetectionframes}
                    onFrameDrop={handleFrameDrop}
                    draggedFrames={draggedFrames}
                    setDraggedFrames={setDraggedFrames}
                    handleRemoveImage={handleRemoveImage}
                    reportFrames={reportFrames}
                  />
                </div>
                <div className="mt-6 w-full max-w-6xl  rounded-lg shadow-lg ">
                  {/* Recommendations and Findings Section */}
                  {showFindings && (
                    <>
                      <div className="grid grid-cols-2 bg-gray-700 rounded-md gap-4 px-4 py-6">
                        {/* Recommendations Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">
                            Recommendations
                          </h3>
                          <textarea
                            value={recommendationsText}
                            onChange={(e) =>
                              setRecommendationsText(e.target.value)
                            }
                            className="w-full bg-gray-900 text-white p-4 rounded-md border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
                            rows="8"
                            placeholder="Enter recommendations here..."
                          ></textarea>
                        </div>

                        {/* Findings Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">
                            Findings
                          </h3>
                          <textarea
                            value={findingsText}
                            onChange={(e) => setFindingsText(e.target.value)}
                            className="w-full bg-gray-900 text-white p-4 rounded-md border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
                            rows="8"
                            placeholder="Enter findings here..."
                          ></textarea>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mt-4 mb-4">
                          Doctor Comments
                        </h3>
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="w-full h-32 bg-gray-900 text-white p-4 rounded-md border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
                          rows="8"
                          placeholder="Enter Doctor Comments here..."
                        ></textarea>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Patient Information Form */}
            <form
              className="mt-10 bg-gray-800 p-6 rounded-md shadow-md"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Patient Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Patient Name */}
                <div>
                  <Label htmlFor="patientName" className="">
                    Patient Name
                  </Label>
                  <Input
                    id="patientName"
                    {...register("patientName")}
                    placeholder="Enter patient name"
                    className="mt-2 bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Patient ID */}
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    {...register("patientId")}
                    placeholder="Enter patient ID"
                    className="mt-2 bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Patient Age */}
                <div>
                  <Label htmlFor="patientAge">Patient Age</Label>

                  <Input
                    id="patientAge"
                    type="number"
                    {...register("patientAge", {
                      required: "",
                      min: { value: 0, message: "Age cannot be negative" },
                      max: {
                        value: 120,
                        message: "Enter a realistic age (0-120)",
                      },
                      valueAsNumber: true,
                    })}
                    placeholder="Enter patient age"
                    className="mt-2 bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (
                        !(
                          (
                            /[0-9]/.test(e.key) || // Allow digits (0-9)
                            e.key === "Backspace" || // Allow Backspace
                            e.key === "Delete" || // Allow Delete
                            e.key === "ArrowLeft" || // Allow Left Arrow
                            e.key === "ArrowRight" || // Allow Right Arrow
                            e.key === "Tab"
                          ) // Allow Tab key
                        )
                      ) {
                        e.preventDefault(); // Block all other keys
                      }
                    }}
                    onInput={(e) => {
                      if (e.target.value.length > 3) {
                        e.target.value = e.target.value.slice(0, 3); // Limit input to 3 digits
                      }
                    }}
                  />

                  {errors.patientAge && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.patientAge.message}
                    </p>
                  )}
                </div>
                {/* Patient Number */}
                <div>
                  <Label htmlFor="patientNumber">Patient Number</Label>
                  <Input
                    id="patientNumber"
                    type="number"
                    {...register("patientNumber")}
                    placeholder="Enter patient number"
                    className="mt-2 bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.patientNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.patientNumber.message}
                    </p>
                  )}
                </div>

                {/* Patient Gender */}
                <div>
                  <Label>Patient Gender</Label>
                  <RadioGroup
                    value={watch("gender")} // Bind to form state
                    onValueChange={(value) => setValue("gender", value)} // Update form state
                    className="mt-2 flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        id="female"
                        value="female"
                        className="bg-gray-700 border border-gray-600 text-white rounded-full focus:ring-2 focus:ring-blue-500"
                      />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        id="other"
                        value="other"
                        className="bg-gray-700 border border-gray-600 text-white rounded-full focus:ring-2 focus:ring-blue-500"
                      />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Submit Button */}

              {/* Generate Report Button */}
              <Button
                type="submit"
                variant="ghost"
                className="w-full mt-10 bg-gray-700 hover:bg-gray-500 tracking-wider text-md text-white font-semibold px-6 py-3 rounded-md"
              >
                Generate Report
              </Button>
            </form>
            {showConfirmation && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100"
                aria-labelledby="confirmation-modal"
                role="dialog"
                aria-modal="true"
              >
                <div className="w-[90%] max-w-sm bg-gray-800 rounded-lg shadow-lg border border-gray-700 relative">
                  <div className="px-4 py-2 bg-gray-700 rounded-t-lg">
                    <h3
                      id="confirmation-modal"
                      className="text-lg font-semibold text-white"
                    >
                      Confirm Report Generation
                    </h3>
                  </div>
                  <div className="px-4 py-3 text-white">
                    <p>Are you sure you want to generate the report?</p>
                  </div>
                  <div className="flex justify-around px-4 py-3 bg-gray-700 rounded-b-lg">
                    <button
                      onClick={() => {
                        setShowConfirmation(false);
                        setShowReport(true);
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                    >
                      Yes, Generate
                    </button>
                    <button
                      onClick={() => {
                        confirmGenerateReport(false), setShowReport(false);
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                    >
                      No, Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showReport && !showConfirmation && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                aria-labelledby="generated-report-modal"
                role="dialog"
                aria-modal="true"
              >
                {/* Popup Container */}
                <div className="w-[90%] max-w-2xl bg-gray-800 rounded-lg shadow-lg border border-gray-700 relative">
                  {/* Header */}
                  <div className="px-4 py-2 bg-gray-700 rounded-t-lg flex justify-between items-center">
                    <h3
                      id="generated-report-modal"
                      className="text-lg font-semibold text-white"
                    >
                      Generated Report
                    </h3>
                  </div>

                  {/* Iframe Container */}
                  <div className="h-[400px] overflow-y-auto">
                    <iframe
                      src={reportContent}
                      title="Generated Report"
                      className="w-full h-full"
                      frameBorder="0"
                    ></iframe>
                  </div>

                  <div className="flex justify-between items-center px-4 py-3 bg-gray-700 rounded-b-lg">
                    {/* Download and Close */}
                    <button
                      onClick={() => {
                        confirmGenerateReport(true);
                        if (!reportContent) {
                          toast.error("Report not ready yet!");
                          return;
                        }

                        // Trigger download
                        const link = document.createElement("a");
                        link.href = reportContent; // Use the generated Blob URL
                        link.download = `${path}_Report.pdf`; // Set file name
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // Close the popup and optionally reload
                        setShowReport(false);
                        setTimeout(() => {
                          window.location.reload();
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth", // Smooth scrolling effect
                          });
                        }, 100);

                        navigate("/all-reports");
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full"
                    >
                      ✓
                    </button>

                    {/* Close Button */}
                    <button
                      onClick={() => setShowReport(false)}
                      className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full"
                      aria-label="Close without Download"
                    >
                      ✗
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
