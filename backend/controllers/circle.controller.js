import { Circle } from "../models/circle.model.js";
import { User } from "../models/user.model.js";

export const createCircle = async (req, res) => {
  try {
    const { name, description,members } = req.body;
    const creator = req.user.userId; // Assuming req.user is set by auth middleware
    const userD = await User.findById(creator);
    if(!userD){
        return res.status(404).json({ 
            success: false,
            message: "User not found"
        })
    }
    const family = userD.family;
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


export const getCirclesByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userD = await User.findById(userId);
    if(!userD){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }
    const family = userD.family;
    if(!family){
        return res.status(400).json({
            success: false,
            message: "User is not part of any family"
        })
    }

    const circles = await Circle.find({ family,members: userId }).populate("members", "name avatar email");
    return res.status(200).json({
        success: true,
        message: "Circles retrieved successfully",
        circles
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message
    });
  } 
};