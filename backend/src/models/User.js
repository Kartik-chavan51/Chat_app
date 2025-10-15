import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        trim:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    bio:{
        type:String,
        default:""
    },
    profilePic:{
        type:String,
        default:""
    },
    nativelanguage:{
        type:String,
        default:""
    },
    learninglanguage:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    isOnboarded:{
        type:Boolean,
        default:false
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }

    ]

},{timestamps:true});


//pre hook for hashing password before saving user

userSchema.pre("save",async function(next){

    if(!this.isModified("password")) return next();
    try{
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next();
    }catch(error){
        next(error);
    }
}); 

const User=mongoose.model("User",userSchema);


export default User;