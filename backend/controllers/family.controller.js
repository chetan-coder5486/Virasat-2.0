import { Family } from "../models/family.model.js";

export const createFamily = async (req, res) => {
    try {
        const { name } = req.body;
        const creatorId = req.user.userId;
        if (!name) {
            return res.status(400).json({ message: "Family name is required" });
        }
        const newFamily = await Family.create({
            name,
            creator: creatorId,
            members: [creatorId]
        });
        return res.status(201).json({
            success: true,
            message: "Family created successfully",
        });
    } catch (error) {
        console.error("Error creating family:", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating family"
        })
    }
}

export const deleteFamily = async (req, res) => {
    // Only creator can delete the family. This will also delete all associated stories and media files.
    // Steps:
}

export const getFamilyDetails = async (req, res) => {
    const user = req.user.userId;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    try {
        const userD = await user.findById(user).populate('family');
        if (!userD) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (!userD.family) {
            return res.status(404).json({
                success: false,
                message: "User is not part of any family"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Family details fetched successfully",
            family: userD.family
        });
    } catch (error) {
        console.error("Error fetching family details:", error);
        return res.status(500).json({ success: false, message: "Server error while fetching family details" });
    }
}
