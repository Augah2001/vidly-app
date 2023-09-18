const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255,
    minLength: 3,
  },
  phone: { type: Number,
     required: true,
     min: 10 },
  isGold: { type: Boolean,
     required: true,
      default: false },
});

const Customer = mongoose.model("Customer", schema);

const validate = (customer) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().required(),
    isGold: Joi.boolean().required(),
  });

  return schema.validate(customer);
};

exports.validate = validate;
exports.Customer = Customer;
