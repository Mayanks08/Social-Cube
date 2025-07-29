import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { acceptFriendRequest, getFriendsRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";

const NotificationPage = () => {
  const queryClient =useQueryClient();
  const {data:friendRequests ,isLoading} =useQuery({
    queryKey: ["friendRequests"],
    queryFn:getFriendsRequests,
  })

  const {mutate: acceptRequestMutation,isPending} = useMutation({
    mutationFn:acceptFriendRequest,
    onSuccess:()=> {
      queryClient.invalidateQueries({querykey:["friendRequests"]});
      queryClient.invalidateQueries({queryKey:["friends"]});
    }
  });
  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];
  return (
    <div className="p-5 sm:p-6 lg:p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tacking-tight mb-6">Notifications</h1>
        {isLoading ?(
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ):( 
        <>
          {incomingRequests.legth >0 &&(
            <section className="space-y-4">
              <h2 className="text-xl font-semibold felx items-center gap-2">
                <UserCheckIcon className="h-5 w-5 text-primary"/>
                Incoming Friend Requests
                <span className="badge badge-primary ml-2">
                  {incomingRequests.length}
                </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request)=>(
                    <div 
                    key={request._id}
                    className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className=" avatar w-14 h-14 rounded-full bg-base-300">
                              <img src={request.sender.profilePic} alt={request.sender.fullName}/>
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender.fullName}</h3>
                              <div className="flex flex-warp gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm ">
                                  native: { request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-secondary badge-sm">
                                  Learning : {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className= "btn btn-primary btn-sm" 
                          onclick={() =>acceptRequestMutation(request._Id)}
                          disabled={isPending}>
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </section>
          )}

          {/* Accepted Reqs Notifications */}
          {acceptedRequests.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold felx items-center gap-2">
                <BellIcon className="h-5 w-5 text-success"/>
                New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification)=>(
                    <div className="card bg-base-200 shadow-sm" key={notification._id}>
                    <div className="card-body p-4">
                      <div className="flex items-start gap-3">
                        <div className="avatar mt-1 size-10 rounded-full">
                          <img 
                          src={notification.recipient.profilePic} 
                          alt={notification.recipient.fullName}/>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                          <p className="text-sm my-1">
                            {notification.recipient.fullName}
                             accept your friend request
                          </p>
                          <p className="text-xs flex items-center opacity-70">
                            <ClockIcon className="h-3 w-3 mr-1"/>
                            Recently
                          </p>
                        </div>
                        <div  className="badge badge-success">
                          <MessageSquareIcon className="h-3 w-3 mr-1"/>
                          New Friend
                        </div>
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
            </section>
          )}
          {incomingRequests.legth===0 && acceptFriendRequest.legth===0 && (
            <NoNotificationFound/>
          )}

         </>
        )}
      </div>
    </div>
  )
}

export default NotificationPage