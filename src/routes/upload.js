const express = require("express");
const multer = require("multer");
const path = require("path");

const { uploadProductImage } = require("../controllers/products");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(__dirname, "../uploads/");
    cb(null, uploadFolder);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.route("/upload-image").post(upload.single("image"), uploadProductImage);

module.exports = router;
