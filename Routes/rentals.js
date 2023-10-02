const auth = require("../middleware/authorize")
const { Rental } = require("../models/rentals.js");
const {validateRental} = require("../models/rentals.js");
const express = require("express");
const { Customer } = require("../models/Customers.js");
const { Movie } = require("../models/movies.js");
const mongoose = require('mongoose')



const Router = express.Router();


Router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");
  if (!rental) return res.status(400).send("invalid request");
  res.send(rental);
});

Router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental not found");
  res.send(rental);
});



Router.post("/", auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("customer not found");
  const movie =await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("movie not found");

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
  session.startTransaction();

   try {
      
      const result = await rental.save({session});
      await movie.updateOne({$inc : {numberInStock: -1}}, {session});
      await session.commitTransaction();
      res.send(result)
      
   } catch (error) {
      console.log(error.message);
       await session.abortTransaction();
      res.status(400).send('Transaction aborted')
      
    
   } finally {
    session.endSession();
   }
  } catch (error){
    console.error(error.message)
    res.status(500).send('internal server error')
  }
  
   

    

});


Router.put("/:id", auth,async (req, res) => {
   
  const { error } = validateRental(req.body);
  if (error) return res.send(error.message);

  const rental = await Rental.findByIdAndUpdate(req.params.id, req.body, {new:true})

  if (!rental) return res.status(404).send('Rental not found')
   

  res.send(rental);
});

Router.delete("/:id",auth, async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental) return res.status(404).send("Rental not found");
  res.send(rental);
});





module.exports = Router;
