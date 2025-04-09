import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import connDb from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import messageRoutes from './routes/message.routes.js'
import { app, server, io } from './lib/socket.js'


dotenv.config({
    path : "./.env"
})

const PORT = process.env.PORT

app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

app.get('/',(req,res) => {
    res.send("Hello Rishi")
})

server.listen(PORT,()=>{
    connDb()
   console.log(`Server running on port:${PORT}`)
})