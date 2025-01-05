import express from "express";
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentStripe, verifyPaymentStripe } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

// api routes
userRouter.post("/register", registerUser); //register-route

userRouter.post("/login", loginUser); //login-route

userRouter.get('/get-profile',authUser,getProfile) //get-userprofile-route

userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile) //update-userprofile-route

userRouter.post('/book-appointment',authUser,bookAppointment) //book-appointment-route

userRouter.get('/appointments',authUser,listAppointment) //get-appointment-route

userRouter.post('/cancel-appointment',authUser,cancelAppointment)//cancel-appointment-route

userRouter.post('/stripe-payment',authUser,paymentStripe) //payment-route

userRouter.post('/verify-payment-stripe',authUser,verifyPaymentStripe) //verify-payment-route




export default userRouter;