const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const fs = require('fs');

public_users.post("/register", (req,res) => {
  //Write your code here
  //Write the authenication mechanism here
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password) {
    return res.status(200).json({message: 'Username or password missing'});
  }
  if(isValid(username)) {
    users.push({username, password});
    return res.status(200).send('User Successfully registered.');
  } else {
    return res.status(200).send({message: 'User already exist.'});
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here

  axios.get('https://raw.githubusercontent.com/Johnhernan/expressBookReviews/main/final_project/router/booksdb.json')
    .then(response => {
      const bookResponse = response.data;
      if(!bookResponse) throw {message: "No books found."}
      return res.status(200).json(bookResponse);
    })
    .catch(err => {
      return res.status(200).json(err);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let match = books[isbn];

  if (!match) return res.status(200).json(err);

  return res.status(200).json(match);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;

  if (typeof author === 'string') {
    author = author
        .replaceAll('%20', ' ')
        .replaceAll('+', ' ')
  }else return res.status(400).json({message: "Invalid params"});

  axios.get('https://raw.githubusercontent.com/Johnhernan/expressBookReviews/main/final_project/router/booksdb.json')
      .then(response=> {
        let matches = [];
        for (const [key, value] of Object.entries(books)) {
          if(value.author === author) matches.push(value);
        }
        if (matches.length > 0) {
          return res.status(200).json(response);
        }
        return res.status(200).json({message: 'No books found'});

      })
      .catch((err) => {
        return res.json(err)
      })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;

  if (typeof title === 'string') {
    title = title
        .replaceAll('%20', ' ')
        .replaceAll('+', ' ')
  }else return res.status(400).json({message: "Invalid params"});

  axios.get('https://raw.githubusercontent.com/Johnhernan/expressBookReviews/main/final_project/router/booksdb.json')
      .then(response=> {
        let matches = [];
        for (const [key, value] of Object.entries(books)) {
          if(value.title === title) matches.push(value);
        }
        if (matches.length > 0) {
          return res.status(200).json(response);
        }
        return res.status(200).json({message: 'No books found'});

      })
      .catch((err) => {
        return res.json(err)
      })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  axios.get('https://raw.githubusercontent.com/Johnhernan/expressBookReviews/main/final_project/router/booksdb.json')
      .then(response=> {
        let match = response[isbn];

        if (!match) return res.status(200).json({message: "No reviews"});

        return res.status(200).json(match.reviews);
      })
      .catch((err) => {
        return res.json(err)
      })

});

module.exports.general = public_users;
