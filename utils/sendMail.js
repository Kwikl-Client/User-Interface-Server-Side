import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const sendMail = async(recieverMailId, subject, messege) => {
    try {
        const OAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
        OAuth2Client.setCredentials({refresh_token: process.env.OAUTH_REFRESH_TOKEN});
        const accessToken = await OAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.SENDER_MAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: recieverMailId,
            subject: subject,
            text: messege
        };

        const result = await transport.sendMail(mailOptions)
        return result
    }
    catch (error) {
        console.log(error)
        throw new Error();
    }
}

export default sendMail;