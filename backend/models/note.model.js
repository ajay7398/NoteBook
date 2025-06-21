const mongoose = require("mongoose"); // ✅ correct spelling

const noteSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  complete: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

const noteModel = mongoose.model("note", noteSchema);

module.exports = noteModel;
