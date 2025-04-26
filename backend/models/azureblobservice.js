//////////////////////////////////////////////////////////////////////////////////////////////////////
//                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                        
//                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEPLOYMENT)              
//--------------------------------------------------------------------------------------------------
// CODE CLEANED LAST ON: 27-02-2025                                                                 
// CODE LENGTH OF FILE: AZUREBLOBSERVICE LINE 50 - LINE 82                
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                       
// DATE OF DEVELOPMENT START FOR AZURE BLOB SERVICE MODULE: 10/2/2025 - 27/2/2025                  
//--------------------------------------------------------------------------------------------------
//                           BASIC INFORMATION ABOUT THE FILE                                       
//--------------------------------------------------------------------------------------------------
// This module establishes a connection to Azure Blob Storage and provides utility functions to 
// interact with blob containers. It is responsible for managing the storage and retrieval of 
// medical images, videos, and reports in a secure and scalable manner.
//
// Key Features:
/* 
Azure Blob Storage Integration:
- Connects to Azure Blob Storage using a SAS (Shared Access Signature) token.
- Provides a function to access a specific container.
- Tests the connection by listing available containers.

Blob Service Client Setup:
- Uses `BlobServiceClient` to interact with Azure Blob Storage.
- Retrieves container references dynamically.

Security Considerations:
- SAS tokens are loaded securely from environment variables.
- Connection is tested before usage to ensure reliability.

Error Handling:
- Logs connection failures and displays available containers for debugging.
- Ensures safe handling of storage-related operations.

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                   KEY LIBRARIES AND DEPENDENCIES                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////
// dotenv: Loads environment variables for secure configuration.
// @azure/storage-blob: Provides API for interacting with Azure Blob Storage.
//--------------------------------------------------------------------------------------------------
// ENV OF FILE : BACKEND (NODE.JS, AZURE BLOB STORAGE)
// SECURITY CODE LEVEL  : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////


require('dotenv').config();
    const { BlobServiceClient } = require('@azure/storage-blob');
    
    // Load the SAS Token from environment variables
    const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
    const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    
    // Construct the BlobServiceClient with SAS URL
    const blobServiceClient = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net?${sasToken}`);
    
    // Function to get a reference to a specific container
    const getContainerClient = (containerName) => {
        return blobServiceClient.getContainerClient(containerName);
    };
    
    // Test the connection by listing available containers
    const testAzureConnection = async () => {
        try {
            let containers = [];
            for await (const container of blobServiceClient.listContainers()) {
                containers.push(container.name);
            }
            console.log("✅ Azure Blob Storage Connection Successful!");
            console.log("📂 Available Containers:", containers);
        } catch (error) {
            console.error("❌ Azure Blob Storage Connection Failed:", error.message);
        }
    };
    
    // Run the test function
    testAzureConnection();
    
    module.exports = { getContainerClient };
