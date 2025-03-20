import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctors from './pages/Admin/AddDoctors';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctors/DoctorDashboard';
import DoctorAppointments from './pages/Doctors/DoctorAppointments';
import DoctorProfile from './pages/Doctors/DoctorProfile';

const App = () => {
  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className='bg-[#f8F9FD]'>
      <ToastContainer/>
      <NavBar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/* admin route */}
          <Route path="/" element={<></>}/>

          <Route path="/admin-dashboard" element={<Dashboard/>}/>

          <Route path="/all-appointments" element={<AllAppointments/>}/>

          <Route path="/add-doctor" element={<AddDoctors/>}/>
          
          <Route path="/doctor-list" element={<DoctorsList/>}/>

          {/* doctor routes */}

          <Route path="/doctor-dashboard" element={<DoctorDashboard/>}/>
          <Route path="/doctor-appointments" element={<DoctorAppointments/>}/>
          <Route path="/doctor-profile" element={<DoctorProfile/>}/>

        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App
