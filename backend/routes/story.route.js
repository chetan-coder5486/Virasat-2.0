import express from 'express'
import { authenticate } from '../middlewares/authMiddleware.js'
import { createStory, getAllStoriesByFamily } from '../controllers/story.controller.js'

const router = express.Router()


router.route('/create/:familyId').post(authenticate,createStory)
router.route('/:familyId').get(authenticate, getAllStoriesByFamily)

export default router