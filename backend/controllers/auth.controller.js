const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const transporter = require("../config/nodemailer.js");


const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({message:"all fields are required"})
        }
        const existingUser = await User.findOne({email});
        if (!existingUser){
          return res
            .status(400)
            .json({ message: "user does not exist " });
        }

        const isMatched = await bcrypt.compare(password, existingUser.password);
    if(!isMatched)return res.status(400).json({message:"invalid password"});
       
    const token=jwt.sign({id:existingUser._id},process.env.jwt_secret,{expiresIn:'1h'});
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log(token);
        res.status(200).json({token, user:existingUser, message: "loggedin successfully successfully" });
      } catch (error) {
        res.status(500).json({ message: "enternal server erorr" });
      }
};


const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists! Go to login page" });
    }

    const encryptpass = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: encryptpass });
    await user.save();

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    

    // Email send
    try {
      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Notebook",
        text: `Welcome to Notebook web site. Your account has been created successfully with email ID: ${email}`,
      };

      await transporter.sendMail(mailOption);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
    }

    res.status(200).json({ user, message: "Registered successfully" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const Logout=(req,res)=>{
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
  
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { loginController, signupController,Logout };
