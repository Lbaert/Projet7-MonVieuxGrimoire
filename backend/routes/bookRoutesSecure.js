const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("../middlewares/multer");

// Middleware pour authentifier les utilisateurs
router.use(authMiddleware.authenticateUser);

// Routes pour les livres
router.post("/", multer, bookController.createBook);
router.put("/:id", bookController.updateBookById);
router.delete("/:id", bookController.deleteBookById);
router.post("/:id/rating", bookController.rateBook);

module.exports = router;
