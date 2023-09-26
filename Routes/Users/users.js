const _ = require('lodash');
const {User} = require('../../models/Users/Users.js');
const {validateUser} = require('../../models/Users/Users.js')
const express = require('express');
const Router = express.Router();


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
    user = new User(req.body)
    const result = await user.save()
    res.json(_.pick(result, ['_id', 'name', 'email']))


})

Router.put('/:id', async (req,res) => {
    const {error} = validateUser(req.body)
    if (error) return res.status(400).json({message: error.message})
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!user) return res.status(400).json({message: 'user not found'})
    res.json(user)
})
Router.delete('/:id', async (req,res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    if (!user) return res.status(400).json({message: 'user not found'})
    res.json(user)
})

module.exports = Router