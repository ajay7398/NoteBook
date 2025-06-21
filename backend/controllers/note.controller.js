const Note = require("../models/note.model.js");
const User = require("../models/user.model.js");

const fetchNote = async (req, res) => {
  try {
    const { userId } = req;
    const currentUser = await User.findById(userId);
 const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
      res.status(200).json({
        notes: notes,
        username: currentUser.username,
      });
  
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

const removeNote = async (req, res) => {
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
};

const markNote = async (req, res) => {
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
};

const updateNote = async (req, res) => {
  try {
    const { text, id } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { text: text },
      { new: true }
    );
    res.status(200).json({ message: "Note status updated", updatedNote });
  } catch (error) {
    res.status(500).json({ error: "Failed to update note" });
  }
};

module.exports = { updateNote, markNote, fetchNote, removeNote };
