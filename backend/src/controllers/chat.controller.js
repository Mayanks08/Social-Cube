import { generateStreamToken } from "../lib/streamService.js";



export async function getStreamToken(req,res) {
    try {
        const token = generateStreamToken(req.user.id);
        res.json({ token });
    } catch (error) {
        console.log("Error in getStreamToken controller:",error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    
}