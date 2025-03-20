import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


const MyAppointments = () => {

  const {backendUrl, token, getDoctorsData,userData} = useContext(AppContext);
  const [appointments, setAppointments] = useState([]); 
  
  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const stripe = useStripe();
  const elements = useElements();
  const [paymentAppointmentId, setPaymentAppointmentId] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState({});


  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  const getUsersAppointments = async () => {
    // api call
    try {
      const {data} = await axios.get(backendUrl+ '/api/user/appointments',{
        headers: {
          token
        }
      })

      if(data.success){
        setAppointments(data.appointments.reverse());
        // console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }


  const cancelAppointment = async (appointmentId) =>{
    try {

        // api call
        const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{
          //body
          appointmentId
        },{
          headers: {
            token
        }})

        if(data.success){
          toast.success(data.message);
          getUsersAppointments();
          getDoctorsData();
        } else {
          toast.error(data.message);
        }

    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
  }

  const handleStripePayment = async (appointmentId) =>{
    
    try {

      // const stripe = await stripePromise;

      // fetch Appointment details using api call
      const {data} = await axios.post(
        backendUrl + '/api/user/stripe-payment',
        {appointmentId},
        {
          headers: {
              token,
            },
        });

        //validate
        if(!data.success || !data.clientSecret){
          console.log('Invalid response from the server');
          toast.error(data.message || 'Failed to initiate payment. Please try again.');
        }

        // Ensure Stripe and Elements are initialized
        if (!stripe || !elements) {
          toast.error("Stripe.js has not loaded properly. Please try again later.");
          console.log("stripe not loaded properly");
          return;
        }


        //confirm payment
        const cardElement = elements.getElement(CardElement);


        if (!cardElement) {
          toast.error("Card information is not properly loaded.");
          return;
        }

        const result = await stripe.confirmCardPayment(data.clientSecret,{
          payment_method: {
            card: cardElement,
            billing_details:{
              name: userData.name,
              email: userData.email,
              address:{
                line1: userData.address.line1,
                line2: userData.address.line2,
                // as of now static to generate the payment intent
                state: "NY",
                country: "US",
                city: "NYC",
              },
            }
          },
        });


        if(result.error){
          console.log(result.error);
          toast.error(result.error.message || 'Payment failed. Please try again.' );
        } else if (result.paymentIntent.status === 'succeeded'){

          // payment success
          toast.success('Payment successfull');

          const paymentVerification = await axios.post(
            backendUrl + '/api/user/verify-payment-stripe',
            {
                appointmentId,
                paymentIntentId: result.paymentIntent.id
            },
            { headers: { token } }
          );

          if(paymentVerification.data.success){

            //payment success for the appointment 
            setPaymentSuccess(prev => ({
              ...prev,
              [appointmentId]: true,
            }))

            setPaymentAppointmentId(null); // reset payment appointment id

            //refresh appointment and doctor data
            getUsersAppointments();
            getDoctorsData();
            
          } else {
            toast.error(paymentVerification.data.message || 'Payment verification failed.');
          }

        } else {
          toast.error('Payment failed . Please try again.');
        }

    } catch (error) {
      console.log(error);
      toast.error("Payment Failed . Please try again.");
    }
  }

  useEffect(()=>{
    if(token){
      getUsersAppointments();
    }
  },[token])


  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
            <div>
              <img className="w-32 bg-indigo-50" src={item.doctData.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.doctData.name}</p>
              <p>{item.doctData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address</p>
              <p className="text-xs">{item.doctData.address.line1}</p>
              <p className="text-xs">{item.doctData.address.line2}</p>
              <p className="text-xs mt-2">
                <span className="text-sm text-neutral-700 font-normal">Date & Time: </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && !item.payment && paymentAppointmentId !== item._id && !paymentSuccess[item._id] && !item.isCompleted ? (
                <button
                  onClick={() => setPaymentAppointmentId(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              ):(
                // if the payment is successfull
                item.payment && (
                <button className="sm:min-w-48 py-2 border rounded text-green-600">
                    Paid
                </button>
                )
              )}
              
              {!item.cancelled && paymentAppointmentId === item._id && !item.isCompleted && (
                <div>
                    <CardElement className="border rounded p-2 mb-2" />
                  <button
                    onClick={() => handleStripePayment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-green-600 hover:text-white transition-all duration-300"
                  >
                    Confirm Payment
                  </button>
                  <button
                    onClick={() => setPaymentAppointmentId(null)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-gray-300 hover:text-black transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              )}


              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && (
                <button className="sm:min-w-48 py-2 border rounded text-red-600">
                  Appointment Cancelled
                </button>
              )}
              {
                item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border rounded text-green-600">
                    Appointment Completed
                  </button>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments
