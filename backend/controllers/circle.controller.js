import { Circle } from "../models/circle.model.js";

export const createCircle = async (req, res) => {
  try {
    const { name, description,members } = req.body;
    const creator = req.user.userId; // Assuming req.user is set by auth middleware
    const family = req.user.familyId; // Assuming user's family ID is available in req.user
    if(!family){
        return res.status(400).json({ 
            success: false,
            message: "User is not part of any family"
        })
    }
    const circle = await Circle.create({
      name,
      description,
      members,
      family,
      creator
    });

    return res.status(201).json({
        success: true,
        message: "Circle created successfully",
        data: circle
    });
  } catch (error) {
    return res.status(500).json({ 
        success: false,
        message: error.message 
    });
  }
};