const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: String,
    price: Number,
    quantity: Number,
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [orderItemSchema],

        totalAmount: {
            type: Number,
            required: true,
        },

        shippingDetails: {
            fullName: String,
            phone: String,
            address: String,
            city: String,
            pincode: String,
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "PAY_LATER"],
            required: true,
        },

        status: {
            type: String,
            default: "Pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
