import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {

    const {aToken} = useContext(AdminContext);

    return (
        <div className='min-h-screen bg-white border-r w-64 md:w-48 lg:w-64'>
            {
                aToken && <ul className='text-gray-500 mt-5'>
                    <NavLink className={({isActive})=> `flex items-center gap-2 md:gap-1 py-3 px-3 md:px-2 lg:px-4 cursor-pointer ${isActive ? "bg-[#F5F5F5] text-[#0D6EFD] border-r-4 border-blue-600" : ""}`} to={"/admin-dashboard"}>
                        <img src={assets.home_icon} alt="" className='w-5 h-5 md:w-4 md:h-4' />
                        <p className='text-sm md:text-xs lg:text-sm'>Dashboard</p>
                    </NavLink>

                    <NavLink className={({isActive})=> `flex items-center gap-2 md:gap-1 py-3 px-3 md:px-2 lg:px-4 cursor-pointer ${isActive ? "bg-[#F5F5F5] text-[#0D6EFD] border-r-4 border-blue-600" : ""}`} to={"/all-appointments"}>
                        <img src={assets.appointment_icon} alt="" className='w-5 h-5 md:w-4 md:h-4' />
                        <p className='text-sm md:text-xs lg:text-sm'>Appointments</p>
                    </NavLink>

                    <NavLink className={({isActive})=> `flex items-center gap-2 md:gap-1 py-3 px-3 md:px-2 lg:px-4 cursor-pointer ${isActive ? "bg-[#F5F5F5] text-[#0D6EFD] border-r-4 border-blue-600" : ""}`} to={"/add-doctor"}>
                        <img src={assets.add_icon} alt="" className='w-5 h-5 md:w-4 md:h-4' />
                        <p className='text-sm md:text-xs lg:text-sm'>Add Doctor</p>
                    </NavLink>

                    <NavLink className={({isActive})=> `flex items-center gap-2 md:gap-1 py-3 px-3 md:px-2 lg:px-4 cursor-pointer ${isActive ? "bg-[#F5F5F5] text-[#0D6EFD] border-r-4 border-blue-600" : ""}`} to={"/doctor-list"}>
                        <img src={assets.people_icon} alt="" className='w-5 h-5 md:w-4 md:h-4' />
                        <p className='text-sm md:text-xs lg:text-sm'>Doctors List</p>
                    </NavLink>
                </ul>
            }
        </div>
    );
}

export default Sidebar
