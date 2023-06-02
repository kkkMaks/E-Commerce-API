const express = require("express");
const {
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail,
} = require("../controllers/auth");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);
router.get("/verify-email", verifyEmail);

module.exports = router;
