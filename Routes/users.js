const auth = require('../middleware/auth')
const _ = require('lodash');
const {User} = require('../models/Users.js');
const {validateUser} = require('../models/Users.js')
const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt')

Router.get('/me', auth, async (req,res) => {

    const user = await User.findById(req.user._id).select('-password')
    res.json(user)


})


Router.get('/', async (_,res) => {

    const users = await User.find({}).sort({"_id": 1});
    if (!users) return res.status(400).json({message: 'user not found'})
    res.status(200).json(users)

})

Router.get('/:id', async (req,res) => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(400).json({message: 'No user found'})
    res.status(200).json(user)
       
 })

Router.post('/', async (req,res) => {
    const {error} = validateUser(req.body)
    if (error) return res.status(400).json({message: error.message})
    let user = await User.findOne({email: req.body.email})
    if (user) return res.status(400).json({message: 'User already exists'})
    user = new User(_.pick(req.body, ['name', 'username', 'password', 'email']));
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(user.password,salt)
    user.password = hashedpassword
    await user.save()

    const token = user.generateAuthToken()


    res.header("x-auth-token", token).json(_.pick(user, ['name', 'username', 'email']))
    

    


})

Router.put('/:id',auth ,async (req,res) => {
    const {error} = validateUser(req.body)
    if (error) return res.status(400).json({message: error.message})
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!user) return res.status(400).json({message: 'user not found'})
    res.json(user)
})
Router.delete('/:id', auth,async (req,res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    if (!user) return res.status(400).json({message: 'user not found'})
    res.json(user)
})

module.exports = Router