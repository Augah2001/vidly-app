const express = require("express");
const {Genre, validateGenre} = require('../models/Genres.js')
const Router = express.Router();
const auth = require("../middleware/authorize.js")
const admin = require('../middleware/admin.js')
const asyncMiddleware = require('../middleware/async.js');
const error = require("../middleware/error.js");







Router.get("/:id", asyncMiddleware( async(req, res) => {
  
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("genre not found");
    res.send(genre);
   
  
}));

Router.get("/", asyncMiddleware(async (_, res) => {
  throw new Error('something wrong')
  const genres = await Genre.find().sort("title");
  if (!genres) return res.status(404).send("genres not found");
  res.send(genres);
}));

Router.post("/", [auth, admin], asyncMiddleware(async (req, res) => {
  const { error } = validateGenre(req.body);
  error && res.send(error.message);
  let genre = new Genre({
    title: req.body.title,
  });
  genre = await genre.save();
  res.send(genre);
}));

Router.put("/:id", auth, asyncMiddleware(async (req, res) => {
  const { error } = validateGenre(req.body);
  error && res.send(error.message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    $set: {
      title: req.body.title,
    new: true,
  }
  });
  !genre && res.status(404).send("genre not Found");

  res.send(genre);
}));

Router.delete("/:id",auth, asyncMiddleware(async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("course not found");
  res.send(genre);
}));

module.exports = Router;
