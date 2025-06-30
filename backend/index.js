const express = require("express");
const dotenv = require("dotenv").config();
const db = require("./config/db.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const router=require('./routes/authRoute.js')
const note=require('./routes/note.js')
const app = express();
const cookieParser = require("cookie-parser");


// Connect to DB
db();

  
  
// Middleware
app.use(cors({
  origin: ["http://localhost:3000",'https://noteleaf.netlify.app'], // or replace with actual frontend origin
  credentials: true,
}));

app.use(express.json()); 
app.use(bodyParser.json());
app.use(cookieParser());



app.use('/auth',router)
app.use('/api',note);







// Start server
app.listen(process.env.PORT, () => {
  console.log("server is running on port", process.env.PORT);
});












  
  
