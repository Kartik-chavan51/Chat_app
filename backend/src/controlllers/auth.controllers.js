import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function signup(req,res){

    res.send("Signup Route");

    const {email,password,fullname}=req.body;

    try{
        if(!email || !password || !fullname){
            return res.status(400).json({message:"All fields are required"});
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        if(fullname.length<3){
            return res.status(400).json({message:"Fullname must be at least 3 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const exisitngUser=await User.findOne({email});
        if(exisitngUser){
            return res.status(400).json({message:"Email already exists, please use a different email"});
        }

        const idx=Math.floor(Math.random()*100)+1; //1 to 100
        const randomAvator=`https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser=await User.create({
            email,
            password,
            fullname,
            profilePic:randomAvator
        });

        const token= jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000, //7 days
            httpOnly:true, //prevent xss attacks
            sameSite:"Strict",//prevent csrf attacks
            secure:process.env.NODE_ENV==="production" //only send cookie over https in production
        })
    }catch(error){
        console.log("Error in signup",error);
        res.status(500).json({message:"Server Error"});

    }

}


export async function login(req,res){
    res.send("Login Route");
}

export function logout(req,res){
    res.send("Logout Route");
}