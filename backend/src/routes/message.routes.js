import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const messageRoutes = Router()

messageRoutes.get('/users',protectRoute,getUsersForSidebar)
messageRoutes.get('/:id',protectRoute,getMessages)
messageRoutes.post('/send/:id',protectRoute,upload.single('image'),sendMessage)

export default messageRoutes