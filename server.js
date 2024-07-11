
require('dotenv').config();

const express = require('express');

const app = express();

const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json())

const port = process.env.PORT || 8000;

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(port, ()=>{
  console.log(`Server is live on port ${port}`)
})