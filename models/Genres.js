const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 3, maxLength: 255 },
});

const Genre = mongoose.model("Genre", schema);

const validate = (genre) => {
  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
  });
  return schema.validate(genre);
};




exports.Genre = Genre;
exports.validateGenre = validate;
exports.genreSchema = schema;
