import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcryptjs";
import appointmentModel from "../models/appointmentModel.js";

// api for frontend to change availability of doctor
const changeAvailability = async (req, res) => {
	try {
		const { docId } = req.body;

		const docData = await doctorModel.findById(docId);

		await doctorModel.findByIdAndUpdate(docId, {
			available: !docData.available,
		});

		res.json({ success: true, message: "Availability changed successfully" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// api for frontend to get all doctors list

const doctorList = async (req, res) => {
	try {
		const doctors = await doctorModel.find({}).select(["-password", "-email"]);

		res.json({
			success: true,
			doctors,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// api for doctor login
const loginDoctor = async (req, res) => {
	try {
		//auth doctor
		const { email, password } = req.body;

		const doctor = await doctorModel.findOne({ email });

		if (!doctor) {
			return res.json({ success: false, message: "Invalid email or password" });
		}

		const isMatch = bcrypt.compare(password, doctor.password);

		if (isMatch) {
			//password correct
			const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
				expiresIn: "1d",
			});

			res.json({
				success: true,
				message: "Login successful",
				token,
			});
		} else {
			// password incorrect
			res.json({ success: false, message: "Invalid email or password" });
		}
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// api to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
	try {
		const { docId } = req.body;

		const appointments = await appointmentModel.find({ docId });

		res.json({
			success: true,
			appointments,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//api to mark appointments completed for doctor panel
const appointmentComplete = async (req, res) => {
	try {
		const { docId, appointmentId } = req.body;

		const appointmentData = await appointmentModel.findById(appointmentId);

		if (appointmentData && appointmentData.docId === docId) {
			await appointmentModel.findByIdAndUpdate(appointmentId, {
				isCompleted: true,
			});

			return res.json({
				success: true,
				message: "Appointment completed successfully",
			});
		} else {
			return res.json({ success: false, message: "Mark Failed" });
		}
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//api to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
	try {
		const { docId, appointmentId } = req.body;

		const appointmentData = await appointmentModel.findById(appointmentId);

		if (appointmentData && appointmentData.docId === docId) {
			await appointmentModel.findByIdAndUpdate(appointmentId, {
				cancelled: true,
			});

			return res.json({
				success: true,
				message: "Appointment cancelled successfully",
			});
		} else {
			return res.json({ success: false, message: "Cancellation Failed" });
		}
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//api to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
	try {
		const { docId } = req.body;

		const appointments = await appointmentModel.find({ docId });

		let earnings = 0;

		appointments.map((item) => {
			if (item.isCompleted || item.payment) {
				earnings += item.amount;
			}
		});

		let patients = [];

		appointments.map((item) => {
			//get total unique patients
			if (!patients.includes(item.userId)) {
				patients.push(item.userId);
			}
		});

		const dashData = {
			earnings,
			appointments: appointments.length,
			patients: patients.length,
			latestAppointments: appointments.reverse().slice(0, 5),
		};

		res.json({
			success: true,
			dashData,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//api to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
	try {
		const { docId } = req.body;
		const profileData = await doctorModel.findById(docId).select("-password");

		res.json({
			success: true,
			profileData,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//api to update doctor profile data
const updateDoctorProfile = async (req, res) => {
	try {
		const { docId, fees, address, available } = req.body;

		await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

		res.json({
			success: true,
			message: "Doctor profile updated successfully",
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export {
	changeAvailability,
	doctorList,
	loginDoctor,
	appointmentsDoctor,
	appointmentCancel,
	appointmentComplete,
	doctorDashboard,
	doctorProfile,
	updateDoctorProfile,
};