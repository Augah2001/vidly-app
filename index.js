const express = require("express");
const Genres = require("./Routes/Genres/Genres.js");
const Home = require("./Routes/Home/Home.js");
const Customers = require('./Routes/Customers/Customers.js')
const Movies = require('./Routes/Movies/movies.js')
const Rentals = require('./Routes/Rentals/rentals.js')
const Users = require('./Routes/Users/users.js')
const Auth = require('./Routes/Auth/auth.js')


const mongoose = require("mongoose");

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


app.listen(2000, () => {
  console.log("listening to port 2000");
});
