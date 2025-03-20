import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/*left*/}
                <div>
                    <img className='mb-0 w-40' src={assets.pagelogo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>DoctoWorld is your trusted healthcare partner, making doctor appointments easy and hassle-free.
                        With a network of experienced medical professionals, we ensure quality care at your convenience.
                        Book appointments, manage schedules, and connect with top doctors—all in one place.</p>
                </div>

                {/*center*/}
                <div>
                    <p className='text-xl font-medium sm:mb-6 mt-7'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>

                {/*right*/}
                <div>
                    <p className='text-xl font-medium sm:mb-6 mt-7'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+1-212-456-7890</li>
                        <li>sudiptopaul@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                {/* ---copy right text */}
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@ MediCare - All Rights Reserved</p>
            </div>
        </div>
    )
}

export default Footer
