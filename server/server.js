const express = require('express');
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/Product");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/megaSale")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

const port = 5000;

app.get("/api/health", (req, res) => {
    res.json({
        message: "Backend is running successfully"
    });
});

app.get("/api/products", (req, res) => {
   Product.find()
   .then((products) => {
    res.json(products);
});
});

app.post("/api/products", (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {

    console.log(`Server is running on http://localhost:${port}`);
});