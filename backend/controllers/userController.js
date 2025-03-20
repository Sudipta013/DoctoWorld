// api logic for user like login,register,get & update profile, bookappointment, display and cancel appointment and payment gateway

import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Stripe from "stripe";

// api to register user
const registerUser = async (req, res) => {
    try {
        
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"Please fill all the fields"})
        }

        // validate email
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false,message:"Please enter a valid email"})
        }

        // validate password
        if(password.length < 8){
            return res.status(400).json({success:false,message:"Password must be at least 8 characters"})
        }

        // hashing user password
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user
        const userData = {
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData);

        // add new user to database
        const user = await newUser.save();

        // create token 
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
    }
}

// API for user login
const loginUser = async (req, res) => {
    try {

        const {email,password} = req.body;

        // check user exist
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({success:false,message:"User not found"});
        }

        // if user exist match password
        const isMatch = await bcrypt.compare(password,user.password);

        if(isMatch){
            // generate token for user and send res
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            res.json({success:true,token})
        }else{
            res.status(400).json({success:false,message:"Invalid credentials"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
    }
}

// API for to get user profile data
const getProfile = async (req, res) => {
    try {

        const {userId} = req.body;
        const userData = await userModel.findById(userId).select("-password");

        res.json({success:true,userData});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
    }
}

// API to update user profile data
const updateProfile = async (req, res) => {
    try {

        // userId added to body from token from middleware-authUser
        const {userId,name,phone,address,dob,gender} = req.body;
        const imageFile = req.file; //from multer
        
        if(!name || !phone || !dob || !gender){
            return res.status(400).json({success:false,message:"Data Missing"})
        }

        await userModel.findByIdAndUpdate(userId,{
            name,
            phone,
            address:JSON.parse(address),
            dob,
            gender
        })

        if(imageFile){
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});

            const imageURL = imageUpload.secure_url;

            // save image url to database
            await userModel.findByIdAndUpdate(userId,{
                image:imageURL
            })
        }

        res.json({success:true,message:"Profile updated successfully"})

        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {
    try {

        const {userId,docId,slotDate,slotTime} = req.body;

        // check if doctor exist
        const doctData = await doctorModel.findById(docId).select("-password");

        //check if doctor is available
        if(!doctData.available){
            return res.status(400).json({success:false,message:"Doctor is not available"})
        } 

        let slots_booked = doctData.slots_booked;

        // check if slot is already booked
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:"Slot is already booked"})
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        }
        else{
            // noone has booked this slot on that date yet
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        // get userdata
        const userData = await userModel.findById(userId).select("-password");

        delete doctData.slots_booked; //delete slots_booked from doctData object

        // appointment data
        const appointmentData = {
            userId,
            docId,
            userData,
            doctData,
            amount:doctData.fees,
            slotDate,
            slotTime,
            date: Date.now()
        }

        // save appointment data to database
        const newAppointment = await appointmentModel(appointmentData)
        await newAppointment.save();

        // update slots_booked in doctor data
        await doctorModel.findByIdAndUpdate(docId,{
            slots_booked
        })

        res.json({success:true,message:"Appointment booked successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
    }
}

// APi to get user appointment for my-appointment page
const listAppointment = async (req, res) => {
    try {

        const {userId} = req.body;

        //appointments array with all data
        const appointments = await appointmentModel.find({userId})

        res.json({success:true,appointments})


    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const {userId,appointmentId} = req.body;

        // get appointment data
        const appointmentData = await appointmentModel.findById(appointmentId);

        //verify appointment user
        if(appointmentData.userId !== userId){
            return res.json({success:false,message:"You are not authorized to cancel this appointment"});
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{
            cancelled:true
            }
        )

        // update slots_booked in doctor data
        const {docId,slotDate,slotTime} = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        // remove slot from slots_booked if cancelled slottime matches with slottime in slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(
            e => e !== slotTime
        )

        await doctorModel.findByIdAndUpdate(docId,{
            slots_booked
        })

        res.json({success:true,message:"Appointment cancelled successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
    }
}


//     try {

//         // logic 
//         const {appointmentId} = req.body;
//         const appointmentData = await appointmentModel.findById(appointmentId);

//         if(!appointmentData || appointmentData.cancelled){
//             return res.json({success:false,message:"Appointment not found"});
//         }
//         //creating options
//         const options = {
//             amount: appointmentData.amount * 100,
//             currency: process.env.CURRENCY,
//             receipt: appointmentId,
//             payment_capture: 1
//         }

//         // create razorpay order
//         const order = await razorpayInstance.orders.create(options);

//         res.json({success:true,order})
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({success:false,message:error.message})
//     }
    
// }

// API to make payment of appointment using stripe

// API to make payment of appointment using stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentStripe = async (req, res) => {
    try {
        //get the appointment for which user is paying
        const {appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        //check if appointment exists and not cancelled
        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false,message:"Appointment not found"});
        }

        // create payment intent if appointment exists and not cancelled
        try {
            if(typeof appointmentData.amount !== 'number' || isNaN(appointmentData.amount)){
                throw new Error('Invalid amount')
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount: appointmentData.amount,
                currency: 'inr',
                description: `Payment for appointment ${appointmentId}`,

            });

            res.json({
                success: true,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            });


        } catch (error) {

            console.error('Error creating PaymentIntent:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create PaymentIntent',
                error: error.message,
            });  
        }

    } catch (error) {
        console.error('Stripe Payment Error:', error);
        res.status(500).json({success:false,message:error.message});
    }
}

//API to verify payment of appointment using stripe
const verifyPaymentStripe = async (req, res) => {
    try {
        const { appointmentId, paymentIntentId } = req.body;

        // Fetch the payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Verify that the payment was successful
        if (paymentIntent.status === 'succeeded') {
            // Find the appointment and update payment status
            const appointmentData = await appointmentModel.findById(appointmentId);

            if (!appointmentData) {
                return res.status(404).json({ success: false, message: "Appointment not found" });
            }

            // Update payment status in the appointment
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });

            res.json({
                success: true,
                message: "Payment successful and appointment status updated."
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment failed, please try again."
            });
        }
    } catch (error) {
        console.error('Stripe Payment Verification Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentStripe,verifyPaymentStripe} 