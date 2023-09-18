const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Indiquez le répertoire où vous souhaitez stocker les fichiers
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nommez les fichiers téléchargés
    }
  });
  
  const upload = multer({ storage: storage });

// Middleware pour authentifier les utilisateurs
router.use(authMiddleware.authenticateUser);

// Routes pour les livres
router.post('/', upload.single('file'), bookController.createBook);
router.put('/:id', bookController.updateBookById);
router.delete('/:id', bookController.deleteBookById);
router.post('/:id/rating', upload.single('file'), bookController.rateBook);

module.exports = router;


