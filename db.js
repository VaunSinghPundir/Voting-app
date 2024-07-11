require('dotenv').config();
const mongoose = require('mongoose');

const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL)
.then(()=>{
    console.log("connected to MongoDB server")
})
.catch((err) => {
    console.log("MongoDB connection error: ", err);
  });

const db = mongoose.connection;

db.on("connected", ()=>{
    console.log("connected to MongoDB server")
})
db.on("error", (err) => {
    console.log("MongoDB connection error: ", err);
  });
  
  db.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  module.exports = db;


