// services/streamService.js
import { StreamChat } from 'stream-chat';
import "dotenv/config"

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if(!apiKey || !apiSecret) {
  console.error('Please set STEAM_API_KEY and STEAM_API_KEY_SECRET environment variables.');
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    // Create or update user in Stream
    await streamClient.upsertUser(userData);
    return userData
    
  
  } catch (error) {
    console.error(' error upserting stream user:', error);
    throw error;
  }
};
// Todo we do it later
export const generateStreamToken=(userId)=>{
  try {
    // ensure UserId is string
    const userIdString = userId.toString();
    return streamClient.createToken(userIdString)
  } catch (error) {
    console.error("Error generating stream token:", error);
  }
}



