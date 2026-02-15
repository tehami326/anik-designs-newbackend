const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            status: "Pending"
        });

        const revenueData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalRevenue =
            revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        res.json({
            totalProducts,
            totalUsers,
            totalOrders,
            pendingOrders,
            totalRevenue,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
