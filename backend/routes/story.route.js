import express from 'express'
import { authenticate } from '../middlewares/authMiddleware.js'
import { createStory, deleteStoryById, getAllStories, getTimelineStories } from '../controllers/story.controller.js'

const router = express.Router()


router.route('/create').post(authenticate,createStory)
router.route('/').get(authenticate, getAllStories)
router.route('/timeline').get(authenticate, getTimelineStories)
router.route('/:id').delete(authenticate, deleteStoryById)
export default router