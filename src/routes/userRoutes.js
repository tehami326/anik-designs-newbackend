const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    deleteUser,
    updateUserRole,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getAllUsers);
router.delete("/:id", protect, adminOnly, deleteUser);
router.put("/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;
