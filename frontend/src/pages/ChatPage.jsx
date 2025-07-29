import { useEffect, useState } from "react";
import { useParams } from "react-router"
import  useAuthUser  from "../hooks/useAuthUser.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import {toast} from "react-hot-toast"

import{
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,

} from "stream-chat-react"
import { StreamChat } from "stream-chat";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
const STREAM_API_KEY= import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const {id:targetUserId} = useParams()

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading ,setLoading] = useState(true); 

  const {authUser} = useAuthUser()
  const {data:tokenData} = useQuery({
    queryKey:["steamToken"],
    queryFn:getStreamToken,
    enabled:!!authUser
  })
  
  useEffect(() =>{
    const initChat = async () => {
      if(!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...")

        const client = StreamChat.getInstance(STREAM_API_KEY)
        await client.connectUser({
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic,
        },tokenData.token)

        const channelId =[authUser._id,targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId,{
          members:[authUser._id,targetUserId],
        })
        await currChannel.watch()
        setChatClient(client)
        setChannel(currChannel)
      } catch (error) {
        console.error("error initializing stream chat client", error)
        toast.error("could not connect to chat. Please try")
      } finally{
        setLoading(false)
      }
    }
    initChat()
  },[tokenData,authUser,targetUserId])

  const handleVideoCall = () => {
    // handle video call logic here
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`

      channel.sendMessage({
        text:`I like to have a video call with you come and join ${callUrl}`,
      })
      toast.success("Video call link sent Successfully")
    }

  }

  if(loading || !chatClient || !channel) return <ChatLoader/>
  return (
    <div className="h-[90vh">
      <Chat client={chatClient}>
        <Channel className={channel}>
          <CallButton handleVideoCall={handleVideoCall}/>
          <div className="w-full relative">
            <Window>
              <ChannelHeader/>
              <MessageList/>
              <MessageInput/>
            </Window>
          </div>
          <Thread/>
        </Channel>

      </Chat>
    </div>
  )
}

export default ChatPage