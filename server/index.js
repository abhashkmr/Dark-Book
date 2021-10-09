const express = require("express");
const morgan =require('morgan');
const helmet =require('helmet');
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require('./routes/users.js');
const authRoutes=require('./routes/auth');
const postRoutes=require('./routes/posts');



const app = express();
const url = process.env.DB_URL;
const port = process.env.PORT;


mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log("Database connected and Server is running on PORT: " + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/user",userRoutes);
app.use("/auth",authRoutes);
app.use("/posts",postRoutes);

