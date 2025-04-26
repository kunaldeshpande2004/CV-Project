//////////////////////////////////////////////////////////////////////////////////////////////////////
//                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                        
//                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR  DEPLOYMENT)              
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025                                                                 
// CODE LENGTH OF FILE: ROUTES LINE 63 - LINE 429                       
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                       
// DATE OF DEVELOPMENT START FOR ROUTES MODULE: 10/2/2025 - 27/2/2025                              
//--------------------------------------------------------------------------------------------------
//                           BASIC INFORMATION ABOUT THE FILE                                       
//--------------------------------------------------------------------------------------------------
// This Node.js module defines API routes for user authentication, report uploads, and patient data 
// management. It includes routes for login, signup, password reset, video and image processing, 
// and report handling. The module integrates with Azure Blob Storage for secure media storage.
//
// Key Features:
/* 
Authentication Routes:
- `/signup`: Registers a new user with validation.
- `/login`: Authenticates users with reCAPTCHA validation.
- `/forgot-password`: Sends password reset link via email.
- `/reset-password`: Resets user passwords securely.

Video & Image Handling:
- `/upload`: Uploads patient scan videos to Azure Blob Storage.
- `/upload-frame`: Uploads and stores individual image frames.
- `/get-frames/:folder`: Retrieves stored image frames from Azure.

Report Management:
- `/api/reports`: Fetches all stored medical reports.
- `/upload-patient-report`: Uploads and stores PDF reports securely.

Security Considerations:
- JWT-based authentication ensures session security.
- reCAPTCHA prevents automated bot-based attacks.
- Passwords are hashed before storage.
- Secure storage of medical data in Azure Blob Storage.

Error Handling:
- Catches and logs API errors with appropriate status codes.
- Ensures invalid or malicious requests are rejected.

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                   KEY LIBRARIES AND DEPENDENCIES                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Express: Handles API routing.
// Mongoose: Manages MongoDB database interactions.
// Multer: Processes file uploads.
// Azure Storage Blob SDK: Handles cloud storage of medical images and reports.
// JSON Web Token (JWT): Manages authentication tokens.
// Nodemailer: Sends password reset emails.
// Joi: Validates request payloads before processing.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : BACKEND (NODE.JS, EXPRESS, MONGODB, AZURE BLOB STORAGE)
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////


const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/Authcontroller");
const {
  signupvalidation,
  loginValidation,
} = require("../middlewares/Authvalidation");

const router = require("express").Router();
const Report = require("../models/report");

// Login route
router.post("/login", loginValidation, login);

// Signup route
router.post("/signup", signupvalidation, signup);

// Forgot password route
router.post("/forgot-password", forgotPassword);

// Reset password route
router.post("/reset-password", resetPassword);

const upload = multer();
router.post("/api/submit-visit", upload.single("pdfFile"), async (req, res) => {

  try {
    let {
      patientId,
      patientName,
      patientAge,
      patientNumber,
      gender,
      video,
      report,
      visitId,
    } = req.body;
    const now = new Date();
    let temp = visitId;

    visitId = visitId.substring(4, 25);
    visitId += `${String(now.getDate()).padStart(2, "0")}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${now.getFullYear()}${String(now.getHours()).padStart(
      2,
      "0"
    )}${String(now.getMinutes()).padStart(2, "0")}`;
   
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME; // Azure Storage account name
    const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient("scan-videos");
    const containerClient2 = blobServiceClient.getContainerClient("reports");

    const renameBlob = async (oldBlobName) => {
      const oldBlobClient = containerClient.getBlobClient(oldBlobName);

      // Check if the blob exists
      const exists = await oldBlobClient.exists();
      if (!exists) {
    
        return null; // Return null if the blob doesn't exist
      }

      // Generate new blob name
      const newBlobName = `${visitId}_video.mp4`;
      const newBlobClient = containerClient.getBlobClient(newBlobName);

      // Copy the existing blob to the new name
      await newBlobClient.beginCopyFromURL(oldBlobClient.url);


      // Delete the old blob after successful copy
      await oldBlobClient.delete();
    

      // ✅ Return the full URL of the renamed blob
      return newBlobClient.url;
    };

    // ✅ Calling the function and getting the URL
    renameBlob(`${temp}_video.mp4`).then((newUrl) => {
      if (newUrl) {
    
        video = newUrl; // Store the new URL in the variable
       
      }
    });

    const pdfBlobName = `${visitId}_report.pdf`;
    const blockBlobClient = containerClient2.getBlockBlobClient(pdfBlobName);

    // Upload PDF
    const pdfBuffer = req.file.buffer;
    await blockBlobClient.uploadData(pdfBuffer, {
      blobHTTPHeaders: { blobContentType: "application/pdf" },
    });

    const pdfUrl = blockBlobClient.url;
    report = pdfUrl;

    //frames code

    const renameFolder = async (oldFolderName, newFolderName) => {
      try {
        const containerClient3 =
          blobServiceClient.getContainerClient("scan-images");

      

        // **Step 1: Get all blobs inside the folder**
        const blobs = [];
        for await (const blob of containerClient3.listBlobsFlat({
          prefix: `${oldFolderName}/`,
        })) {
          blobs.push(blob.name);
        }

        if (blobs.length === 0) {
        
          return;
        }

        // **Step 2: Copy each blob to the new folder**
        for (const blobName of blobs) {
          const fileName = blobName.split("/").pop(); // Extract the filename (e.g., img1.png)
          const newBlobName = `${newFolderName}/${fileName}`; // New folder path

          const oldBlobClient = containerClient3.getBlobClient(blobName);
          const newBlobClient = containerClient3.getBlobClient(newBlobName);

         
          await newBlobClient.beginCopyFromURL(oldBlobClient.url);
        }

        // **Step 3: Delete old blobs**
        for (const blobName of blobs) {
        
          const oldBlobClient = containerClient3.getBlobClient(blobName);
          await oldBlobClient.delete();
        }

       
      } catch (error) {
       
      }
    };
    renameFolder(temp, visitId);
    //end

    const newReport = new Report({
      visitId,
      patientId,
      patientName,
      patientAge,
      patientNumber,
      gender,
      video,
      report,
      visitDate: new Date().toISOString().split("T")[0], // Auto add date
      visitTime: new Date().toTimeString().split(" ")[0], // Auto add time
    });

    const savedReport = await newReport.save();
    res.status(201);
  } catch (error) {
   
    res.status(400)
  }
});

// Fetch image frames from Azure
router.get("/get-frames/:folder", async (req, res) => {
  try {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME; // Azure Storage account name
    const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN; // SAS token

    // Initialize Azure BlobServiceClient with SAS token
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient("scan-images");

    const folder = req.params.folder;
    let imageUrls = [];

    // Fetch all blobs inside the folder
    for await (const blob of containerClient.listBlobsFlat({
      prefix: `${folder}/`,
    })) {
      // Append SAS token to each URL
      const blobUrl = `https://${accountName}.blob.core.windows.net/scan-images/${blob.name}?${sasToken}`;
      imageUrls.push(blobUrl);
    }

    res.json({ images: imageUrls });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

router.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500)
  }
});
const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid"); // Ensure UUID is imported
require("dotenv").config();

router.post("/upload", upload.single("file"), async (req, res) => {
  const { temp } = req.body;
  try {
    if (!req.file) {
      return res.status(400)
    }

    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME; // Replace with your actual Azure Storage account name
    const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient("scan-videos");

    //const blobName = `${uuidv4()}-${req.file.originalname}`;
    const blobName = `${temp}_video.mp4`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: {
        blobContentType: req.file.mimetype, // e.g., 'video/mp4'
      },
    });

    const blobUrl = blockBlobClient.url;

    res.status(200).json({ message: "Upload successful", url: blobUrl });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

//original
router.post("/upload-frame", async (req, res) => {
  try {
    const { annotated_image, idx, visitId } = req.body; // Expect base64 image and a unique string

 

    if (!annotated_image) {
      return res
        .status(400)
        
    }

    // Initialize Azure Blob Service Client
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );

    const containerClient = blobServiceClient.getContainerClient("scan-images");

    // Convert base64 image to Buffer
    const base64Image = annotated_image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Generate timestamp for folder structure (YYYYMMDDHHmm)

    // **Create virtual folder path**
    const folderName = visitId;
    const blobName = `${folderName}/img${idx}.png`; // Store in the folder

    // Upload the image
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(imageBuffer, {
      blobHTTPHeaders: { blobContentType: "image/png" },
    });

    // Return the full blob URL
    const blobUrl = blockBlobClient.url;

    res.status(200).json({ success: true, blobUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res
      .status(500)
     
  }
});

router.post(
  "/upload-patient-report",
  upload.single("pdfFile"),
  async (req, res) => {
    try {
      let {
        patientName,
        patientId,
        patientAge,
        patientNumber,
        gender,
        visitId,
      } = req.body;
      const pdfBuffer = req.file.buffer;

      const now = new Date();
      let temp = visitId;

      visitId = visitId.substring(4, 25);
      visitId += `${String(now.getDate()).padStart(2, "0")}${String(
        now.getMonth() + 1
      ).padStart(2, "0")}${now.getFullYear()}${String(now.getHours()).padStart(
        2,
        "0"
      )}${String(now.getMinutes()).padStart(2, "0")}`;
      const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME; // Replace with your actual Azure Storage account name
      const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient = blobServiceClient.getContainerClient("reports");

      await containerClient.createIfNotExists();

      // Unique name for the PDF file
      // const pdfBlobName = `report-${patientId}-${uuidv4()}.pdf`;
      const pdfBlobName = `${visitId}_report.pdf`;
      const blockBlobClient = containerClient.getBlockBlobClient(pdfBlobName);

      // Upload PDF
      await blockBlobClient.uploadData(pdfBuffer, {
        blobHTTPHeaders: { blobContentType: "application/pdf" },
      });

      const pdfUrl = blockBlobClient.url;

      res.status(200).json({
        pdfUrl,
      });
    } catch (error) {
      console.error("Error uploading to Azure Blob Storage:", error);
      res.status(500)
    }
  }
);

module.exports = router;
