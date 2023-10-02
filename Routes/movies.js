const express = require("express");
const { validateMovie } = require("../models/movies.js");
const { Movie } = require("../models/movies.js");
const { Genre } = require("../models/Genres.js");
const auth = require("../middleware/authorize.js")

const Router = express.Router();

Router.get("/", async (req, res) => {
  const movies = await Movie.find();
  if (!movies) return res.status(404).send("Movies not found");
  res.send(movies);
});



Router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

Router.post("/", auth,async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.send(error.message);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Genre not found");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      title: genre.title,
      _id: genre.id,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  const result = movie.save();
  
  res.send(movie);
});

Router.put("/:id", auth, async (req, res) => {
   
   const { error } = validateMovie(req.body);
   if (error) return res.send(error.message);

   const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new:true})

   if (!movie) return res.status(404).send('Movie not found')
    

   res.send(movie);
});

Router.delete("/:id", auth,  async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

module.exports = Router;
