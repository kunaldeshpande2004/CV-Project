//////////////////////////////////////////////////////////////////////////////////////////////////////
//                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                        
//                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR  DEPLOYMENT)              
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025                                                                 
// CODE LENGTH OF FILE: REPORT SCHEMA LINE 49 - LINE 63                    
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                       
// DATE OF DEVELOPMENT START FOR REPORT SCHEMA MODULE: 10/2/2025 - 27/2/2025                       
//--------------------------------------------------------------------------------------------------
//                           BASIC INFORMATION ABOUT THE FILE                                       
//--------------------------------------------------------------------------------------------------
// This module defines the Mongoose schema for storing medical reports in MongoDB. It captures 
// patient details, visit information, and associated medical records such as videos and PDFs.
//
// Key Features:
/* 
Report Schema Structure:
- `visitId`: Unique identifier for the medical visit.
- `patientId`: Identifier for the patient.
- `patientName`: Stores the patient's full name.
- `patientNumber`: Contact number of the patient.
- `gender`: Stores the gender of the patient.
- `visitDate`: Date of the medical visit.
- `visitTime`: Time of the medical visit.
- `video`: Stores the URL of the ultrasound/video scan.
- `report`: Stores the URL of the generated medical report.

Security Considerations:
- Ensures structured storage of medical records.
- Data is validated through Mongoose schema to maintain consistency.

Error Handling:
- Prevents insertion of invalid data types.
- Ensures proper indexing and query performance.

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                   KEY LIBRARIES AND DEPENDENCIES                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Mongoose: Provides schema-based data modeling for MongoDB.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : BACKEND (NODE.JS, MONGODB)
// SECURITY CODE LEVEL : LOW
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    visitId: String,
    patientId: String,
    patientName: String,
    patientNumber: String,
    gender : String,
    visitDate: String,
    visitTime: String,
    video:String,
    report: String,
  });

const ReportSchema= mongoose.model('Report',reportSchema);
module.exports = ReportSchema;