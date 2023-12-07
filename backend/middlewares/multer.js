const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
};

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const isValid = !!MIME_TYPES[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type");
    callback(error, isValid);
  },
});

module.exports = (req, res, next) => {
  upload.single("image")(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ message: "Invalid file format." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image provided." });
    }

    try {
      const { buffer, originalname } = req.file;

      // Log la taille de l'image avant la compression
      console.log("Taille de l'image avant compression:", buffer.length, "octets");
      
      const timestamp = Date.now();
      const ref = `${timestamp}-${originalname}.webp`;

      await sharp(buffer)
        .webp({ quality: 20 })
        .toFile(`./images/${ref}`);

        // Log la taille de l'image après la compression
        console.log("Taille de l'image après compression:", fs.statSync(`./images/${ref}`).size, "octets");

      req.file.filename = ref;
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Image compression failed." });
    }
  });
};
