let books = [
    { title: "Learn C++", category: "Basic" },
    { title: "DBMS Concepts", category: "IT" },
    { title: "Operating Systems", category: "CSE" },
    { title: "Data Structures", category: "ISE" },
    { title: "Love & Loss", category: "Novel" },
    { title: "Harry Potter", category: "Fantasy" }
  ];
  
  function displayBooks(filter) {
    const bookContainer = document.getElementById("Books");
    bookContainer.innerHTML = "";
  
    books
      .filter(book => filter === "all" || book.category === filter)
      .forEach(book => {
        let bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
          <h3>${book.title}</h3>
          <p>${book.category}</p>
          <button onclick="borrowBook('${book.title}')">Borrow</button>
        `;
        bookContainer.appendChild(bookCard);
      });
  }
  
  function borrowBook(title) {
    alert(`You have borrowed "${title}"`);
  }
  
  function filterProduct(category) {
    displayBooks(category);
  }
  
  document.getElementById("search").addEventListener("click", () => {
    let value = document.getElementById("search-input").value.toLowerCase();
    let filtered = books.filter(b => b.title.toLowerCase().includes(value));
    const bookContainer = document.getElementById("Books");
    bookContainer.innerHTML = "";
  
    filtered.forEach(book => {
      let bookCard = document.createElement("div");
      bookCard.classList.add("book-card");
      bookCard.innerHTML = `
        <h3>${book.title}</h3>
        <p>${book.category}</p>
        <button onclick="borrowBook('${book.title}')">Borrow</button>
      `;
      bookContainer.appendChild(bookCard);
    });
  });
  
  // Initial render
  window.onload = () => displayBooks("all");
  