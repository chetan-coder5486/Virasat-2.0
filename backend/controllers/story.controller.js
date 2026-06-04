import { Circle } from "../models/circle.model.js";
import { Family } from "../models/family.model.js";
import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";
import cloudinary from 'cloudinary'

// Post api/story/create

export const createStory = async (req, res) => {
    try {
        const { title, description, date, tags, isMilestone, circle, memoryFiles } = req.body;
        const author = req.user.userId; // Assuming req.user is set by auth middleware
        const userD = await User.findById(author);
        const familyId = userD.family;
        if (!familyId) {
            console.log("User is not part of any family. Cannot create story.");
            return res.status(400).json({ message: "User is not part of any family" });
        }
        const family = await Family.findById(familyId);
        if (!family) {
            return res.status(404).json({ message: "Family not found" });
        }
        if (circle) {
            const circleDoc = await Circle.findOne({ _id: circle, family });
            if (!circleDoc) {
                return res.status(404).json({
                    success: false,
                    message: "Circle not found in user's family"
                })
            }
            if (!circleDoc.members.includes(author)) {
                return res.status(403).json({
                    success: false,
                    message: "User is not a member of the specified circle"
                })
            }
        }
        const story = await Story.create({
            title,
            description,
            date,
            tags: Array.isArray(tags) ? tags : [],
            isMilestone,
            circle: circle || null,
            family: familyId,
            memoryFiles: Array.isArray(memoryFiles) ? memoryFiles : [],
            author
        });
        return res.status(201).json({
            success: true,
            message: "Story created successfully",
            data: story,
        });
    } catch (error) {
        console.log("Error creating story:", error);
        res.status(400).json({ message: error.message });
    }
};


export const getAllStories = async (req, res) => {
    try {

        const user = req.user.userId;
        const userD = await User.findById(user);
        const familyId = userD.family;
        if (!familyId) {
            console.log("User is not part of any family. Cannot fetch stories.");
            return res.status(400).json({ message: "User is not part of any family" });
        }
        const { circleId } = req.query; // optional

        const filter = circleId
            ? { family: familyId, circle: circleId }
            : { family: familyId, circle: null };

        const stories = await Story.find(filter)
            .populate("author", "name avatar")
            .sort({ date: -1 });
        return res.status(200).json({
            success: true,
            message: "Stories retrieved successfully",
            data: stories
        });
    } catch (err) {
        console.log("Error fetching stories:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const getTimelineStories = async (req, res) => {
    try {
        const user = req.user.userId;
        const userD = await User.findById(user);
        const familyId = userD.family;
        if (!familyId) {
            console.log("User is not part of any family. Cannot fetch timeline stories.");
            return res.status(400).json({ message: "User is not part of any family" });
        }
        const stories = await Story.find({ family: familyId, isMilestone: true })
            .populate("author", "name avatar")
            .sort({ date: 1 });
        return res.status(200).json({
            success: true,
            message: "Timeline stories retrieved successfully",
            data: stories
        });
    } catch (err) {
        console.log("Error fetching timeline stories:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const deleteStoryById = async (req, res) => {
    try {
        console.log("Received request to delete story with ID:", req.params.id);    
        const user = req.user.userId;
        const storyId = req.params.id;
        const userD = await User.findById(user);
        if (!userD) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        const story = await Story.findById(storyId)
        if (!story) {
            return res.status(404).json({
                message: "Story not found",
                success: false
            })
        }
        console.log("Story found:", story.family);
        console.log("User's family ID:", userD.family);
        if (story.family.toString() !== userD.family.toString()) {
            return res.status(403).json({
                message: "User not part of related family",
                success: false
            })
        }
        console.log("User ID:", user);
        if ((story.author.toString() !== user.toString()) && (userD.role !== "admin")) {
            return res.status(401).json({
                message: "User not the author of the story",
                success: false
            })
        }
        const publicIds = story.memoryFiles
            .map((file) => file.publicId)
            .filter(Boolean);

        await Story.findByIdAndDelete(storyId);

        res.status(200).json({
            message: "Story deleted successfully",
            success: true
        });

        // Cleanup media in the background so response is fast.
        setImmediate(() => {
            Promise.allSettled(
                publicIds.map((publicId) =>
                    cloudinary.uploader.destroy(publicId)
                )
            ).catch((cleanupError) => {
                console.log("Error cleaning up story media:", cleanupError);
            });
        });
        return;
    }
    catch (error) {
        console.log("Error deleting story:", error);
        return res.status(500).json({
            message: error.message,
            success:false
        });
    }
}

