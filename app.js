const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const path = require("path");
const app = express();

// Model
const User = require("./models/User");

const books = [
  { id: "1", title: "Clean Code", category: "IT" },
  { id: "2", title: "Harry Potter", category: "Fantasy" },
  { id: "3", title: "The Alchemist", category: "Novel" },
  { id: "4", title: "Introduction to Algorithms", category: "CSE" },
  { id: "5", title: "Love Story", category: "Love" }
];

let history = [];

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/libraryDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session
app.use(session({
  secret: "secretlibrary",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/libraryDB" }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Auth Middleware
function isLoggedIn(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

// Routes
app.get("/", isLoggedIn, (req, res) => {
  res.render("index", { books });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.send("Invalid credentials");
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, email, password: hash });
    res.redirect("/login");
  } catch (err) {
    res.send("User already exists or error occurred");
  }
});

app.get("/borrow/:id", isLoggedIn, (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 14);

  history.push({
    id: book.id,
    title: book.title,
    borrowDate: new Date().toLocaleDateString(),
    returnDate: returnDate.toLocaleDateString(),
    returned: false
  });

  res.render("borrow", { book, returnDate: returnDate.toLocaleDateString() });
});

app.get("/return", isLoggedIn, (req, res) => {
  res.render("return");
});

app.post("/return", isLoggedIn, (req, res) => {
  const { bookId } = req.body;
  const entry = history.find(h => h.id === bookId);
  if (entry) entry.returned = true;
  res.redirect("/history");
});

app.get("/history", isLoggedIn, (req, res) => {
  res.render("history", { history });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
