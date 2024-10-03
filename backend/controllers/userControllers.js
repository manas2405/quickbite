const userModel = require('../models/UserModel');
const otpModel = require('../models/OtpModel');  
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const nodemailer = require('nodemailer'); 
require('dotenv').config();


const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Login user 
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const otp = generateOtp();

        let existingOtp = await otpModel.findOne({ email });
        if (existingOtp) {
            existingOtp.otp = otp;
            await existingOtp.save();
        } else {
            const newOtp = new otpModel({ email, otp });
            await newOtp.save();
        }

        await sendOtpEmail(email, otp);

        res.json({ success: true, message: "OTP sent to your email." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "An error occurred while logging in." });
    }
};

// Function to send OTP via email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASSWORD 
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "OTP Verification",
        html: `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                        .container { background-color: #fff; border-radius: 5px; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
                        h2 { color: #333; }
                        p { color: #666; }
                        .otp { font-size: 24px; font-weight: bold; color: #007bff; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>OTP Verification</h2>
                        <p>Hi,</p>
                        <p>Your OTP for verification is:</p>
                        <p class="otp">${otp}</p>
                        <p>This OTP is valid for 5 minutes.</p>
                    </div>
                </body>
            </html>
        `
    };

    return transporter.sendMail(mailOptions);
};

// OTP verification
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await otpModel.findOne({ email });

        if (!otpRecord) {
            return res.json({ success: false, message: 'No OTP sent to this email' });
        }

        if (otpRecord.otp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        const user = await userModel.findOne({ email });
        const token = createToken(user._id);

        await otpModel.deleteOne({ email });

        res.json({ success: true, message: "User logged in successfully", token: token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error verifying OTP' });
    }
};

// Helper function to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "20h" });
};

// Register user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existEmail = await userModel.findOne({ email });
        if (existEmail) {
            return res.json({ success: false, message: 'User already exists' });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        // Ensure strong password
        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters long' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        // Create JWT token
        const token = createToken(user._id);
        res.json({ success: true, message: "User created successfully", token: token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error occurred during registration' });
    }
};

