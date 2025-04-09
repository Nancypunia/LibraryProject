const Book = require('./models/Book');

app.get("/seed-books", async (req, res) => {
  await Book.deleteMany({}); // clear existing books
  await Book.insertMany([
    { title: "Clean Code", category: "IT" },
    { title: "Harry Potter", category: "Fantasy" },
    { title: "The Alchemist", category: "Novel" },
    { title: "Love Story", category: "Love" }
  ]);
  res.send("✅ Sample books inserted successfully");
});
