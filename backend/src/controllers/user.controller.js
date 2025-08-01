import User from "../models/User.js";
import FriendRequest  from "../models/FriendRequest.js";


export async function getRecommendedUsers(req,res){
    try {
        const currentUserId=req.user.id;
        const currentUser=req.user;


        const recommendedUsers= await User.find({
            $and: [
                { _id: { $ne: currentUserId } },//exclude current user
                { _id: { $nin: currentUser._id } },// exclude current user'd friends 
                {isOnboarded:true}

            ]
        })
        res.status(200).json(recommendedUsers)
    } catch (error) {
        console.error("error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyFriends(req,res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName profile nativeLanguage learningLanguage");

        res.status(200).json(user.friends)
    } catch (error) {
        console.log("error in getMyFriends controller",error.message)
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req,res){
    try {
        const myId = req.user.id;
        const {id:recipientId}=req.params;

        // here i am prevent to send request to myself
        if (myId === recipientId) {
            return res.status(400).json({ message: "You can't send a friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({ message: "Recipient  not found" });
        }
        // check if recipient is already my friend
        if(recipient.friends.includes(myId)){
            return res.status(400).json({ message: "You are already friends with this person" });
        }
        //check if a request is already sent
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId}
            ],
        })
        if(existingRequest){
            return res
            .status(400)
            .json({ message: "A friend request has already been sent"})
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId

        })
            res.status(201).json(friendRequest)   
    } catch (error) {
        console.log("Error  in  sendFriendRequest controller",error.message)
        res.status.json({message:"Internal Server Error"})
    }
}

export async function acceptFriendRequest(req,res) {
    try {
        const {id:requestId} =req.params

        const friendRequest = await FriendRequest.findById(requestId)
        if(!friendRequest){
            return res.status(404).json({ message: "Friend request not found" });
        }
        // verify the current user is the recipient
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(400).json({ message: "You can't accept this friend request" })
         }
         friendRequest.status="accepted";
         await friendRequest.save();

         // add each user to other friend array
        await User.findByIdAndUpdate(friendRequest.sender,
            {$addToSet:{friends:friendRequest.recipient}
        });
        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender},
        });
        res.status(200).json({message:"Friend request accepted"})

    } catch (error) {
        
    }
}

export async function getFriendRequests(req,res){
    try {
        const  incomingReqs = await FriendRequest.find({
            recipient:req.user.id,
            status:"pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage")
        const acceptedReqs = await FriendRequest.find({
            sender:req.user.id,
            status:"accepted",
        }).populate("recipient", "fullname profilePic")
        res.status(200).json({incomingReqs,acceptedReqs})

    } catch (error) {
        console.log("Error in getPendingFriendRequest Controller" , error.message)
        res.status(500).json({message:"internal Server Error"})
    }
}

export async function getOutgoingFriendReqs(req,res) {
    try {
        const outgoingRequests =await FriendRequest.find({
            sender:req.user.id,
            status:"pending"
        }).populate("recipient",
            "fullName profilePic nativeLanguage learningLanguage")
            res.status(200).json({outgoingRequests})

    } catch (error) {
        console.log("Error in the getOutgoingFriendReqs Controller" , error.message)
        res.status(600).json({
            message:"Internal Server Error"
        })
    }
    
}
