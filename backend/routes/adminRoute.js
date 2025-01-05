import express from "express";
import { addDoctor,adminDashboard,allDoctors,appointmentCancel,appointmentsAdmin,loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

//route for adding a doctor by admin
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)

//route for login admin
adminRouter.post('/login',loginAdmin)

//route for getting all doctors for admin panel
adminRouter.post('/all-doctors',authAdmin,allDoctors)

adminRouter.post('/change-availability',authAdmin,changeAvailability) 

//route for getting all appointments for admin panel
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)

// route for cancelling an appointment by admin
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)

//route for dashdata for admin panel
adminRouter.get('/dashboard',authAdmin,adminDashboard)


export default adminRouter;