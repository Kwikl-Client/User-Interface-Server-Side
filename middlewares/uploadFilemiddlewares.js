import fs from 'fs';
import { authenticateGoogle, uploadToGoogleDrive } from "../utils/uploadToDrive.js";

const uploadImg =async(req, res, next) => {
    try {
        const route = req.originalUrl.split("/")[2];
        // Check if any file is uploaded
        if (!req.files || Object.keys(req.files).length === 0){
            next();
            return;
        }
        req.picUrls={};
        const auth = authenticateGoogle();
        const promises = [];

        // Iterate through each named field and create an array of promises for file uploads
        for (const fieldName in req.files) {
            const files = req.files[fieldName];
            promises.push(
                Promise.all(files.map(async (file) => {
                    const response = await uploadToGoogleDrive(file, auth, route);
                    // console.log(response)
                    // Delete the file after uploading
                    fs.unlink(file.path, (err) => {
                        if (err)
                            console.error("Error deleting file:", err);
                        else
                            console.log("File deleted");

                    });
                    // req.picUrls[fieldName]=`https://drive.google.com/thumbnail?id=${response.data.id}`
                    req.picUrls[fieldName]=`https://lh3.googleusercontent.com/d/${response.data.id}?authuser=0`
                    //req.picUrls[fieldName]=`https://drive.usercontent.google.com/download?id=${response.data.id}&export=view&authuser=0`
                }))
            );
        }
        // Wait for all file uploads to complete
        await Promise.all(promises);
        // res.status(200).json({ responses: response });
        next();
    }
    catch (error) {
        throw new Error(error);
    }
};

export default uploadImg;