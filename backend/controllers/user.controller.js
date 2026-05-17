import { User } from "../models/user.model.js"

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