const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

const getBooks = new Promise((resolve, reject) => {
  books? resolve(books) : reject(new Error('Can\'t get books '));
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getBooks.then(books => res.status(300).json(books)).catch(er => res.status(404).json(er));
});

const getBooksByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
  books? resolve(books[isbn]) : reject(new Error('Can\'t get book'));
})}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBooksByISBN(isbn).then(book => res.status(300).json(book)).catch(er => res.status(404).json(er));
 });
 
const getBooksByAuthor = (author) => {
  const booksByAuthor = []
  for (const book in books) {
    if (book.author === author) booksByAuthor.push(book);
  }
  return new Promise((resolve, reject) => {
  booksByAuthor? resolve(booksByAuthor) : reject(new Error('Can\'t get book'));
})}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBooksByAuthor(author).then(book => res.status(300).json(book)).catch(er => res.status(404).json(er));
});

const getBooksTitle = (title) => {
  const booksTitle = []
  for (const book in books) {
    if (book.title === title) booksTitle.push(book);
  }
  return new Promise((resolve, reject) => {
  booksTitle? resolve(booksTitle) : reject(new Error('Can\'t get book'));
})}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const author = req.params.author;
  getBooksTitle(title).then(book => res.status(300).json(book)).catch(er => res.status(404).json(er));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
