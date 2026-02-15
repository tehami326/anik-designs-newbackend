const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

exports.createProduct = async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload_stream(
                { folder: "anik-designs" },
                async (error, result) => {
                    if (error) throw error;

                    imageUrl = result.secure_url;

                    const product = await Product.create({
                        ...req.body,
                        image: imageUrl,
                    });

                    res.status(201).json(product);
                }
            );

            result.end(req.file.buffer);
        } else {
            return res.status(400).json({ message: "Image required" });
        }

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

        if (req.file) {
            const streamUpload = () =>
                new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "anik_products" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    stream.end(req.file.buffer);
                });

            const result = await streamUpload();
            updatedData.image = result.secure_url;
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
