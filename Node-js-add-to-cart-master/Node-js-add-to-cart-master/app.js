const express = require('express');
const app = express();
const path = require('path');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Dummy data for now (replace with DB later)
const books = [
  { id: '1', title: 'Clean Code' },
  { id: '2', title: 'Harry Potter' },
];
const history = [];

app.get('/borrow/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 14); // 14 days return policy

  history.push({
    id: book.id,
    title: book.title,
    borrowDate: new Date().toLocaleDateString(),
    returnDate: returnDate.toLocaleDateString(),
    returned: false
  });

  res.render('borrow', { book, returnDate: returnDate.toLocaleDateString() });
});

app.get('/return', (req, res) => {
  res.render('return');
});

app.post('/return', (req, res) => {
  const { bookId } = req.body;
  const entry = history.find(h => h.id === bookId);
  if (entry) entry.returned = true;
  res.redirect('/history');
});

app.get('/history', (req, res) => {
  res.render('history', { history });
});
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Add login logic here (database check or mock for now)
  res.redirect('/');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  // Add signup logic here (store in DB or mock data)
  res.redirect('/login');
});

