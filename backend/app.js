const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../backend/config/db');
const authRoutes = require('../backend/routes/authRoutes');
const bookRoutes = require('../backend/routes/bookRoutes');
const bookRoutesSecure = require('../backend/routes/bookRoutesSecure');
require('dotenv').config();
const multer = require('multer');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('../uploads', express.static('uploads'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads'); // Indiquez le répertoire où vous souhaitez stocker les fichiers
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nommez les fichiers téléchargés
  }
});

const upload = multer({ storage: storage });

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
