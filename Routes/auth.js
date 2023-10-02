require('dotenv').config({path:'config.env'})
const config = require('config')
const jwt = require('jsonwebtoken')
const Joi = require('joi');
const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt')
const {User} = require('../models/Users')
const auth = require("../middleware/auth")





Router.post('/',auth,  async (req,res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).json({message: error.message})
    let user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).json({message: 'invalid username or password'})

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    console.log(validPassword)
    if (!validPassword) return res.status(400).json({message: "invalid username or password"})


    const token = user.generateAuthToken()
    console.log(config.get('jwtPrivateKey'))
    res.send(token)
        
     
    

     


    

    


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