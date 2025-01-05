import { createContext } from "react";

export const AppContext = createContext();

const currency = "₹";

const calcAge = (dob) => {
    // calculate age
    const today = new Date();
    const birthDate = new Date(dob);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
}

const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + " " + dateArray[2];
}


const AppContextProvider = (props) => {
    const value = {
        calcAge,
        slotDateFormat,
        currency
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;