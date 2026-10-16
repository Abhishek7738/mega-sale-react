
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    weight: String,
    price: Number,
    oldPrice: Number,
    image: String,
    featured: Boolean,
    isPremium: {
        type: Boolean,
        default: false,
    },
    isNewLaunch: {
        type: Boolean,
        default: false,
    },
    rating: Number,
    categories: [String],
    description: {
        type: String,
        default: "",
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: "Stock must be a whole number.",
        },
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
