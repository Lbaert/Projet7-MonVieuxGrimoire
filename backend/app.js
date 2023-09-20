const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../backend/config/db');
const authRoutes = require('../backend/routes/authRoutes');
const bookRoutes = require('../backend/routes/bookRoutes');
const bookRoutesSecure = require('../backend/routes/bookRoutesSecure');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet({crossOriginEmbedderPolicy: false }));
app.use(helmet({crossOriginResourcePolicy: {policy: "same-site"} }));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use book routes without authentication middleware
app.use('/api/books', bookRoutes);

// Use book routes with authentication middleware 
app.use('/api/books', bookRoutesSecure);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
