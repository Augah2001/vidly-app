const express = require("express");
const { Customer, validate } = require("../models/Customers.js");
const auth = require("../middleware/authorize.js");
const asyncMiddleware = require("../middleware/async.js");

const Router = express.Router();

Router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const customers = await Customer.find().sort("name");
    if (!customers) return res.status(404).send("no customers found");
    res.send(customers);
  })
);

Router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) return res.status(404).send("customer not found");
      res.send(customer);
    } catch (error) {
      console.log(error.message);
      res.send("bad request");
    }
  })
);

Router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send(error.message);

    let customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });

    customer = await customer.save();
    res.send(customer);
  })
);

Router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.message);

  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    },
    {new:true});

    if (!customer) return res.status(404).send("customer not found");

    res.send(customer);
  } catch (error) {
    res.status(400).send("bad request");
    console.log(error.message);
  }
});

Router.delete(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id);
      if (!customer) return res.status(404).send("customer not found");
      res.send(customer);
    } catch (error) {
      res.status(400).send("bad request");
      console.log(error.message);
    }
  })
);

module.exports = Router;
