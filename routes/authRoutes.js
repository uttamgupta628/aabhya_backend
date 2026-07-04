const express = require("express");
const router = express.Router();
const { loginAdmin, getMe, createAdmin } = require("../controllers/authController");
const { protect, requireSuperAdmin } = require("../middleware/auth");

router.post("/login", loginAdmin);
router.get("/me", protect, getMe);
router.post("/create-admin", protect, requireSuperAdmin, createAdmin);

module.exports = router;
