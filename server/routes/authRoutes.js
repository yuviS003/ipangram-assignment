const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserInfo,
} = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// Route to get user information
router.get("/user", verifyToken, getUserInfo);

module.exports = router;
