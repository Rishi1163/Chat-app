import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: `${process.env.FRONTEND_URL}`,
        credentials: true
    }
})

export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId]
}

//use to store online users
const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id)

    const userId = socket.handshake.query.userId
    if(userId) userSocketMap[userId] = socket.id // this is to set the userStatus to "online"
    
    //io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap)) 

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id)
        delete userSocketMap[userId] // this is to set the userStatus to "offline"
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})


export { io, app, server}