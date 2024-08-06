const express = require("express"); // Express framework for creating the web server
const sqlite3 = require("sqlite3").verbose(); // SQLite3 library for database operations
const { open } = require("sqlite"); // SQLite library for async database operations
/*
open from sqlite: A utility to open SQLite databases with async support.
*/

const app = express(); // Create an Express application
const PORT = process.env.PORT || 3000;
let db; // Variable to hold the database connection

// Connect to SQLite database
/*
This IIFE (Immediately Invoked Function Expression) asynchronously opens a connection to the SQLite database and assigns it to the db variable.
*/
(async () => {
  // Open a connection to the SQLite database
  db = await open({ filename: "database.sqlite", driver: sqlite3.Database });
  if (db) console.log("Connected to the SQLite database.");
})();
// Root endpoint for testing the server
app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.1 CW - SQL Queries & async/await" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*self notes for concept and revision:

async and await:
async/await: Keywords used to handle asynchronous operations. async is used to declare an asynchronous function, and await is used to wait for a promise to resolve.
- `async` keyword before a function declaration makes the function return a Promise.
- `await` keyword inside an async function pauses the execution until the Promise is resolved.


async:
Declares an asynchronous function.
Allows the use of await inside the function.
Returns a promise, implicitly or explicitly
async function fetchData() {
  // Asynchronous code here
}

await:
Can only be used inside async functions.
Pauses the execution of the async function until the promise is resolved or rejected.
Returns the resolved value of the promise or throws an error if the promise is rejected.
async function fetchData() {
  let response = await fetch('https://abc.xyz.com/data');
  let data = await response.json();
  return data;
}

async (req, res):

This is an asynchronous function that takes req (request) and res (response) as parameters.
The async keyword before a function makes the function return a promise. Within this function, you can use the await keyword to wait for promises to be resolved.
Example:

app.get('/example', async (req, res) => {
  // This is an async function that can use await
  let data = await someAsyncFunction();
  res.status(200).json(data);
})

Database Queries:

db.all(query, params):
Runs a SQL query and returns all matching rows.
query: The SQL query string.
params: An array of parameters to replace the placeholders in the query.
let query = 'SELECT * FROM movies WHERE genre = ?';
let response = await db.all(query, ['Action']);
// response will be an array of all rows matching the query


db.get(query, params):
Runs a SQL query and returns a single row.
query: The SQL query string.
params: An array of parameters to replace the placeholders in the query.
let query = 'SELECT * FROM movies WHERE id = ?';
let response = await db.get(query, [1]);
// response will be a single row matching the query

SQL Query Placeholders:
- The question mark (`?`) in the SQL query is a placeholder for a parameter. The actual value is provided in the `params` array.


Request Parameters (req.params) and Query Parameters (req.query):


req.params:
Used to access route parameters.
Route parameters are part of the URL and are defined in the route path.
Example: In the route /movies/genre/:genre, :genre is a route parameter.
app.get('/movies/genre/:genre', (req, res) => {
  let genre = req.params.genre;
  // genre will contain the value passed in the URL
});


req.query:
Used to access query parameters.
Query parameters are part of the URL after the ? symbol and are key-value pairs.
Example: In the URL /movies?genre=Action, genre is a query parameter.
app.get('/movies', (req, res) => {
  let genre = req.query.genre;
  // genre will contain the value passed as a query parameter
});

*/

/*
Exercise 1: Fetch all movies

Create an endpoint /movies that fetches all the movies from the database.

API Call

http://localhost:3000/movies

Expected Output

// You'll get all the movies in the database in the format
// { movies: [...] }
*/

// fucntion to fetch all movies from the database
async function fetchAllMovies() {
  let query = "SELECT * FROM movies";
  let response = await db.all(query, []);
  return { movies: response };
}
// Endpoint to fetch all movies from db
app.get("/movies", async (req, res) => {
  let result = await fetchAllMovies();
  res.status(200).json(result);
});

/*
Exercise 2: Fetch all movies by genre

Create an endpoint /movies/genre/:genre that fetches movies based on genre from the database.

API Call

http://localhost:3000/movies/genre/Biography

Expected Output

{
  movies: [
    {
      id: 1,
      title: 'Dangal',
      director: 'Nitesh Tiwari',
      genre: 'Biography',
      release_year: 2016,
      rating: 4.8,
      actor: 'Aamir Khan',
      box_office_collection: 220,
    },
    {
      id: 6,
      title: 'Sanju',
      director: 'Rajkumar Hirani',
      genre: 'Biography',
      release_year: 2018,
      rating: 4.4,
      actor: 'Ranbir Kapoor',
      box_office_collection: 120,
    },
  ],
}
*/

// function to fetch movies by genre from the database

async function fetchMoviesByGenre(genre) {
  let query = "SELECT * FROM movies Where genre = ?";
  let response = await db.all(query, [genre]); // Execute the query with the genre parameter
  return { movies: response };
}

// Endpoint to fetch movies by genre from db
app.get("/movies/genre/:genre", async (req, res) => {
  let genre = req.params.genre; // fetch genre from req parameter
  let result = await fetchMoviesByGenre(genre);
  res.status(200).json(result);
});

/*
Exercise 3: Fetch movie details by ID

Create an endpoint /movies/details/:id that fetches movies based on id from the database.

API Call

http://localhost:3000/movies/details/3

Expected Output

{
  movie: {
    id: 3,
    title: 'PK',
    director: 'Rajkumar Hirani',
    genre: 'Comedy',
    release_year: 2014,
    rating: 4.6,
    actor: 'Aamir Khan',
    box_office_collection: 140,  
  }
}
*/

// fuunction to fetch movie details by id from the database
async function fetchMoviesByID(id) {
  let query = "SELECT * FROM movies WHERE id = ?";
  let response = await db.all(query, [id]);
  return { movies: response };
}

// Endpoint to fetch movie details by id from db
app.get("/movies/details/:id", async (req, res) => {
  let id = req.params.id; // fetch id from req parameter
  let result = await fetchMoviesByID(id);
  res.status(200).json(result);
});

/*
Exercise 4: Fetch movie details by release_year

Create an endpoint /movies/release_year/:year that fetches movies based on release_year from the database.

API Call

http://localhost:3000/movies/release_year/2016

Expected Output

{
  movies: [
    {
      id: 1,
      title: 'Dangal',
      director: 'Nitesh Tiwari',
      genre: 'Biography',
      release_year: 2016,
      rating: 4.8,
      actor: 'Aamir Khan',
      box_office_collection: 220,
    },
    {
      id: 5,
      title: 'Sultan',
      director: 'Ali Abbas Zafar',
      genre: 'Drama',
      release_year: 2016,
      rating: 4.3,
      actor: 'Salman Khan',
      box_office_collection: 120,
    },
  ],
}
*/

// function to fetch movies by release_year from the database
async function fetchMoviesByRealeaseYear(year) {
  let query = "SELECT * FROM movies WHERE release_year = ? ";
  let response = await db.all(query, [year]);
  return { movies: response };
}

// Endpoint to fetch movies by release_year from db
app.get("/movies/release_year/:release_year", async (req, res) => {
  let release_year = req.params.release_year; // fetch release_year from req parameter
  let result = await fetchMoviesByRealeaseYear(release_year);
  res.status(200).json(result);
});
