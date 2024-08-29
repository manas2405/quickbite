const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

exports.userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please provide both email and password"})
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({success : false});
    }
}
exports.userRegister = async (req, res) => {
    try {
        const { name, location, email, password, date } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide both email and password" });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            location,
            email,
            password: hashedPassword,
            date
        });

        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}