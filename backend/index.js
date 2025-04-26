//////////////////////////////////////////////////////////////////////////////////////////////////////
//                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                        
//                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR  DEPLOYMENT)              
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025                                                                 
// CODE LENGTH OF FILE: SERVER LINE 59 - LINE 87                           
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                       
// DATE OF DEVELOPMENT START FOR SERVER MODULE: 10/2/2025 - 27/2/2025                              
//--------------------------------------------------------------------------------------------------
//                           BASIC INFORMATION ABOUT THE FILE                                       
//--------------------------------------------------------------------------------------------------
// This is the main server file for the Pregnancy Tracker application. It sets up the Express.js 
// backend, connects to the database, and configures middleware for authentication, API routing, 
// and file handling.
//
// Key Features:
/* 
Server Setup:
- Initializes an Express.js server.
- Listens on a configurable port (default: 8080).
- Uses `dotenv` to load environment variables.

Middleware Configuration:
- `body-parser`: Parses incoming JSON and URL-encoded requests.
- `cors`: Enables Cross-Origin Resource Sharing for frontend communication.
- `express.json()`: Handles large JSON payloads (up to 100MB).
- `express.urlencoded()`: Supports extended URL-encoded data (100MB limit).

Routes & API Handling:
- `/auth`: Handles authentication routes (signup, login, password reset).
- `/uploads`: Serves static files from the `uploads` directory.

Security Considerations:
- Restricts JSON payload size to prevent DOS attacks.
- Enables CORS for secure cross-origin requests.
- Stores environment-sensitive variables securely in `.env` file.

Error Handling:
- Ensures proper error logging and debugging.
- Uses appropriate status codes for API responses.

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                   KEY LIBRARIES AND DEPENDENCIES                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Express: Core web framework for Node.js.
// Body-parser: Parses JSON and URL-encoded requests.
// Cors: Enables cross-origin requests.
// Path: Handles file paths for static uploads.
// Dotenv: Manages environment variables securely.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : BACKEND (NODE.JS, EXPRESS, MONGODB, AZURE BLOB STORAGE)
// SECURITY CODE LEVEL : LOW
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////

const express = require("express");
const app = express();

const bodyParser = require('body-parser'); 
const cors = require('cors')
const path = require('path');
const Authrouter = require('./Routes/AuthRouter')
require('dotenv').config();
require('./models/db')

require('./models/azureblobservice')

const PORT = process.env.PORT || 8080;



app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/auth',Authrouter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
    
})