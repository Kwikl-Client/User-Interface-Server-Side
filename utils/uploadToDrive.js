import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const authenticateGoogle = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: `${process.cwd()}/seobrook.json`,
    scopes: 'https://www.googleapis.com/auth/drive.file',
  });
  return await auth.getClient(); // Ensure the client is properly authenticated
};

const uploadToGoogleDrive = async (filePath, route) => {
    let parentFolderId;
    if (!filePath) {
      throw new Error('File path is not provided');
    }
  
    switch (route) {
      case 'editCustomerDetails':
        parentFolderId = process.env.HERO_FOLDER_ID;
        break;
      // Add more cases if needed
    }
  
    const auth = await authenticateGoogle();
    const drive = google.drive({ version: 'v3', auth });
  
    const fileMetadata = {
      name: path.basename(filePath),
      parents: [parentFolderId],
    };
  
    const media = {
      mimeType: 'image/png', // Adjust the MIME type as necessary
      body: fs.createReadStream(filePath),
    };
  
    try {
      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink', // Include 'webViewLink' to get a viewable link to the file
      });
  
      const fileId = response.data.id;
      const fileLink = response.data.webViewLink; // This is optional, for easy access to the file
  
      return { fileId, fileLink };
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      throw error;
    }
  };
  

export { authenticateGoogle, uploadToGoogleDrive };
