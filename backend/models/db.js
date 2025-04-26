//////////////////////////////////////////////////////////////////////////////////////////////////////
//                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                        
//                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT)              
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025                                                                 
// CODE LENGTH OF FILE: DATABASE CONNECTION LINE 43 - LINE 53             
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                       
// DATE OF DEVELOPMENT START FOR DATABASE CONNECTION MODULE: 10/2/2025 - 27/2/2025                 
//--------------------------------------------------------------------------------------------------
//                           BASIC INFORMATION ABOUT THE FILE                                       
//--------------------------------------------------------------------------------------------------
// This module establishes a connection to the MongoDB database using Mongoose. It ensures that 
// the backend has persistent and secure access to the database for handling authentication, 
// patient records, medical reports, and other critical data.
//
// Key Features:
/* 
MongoDB Connection Setup:
- Connects to MongoDB using the connection string stored in environment variables.
- Uses Mongoose for efficient MongoDB Object Data Modeling (ODM).

Security Considerations:
- Connection URI is securely stored in environment variables (`.env` file).
- Proper error handling to prevent system crashes in case of connection failure.

Error Handling:
- Logs successful connection messages.
- Catches and logs errors if the connection fails.
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                   KEY LIBRARIES AND DEPENDENCIES                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Mongoose: Provides an ODM for MongoDB, enabling schema-based data modeling.
// dotenv: Loads environment variables securely.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : BACKEND (NODE.JS, MONGODB)
// SECURITY CODE LEVEL : LOW
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////

const mongoose = require('mongoose');
const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url)
    .then(()=>{
        console.log('Mongodb Connected...');
        
    }).catch((err)=>{
        console.log('Mongodb Connection Error: ' , err);
        
    })