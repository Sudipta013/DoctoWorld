import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    // on refresh the state is lost, so we need to store it in local storage and use 
    const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"");

    // state to store the doctor data
    const [doctors,setDoctors] = useState([]);
    // state to store the appointments
    const [appointments,setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL


    const getAllDoctors = async () => {

        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors',{},{
                headers: {
                    aToken
                }
            })

            if(data.success){
                setDoctors(data.doctors);
                console.log(data.doctors);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const changeAvailability = async (docId) => {
        try {
            
            //call api
            const {data} = await axios.post(backendUrl + '/api/admin/change-availability',{docId},{
                headers:{
                    aToken
                }
            })

            //check
            if(data.success){
                toast.success(data.message);
                // update the state of doctors
                getAllDoctors();
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    // get all Appointments
    const getAllAppointments = async () => {
        try {
            //api call
            const {data} = await axios.get(backendUrl + '/api/admin/appointments',{
                headers:{
                    aToken
                }
            })

            if(data.success){
                setAppointments(data.appointments);
                console.log(data.appointments);
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    //cancel appointment
    const cancelAppointment = async (appointmentId) => {
        try {
            //api call
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment',{appointmentId},{
                headers:{
                    aToken
                }
            })

            if(data.success){
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    //Dashboard data 
    const getDashData = async () => {
        try {

            const {data} = await axios.get(backendUrl + '/api/admin/dashboard',{
                headers:{
                    aToken
                }
            })

            if(data.success){
                setDashData(data.dashData);
                console.log(data);
            } else{
                toast.error(data.message);
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }

    const value = {
        aToken,setAToken,
        backendUrl,doctors,getAllDoctors,changeAvailability,
        appointments,setAppointments,
        getAllAppointments,
        cancelAppointment,
        getDashData,dashData,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;