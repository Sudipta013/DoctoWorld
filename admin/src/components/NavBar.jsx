import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import {useNavigate} from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const NavBar = () => {
  const {aToken,setAToken} = useContext(AdminContext);
  const {dToken,setDToken} = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate('/')
    aToken && setAToken('');
    aToken && localStorage.removeItem('aToken');
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken")
  }

  return (
    <div className='flex justify-between items-center px-5 sm:px-10 py-3 bg-white border-b'>
      <div className='flex items-center gap-2 text-xs sm:text-sm'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-500 mt-2'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={logout} className='bg-primary text-white text-sm px-6 py-1.5 rounded-full hover:bg-primary/80 transition-all duration-300 mt-2 sm:px-8 sm:py-2 md:px-10 md:py-2.5 lg:px-12 lg:py-3'>Logout</button>
    </div>
  )
}

export default NavBar
