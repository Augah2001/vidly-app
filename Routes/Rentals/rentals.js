const Joi = require("joi");
const { Rental } = require("../../models/Rentals/rentals.js");
const validateRental = require("../../models/Rentals/rentals.js");
const express = require("express");
const { Customer } = require("../../models/Customers/Customers.js");
const { Movie } = require("../../models/Movies/movies.js");
const fawn = require('fawn')

const Router = express.Router();
fawn.init(mongoose)

Router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");
  if (!rental) return res.status(400).send("invalid request");
  res.send(rental);
});

Router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send("invalid Request");
  const customer = Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Request");
  const movie = Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Request");

  const rental = new Rental({
    customer: {
        _id: customer.id,
        name: customer.name,
        phone: customer.phone,
    },
    movie: {
        _id: movie.id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate


    }
  })
   const session = await mongoose.startSession();

   try {
      session.startTransaction();
      const result = await rental.save({session});
      await movie.updateOne({$inc : {numberInStock: -1}}, {session});
      session.commitTransaction();
      res.send(result)
      
   } catch (error) {
      console.log(error.message);
      session.abortTransaction();
    
   } finally {
    session.endSession();
   }

    

});
