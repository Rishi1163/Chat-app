import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import { User } from "../models/user.models.js"
import bcrypt, { genSalt } from 'bcryptjs'

export const signup = async (req, res) => {
    try {
        const { email, fullName, password } = req.body
        if (!email || !fullName || !password) {
            res.status(400).json({ message: "All fields are required!" })
        }
        if (password.length < 6) {
            return res.status(400).json({ messsage: "Password length must be atleast 6 characters!" })
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists!" })
        }

        const salt = await genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            fullName,
            password: hashPassword
        })

        if (newUser) {
            //generate jwt token
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(400).json({ message: "Invalid user details" })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ message: "Invalid server error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." })
    }
    try {
        const user = await User.findOne({ email })
        if(!user){
            return res.status(400).json({message : "Invalid credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid credentials"})
        }

        generateToken(user._id,res)
        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            email : user.email,
            profilePic : user.profilePic
        })
    } catch (error) {
        console.log("Login controller error",error.message)
        res.status(500).json({message : "Internal server error!"})
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge : 0})
        res.status(200).json({message : "Logout successfull"})
    } catch (error) {
        console.log("Logout controller error",error)
        res.status(500).json({message : "Internal server error!"})
    }
}

export const updateProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const userId = req.user._id;
        const profilePic = req.file.buffer.toString("base64"); // Convert to base64

        // Upload the file to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${profilePic}`, {
            folder: "SwiftText", // Optional: Organize uploads
        });

        // Update user's profile pic in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = async (req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}