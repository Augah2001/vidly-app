const jwt = require('jsonwebtoken')
const Joi = require('joi');
const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt')
const {User} = require('../../models/Users/Users')




Router.post('/', async (req,res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).json({message: error.message})
    let user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).json({message: 'invalid username or password'})

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    console.log(validPassword)
    if (!validPassword) return res.status(400).json({message: "invalid username or password"})

    try {
        const token =  await jwt.sign({_id: user._id}, 'mysecret')
        console.log(token)
        
     
    } catch (error) {
        console.log(error)
    } finally {
        res.send('wadii')
    }

     


    

    


})



const validate = (request) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email(),
        username: Joi.string().min(5).max(255),
        password: Joi.string().min(5).max(255).required(),

    }).xor('username', 'email')

    return schema.validate(request)
    
}

module.exports = Router