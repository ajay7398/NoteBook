const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./config/db.js");
const Note = require("./models/note.model.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const router=require('./routes/authRoute.js')
const app = express();
const cookieParser = require("cookie-parser");
const verifyToken = require("./middlewares/auth.middleware.js");
app.use(express.json()); // This line is enough in most modern cases

// Connect to DB
db();

  
  
// Middleware
app.use(cors({
  origin: "http://localhost:3000", // or replace with actual frontend origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(bodyParser.json());
app.use(cookieParser());



app.use('/auth',router)
// Start server
app.listen(process.env.PORT, () => {
  console.log("server is running on port", process.env.PORT);
});

// Create Note
app.post("/note", async (req, res) => {
  const { text, complete } = req.body;

  try {
    // Check for duplicates
    const existing = await Note.findOne({ text });
    if (existing) {

      return res.status(400).json({ message: " already exists" });
    }

    const newNote = new Note({ text, complete });
    await newNote.save();

    res.status(201).json({ message: "Note created" });
  } catch (err) {
    console.error("Error saving note:", err);
    res.status(500).json({ error: "Failed to save note" });
  }
});



// Get all notes
app.get("/note", (req, res) => {

  Note.find()
    .then((notes) => {
    
      res.status(200).json(notes);
    })
  
    .catch((err) => {
      console.error("Error fetching notes:", err);
      res.status(500).json({ error: "Failed to fetch notes" });
    });
});

// delete note
app.delete("/delete", async (req, res) => {
  try {
    const { note } = req.body;
    const deleted = await Note.deleteOne({ text: note });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (error) {
    console.log("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});



// Update complete status by text
app.put('/update', async (req, res) => {
  const { id } = req.body;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.complete = !note.complete; // toggle complete
   
    console.log("After toggle:", note.complete);
    await note.save();

    res.status(200).json({ message: "Note status updated", note });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});


app.put('/note',async(req,res)=>{
  try {
    const {text,id}=req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { text: text },
      { new: true }
    );
    res.status(200).json({ message: "Note status updated", updatedNote });
  } catch (error) {
    res.status(500).json({ error: "Failed to update note" });
  }

  
  
})
