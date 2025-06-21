const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const Note =require('../models/note.model.js')

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
       
    const token=jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

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


const createNote = async (req, res) => {
  const { text, complete } = req.body;

  try {
    const {userId} = req; // make sure user is authenticated and `req.user` is set

    const existing = await Note.findOne({ text, user: userId });
    if (existing) {
      return res.status(400).json({ message: "Note already exists for this user" });
    }

    const newNote = new Note({ text, complete, user: userId });
    await newNote.save();

    res.status(201).json({ message: "Note created", note: newNote });
  } catch (err) {
    console.error("Error saving note:", err);
    res.status(500).json({ error: "Failed to save note" });
  }
}

module.exports = { loginController, signupController,Logout,createNote };
