import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  const {docId} = useParams()
  const {doctors,currencySymbol,backendUrl,token,getDoctorsData} = useContext(AppContext)
  const daysOfWeek = ['SUN' ,'MON' ,'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null) 

  const [docSlots, setDocSlots] = useState([])
  const [slotIndex,setSlotIndex] = useState(0)
  const [slotTime,setSlotTime] = useState('')

  const fetchDocInfo = async () => {

    try {
      // fetch doctor info
      const doctorInfo = doctors.find(doctor => doctor._id === docId)
      setDocInfo(doctorInfo);
      // console.log(doctorInfo);
    } catch (error) {
      console.log(error);
    }
    
  }

  const getAvailableSlots = async () => {

    setDocSlots([])
    //all the time slots array
    const allSlots = []; 
    //getting current date
    const today = new Date();

    for(let i = 0; i < 7; i++){
      //getting date with slot Index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      //setting and time of date with Index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21,0,0,0);

      //setting starting time for today
      if(i == 0){
        if(today.getHours() >= 21){
          //skip if past 9PM 
          allSlots.push([]);
          continue;
        }
        currentDate.setHours(today.getHours() > 10 ? today.getHours() + 1 : 10);
        currentDate.setMinutes(today.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while(currentDate < endTime){
        let formattedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // hide booked slots
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day+"_"+month+"_"+year;
        const slotTime = formattedTime;

        //check slotdate and slotime if entry exists in slots_booked then hide it
        const isSlotAvailable = docInfo.slots_booked
        [slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

        if(isSlotAvailable){
          //add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      allSlots.push(timeSlots);
    }

    // console.log("fetching available slots...")
    // console.log("setting docslots: ",allSlots);
    setDocSlots(allSlots); //set all slots 

    //--ignore this comment
    //setting hours
    //   if(today.getDate() === currentDate.getDate()){
    //     currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
    //     currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
    //   } else{
    //     currentDate.setHours(10);
    //     currentDate.setMinutes(0);
    //   }
    //   while(currentDate < endTime){
    //     let formattedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        
    //     //add slot to array
    //     timeSlots.push({
    //       datetime: new Date(currentDate),
    //       time: formattedTime
    //     });

    //     // increment time by 30 minutes
    //     currentDate.setMinutes(currentDate.getMinutes() + 30)
    //   }
    // }
    // setDocSlots(prevSlots => [...prevSlots,timeSlots])
  }

  const bookAppointment = async () => {
    // check user logged in
    if(!token){
      toast.warn('Login to book an appointment');
      return navigate('/login');
    }

    try {

      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1; //1 for jan
      let year = date.getFullYear()

      const slotDate = day + '_' + month + '_' + year;

      // console.log(slotDate);

      // api call
      const {data} = await axios.post(backendUrl +'/api/user/book-appointment',{docId,slotDate,slotTime},{
        headers: {
          token
        }
      });

      if(data.success){
        toast.success(data.message);
        getDoctorsData(); //slots updated so get data again
        return navigate('/my-appointments');
      }
      else{
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }


  useEffect(() => {
    fetchDocInfo();
  },[doctors,docId])

  useEffect(() => {
    if(docInfo){
      getAvailableSlots();
    }
  },[docInfo])

  useEffect(() => {
    // console.log(docSlots);
  },[docSlots])

  return docInfo && (
     <div className="container mx-auto p-4">
      {/* Doctor details */}
      <div className='flex flex-col sm:flex-row gap-4 bg-white shadow-lg rounded-lg p-4'>
        <div className="">
          <img className='bg-blue-700 w-full sm:max-w-72 rounded-lg' src={docInfo?.image} alt={docInfo?.name} />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* Doc Info */}
          <h2 className="text-2xl font-medium text-gray-900 flex items-center">
            {docInfo?.name} 
            <img className="ml-2 w-5 h-5 mt-1" src={assets.verified_icon} alt="Verified" />
          </h2>

          <div>
            <p className="text-gray-600 mt-1">{docInfo?.degree} - {docInfo?.speciality}</p>
            <button className="mt-2 bg-blue-500 text-white py-1 px-2 text-sm rounded-full hover:bg-blue-600 transition duration-200">
              {docInfo.experience} Experience
            </button>
          </div>

          {/* Doctor About */}
          <div>
            <p className="flex items-center gap-1 font-semibold mb-1 mt-3 text-gray-900">
              About <img className="inline w-4 h-4" src={assets.info_icon} alt="Info" />
            </p>
            <p className=" text-gray-500 sm:text-sm md:text-base mt-1">
              {docInfo.about}
            </p>
          </div>
          <p className=' text-gray-500 sm:text-sm md:text-base'>
            Appointment Fee: <span className="text-sm text-gray-700">{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* ---booking slots---*/}
      <div className='flex flex-col items-center sm:pl-4 mt-3 font-medium text-gray-700 rounded-lg p-4 shadow-md'>
        <p className='text-lg sm:text-xl font-semibold text-gray-800 my-2'>
          Booking Slots
        </p>
        <div className='flex justify-center gap-2 items-center w-full overflow-x-scroll sm:overflow-auto rounded-lg p-3'>
          {
            docSlots.map((item, index) => {
                const isToday = new Date().getDate() === item[0]?.datetime.getDate();
                const hasSlots = item.length > 0;
                return (
                  <div className={`flex flex-col justify-center items-center w-32 h-14 cursor-pointer rounded-full transition-colors duration-300 ${
                    slotIndex === index 
                    ? "bg-gradient-to-r from-blue-700 to-indigo-600 text-white"
                    : "border border-gray-300 hover:bg-gray-100"
                    }`} 
                    key={index}
                    onClick={() => setSlotIndex(index)}
                    >
                    {/* {isToday && item.length === 0 ? (
                      <p className='text-sm sm:text-base font-medium text-gray-500'>No slots</p>
                    ) : (
                      <>
                        <p className='text-sm sm:text-base font-medium'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                        <p className='text-sm sm:text-base font-medium'>{item[0] && item[0].datetime.getDate()}</p>
                      </>
                    )} */}

                    {isToday ? (
                        hasSlots ? (
                            <>
                                <p className='text-sm sm:text-md font-medium'>{daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p className='text-sm sm:text-base font-medium'>{item[0].datetime.getDate()}</p>
                            </>
                        ) : (
                            <p className='text-sm sm:text-sm font-medium text-black py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-full'>NO SLOTS TODAY</p>
                        )
                    ) : (
                        hasSlots ? (
                            <>
                                <p className='text-sm sm:text-sm font-medium'>{daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p className='text-sm sm:text-sm font-medium'>{item[0].datetime.getDate()}</p>
                            </>
                        ) : (
                            <p className='text-sm sm:text-sm font-medium text-black py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-full'>NO SLOTS TODAY</p>
                        )
                    )}
                  </div>
                )
            })
          }
        
        </div>
        {/* Time slots ui */}
        <div className='flex items-center gap-2 overflow-x-scroll sm:overflow-auto mt-1 rounded-lg p-2 w-full max-w-5xl'>
          {
            docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p className={`text-sm font-light flex-shrink-0 px-4 py-2 rounded-full cursor-pointer ${item.time == slotTime 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 border border-gray-300'  
              }`} 
              key={index}
              onClick={()=>setSlotTime(item.time)}
              >
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>
        <div className='flex justify-center items-center w-full mt-2'>
          <button onClick={bookAppointment} className='bg-blue-600 text-white text-sm font-light px-14 py-3 rounded-full my-2 ml-2'>
            Book an appointment
          </button>
        </div>
      </div>

      {/* relatedDoctors */}
      <RelatedDoctors docId = {docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointment
