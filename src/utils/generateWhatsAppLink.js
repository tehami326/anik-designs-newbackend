exports.generateWhatsAppLink = (order) => {
    const phoneNumber = "918800621770"; // Main business number

    const itemsText = order.items
        .map(
            (item) =>
                `- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`
        )
        .join("\n");

    const message = `
New Order - Anik Design

Name: ${order.shippingDetails.fullName}
Phone: ${order.shippingDetails.phone}
Address: ${order.shippingDetails.address}
City: ${order.shippingDetails.city}
Pincode: ${order.shippingDetails.pincode}

Items:
${itemsText}

Total: ₹${order.totalAmount}
Payment: ${order.paymentMethod}
  `;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
