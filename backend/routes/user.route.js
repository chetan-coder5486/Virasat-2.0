import express from "express";
import { editProfilePicture, getCloudinarySignature, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.route('/cloudinary-signature').post(authenticate, getCloudinarySignature)
router.route('/profile/:id').get(getUserProfile)
router.route('/profile/update').put(authenticate, updateUserProfile)
router.route('/profile/picture').put(authenticate, editProfilePicture)

export default router