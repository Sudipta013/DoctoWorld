import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {

  // const [userData, setUserData] = useState({
  //   name: 'Sudipta Paul',
  //   image:assets.profile_pic,
  //   email: 'sudipta.paul@techflinch.com',
  //   phone: '+91-8904148904',
  //   address:{
  //     line1: "57th Cross, Richmond",
  //     line2: "Circle, Church Road, London",
  //   },
  //   gender: 'Male',
  //   dob: '2000-01-20',
  // })

  const {userData,setUserData,token,backendUrl,loadUserProfileData} = useContext(AppContext);

  const [edit, setEdit] = useState(false);
  const [image,setImage] = useState(false);

  const updateUserProfileData = async () => {

    // api call
    try {
      const formData = new FormData();

      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      // user has option to update image or not
      image && formData.append('image', image);

      const {data} = await axios.post(backendUrl + '/api/user/update-profile',formData,{
        headers:{
          token
        }
      })

      if(data.success){
        toast.success(data.message);
        await loadUserProfileData(); //refetch the data
        setEdit(false); //come out of edit mode
        setImage(false); //reset image state
      } else {
        toast.error(data.message);
      }

    } catch (error) {

      console.log(error);
      toast.error(error.message);
      
    }
  }

  return userData && (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-2 md:p-4 lg:p-2">

      {
        edit
        ? <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
              <img className='w-10 absolute bottom-12 right-12' src={image ? '': assets.upload_icon } alt="" />
            </div>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
        : <img className='w-36 rounded' src={userData.image}></img>
      }


      {/* image div
      <div className='flex-shrink-0 '>
        <img 
          className='w-44 h-44 rounded-full md:rounded-lg object-cover md:w-48 md:h-48 lg:w-64 lg:h-64 border-y-2 md:border-2 border-blue-600' 
          src={userData.image} 
          alt="profile_image" />
      </div> */}

      <div className='flex-1 bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2'>
        {/* Name Section */}
        {
          edit 
          ? <input  
              className='w-full text-xl font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="text" 
              value={userData.name} 
              placeholder='Name' 
              onChange={e => setUserData(prev => ({...prev, name: e.target.value}))}/> 
          : <p className='font-medium text-2xl text-neutral-800'>{userData.name}</p>
        }
        <hr className='bg-zinc-400 h-[1px] border-none my-4'/>

        {/* contact info */}
        <div className='space-y-4'>
          <p className='text-neutral-500 font-semibold'>CONTACT INFORMATION</p>
          {/* email div */}
          <div className='space-y-2'>
            <p className='font-medium text-gray-700'>Email: </p>
            <p className='text-blue-600 font-medium'>{userData.email}</p>
          </div>
          {/* phone div */}
          <div className='space-y-2'>
            <p className='font-medium text-gray-700'>Phone: </p>
            {
              edit 
              ? <input className='w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  type="text" 
                  value={userData.phone} 
                  placeholder='phone' 
                  onChange={e => setUserData(prev => ({...prev, phone: e.target.value}))}/> 
              : <p className='text-blue-400'>{userData.phone}</p>
            }
          </div>

          {/* address div */}
          <div className='space-y-2'>
            <p className='font-medium text-gray-700'>Address: </p>
            
            {
            edit 
            ? <p>
              <input  className='w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2'
                type="text" 
                value={userData.address.line1} 
                placeholder='Line 1' 
                onChange={e => setUserData(prev => ({...prev, address: {...prev.address, line1: e.target.value}}))}/> 
              <br />  
              <input  className='w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2'
                type="text"
                value={userData.address.line2} 
                placeholder='Line 2' 
                onChange={e => setUserData(prev => ({...prev, address: {...prev.address, line2: e.target.value}}))}/>
              </p>
            : <p className='text-gray-500'>
              {userData.address.line1}
              <br /> 
              {userData.address.line2}
              </p>
          }
          </div>
        </div>

        <hr className='my-4 border-gray-700' />

        {/* basic info */}
        <div className='space-y-4'>
          <p className='text-neutral-500 mt-3 font-semibold'>BASIC INFORMATION</p>

          {/* gender div */}
          <div className='space-y-2'>
            <p className='font-medium text-gray-700'>Gender:</p>
            {
              edit 
              ? <select 
                className='w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))} value={userData.gender}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              : <p className='text-gray-400'>{userData.gender}</p>
            }
          </div>
          {/* Birthday div */}
          <div className='space-y-2'>
            <p className='font-medium text-gray-700'>Birthday:</p>
            {
              edit 
              ? <input 
                  className='w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                  type="date" 
                  onChange={(e) => setUserData(prev => ({...prev, dob: e.target.value}))} 
                  value={userData.dob}/>
              : <p className='text-gray-400'>{userData.dob}</p>
            }
          </div>
        </div>
        {/* Buttons */}
        <div className='mt-6'>
          {
            edit
            ? <button className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all' onClick={updateUserProfileData}>Save information</button>

            : <button className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all' onClick={() => setEdit(true)}>Edit Profile</button>
          }
        </div>
      </div>
    </div>
  )
}

export default MyProfile
