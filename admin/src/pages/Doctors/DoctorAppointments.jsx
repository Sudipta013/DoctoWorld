import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {

    const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
    const { calcAge, slotDateFormat, currency } = useContext(AppContext);

    useEffect(() => {
        if (dToken) {
            getAppointments();
        }
    }, [dToken])

    return (
        <div className='w-full max-w-full m-5'>
            <p className='mb-3 text-lg font-medium'>All Appointments</p>
            <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b text-center'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>

                {
                    appointments.reverse().map((item, index) => (
                        <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b text-gray-500 items-center text-center hover:bg-gray-50' key={index}>
                            <p className='max-sm:hidden'>{index + 1}</p>
                            <div className='flex items-center gap-2 justify-center max-sm:justify-start'>
                                <img className='w-8 rounded-full' src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
                            </div>
                            <div>
                                <p className='text-xs inline border border-gray-400 px-2 rounded-full'>{item.payment ? "Online" : "Cash"}</p>
                            </div>
                            <p className='max-sm:hidden'>{calcAge(item.userData.dob)}</p>
                            <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>
                            <p>{currency}{item.amount}</p>

                            {
                                item.cancelled
                                    ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                                    : item.isCompleted
                                        ? <p className='text-green-400 text-xs font-medium'>Completed</p>
                                        : <div className='flex gap-2 max-sm:gap-1 items-center justify-center pt-1'>
                                            <img onClick={() => cancelAppointment(item._id)} className='w-8 cursor-pointer' src={assets.cancel_icon} alt="" />
                                            <img onClick={() => completeAppointment(item._id)} className='w-8 cursor-pointer' src={assets.tick_icon} alt="" />
                                        </div>
                            }

                        </div>

                    ))
                }
            </div>
        </div>
    )
}

export default DoctorAppointments
