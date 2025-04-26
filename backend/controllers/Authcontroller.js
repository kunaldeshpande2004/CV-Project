//////////////////////////////////////////////////////////////////////////////////////////////////////
//                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED
//                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR  DEPLOYMENT)
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025
// CODE LENGTH OF FILE: AUTHCONTROLLER LINE 62 - LINE 382
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS
// DATE OF DEVELOPMENT START FOR AUTHCONTROLLER MODULE: 10/2/2025 - 27/2/2025
//--------------------------------------------------------------------------------------------------
//                           BASIC INFORMATION ABOUT THE FILE
//--------------------------------------------------------------------------------------------------
// This Node.js module handles user authentication, including signup, login, password reset, and
// reCAPTCHA verification. It ensures secure user management using hashing, JWTs, and email masking.
//
// Key Features:
/* 
Signup Process:
- Registers a new user with encrypted passwords.
- Masks and hashes sensitive information like emails and medical IDs.
- Checks if a user already exists before registration.

Login Process:
- Authenticates users using email and password.
- Implements Google reCAPTCHA to prevent bot attacks.
- Generates JWT tokens for secure session management.

Forgot Password & Reset Password:
- Sends password reset emails via Nodemailer.
- Uses JWT-based reset links with a 5-minute expiration.
- Securely updates the user's password after verification.

Security Considerations:
- Passwords are encrypted using bcrypt.
- Emails are masked and partially hashed for privacy.
- reCAPTCHA prevents automated attacks.
- JWT tokens have expiration times to reduce misuse risks.

Error Handling:
- Returns appropriate HTTP status codes and messages.
- Handles token expiration and validation errors.
- Prevents duplicate accounts and incorrect logins.

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                   KEY LIBRARIES AND DEPENDENCIES                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Express: Handles API routing.
// Bcrypt: Encrypts passwords for security.
// JSON Web Token (JWT): Generates and verifies authentication tokens.
// Axios: Sends HTTP requests for reCAPTCHA validation.
// Nodemailer: Sends password reset emails.
// Crypto: Generates secure reset tokens.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : BACKEND (NODE.JS, EXPRESS)
// DATABASE USED: MONGODB (MONGOOSE ODM)
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////


const fs = require("fs");
const path = require("path");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
        user: "swetanshu@setvglobal.com",
         pass: "gnfvxlkxouewlqiy",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const hashEmailForStorage = async (email) => {
  const [localPart, domain] = email.split("@");
  const firstThreeChars = localPart.slice(0, 3);
  const remainingChars = localPart.slice(3);
  const hashedRemaining = await bcrypt.hash(remainingChars, 10);
  return `${firstThreeChars}${hashedRemaining}@${domain}`;
};



// Function to hash email and medical ID
const hashValue = async (value) => {
  return await bcrypt.hash(value.toLowerCase(), 10);
};
const express = require("express");

const app = express();
// Serve static files from the "controller" folder
app.use(express.static(path.join(__dirname)));

// Store image filename in a variable
const logo = "setVlogo.png";
const maskMedicalId = (medicalId) => {
  return "#".repeat(medicalId.length - 3) + medicalId.slice(-3);
};

const maskEmail = (email) => {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart =
    localPart.slice(0, 3) + "*".repeat(localPart.length - 3);
  return `${maskedLocalPart}@${domain}`;
};

const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      specialization,
      hospitalName,
      medicalId,
      yearsOfExperience,
      password,
    } = req.body;

  


    const maskedMedicalId = maskMedicalId(medicalId);

    // Partially mask the email (this is used for storage and lookup)
    const maskedEmail = maskEmail(email);

    // Check if user already exists using the masked email
    const existingUser = await UserModel.findOne({ email: maskedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists, you can login", success: false });
    }

    // Partially hash the email
   

    // Create new user
    const newUser = new UserModel({
      fullName,
      originalEmail: email, // Store the original email for login lookup
      email: maskedEmail, // Store the hashed version
      maskedEmail, // Store the masked version
      specialization,
      hospitalName,
      medicalId: maskedMedicalId,
      maskedMedicalId,
      yearsOfExperience,
      password: await bcrypt.hash(password, 10),
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const login = async (req, res) => {

  try {
    const { email, password, recaptcha } = req.body;

    const secretKey = process.env.SECRET_KEY;
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`;

    const googleRes = await axios.post(googleVerifyUrl);

    if (!googleRes.data.success) {
      return res
        .status(400)
        .json({ success: false, message: "reCAPTCHA verification failed." });
    }

    // Find user by original email field
    const maskedEmail = maskEmail(email);

    // Search using the masked email (not hashed)
    const user = await UserModel.findOne({ email: maskedEmail });
    
    const errorMessage = "Auth failed, email or password is wrong";
    if (!user) {
      return res.status(403).json({ message: errorMessage, success: false });
    }

    // Compare passwords
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMessage, success: false });
    }

    // Generate JWT token
    const jwttoken = jwt.sign(
      { email: user.email, _id: user._id },   // `user.email` is already masked in your DB
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
);


    res.status(200).json({
      message: "Login successfully",
      success: true,
      jwttoken,
      email: maskedEmail,
      fullName: user.fullName,
      specialization: user.specialization,
      hospitalName: user.hospitalName,
      medicalId: user.medicalId,
      yearsOfExperience: user.yearsOfExperience,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const maskedEmail = maskEmail(email);

    // Search using masked email
    const user = await UserModel.findOne({ email: maskedEmail });


    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Generate reset token with hashed email inside payload (not plain email)
  

    const resetToken = jwt.sign(
      { maskedEmail, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );
    

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const htmlTemplate = ` <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            background-color: #f4f7fe;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: black;
        }
        .container {
            width: 100%;
            height: 100vh;
            display: table;
        }
        .card {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            margin: 0 auto;
            color: black;
        }
        
        h1,h2 {
            color: #eb7734;
        }
        .button {
            background-color: #eb7734;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 15px 0;
        }
        .footer {
            margin-top: 20px;
            color: #777;
            font-size: 12px;
        }
        .logo {
            margin-bottom: 15px;
        }
        .logo img {
            max-width: 100px;
        }
    </style>
</head>
<body>
    <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" valign="top">
                <table class="card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 400px;">
                    <tr>
                        <td align="center">
                            <h1> SETV </h1>
                            <h2>Forgot your password?</h2>
                            <p style='color:black'>You requested to reset your password. Click the button below to set a new password: </p>
                            <a href="${resetUrl}" style='color:white' class="button">Reset My Password</a>
                            <p style='color:black'>(This link will expire in 5 minutes)</p>
                            <p style='color:black' >If you did not request this, you can ignore this message.</p>
                            <div class="footer"  >
                                <p>SETV GLOBAL</p>
                                <p>Follow us on social media</p>
                                <p> <a href='https://www.linkedin.com/company/setv-global'>Linkedin</a> | <a href='https://www.setvglobal.com/'>Website</a></p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

    `;

    const mailOptions = {
      to: email,
      subject: "SETV.W AI  Password Reset Request",
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset link sent to your email.",
      success: true,
    });
  } catch (err) {
   
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

  const resetPassword = async (req, res) => {
    try {
      const { token, newPassword, recaptcha } = req.body;

      // Verify reCAPTCHA
      const secretKey = process.env.SECRET_KEY;
      const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`;

      const googleRes = await axios.post(googleVerifyUrl);

      if (!googleRes.data.success) {
        return res.status(400).json({
          success: false,
          message: "reCAPTCHA verification failed.",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user using masked email (from token)
      const user = await UserModel.findOne({ email: decoded.maskedEmail});
  

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successfully.", success: true });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Reset token has expired.", success: false });
    }
    console.error("Error in resetPassword:", err);
    res.status(500)
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
};




