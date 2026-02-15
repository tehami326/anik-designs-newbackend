const nodemailer = require("nodemailer");

exports.sendOrderEmail = async (order) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const itemsText = order.items
        .map(
            (item) =>
                `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`
        )
        .join("\n");

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Order - Anik Design",
        text: `
New Order Received

Customer Details:
Name: ${order.shippingDetails.fullName}
Phone: ${order.shippingDetails.phone}
Address: ${order.shippingDetails.address}
City: ${order.shippingDetails.city}
Pincode: ${order.shippingDetails.pincode}

Items:
${itemsText}

Total Amount: ₹${order.totalAmount}
Payment Method: ${order.paymentMethod}
    `,
    };

    await transporter.sendMail(mailOptions);
};
