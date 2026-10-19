
const mongoose = require("mongoose");

const paymentAttemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],

        customer: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
        },

        subtotal: {
            type: Number,
            required: true,
        },

        deliveryCharge: {
            type: Number,
            required: true,
        },

        total: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            default: "Razorpay",
        },

        status: {
            type: String,
            enum: ["Pending", "Verifying", "Verified", "Failed"],
            default: "Pending",
        },

        razorpayPaymentId: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "PaymentAttempt",
    paymentAttemptSchema
);
