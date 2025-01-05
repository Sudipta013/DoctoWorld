import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

//common logics
export const AppContext = createContext();

const AppContextProvider = (props) => {
    
    const currencySymbol = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([]);

    //state to save user auth token from backend api
    const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false);

    // state to store user data
    const [userData, setUserData] = useState(false);


    //api call
    const getDoctorsData = async () => {
        try{

            const {data} = await axios.get(backendUrl + '/api/doctor/list')

            if(data.success){
                setDoctors(data.doctors);
            }else{
                toast.error(data.message);
            }

        } catch(error){
            console.log(error);
            toast.error(error.message)
        }
    }

    // get user data and save to state
    const loadUserProfileData = async () => {
        try {

            const {data} = await axios.get(backendUrl + '/api/user/get-profile', {
                headers:{
                    token
                }
            })

            if(data.success){
                setUserData(data.userData);
            } else{
                toast.error(data.message);
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    
    const value = {
        doctors,getDoctorsData,
        currencySymbol,
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadUserProfileData,
    }

    useEffect(() => {
        // func called when web page is loaded
        getDoctorsData();
    },[])

    useEffect(() => {
        if(token){
            // when user is logged in
            loadUserProfileData();
        } else {
            // when user is logged out
            setUserData(false);
        }
    },[token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;