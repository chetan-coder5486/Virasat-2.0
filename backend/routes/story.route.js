import express from 'express'
import { authenticate } from '../middlewares/authMiddleware.js'
import { createStory, getAllStories } from '../controllers/story.controller.js'

const router = express.Router()


router.route('/create').post(authenticate,createStory)
router.route('/').get(authenticate, getAllStories)

export default router