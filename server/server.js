require("dotenv").config();
const express = require('express');
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");

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
    Product.create(req.body)
        .then((product) => {
            res.status(201).json(product);
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error creating product",
                error: error.message
            });
        });
});

app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10)
        .then((hashedPassword) => {
            return User.create({
                name,
                email,
                password: hashedPassword

            });
        })
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error creating user",
                error: error.message
            });
        });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }
            return bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (!isMatch) {
                        return res.status(401).json({
                            message: "Invalid email or password"
                        });
                    }
                    const token = jwt.sign(
                        { userId: user._id },
                        process.env.JWT_SECRET,
                        { expiresIn: "1h" }
                    );
                    return res.status(200).json({
                        message: "Login successful",
                        token: token,
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email
                        }
                    });

                });
        });
});

app.get("/api/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Profile accessed successfully",
        user: req.user
    });
});

app.listen(port, () => {

    console.log(`Server is running on http://localhost:${port}`);
});