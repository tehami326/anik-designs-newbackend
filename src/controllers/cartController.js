const Cart = require("../models/Cart");
const Product = require("../models/Product");


// GET USER CART WITH TOTAL CALCULATION
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        if (!cart) {
            return res.json({
                items: [],
                totalItems: 0,
                subtotal: 0,
            });
        }

        // Calculate totals securely
        let subtotal = 0;
        let totalItems = 0;

        cart.items.forEach((item) => {
            subtotal += item.product.price * item.quantity;
            totalItems += item.quantity;
        });

        res.json({
            items: cart.items,
            totalItems,
            subtotal,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ADD TO CART
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REMOVE ITEM FROM CART
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE ITEM QUANTITY (Increase / Decrease)
exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        // If quantity <= 0 → remove item
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
