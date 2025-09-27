import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { ENV_VARS } from "../config/envVars.js";

export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid Email" });
        }

        if (!password.lenght > 6) {
            return res.status(400).json({ success: false, message: "Password must be At least 6 characters Long" });
        }

        const existingUserByEmail = await User.findOne({ email: email })

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "User with this Email already exists" });
        }

        const existingUserByUser = await User.findOne({ username: username })

        if (existingUserByUser) {
            return res.status(400).json({ success: false, message: "This username already exists" });
        }

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            email: email,
            username: username,
            password: hashedPassword,
            image: image
        })

        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            success: true, message: "User Created Sucessfully", user: {
                ...newUser._doc,
                password: ""
            }
        })
    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function login(req, res) {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({success:false, message: "All fields must be Entered"})
        }

        const user = await User.findOne({email:email})
        if(!user) {
            return res.status(400).json({success:false, message:"Credentials are wrong"});
        }

        const isPassword = await bcryptjs.compare(password, user.password);
        if(!isPassword){
            return res.status(400).json({success:false, message: "Wrong Credentials"});
        };

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            success: true, 
            message:"Correct",
            user: {
            ...user._doc,
            password:""
        }})
    } catch (error) {
        console.log("Error in Login Controller",error.message);
        return res.status(500).json({success:false, message: "Internal Server Error"});
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({success: true, message: "logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

export async function authCheck(req,res){
    try {
        const token = req.cookies['jwt-netflix']

        if(!token){
            return res.status(200).json({success:true, user:null})
        }

        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
        if(!decoded){
            return res.status(200).json({success:true, user:null})
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(200).json({success:true, user:null})
        }
        
        res.status(200).json({success:true, user:user})
    } catch (error) {
        console.log("Error in authCheck Controller",error.message);
        res.status(200).json({success:true, user:null})
    }
}