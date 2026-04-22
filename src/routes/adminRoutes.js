const express = require("express");
const router = express.Router();

const { getAdminStats } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
    getAllUsers,
    deleteUser,
    updateUserRole,
} = require("../controllers/userController");

router.get("/stats", protect, adminOnly, getAdminStats);

router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;
