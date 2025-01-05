import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({speciality,docId}) => {

    const {doctors} = useContext(AppContext)
    const navigate = useNavigate()

    const [relDoc,setRelDoc] = useState([])

    useEffect(() => {
        if(doctors.length > 0 && speciality){
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId);
            setRelDoc(doctorsData)
        }
    },[doctors,speciality,docId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-600 md:mx-10'>
        <h1 className='text-3xl font-medium'>Top Related Doctors to Book</h1>
        <p className='sm:w-1/3 text-center text-sm'>Simply browse through our list of trusted doctors</p>
        <div className='flex flex-wrap justify-center w-full p-2 gap-4'>
            {relDoc.slice(0,5).map((item,index)=>(
                <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 w-60'>
                    <img className='bg-blue-50' src={item.image} alt="" />
                    <div className='p-4'>
                        <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                            <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                        </div>
                        <p className='font-medium text-lg mt-2'>{item.name}</p>
                        <p className='text-sm mt-1'>{item.speciality}</p>
                    </div>
                </div>
            ))}
        </div>
        <button onClick={()=>{ navigate('/doctors');scrollTo(0,0)}} className='bg-blue-500 text-white px-8 py-2 rounded-full mt-2'>more</button>
        </div>
    )
}

export default RelatedDoctors
