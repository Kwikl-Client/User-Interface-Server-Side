import express from "express";
import mongoose from "mongoose";
import Meeting from "../models/meetingsModel.js";
import customerModel from "../models/customerModel.js";
import sendMail from "../utils/sendMail.js";
import { language } from "googleapis/build/src/apis/language/index.js";
const router = express.Router();
const { DAILY_API_URL, DAILY_API_KEY } = process.env;

if (!DAILY_API_URL || !DAILY_API_KEY) {
    console.error(
        "DAILY_API_URL or DAILY_API_KEY is missing in environment variables!"
    );
    process.exit(1); // Exit the application if credentials are not provided
}

router.get("/", async (req, res) => {
    try {
        const currentDate = new Date();

        const meetings = await Meeting.find({
            date: { $gt: currentDate },
            "participants.1": { $exists: false }, // Meetings with less than 3 participants
        });

        console.log(meetings);
        return res.status(200).json({
            success: true,
            message: "Meetings fetched successfully.",
            data: meetings,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching meetings.",
            data: null,
        });
    }
});

router.get("/:customId", async (req, res) => {
    const { customId } = req.params;
    const currentDate = new Date();
    try {
        const meetings = await Meeting.find({
            date: { $gt: currentDate },
            "participants.userId": customId,
        });

        return res.status(200).json({
            success: true,
            message: "User meetings fetched successfully.",
            data: meetings,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user meetings.",
            data: null,
        });
    }
});

router.post("/", async (req, res) => {
    const { title, date, customId,language } = req.body;
    const origin = req.get("origin");
    try {
        const userExists = await customerModel.findById(customId);
        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: "User not registered. Please register first.",
                data: null,
            });
        }

        const response = await fetch(DAILY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${DAILY_API_KEY}`,
                Accept: "/",
            },
            body: JSON.stringify({
                name: title.split(" ").join("-"),
                privacy: "public",
                properties: {
                    enable_chat: true,
                    enable_screenshare: false,
                    start_video_off: true,
                    start_audio_off: true,
                },
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create Daily.co room");
        }

        const room = await response.json();
        console.log(room);

        const newMeeting = new Meeting({
            title,
            date: date,
            url: origin + "/join/" + title.split(" ").join("-"),
            host: userExists?._id || "Admin",
            participants: [],
            language: language,
        });

        await newMeeting.save();
        await sendMail(
            userExists.email, // Use email from userExists
            "Meeting schedule",
            `Your meeting "${newMeeting.title}" has been successfully scheduled.\n\nMeeting Date: ${new Date(
                newMeeting.date
            ).toLocaleString()}\nMeeting Link: ${newMeeting.url}\nYou are the host of this meeting.\n\nThank you for using our service!`
        );

        return res.status(201).json({
            success: true,
            message: "Meeting scheduled successfully.",
            data: newMeeting,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error scheduling meeting.",
            data: null,
        });
    }
});

router.put("/:meetingId", async (req, res) => {
    const { meetingId } = req.params;
    const { customId, shouldAdd } = req.body; // customId as participant to be added/removed

    console.log('Request received:', { meetingId, customId, shouldAdd });

    try {
        // Debug: Log before finding meeting
        console.log('Attempting to find meeting with ID:', meetingId);
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            console.log('Meeting not found for ID:', meetingId);
            return res.status(404).json({
                success: false,
                message: "Meeting not found.",
                data: null,
            });
        }
        console.log('Meeting found:', meeting);

        // if (meeting.host.toString() !== customId) {
        //     console.log('Host check failed:', { host: meeting.host, customId });
        //     return res.status(403).json({
        //         success: false,
        //         message: "Only the host can modify participants.",
        //         data: null,
        //     });
        // }

        // Debug: Check existing participants
        const existingParticipant = meeting.participants.some(
            (participant) => {
                console.log('Checking participant:', { participantId: participant.userId.toString(), customId });
                return participant.userId.toString() === customId;
            }
        );
        console.log('Existing participant check:', { existingParticipant, shouldAdd });

        if (shouldAdd && existingParticipant) {
            console.log('User already a participant:', customId);
            return res.status(400).json({
                success: false,
                message: "User is already a participant.",
                data: null,
            });
        }

        if (!shouldAdd && !existingParticipant) {
            console.log('User not a participant:', customId);
            return res.status(400).json({
                success: false,
                message: "User is not a participant.",
                data: null,
            });
        }

        console.log('Meeting before update:', meeting);

        // Debug: Pause execution here to inspect state
        debugger;

        if (shouldAdd) {
            console.log('Adding participant:', { userId: customId, role: 'participant' });
            meeting.participants.push({
                userId: customId,
                role: "participant",
            });
        } else {
            console.log('Removing participant:', customId);
            meeting.participants = meeting.participants.filter(
                (participant) => {
                    const keep = participant.userId.toString() !== customId;
                    console.log('Filtering participant:', { participantId: participant.userId.toString(), customId, keep });
                    return keep;
                }
            );
        }

        console.log('Meeting after update, before save:', meeting);

        // Debug: Save meeting and log result
        const savedMeeting = await meeting.save();
        console.log('Meeting saved successfully:', savedMeeting);

        await sendMail(
            email,
            "Meeting Participant Update",
            `You have been ${
                shouldAdd ? "added to" : "removed from"
            } the meeting "${meeting.title}".\n\nMeeting Date: ${new Date(
                meeting.date
            ).toLocaleString()}\nHost: ${
                meeting.hostName || "N/A"
            }\n\nIf you have any questions, please contact the meeting organizer.`
        );

        return res.status(200).json({
            success: true,
            message: `Participant ${shouldAdd ? "added" : "removed"} successfully.`,
            data: savedMeeting,
        });
    } catch (error) {
        console.error('Error in update meeting:', error);
        return res.status(500).json({
            success: false,
            message: "Error updating meeting participants.",
            data: null,
        });
    }
});

router.patch("/:meetingId", async (req, res) => {
    const { meetingId } = req.params;
    const { customId } = req.body; // customId as host

    try {
        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found.",
                data: null,
            });
        }

        if (meeting.host.toString() !== customId) {
            return res.status(403).json({
                success: false,
                message: "Only the host can mark the meeting as completed.",
                data: null,
            });
        }

        meeting.status = "completed";
        await meeting.save();

        return res.status(200).json({
            success: true,
            message: "Meeting marked as completed.",
            data: meeting,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error marking meeting as completed.",
            data: null,
        });
    }
});

router.delete("/:meetingId", async (req, res) => {
    const { meetingId } = req.params;

    try {
        const meeting = await Meeting.findByIdAndDelete(meetingId);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found.",
                data: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Meeting deleted successfully.",
            data: meeting,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error deleting meeting.",
            data: null,
        });
    }
});

export default router;
