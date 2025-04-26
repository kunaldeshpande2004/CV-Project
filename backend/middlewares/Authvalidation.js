//////////////////////////////////////////////////////////////////////////////////////////////////////
//                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                        
//                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR  DEPLOYMENT)              
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025                                                                 
// CODE LENGTH OF FILE: VALIDATION LINE 51 - LINE 90                      
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                       
// DATE OF DEVELOPMENT START FOR VALIDATION MODULE: 10/2/2025 - 27/2/2025                          
//--------------------------------------------------------------------------------------------------
//                           BASIC INFORMATION ABOUT THE FILE                                       
//--------------------------------------------------------------------------------------------------
// This Node.js module provides middleware for validating user input using Joi. It ensures that 
// signup and login requests contain correctly formatted and secure data before being processed.
//
// Key Features:
/* 
Signup Validation:
- Ensures all required fields are provided: full name, email, specialization, hospital name, 
  medical ID, years of experience, password, and reCAPTCHA.
- Validates password strength using regex (requires uppercase, lowercase, number, and special character).
- Limits `yearsOfExperience` to a reasonable range (1-100 years).

Login Validation:
- Ensures email and password fields are correctly formatted.
- Password validation enforces security requirements.
- reCAPTCHA verification is required to prevent bot attacks.

Security Considerations:
- Prevents common validation issues such as empty fields or invalid email formats.
- Ensures passwords meet complexity requirements to enhance security.
- Uses reCAPTCHA to prevent automated bot-based attacks.

Error Handling:
- Returns `400 Bad Request` if validation fails, with a descriptive error message.
- Prevents processing of invalid or malicious requests.

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                   KEY LIBRARIES AND DEPENDENCIES                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Joi: A powerful validation library used to enforce input rules.
// Express Middleware: Ensures that invalid requests are rejected before reaching the controller.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : BACKEND (NODE.JS, EXPRESS)
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////

const Joi = require('joi');

const signupvalidation = (req,res,next)=>{
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        specialization: Joi.string().required(),
        hospitalName: Joi.string().required(),
        medicalId: Joi.string().required(),
        yearsOfExperience: Joi.number().integer().min(1).max(100).required(),
        password: Joi.string().required().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#%^~])[A-Za-z\d@$!%*?&_#%^~]{8,}$/),
        recaptcha:Joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({message:"Bad request",error})
    }
    next();
}
const loginValidation =(req,res,next) =>{


    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#%^~])[A-Za-z\d@$!%*?&_#%^~]{8,}$/),
        recaptcha:Joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
 
        return res.status(400)
           .json({message:" Auth failed email or password is wrong",error})
    }
    next();
}
module.exports = {
    signupvalidation,
    loginValidation
}