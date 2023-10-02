const mongoose = require('mongoose');
const Joi = require('joi')
const config = require('config')
const jwt = require('jsonwebtoken')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 255,
        minLength: 5
    },
    name: {
        type: String,
        required: true,
        maxLength: 255,
        minLength: 5

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        maxLength: 1000,
        minLength: 5
    },
    isAdmin: Boolean
})

schema.methods.generateAuthToken = function () {
    const token =  jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
    return token
}

const User = mongoose.model('User', schema)





const validate = (user) => {
    const schema = Joi.object({
        email: Joi.string().required().min(5).max(255).email(),
        username: Joi.string().required().min(5).max(255),
        password: Joi.string().min(5).max(255).required(),
        name: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean().required()

    })

    return schema.validate(user)
    
}

exports.validateUser = validate
exports.User = User