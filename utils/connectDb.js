import mongoose from 'mongoose';

const connectDB = async () => {
    const URIwithPwd = process.env.CONNECTION_STR.replace('<password>', encodeURIComponent(process.env.USER_PASSWORD));
    const completeUri = URIwithPwd + process.env.DB_NAME;
    try {
        await mongoose.connect(completeUri);
        console.log(`MongoDB Connected sucessfully`.bold.brightMagenta);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;