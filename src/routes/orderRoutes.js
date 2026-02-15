const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// User places order
router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin views all orders
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:id", protect, adminOnly, getOrderById);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.delete("/:id", protect, adminOnly, deleteOrder);


module.exports = router;
