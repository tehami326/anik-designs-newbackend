const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

// Helper: upload a single buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        stream.end(buffer);
    });

// CREATE PRODUCT (Admin)
exports.createProduct = async (req, res) => {
    try {
        const files = req.files || (req.file ? [req.file] : []);

        if (!files.length) {
            return res.status(400).json({ message: "At least one image required" });
        }

        // Upload all images (max 6 enforced by multer)
        const uploadResults = await Promise.all(
            files.map((f) => uploadToCloudinary(f.buffer, "anik-designs"))
        );

        const imageUrls = uploadResults.map((r) => r.secure_url);

        // Parse sizes — sent as JSON string from frontend
        let sizes = [];
        if (req.body.sizes) {
            try { sizes = JSON.parse(req.body.sizes); } catch { sizes = []; }
        }

        const product = await Product.create({
            ...req.body,
            sizes,
            image: imageUrls[0],      // first image as primary (backward compat)
            images: imageUrls,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL PRODUCTS (Public)
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE PRODUCT (Admin)
exports.updateProduct = async (req, res) => {
    try {
        let updatedData = { ...req.body };

        const files = req.files || (req.file ? [req.file] : []);

        if (files.length) {
            const uploadResults = await Promise.all(
                files.map((f) => uploadToCloudinary(f.buffer, "anik-designs"))
            );
            const imageUrls = uploadResults.map((r) => r.secure_url);
            updatedData.image = imageUrls[0];
            updatedData.images = imageUrls;
        }

        if (updatedData.sizes) {
            try { updatedData.sizes = JSON.parse(updatedData.sizes); } catch { updatedData.sizes = []; }
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE PRODUCT (Admin)
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
