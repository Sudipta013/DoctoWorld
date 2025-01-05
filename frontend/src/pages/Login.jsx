import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const {backendUrl,token,setToken} = useContext(AppContext); // get backend url and token from context

  const navigate = useNavigate(); // navigate to home page

  const [state,setState] = useState('Sign Up')

  // state var
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // prevent page refresh


    try {
      
      if(state === 'Sign Up'){

        const {data} = await axios.post(backendUrl + '/api/user/register',{
          // body
          name,email,password
        })

        // if account creation is success

        if(data.success){
          // recieve a token and save
          localStorage.setItem('token',data.token)
          setToken(data.token)
        } else {

          // if account creation is not success
          toast.error(data.message);

        }

      } else {

        // if state not signup
        const {data} = await axios.post(backendUrl + '/api/user/login',{
          // body
          email,password
        })

        // if account creation is success

        if(data.success){
          // recieve a token and save
          localStorage.setItem('token',data.token)
          setToken(data.token)
        } else {

          // if account creation is not success
          toast.error(data.message);

        }

      }

    } catch (error) {

      toast.error(error.message);

    }

  }


  useEffect(()=>{
    if(token){
      // if user is logged in and token is generated user redirected to home page
      navigate('/');
    }
  },[token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state == 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state == 'Sign Up' ? "sign up" : "log in"} to book appointment</p>
        {
          state == 'Sign Up' && 
          <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>{setName(e.target.value)}} value={name} required />
          </div>
        }
        
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e)=>{setEmail(e.target.value)}} value={email} required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e)=>{setPassword(e.target.value)}} value={password} required />
        </div>
        <button type='submit' className='bg-blue-600 text-white rounded p-2 mt-3 w-full text-base'>{state == 'Sign Up' ? "Create Account" : "Login"}</button>
        {
          state == 'Sign Up'
          ? <p>Already have an account? 
            <span onClick={()=>setState('Login')} className='text-blue-900 underline cursor-pointer ml-1'>Login here</span> </p>
          : <p>Create a new account? 
            <span onClick={()=>setState('Sign Up')} className='text-blue-900 underline cursor-pointer ml-1'>Click here</span> </p>
        }
      </div>
    </form>
  )
}

export default Login
