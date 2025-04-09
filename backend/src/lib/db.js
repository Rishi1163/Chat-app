import mongoose from 'mongoose'

const connDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if(conn){
            console.log(`DB connected successfully! ${conn.connection.host}`)
        }else{
            console.log("Connection error!")
        }
    } catch (error) {
        console.log("Catch block error of db",error)
    }
}

export default connDb