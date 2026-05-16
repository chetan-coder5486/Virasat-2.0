import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { clearRefreshToken, generateAccessToken, generateRefreshToken, sendRefreshToken, verifyRefreshToken } from "../utils/tokenUtils.js";


// POST /api/auth/register


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists', success: false })
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword })
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        sendRefreshToken(res, refreshToken) // Set HttpOnly cookie

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        console.log('Error in registerUser:', error);
        return res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
}

// POST /api/auth/login


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            })
        }
        const userD = await User.findOne({ email })
        if (!userD) {
            return res.status(400).json({
                message: "User does not exist by this email",
                success: false
            })
        }
        const isPasswordValid = await (bcryptjs.compare(password, userD.password))
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        // Generate tokens
        const accessToken = generateAccessToken(userD);
        const refreshToken = generateRefreshToken(userD);

        // Send refresh token as httpOnly cookie
        sendRefreshToken(res, refreshToken);

        // Send response
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            user: userD
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
}


// Refresh access token
// POST /api/auth/refresh

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided"
            })
        }
        const decoded = verifyRefreshToken(refreshToken)

        if (!decoded) {
            clearRefreshToken(res)
            return re.status(401).json({
                success: false,
                message: "Invalid refresh token"
            })
        }


        const user = await User.findById(decoded.userId)
        if (!user) {
            clearRefreshToken(res)
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        // Check token version (allows invalidating all tokens)
        if (user.tokenVersion !== decoded.tokenVersion) {
            clearRefreshToken(res);
            return res.status(401).json({
                success: false,
                message: 'Token has been revoked'
            });
        }

        const newAccessToken = generateAccessToken(user)

        // Optionally generate new refresh token (rotation)
        const newRefreshToken = generateRefreshToken(user)
        sendRefreshToken(res, newRefreshToken) // Set new refresh token cookie


        // Send response
        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });


    } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error refreshing token',
            error: error.message
        });
    }
}

//  POST /api/auth/logout

export const logoutUser = async (req, res) => {
    try {
        clearRefreshToken(res) // Clear the refresh token cookie
        res.status(200).json({
            success: true,
            message: " Logged out succesfully",

        })
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging out',
            error: error.message
        });
    }
}

//  POST /api/auth/logout-all
export const logoutAll = async (req, res) => {
    try {
        // Increment token version (invalidates all refresh tokens)
        await req.user.incrementTokenVersion();

        // Clear current refresh token cookie
        clearRefreshToken(res);

        res.status(200).json({
            success: true,
            message: 'Logged out from all devices'
        });
    } catch (error) {
        console.error('Logout all error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging out',
            error: error.message
        });
    }
};

// Get me
// GET /api/auth/me

export const getMe = async (req, res) => {
    try {
        console.log("hit me");
        const userD = await User.findById(req.user.userId).select('-password')
        if (!userD) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user: userD
        });
    } catch (error) {
        console.error('Get me error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        })
    }
}