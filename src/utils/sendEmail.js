const nodemailer = require("nodemailer");

// CREATE TRANSPORTER ONCE
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
});

// VERIFY CONNECTION WHEN SERVER STARTS
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Email transporter error:", error.message);
    } else {
        console.log("✅ Email transporter ready");
    }
});

exports.sendOrderEmail = async (order) => {
    try {
        const itemsText = order.items
            .map((item) => `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`)
            .join("\n");

        await transporter.sendMail({
            from: `"Anik Design Orders" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `🛍️ New Order - ₹${order.totalAmount}`,
            text: `
NEW ORDER RECEIVED
==================

Customer Details:
Name     : ${order.shippingDetails.fullName}
Phone    : ${order.shippingDetails.phone}
Address  : ${order.shippingDetails.address}
City     : ${order.shippingDetails.city}
Pincode  : ${order.shippingDetails.pincode}

Items Ordered:
${itemsText}

Total Amount  : ₹${order.totalAmount}
Payment Method: ${order.paymentMethod}
Order ID      : ${order._id}
            `,
        });

        console.log("✅ Order email sent for order:", order._id);

    } catch (error) {
        console.log("❌ Email failed for order:", order._id, "| Reason:", error.message);
    }
};