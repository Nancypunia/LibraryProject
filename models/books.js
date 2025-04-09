const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  category: String,
  isBorrowed: { type: Boolean, default: false },
  borrowedBy: String,         // username or userId
  borrowDate: Date,
  returnDate: Date
});

module.exports = mongoose.model("Book", bookSchema);
