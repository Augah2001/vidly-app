const express = require("express");
const Genres = require("./Routes/Genres/Genres.js");
const Home = require("./Routes/Home/Home.js");
const Customers = require('./Routes/Customers/Customers.js')
const Movies = require('./Routes/Movies/movies.js')

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1/vidly")
  .then(console.log("connected"))
  .catch((err) => console.log(err));

  



const app = express();
app.use(express.json());
app.use("/api/genres/", Genres);
app.use("/", Home);
app.use("/api/customers", Customers)
app.use('/api/movies', Movies)

app.listen(2000, () => {
  console.log("listening to port 2000");
});
