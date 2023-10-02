const express = require('express')
const Router = express.Router()

const genres = [
  {
    id: 1,
    title: "wonderWoman",
    year: "2018",
  },
  {
    id: 2,
    title: "Iron Man",
    year: 2007,
  },
];

Router.get('/',(req,res)=>{
    res.send(genres)
})

module.exports = Router