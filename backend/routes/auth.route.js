import express from 'express'
import { getMe, loginUser, logoutAll, logoutUser, refreshToken, registerUser } from "../controllers/auth.controller.js"
import { authenticate } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/refresh').post(refreshToken)

//Protected route 
router.route('/logout').post(authenticate, logoutUser)
router.route('/me').get(authenticate, getMe)
router.route('/logout-all').post(authenticate, logoutAll)


export default router