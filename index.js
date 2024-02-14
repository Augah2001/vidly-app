const express = require("express");
const Genres = require("./Routes/Genres.js");
const Home = require("./Routes/Home.js");
const Customers = require('./Routes/Customers.js')
const Movies = require('./Routes/movies.js')
const Rentals = require('./Routes/rentals.js')
const Users = require('./Routes/users.js')
const Auth = require('./Routes/auth.js')
const config = require('config')
const winston = require('winston')


const {logger} = require('./middleware/error.js')



process.on('uncaughtException', (error)=> {
  logger.error(error.message, error)
  console.log('we got an exception')

})

process.on('unhandledRejection', (error)=> {
  logger.error(error.message, error)
  console.log('unhandled rejection')
})



const mongoose = require("mongoose");
const {error} = require("./middleware/error.js");


const p = Promise.reject(new Error('something went wrong'))
p.then(()=> {})

mongoose
  .connect("mongodb://127.0.0.1:5000/vidly", { useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=> console.log("connected to database port 5000"))
  .catch((err) => console.log(err));


  

  



const app = express();
app.use(express.json());
app.use("/api/genres/", Genres);
app.use("/", Home);
app.use("/api/customers", Customers)
app.use('/api/movies', Movies)
app.use('/api/rentals', Rentals)
app.use('/api/users', Users)
app.use('/api/auth', Auth)

app.use(error)

if (!config.get("jwtPrivateKey")) {
  console.error('fatal error: jwtPrivatekey is not defined')
  process.exit(1)
}


app.listen(config.get('PORT'), () => {
  console.log(`listening to port ${config.get('PORT')}`);
});
module.exports.logger = logger