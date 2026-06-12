const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            enum: [
                "home-decor",
                "cushion-covers",
                "curtains",
                "quilts",
                "wall-hangings",
                "garments",          
            ],
            required: true,
        },
        image: {
            type: String,
            default: "",             
        },
        images: {
            type: [String],          
            default: [],
        },
        sizes: {
            type: [String],          
            default: [],
        },
        stock: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
