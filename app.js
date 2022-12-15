require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
const port = process.env.EXPRESS_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const userHandlers = require("./userHandlers");
const { validateMovie, validateUser } = require("./validators.js");
const movieHandlers = require("./movieHandlers");
const { hashPassword, verifyPassword, verifyToken } = require("./auth");

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
); // /!\ login should be a public route
app.post("/api/users", validateUser, hashPassword, userHandlers.postUser);
app.get("/api/users", userHandlers.getUser);
app.get("/api/users/:id", userHandlers.getUserById);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
// then the routes to protect
app.use(verifyToken); // authentication wall : verifyToken is activated for each route after this line

app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.post("/api/movies", validateMovie, movieHandlers.postMovie);
//app.post("/api/movies", validateMovie, verifyToken, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/users/:id", userHandlers.deleteUser);
app.put("/api/users/:id", validateUser, userHandlers.updateUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
