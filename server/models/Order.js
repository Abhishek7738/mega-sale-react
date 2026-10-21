const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                name: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String,
                    default: "",
                },

                price: {
                    type: Number,
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
            name: {
                type: String,
                required: true,
            },

            email: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            address: {
                type: String,
                required: true,
            },
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
            required: true,
        },

        paymentStatus: {
            type: String,
            default: "Pending",
        },
        razorpayOrderId: {
            type: String,
            default: "",
        },

        razorpayPaymentId: {
            type: String,
            default: "",
        },

        orderStatus: {
            type: String,
            default: "Placed",
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index(
    { razorpayOrderId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            paymentMethod: "Razorpay",
        },
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;