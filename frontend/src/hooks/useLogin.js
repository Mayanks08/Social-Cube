import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { login } from '../lib/api.js';

const useLogin = () => {
     const queryclient = useQueryClient();
  const { mutate,
        isPending,
        error} = useMutation({
    mutationFn:login,
    onSuccess:()=>queryclient.invalidateQueries({queryKey:["authUser"]})
  });
  return{error:error,loginMutation:mutate,isPending}

}

export default useLogin;