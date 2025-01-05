import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='px-4 md:px-10 lg:px-20'>
      
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT<span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-8 items-center'>
        <img className='w-full md:w-1/2 lg:w-[400px] h-auto object-contain mx-auto' src={assets.about_image} alt="About Medicare" />
        
        <div className='flex flex-col justify-center gap-4 w-full md:w-1/2 text-sm md:text-base lg:text-base text-gray-600 px-2 md:px-4 lg:px-6'>
          <p className='leading-relaxed text-center md:text-left'>Welcome to Medicare, your trusted partner in managing your healthcare needs conveniently and efficiently. At Medicare, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p className='leading-relaxed text-center md:text-left'>Medicare is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Medicare is here to support you every step of the way.</p>
          <b className='text-gray-800 text-lg md:text-xl text-center md:text-left'>Our Vision</b>
          <p className='leading-relaxed text-center md:text-left'>Our vision at Medicare is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>

      <div className='text-xl my-4 text-center'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span> </p>
      </div>
      <div className='flex flex-col md:flex-row mb-20 gap-4'>
        <div className='border px-6 md:px-10 lg:px-16 py-8 flex flex-col gap-3 text-[15px] hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer text-gray-600'>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-6 md:px-10 lg:px-16 py-8 flex flex-col gap-3 text-[15px] hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer text-gray-600'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-6 md:px-10 lg:px-16 py-8 flex flex-col gap-3 text-[15px] hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer text-gray-600'>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About