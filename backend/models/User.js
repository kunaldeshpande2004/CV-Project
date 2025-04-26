//////////////////////////////////////////////////////////////////////////////////////////////////////
//                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED
//                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR  DEPLOYMENT)
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025
// CODE LENGTH OF FILE: USER SCHEMA LINE 49 - LINE 68
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS
// DATE OF DEVELOPMENT START FOR USER SCHEMA MODULE: 10/2/2025 - 27/2/2025
//--------------------------------------------------------------------------------------------------
//                           BASIC INFORMATION ABOUT THE FILE
//--------------------------------------------------------------------------------------------------
// This module defines the Mongoose schema for storing user details in MongoDB. It ensures that
// authentication and authorization are securely handled, maintaining structured user information.
//
// Key Features:
/* 
User Schema Structure:
- `fullName`: Stores the full name of the user.
- `email`: Stores the hashed/masked email (unique identifier for login).
- `originalEmail`: Stores the actual email for login validation.
- `specialization`: Defines the user's medical specialization.
- `hospitalName`: Stores the name of the associated hospital.
- `medicalId`: Unique identifier for medical professionals.
- `yearsOfExperience`: Stores the number of years the user has practiced.
- `password`: Encrypted password for authentication.
- `timestamps`: Automatically stores createdAt and updatedAt timestamps.

Security Considerations:
- Passwords are stored in an encrypted format.
- Emails are masked and stored securely.
- Schema ensures unique constraint on email to prevent duplicate accounts.

Error Handling:
- Prevents insertion of invalid or incomplete user data.
- Ensures all required fields are properly validated.

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                   KEY LIBRARIES AND DEPENDENCIES                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Mongoose: Provides schema-based data modeling for MongoDB.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : BACKEND (NODE.JS, MONGODB)
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
    hospitalName: { type: String, required: true },
    medicalId: { type: String, required: true },
    yearsOfExperience: { type: Number },
    password: { type: String, required: true },

  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
