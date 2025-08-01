import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from "react-router";
import { useEffect, useState } from 'react';
import { getOutgoingFriendsReqs, getRecommandedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import { CheckCheckIcon, MapPinIcon, UserIcon, UserPlusIcon } from 'lucide-react';
import FriendCard, { getLanguageFlag } from '../components/FriendCard.jsx';
import NoFriendCard from '../components/NoFriendCards.jsx';

const HomePage = () => {
   const  queryClient =useQueryClient();
   const [outgoingRequestsIds , setOutgoingingRequestsIds] =useState(new Set());


   const {data:friends=[],isLoading:loadingFriends} =useQuery({
    queryKey: ["Friends"],
    queryFn:getUserFriends
    
   })

   const {data:recommendedUser=[],isLoading:loadingUseres} =useQuery({
    queryKey: ["users"],
    queryFn:getRecommandedUsers
    
   })
   const {data:outgoingFriendsReqs}= useQuery({
    queryKey: ["outgoingFriendsReqs"],
    queryFn:getOutgoingFriendsReqs,
   })
   const {Mutate:sendRequestMutation, isPending} =useMutation({
    mutationFn:sendFriendRequest,
    onSuccess:()=> queryClient.invalidateQueries({queryKey:["outgoingFriendReqs"]})
   })

   useEffect(()=>{
    const outgoingIds =new Set()
    if(outgoingFriendsReqs&& outgoingFriendsReqs.length>0){
      outgoingFriendsReqs.forEach((req) =>{
      outgoingIds.add(req.recipent._id)
    })
    setOutgoingingRequestsIds(outgoingIds) 
   }   
   },[outgoingFriendsReqs])
  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to="/notifications" className='btn btn-outline btn-sm'>
          <UserIcon className='mr-2 size-5'/>
          Friends Requests
          </Link>
        </div>
        {loadingFriends ?(
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner  loading-lg'/>
          </div>
        ):friends.length===0 ?(
          <NoFriendCard/>
        ):(
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" >
            {friends.map((friends)=>(
              <FriendCard key={friends.id} friend={friends} />
            ))}
          </div>
        )}
        <section>
          <div className='mb-6 sm:mb-8'>
            <div className=' flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Meet New Learners</h2>
                <p className='opacity-70'>
                  Discover Perfect Language Learning Buddies Here
                </p>
              </div>
            </div>
           </div>

           {loadingUseres ? (
            <div className='flex justify-center py-12' >
            <span className='loading loading-spinner loading-lg'/>  
            </div>
           ): recommendedUser.length===0 ? (
            <div className='card bg-base-200 p-6 text-center'>
              <h3 className='font-semibold text-lg mb-2'> No recommended available</h3>
              <p className='text-base-content opacity-70'>
                Try searching for users with similar interests
              </p>
            </div>
           ):( 
           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recommendedUser.map((user) => {
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
              return(
                <div key={user._id} className='card bg-base-200 hover: shadow-lg transition-all duration-300'>
                  <div className='card-body p-5  space-y-6'>
                    <div className='flex items-center gap-3'>
                    <div className='avatar size-16 rounded-full'>
                      <img src={user.profilePic} alt={user.fullName} />
                    </div>
                    <div>
                      <h3 className='font-semibold text-lg'> {user.fullName}</h3>
                      {user.location&& (
                        <div className='flex items-center text-xs opacity-70 mt-1'>
                          <MapPinIcon className='size-3 mr-1-'/>
                          {user.location}
                        </div>
                      )}
                    </div>
                    </div>
                    {/* language flags */}
                    <div className='flex flex-wrap gap-1.5'>
                      <span className='badge badge-secondary'>{getLanguageFlag(user.nativeLanguage)}
                        Native:{capitialize(user.nativeLanguage)}
                      </span>
                      <span className=" badge badge-outline">
                        {getLanguageFlag(user.learningLanguage)}
                        Learning:{capitialize(user.learningLanguage)}
                      </span>
                    </div>
                    {user.bio&&<p className='text-sm opacity-70'>{user.bio}</p> }

                    {/* Action button  */}
                    <button
                    className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" :"btn-primary"}`}
                    onClick={() => sendRequestMutation(user._id) }
                    disabled={hasRequestBeenSent ||isPending}
                    >
                      {hasRequestBeenSent ?(
                        <>
                        <CheckCheckIcon className='size-4 mr-4'/>
                        Request Sent
                        </>
                      ):(
                        <>
                        <UserPlusIcon className='size-4 mr-4'/>
                        Send Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
           </div>
           )}
        </section>
      </div>
    </div>
  )
}

export default HomePage;

const capitialize = (str) =>str.charAt(0).toUpperCase()+ str.slice(1)
