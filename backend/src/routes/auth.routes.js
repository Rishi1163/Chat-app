import express, { Router } from 'express'
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'

const authRoutes = Router()

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/logout', protectRoute, logout)

authRoutes.put('/update-profile', protectRoute, upload.single('profilePic'), updateProfile)

authRoutes.get('/check',protectRoute,checkAuth)

export default authRoutes