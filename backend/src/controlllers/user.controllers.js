import User from "../models/user.model.js";
export async function getRecommendedUsers(req,res){

    try {
        const currentUserId=req.user.id;
        const currentUser=req.user;

        const recommendedUsers=await User.find({
            $and:[
                {_id:{$ne:currentUserId}},// Exclude self
                {$id:{$nin:currentUser.friends}},//exculde current user's friends
                {isOnboarded:true}
            ]  
        })

        res.status(200).json(recommendedUsers)


    } catch (error) {
        console.error("Error in getRecommendedUsers controllers",error.message);
        res.status(500).json({message:"Internal Server Error"});
        
    }
}

export async function getMyFriends(req,res){
    try {
        const user=await User.findById(req.user._id)
        .select("friends")
        .populate("friends","fullName profilePic nativeLanuage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
        
    }
}
