const Order = require("../models/Order");
const { sendOrderEmail } = require("../utils/sendEmail");
const { generateWhatsAppLink } = require("../utils/generateWhatsAppLink");

/* =====================================================
   PLACE ORDER
===================================================== */
exports.placeOrder = async (req, res) => {
    try {
        const { items, shippingDetails, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let totalAmount = 0;

        const orderItems = items.map((item) => {
            totalAmount += item.price * item.quantity;

            return {
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            };
        });

        /* =========================
           SAVE ORDER FIRST
        ========================= */
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingDetails,
            paymentMethod,
        });

        /* =========================
           GENERATE WHATSAPP LINK
        ========================= */
        const whatsappURL = generateWhatsAppLink(order);

        /* =========================
           RESPOND IMMEDIATELY
        ========================= */
        res.status(201).json({
            message: "Order placed successfully",
            order,
            whatsappURL,
        });

        /* =========================
           EMAIL SEND AFTER RESPONSE
           (BACKGROUND TASK)
        ========================= */
        setTimeout(() => {
            sendOrderEmail(order)
                .then(() => console.log("Email sent"))
                .catch(err => console.log("Email error:", err.message));
        }, 2000);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



/* =====================================================
   USER – GET MY ORDERS
===================================================== */
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* =====================================================
   ADMIN – GET ALL ORDERS
===================================================== */
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* =====================================================
   GET SINGLE ORDER (Admin)
===================================================== */
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* =====================================================
   UPDATE ORDER STATUS
===================================================== */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: false }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


/* =====================================================
   DELETE ORDER (Admin)
===================================================== */
exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
