import express from "express";
import cors from "cors";

import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cloudinaryRoutes from "./routes/cloudinary.routes.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://anik-designs.vercel.app",
    "https://www.anikdesign.in",
    "https://www.anikdesign.in/",
    "https://anikdesign.in",
    "https://anikdesign.in/"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else if (origin.match(/\.vercel\.app$/)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.options("*", cors());

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong",
    });
});

export default app;
