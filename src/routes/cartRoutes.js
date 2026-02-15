const express = require("express");
const router = express.Router();

const {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// All cart routes are protected
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.post("/remove", protect, removeFromCart);
router.put("/update", protect, updateCartItem);


module.exports = router;
