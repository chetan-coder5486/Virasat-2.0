import { User } from "../models/user.model.js"
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getCloudinarySignature = (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    timestamp,
    upload_preset: req.body.uploadPreset || "family_trunk_uploads",
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id
        const userD = await User.findById(userId).select('-password').populate('family', 'name')
        if (!userD) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            })
        }
        return res.status(200).json({ 
            success: true,
            user: userD 
        })
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({  
            success: false,
            message: 'Server error' 
        })
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId
        const { name, bio } = req.body
        const userD = await User.findById(userId)
        if (!userD) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            })
        }
        userD.name = name
        userD.bio = bio
        const updatedUser = await userD.save()
        return res.status(200).json({ 
            success: true,
            user: updatedUser 
        })
    } catch (error) {
        console.error("Error updating user profile:", error);
        return res.status(500).json({  
            success: false,
            message: 'Server error' 
        })
    }
}

export const editProfilePicture = async (req, res) => {
    try {
        const userId = req.user.userId  
        const { avatar } = req.body
        const userD = await User.findById(userId)
        if (!userD) {   
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        userD.avatar = avatar
        const updatedUser = await userD.save()
        return res.status(200).json({
            success: true,
            user: updatedUser
        })
    }
    catch (error) {
        console.error("Error updating profile picture:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}