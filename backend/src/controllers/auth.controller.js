import { upsertStreamUser } from "../lib/streamService.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken"

export async function signup(req,res){
   const {fullName,email,password} = req.body;

   try {
        if(!email || !password || !fullName){
            return res.status(400).json({message: "Please fill in all fields."});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }
        
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already in use. Please use different email."})
        }
         const idx = Math.floor(Math.random()*100)+1; //generate the number
         const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`; //generate the randome avatar

      
        const newUser = new User({
            fullName,
            email,
            password,
            profilePic: randomAvatar
            });
            await newUser.save();

            //TODO we have to create user in stream
          try {
              await upsertStreamUser({
                  id:newUser._id.toString(),
                  name:newUser.fullName,
                  Image:newUser.profilePic || ""
              })
               console.log(`Stream user created for ${newUser.fullName}`) 
          } catch (error) {
            console.log("Error creating stream user", error);
          }

         const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET_KEY,{expiresIn: "7d"})
            res.cookie("jwt",token,{
                httpOnly:true,
                maxAge: 7*24*60*60*1000 ,//7 days in milliseconds
                sameSite:"strict",
                secure:process.env.NODE_ENV==='production'
            })

            res.status(201).json({message:"User created successfully",success:true,user:newUser})
        } catch (error) {
          console.log("error in signup controller", error);
          res.status(500).json({message:"Internal server error",success:false})
       }
}
export async function login(req,res){
    try {
        const {email,password}=req.body;
        
        if(!email|| !password){
            return res.status(400).
            json({message:"Please enter both email and password"})
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid email or password"})
        }

        const isPasswordCorrect = await user.matchPassword(password)
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid email or password"})
        };

         const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn: "7d"})
            res.cookie("jwt",token,{
                httpOnly:true,
                maxAge: 7*24*60*60*1000 ,//7 days in milliseconds
                sameSite:"strict",
                secure:process.env.NODE_ENV==='production'
            })

            res.status(200).json({success:true,user});

    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({message:"Internal server error",success:false})
        
    }
}
export function logout(req,res){
   res.clearCookie("jwt")
   res.status(200).json({success:true,message:"Logged out successfully"})
}

export  async function onboarding(req,res){
    try {
        const userId= req.user.id

        const {fullName,bio,nativeLanguage,learinglanguage,location}=req.body
        if(!fullName,!bio,!nativeLanguage,!learinglanguage,!location){
            return res.status(400).json({
            message:"Please fill all fields",missingFields:[
               !fullName && "fullName",
               !bio &&"bio",
               !nativeLanguage&&"nativeLanguage",
               !learinglanguage&&"learinglanguage",
               !location&&"location",
            ].filter(Boolean),
        })
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true
        },{new:true})
        if(!updatedUser) return res.status(404).json({message:"user not found"})
            // TODO : send user deatils to stream
      try {
                  await upsertStreamUser({
                      userId:updatedUser._id.toString(),
                      name:updatedUser.fullName,
                      image:updatedUser.profilePic||"",
                      bio:updatedUser.bio,
                      nativeLanguage:updatedUser.nativeLanguage,
                      learningLanguage:updatedUser.learningLanguage,
                      location:updatedUser.location
                  })
                  console.log(`stream user updated after onboarding for ${updatedUser.fullName}`)
      } catch (streamError) {
        console.log("Error updating stream user during on boarding",streamError.message)        
      }

            res.status(200).json({success:true,user:updatedUser})
    } catch (error) {
        console.log("error in onboarding controller", error.message);
        res.status(500).json({message:"Internal server error" })
        
    }
}
