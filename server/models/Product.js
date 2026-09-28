const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: String,
    weight: String,
    price: Number,
    oldPrice: Number,
    image: String,
    featured: Boolean,
    rating: Number,
    categories: [String],

});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
