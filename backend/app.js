const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../backend/config/db');
const authRoutes = require('../backend/routes/authRoutes');
const bookRoutes = require('../backend/routes/bookRoutes');
const bookRoutesSecure = require('../backend/routes/bookRoutesSecure');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

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
