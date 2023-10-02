const express = require("express");
const {Genre, validateGenre} = require('../../models/Genres/Genres.js')
const Router = express.Router();
const auth = require("../../middleware/auth")

Router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("genre not found");
    res.send(genre);
  } catch (error) {
    res.send("invalid ID");
  }

  
});

Router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("title");
  if (!genres) return res.status(404).send("genres not found");
  res.send(genres);
});

Router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  error && res.send(error.message);
  let genre = new Genre({
    title: req.body.title,
  });
  genre = await genre.save();
  res.send(genre);
});

Router.put("/:id", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  error && res.send(error.message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    new: true,
  });
  !genre && res.status(404).send("genre not Found");

  res.send(genre);
});

Router.delete("/:id",auth, async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("course not found");
  res.send(genre);
});

module.exports = Router;
