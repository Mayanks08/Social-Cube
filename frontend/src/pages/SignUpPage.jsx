import React, { useState } from 'react'
import { Box} from 'lucide-react';
import {Link } from 'react-router'

import useSignUp from '../hooks/useSignup.js';
const SignUpPage = () => {
  const [signupData,setSignupData]=useState({
    name: "",
    email: "",
    password: "",
  })
//  i write the costum hook here in hooks folder
  // const queryClient = useQueryClient();
  
  //  const {mutate:signupMutation ,isPending,error} =useMutation({
  //   mutationFn: signup,
  //   onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
  //  })

  const {isPending ,error ,  signupMutation} = useSignUp();


  const handleSignup = (e) =>{
    e.preventDefault();
    signupMutation(signupData)
  }
  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="cyber">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
      {/* //left side of signup from */}

      <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
      {/* //logo */}
      <div className='mb-4 flex items-center justify-start gap-2'>
        <Box className='size-9 text-primary'/>
        <span className='text-3xl font-bold font-mono bg-clip-text  text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
          Cube
        </span>
      </div>
      {/* //error message if any comes*/}
       {error && (
        <div className='alert alert-error mb-4'>
          <span>{error.response.data.message}</span>
        </div>
       )}
        {/* //SignUp form */}
        <div className='w-full'>
          <form onSubmit={handleSignup}>
            <div className='space-y-4'>
              <div>
                <h2 className='text-xl font-semibold'>Create an Account</h2>
                <p className='text-sm opacity-70'>
                  Join Cube  and start your language learning adverture!
                </p>
              </div>

              <div className='space-y-3'>
                {/* FUllNAME */}
              <div className='form-control w-full'>
                <label className='label'> 
                  <span className='label-text'>Full Name</span>
                </label>
                <input type="text" 
                  placeholder="John Doe"
                  className="input input-bordered w-full" 
                  value={signupData.fullName}
                  onChange={(e) =>setSignupData({...signupData, fullName:e.target.value})}
                  required
                />
              </div>
              {/* Email */}
              <div className='form-control w-full'>
                <label className='label'> 
                  <span className='label-text'>Email</span>
                </label>
                <input type="email" 
                  placeholder="JohnDoe@gmail.com"
                  className="input input-bordered w-full" 
                  value={signupData.email}
                  onChange={(e) =>setSignupData({...signupData, email:e.target.value})}
                  required
                />
              </div>
              {/* Password  */}
              <div className='form-control w-full'>
                <label className='label'> 
                  <span className='label-text'>Password</span>
                </label>
                <input type="password" 
                  placeholder="Password"
                  className="input input-bordered w-full" 
                  value={signupData.password}
                  onChange={(e) =>setSignupData({...signupData, password:e.target.value})}
                  required
                />
                <p className='text-xs opacity-70 mt-1'>
                  Password must be at least  6 characters long
                </p>
              </div>

              <div className='form-control '>
                <label className='label cursor-pointer justify-start gap-2'>
                  <input type='checkbox' className='checkbox checkbox-sm' required/>
                  <span className='text-xs leading-tight'>
                    I agree to the {""}
                    <span className="text-primary hover:underline">terms of serivce </span>
                    <span className='text-primary hover:undeerline'>privacy policy</span>
                  </span>
                </label>
              </div>
              </div>
              <button className="btn btn-primary w-full" typr="submit">
                {isPending ?(
                  <>
                  <span className='loading loading-spinner loading-xs'></span>
                  Loading...
                  </>
                ):(
                  "Create Account"
                )}
              </button>
              <div className='text-center mt-4'>
                <p className='text-sm'>
                  Already have an account?{""}
                  <Link to="/login" className='text-primary hover:underline'>
                  Sign In
                  </Link>
                </p>
              </div>
            </div>
          </form>

        </div>
      </div>

      {/* Right Side  */}
      <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
        <div className='max-w-md p-8'>
          {/* image set  */}
          <div className='relative aspect-square max-w-sm mx-auto'>
            <img src="/01.png" alt="image" className='w-full h-full ' />
          </div>
          <div className='text-center space-y-2 mt-2  '>
            <h2 className='text-xl front-semibold  '> Connect with Language Learners  worldwide</h2>
            <p className='opacity-70'>
              Practice conversation , make friends, and improve your language skills with together
            </p>
          </div>
        </div>

      </div>
      </div>
    </div>
  )
}

export default SignUpPage