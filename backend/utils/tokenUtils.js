import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// Generate Access Token

export const generateAccessToken = (user) => {
    return jwt.sign({
        userId: user._id,
        email: user.email,
        role: user.role
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m'
    })
}

// Generate Refresh Token

export const generateRefreshToken = (user) => {
    return jwt.sign({
        userId: user._id,
        email: user.email,
        role: user.role,
        tokenVersion: user.tokenVersion
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
    })
}

//Verify access token

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        return null
    }
}

//Verify refresh Token

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        return null
    }
}

export const sendRefreshToken = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        path: '/api/v1/auth/refresh' //only send for this path
    })
}

export const clearRefreshToken = (res) => {
    res.clearCookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/api/v1/auth/refresh'
    })
}
