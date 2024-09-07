const users = require("../models/User");
const userotp = require("../models/Otp");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');

// email config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


exports.userregister = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ error: "Please Enter All Input Data" })
    }

    try {
        const presuer = await users.findOne({ email: email });

        if (presuer) {
            res.status(400).json({ error: "This User Already exists" })
        } 
        else {
            const userregister = new users({
                name, email, password
            });

            const storeData = await userregister.save();
            res.status(200).json(storeData);
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }

};



// user send otp
exports.userOtpSend = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" })
    }


    try {
        const presuer = await users.findOne({ email: email });

        if (presuer) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existEmail = await userotp.findOne({ email: email });


            if (existEmail) {
                const updateData = await userotp.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: OTP
                }, { new: true }
                );
                await updateData.save();

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "OTP verification",
                    html: `
                        <html>
                            <head>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f4f4f4;
                                        padding: 20px;
                                    }
                                    .container {
                                        background-color: #fff;
                                        border-radius: 5px;
                                        padding: 20px;
                                        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
                                    }
                                    h2 {
                                        color: #333;
                                    }
                                    p {
                                        color: #666;
                                    }
                                    .otp {
                                        font-size: 24px;
                                        font-weight: bold;
                                        color: #007bff;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h2>OTP Verification</h2>
                                    <p>Hi,</p>
                                    <p>Your OTP for verification is:</p>
                                    <p class="otp">${OTP}</p>
                                </div>
                            </body>
                        </html>
                    `
                };


                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })

            } else {

                const saveOtpData = new userotp({
                    email, otp: OTP
                });

                await saveOtpData.save();
                
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "OTP verification",
                    html: `
                        <html>
                            <head>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f4f4f4;
                                        padding: 20px;
                                    }
                                    .container {
                                        background-color: #fff;
                                        border-radius: 5px;
                                        padding: 20px;
                                        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
                                    }
                                    h2 {
                                        color: #333;
                                    }
                                    p {
                                        color: #666;
                                    }
                                    .otp {
                                        font-size: 24px;
                                        font-weight: bold;
                                        color: #007bff;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h2>OTP Verification</h2>
                                    <p>Hi,</p>
                                    <p>Your OTP for verification is:</p>
                                    <p class="otp">${OTP}</p>
                                </div>
                            </body>
                        </html>
                    `
                };
                
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } 
                    else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })
            }
        } else {
            res.status(400).json({ error: "This User Not Exist In our Db" })
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
};

exports.userLogin = async (req, res) => {
    const { email, password, otp } = req.body; 

    if (!email || !password || !otp) { 
        return res.status(400).json({ error: "Please provide email, password, and OTP" });
    }

    try {
        const otpverification = await userotp.findOne({ email: email });

        if (!otpverification) {
            return res.status(400).json({ error: "OTP not found for this email" });
        }

        if (otpverification.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        const preuser = await users.findOne({ email: email });

        if (!preuser) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, preuser.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = await preuser.generateAuthtoken();
        return res.status(200).json({ message: "User Login Successfully Done", userToken: token });
    } catch (error) {
        console.error("Error during login:", error); 
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};

