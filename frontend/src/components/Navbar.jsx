import { Link, useLocation } from "react-router";
import  useAuthUser  from "../hooks/useAuthUser.js";
import { BellIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
    const {authUser} =useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");

     const {logoutMutation} = useLogout();
    
  return (
    <div className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-full">
            {/* logo on if user on chat page  */}
            {isChatPage&& (
                <div className="pl-5">
                    <Link to="/" className="flex items-center gap=2.5">
                     <Box  className="size-9 text-primary "/>
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider ">
                            Cube
                         </span>
             </Link>
                </div>
            )}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                <Link to={"/notifications"}>
                <button className="btn btn-ghost btn-circle">
                    <BellIcon className="h-6 w-6 text-base-content opacity-70"/>
                </button>
                </Link>
            </div>
            {/* pura karna hai */}
            <ThemeSelector />

             <div className="avatar" >
                <div className="w-12 rounded-full">
                    <img src={authUser?.profilePic} alt="Profile" />
                </div>
            </div>

            {/* Logout button */}
            <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70"/>
            </button>
        </div>
    </div>
    </div>
  )
}

export default Navbar;