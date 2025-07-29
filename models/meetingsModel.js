import mongoose from "mongoose";

// Define the schema for the meeting data
const meetingSchema = new mongoose.Schema(
    {
        
        title: {
            type: String,
            required: true, // Meeting title is required
        },
        date: {
            type: Date,
            required: true, // Meeting date and time is required
        },
        url: {
            type: String,
            required: true, // Meeting URL is required
        },
        language:{
            type: String,
        },
        status: {
            type: String,
            enum: ["scheduled", "active", "completed"],
            default: "scheduled", // Default status is 'scheduled'
        },
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to a 'User' model (assuming you have a user model)
            required: true, // Host is required
        },
        participants: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User", // Reference to a 'User' model (assuming you have a user model)
                    required: true,
                },
                role: {
                    type: String,
                    enum: ["participant", "audience"],
                    default: "participant", // Default role is 'participant'
                },
            },
        ],
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Create and export the meeting model
const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
