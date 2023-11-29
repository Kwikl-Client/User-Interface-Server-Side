import { google } from "googleapis";
import fs from 'fs';

const authenticateGoogle = () => {
    const auth = new google.auth.GoogleAuth({
        // credentials: {
        //     private_key: process.env.DRIVE_SECRET,
        //     client_email:  process.env.DRIVE_MAIL,

        // },
        keyFile: `${process.cwd()}/seobrook.json`,
        scopes: "https://www.googleapis.com/auth/drive",
    });
    return auth;
};

const uploadToGoogleDrive = async (file, auth) => {
    const fileMetadata = {
        name: file.originalname,
        parents: [process.env.PARENT_FOLDER_ID], // Change it according to your desired parent folder id
    };
    const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
    };

    const driveService = google.drive({ version: "v3", auth });

    const response = await driveService.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
    });
    return response;
};

export { authenticateGoogle, uploadToGoogleDrive };