import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
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

        

        try {
            await upsertStreamUser({
            id:newUser._id.toString(),
            name:newUser.fullname,
            image:newUser.profilePic || "",
        });
        console.log(`Stream user created for ${newUser.fullname}`);
            
        } catch (error) {
            console.log("Error creating stream user:",error);
            
        }


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
    try {
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user=await User.findOne({ email});
        if(!user) return res.status(401).json({message:"Incorrect email or password"});

        const isPasswordCorrect=await user.matchPassword(password)
        if(!isPasswordCorrect) return res.status(401).json({message:"Incorrect email or password"});

        const token= jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000, //7 days
            httpOnly:true, //prevent xss attacks
            sameSite:"Strict",//prevent csrf attacks
            secure:process.env.NODE_ENV==="production" //only send cookie over https in production
        })

        res.status(200).json({success:true,user});

    } catch (error) {
        console.log("Error in login",error.message);
        res.status(500).json({message:"Interna; Server Error"});
        
    }
}

export function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({success:true,message:"Logged out successfully"});
}

export async function onboard(req,res){
    try {
        const userId=req.user._id

        const {fullname,bio,nativeLanguage,learningLanguage,location}=req.body;

        if(!fullname || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({message:"All fields are required",
                missingFields:[
                    !fullname && "fullname",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)
            });
        }

        const updatedUser=await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true
        },{new:true})

        if(!updatedUser){
            return res.status(404).json({message:"User not found"});
        }

        try {
            await upsertStreamUser({
                id:updatedUser._id.toString(),
                name:updatedUser.fullname,
                image:updatedUser.profilePic || "",
            });
            console.log(`Stream user updated for ${updatedUser.fullname}`);
        } catch (streamError) {
            console.log("Error updating stream user:",streamError.message);
            
        }

        res.status(200).json({success:true,user:updatedUser});
    } catch (error) {
        console.log("Error in onboard controller",error);
        res.status(500).json({message:"Server Error"});
        
    }
}