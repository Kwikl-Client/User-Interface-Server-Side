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

const uploadToGoogleDrive = async (file, auth, route) => {
    let parentFolderId;
    switch (route) {
        case 'editHero':
            parentFolderId = process.env.HERO_FOLDER_ID;
            break;
        case 'editCharacters':
            parentFolderId = process.env.CHARACTER_FOLDER_ID;
            break;
        case 'editOverview':
            parentFolderId = process.env.OVERVIEW_FOLDER_ID;
            break;
        case 'editAuthor':
            parentFolderId = process.env.AUTHOR_FOLDER_ID;
            break;
        case 'editfomoAuthor':
            parentFolderId = process.env.FOMO_AUTHOR_FOLDER_ID;
            break;
        default:
            parentFolderId = process.env.PARENT_FOLDER_ID;
            break;
    }
    const fileMetadata = {
        name: file.originalname,
        parents: [parentFolderId], // Change it according to your desired parent folder id
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