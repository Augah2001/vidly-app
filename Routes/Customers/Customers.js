const express = require('express')
const {Customer, validate} = require('../../models/Customers/Customers.js')

const Router = express.Router()




Router.get('/', async (req,res) => {
    const customers = await Customer.find().sort('name') 
    if (!customers) return res.status(404).send('no customers found')
    res.send(customers)
})

Router.get('/:id', async (req,res) => {
    
    try {
        const customer = await Customer.findById(req.params.id)
        if (!customer) return res.status(404).send('customer not found')
        res.send(customer)
    }catch(error) {
        console.log(error.message)
        res.send('bad request')
    }

})

Router.post('/', async (req,res) => {
    const {error} = validate(req.body)
    if (error) return  res.send(error.message)

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })

    customer = await customer.save()
    res.send(customer)

Router.put('/:id', async (req, res) => {

    const {error} = validate(req.body)
    if (error) return res.send(error.message)

    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
          name: req.body.name,
          phone: req.body.phone,
          isGold: req.body.isGold,
        });

        if (!customer) return res.status(404).send("customer not found");

        res.send(customer);
    } catch (error) {
        res.status(400).send('bad request')
        console.log(error.message)
    }

    
})    
})


Router.delete('/:id', async (req,res) => {

    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).send("customer not found");
        res.send(customer);
    } catch (error) {
        res.status(400).send('bad request')
        console.log(error.message)
    }

    
})







module.exports = Router