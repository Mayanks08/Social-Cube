import  { useEffect, useState } from 'react'
import  useAuthUser  from '../hooks/useAuthUser.js';
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";

import {
  // ... other imports
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'

import '@stream-io/video-react-sdk/dist/css/styles.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const STREAM_API_KEY= import.meta.env.VITE_STREAM_API_KEY

const CallPage = () => {
  const {id:callId} = useState(null);
  const [call, setCall] = useState(null);
  const [client, setClient] =useState(null)
  const [isConnecting, setIsConnecting ] = useState(true);
  const {authUser,isLoading} =useAuthUser()
   const {data:tokenData} = useQuery({
    queryKey:["steamToken"],
    queryFn:getStreamToken,
    enabled:!!authUser
  })

  useEffect(() =>{
    const initCall = async () => {
      if (!tokenData.token || !authUser || !callId) return;

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image:authUser.profilePic
          
        }
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          token: tokenData.token,
          user
        });
        const callInstance = videoClient.call("default",callId);
        await callInstance.join({
          create:true
        })
        setClient(videoClient)
        setCall(callInstance);
      } catch (error) {
        console.error("error joining call", error);
        toast.error("Could not join call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    }
    initCall()
  }, [tokenData, authUser, callId]);
  if(isLoading || isConnecting) return <PageLoader/>


  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='relative'>
        {client && call ?(
          <StreamVideo client={client}>
            <StreamCall call={call} >
              <CallContent  />
            </StreamCall>
          </StreamVideo>
        ) :(
          <div className='flex items-center justify-center h-full'>
            <p> Could not initialize call . Please Refresh or Try again later</p>
          </div>
        )}
      </div>
    </div>
  )
}

const CallContent = () => {
  const {useCallCallingState} = useCallStateHooks()
  const callingState  = useCallCallingState()

  const navigate = useNavigate(-1)

  if(callingState === CallingState.LEFT) return navigate("/")

  return(
    <StreamTheme>
      <SpeakerLayout/>
      <CallControls/>
    </StreamTheme>
  )
}


export default CallPage;