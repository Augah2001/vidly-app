const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 255,
      },
      phone: { type: Number, required: true, min: 9 },
    }),
  },

  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        trim: true,
      },

      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
      },
    }),
  },
  DateOut: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  DateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model("Rental", schema);

const validate = (rental) => {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });

  return schema.validate(rental);
};

exports.validateRental = validate;
exports.Rental = Rental;




