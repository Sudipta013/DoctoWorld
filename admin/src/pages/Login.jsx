import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    //manage the admin or doctor login using state
    const [state,setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {setAToken,backendUrl} = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            //api call using axios
            if (state === 'Admin') {
                // if state is admin 
                const {data} = await axios.post(backendUrl + '/api/admin/login', {
                    email,
                    password
                })
                if(data.success){
                    // console.log(data.token);
                    // saving the token in local storage for future use
                    localStorage.setItem('aToken',data.token);
                    setAToken(data.token);
                }
                else{
                    // success is false 
                    toast.error(data.message);
                }
            }
            else{
                // if state is doctor
            }

        } catch (error) {
            
        }

    }


    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span>Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input 
                        onChange={(e)=>{setEmail(e.target.value)}} 
                        value={email} 
                        className='border border-[#5E5E5E] rounded-md p-2 mt-1 w-full' 
                        type="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        required={true}
                    />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input 
                        onChange={(e)=>{setPassword(e.target.value)}} 
                        value={password}
                        className='border border-[#5E5E5E] rounded-md p-2 mt-1 w-full' 
                        type="password"
                        autoComplete='off'
                        name="current-password" 
                        placeholder="Enter your password"
                        required={true}
                    />
                </div>
                <button className='bg-primary text-white rounded-md py-2 mt-3 w-full text-base'>Login</button>
                {
                    state === 'Admin' 
                    ? <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span></p>
                    : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span></p> 
                }
            </div>
        </form> 
    )
}

export default Login
