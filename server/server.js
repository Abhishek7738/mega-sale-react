require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");
const sendEmail = require("./utils/sendEmail");
const crypto = require("crypto");

app.use(cors());
app.use(express.json());

mongoose
    .connect("mongodb://localhost:27017/megaSale")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

const port = 5000;

// Health Check


app.get("/api/health", (req, res) => {
    res.json({
        message: "Backend is running successfully"
    });
});
// Get Products
app.get("/api/products", (req, res) => {
    const { category, search } = req.query;

    const filter = {};

    if (category) {
        filter.categories = category;
    }

    if (search) {
        filter.name = {
            $regex: search,
            $options: "i"
        };
    }

    Product.find(filter)
        .then((products) => {
            res.json(products);
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error fetching products",
                error: error.message
            });
        });
});

// Create Product
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
// Update Product
app.put("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Error updating product",
            error: error.message
        });
    }
});

// Register User
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Send safe response
        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Error creating user"
        });
    }
});

// Login User
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
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error logging in",
                error: error.message
            });
        });
});
// Forgot Password
app.post("/api/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email"
            });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Save token and expiry
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        // Reset link for React frontend
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Mega Sale - Reset Your Password",
            text: `Reset your password using this link: ${resetLink}`,
            html: `
                <h2>Mega Sale Password Reset</h2>
                <p>You requested to reset your password.</p>
                <p>This link will expire in 15 minutes.</p>
                <p>
                    <a href="${resetLink}">
                        Reset Your Password
                    </a>
                </p>
                <p>If you did not request this, you can ignore this email.</p>
            `,
        });

        res.json({
            message: "Password reset email sent successfully"
        });
    } catch (error) {
        console.error("Forgot password error:", error);

        res.status(500).json({
            message: "Error sending password reset email"
        });
    }
});
// Reset Password
app.post("/api/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Find user with valid, non-expired reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        user.password = hashedPassword;

        // Invalidate reset token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({
            message: "Password reset successfully"
        });
    } catch (error) {
        console.error("Reset password error:", error);

        res.status(500).json({
            message: "Error resetting password"
        });
    }
});

// Protected Profile Route
app.get("/api/profile", authMiddleware, (req, res) => {
    User.findById(req.user.userId)
        .select("-password")
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message: "Profile accessed successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error fetching profile",
                error: error.message
            });
        });
});
// Create Order route

app.post("/api/orders", authMiddleware, async (req, res) => {
    try {
        const {
            items,
            customer,
            paymentMethod,
        } = req.body;

        // 1. Validate required order details
        if (
            !Array.isArray(items) ||
            items.length === 0 ||
            !customer ||
            !customer.name?.trim() ||
            !customer.email?.trim() ||
            !customer.phone?.trim() ||
            !customer.address?.trim()
        ) {
            return res.status(400).json({
                message: "Complete order details are required",
            });
        }

        // 2. Validate each product ID and quantity
        for (const item of items) {
            if (
                !item.product ||
                !mongoose.isValidObjectId(item.product) ||
                !Number.isSafeInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    message: "Invalid product ID or quantity",
                });
            }
        }

        // 3. Get actual product prices from MongoDB
        const productIds = items.map((item) => item.product);

        const products = await Product.find({
            _id: { $in: productIds },
        });

        const productMap = new Map(
            products.map((product) => [
                product._id.toString(),
                product,
            ])
        );

        // 4. Recalculate prices and subtotal on the backend
        let calculatedSubtotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const product = productMap.get(
                item.product.toString()
            );

            if (!product) {
                return res.status(400).json({
                    message: "One or more products were not found",
                });
            }

            if (
                !Number.isFinite(product.price) ||
                product.price < 0
            ) {
                return res.status(400).json({
                    message: "Invalid product price in database",
                });
            }

            const itemTotal = product.price * item.quantity;

            if (!Number.isSafeInteger(itemTotal)) {
                return res.status(400).json({
                    message: "Invalid order amount",
                });
            }

            calculatedSubtotal += itemTotal;

            validatedItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
        }

        if (!Number.isSafeInteger(calculatedSubtotal)) {
            return res.status(400).json({
                message: "Invalid order subtotal",
            });
        }

        // 5. Apply the existing ₹40 delivery rule
        const calculatedDeliveryCharge =
            calculatedSubtotal > 0 ? 40 : 0;

        const calculatedTotal =
            calculatedSubtotal + calculatedDeliveryCharge;

        // 6. Save only backend-calculated amounts
        const order = await Order.create({
            user: req.user.userId,
            items: validatedItems,
            customer: {
                name: customer.name.trim(),
                email: customer.email.trim(),
                phone: customer.phone.trim(),
                address: customer.address.trim(),
            },
            subtotal: calculatedSubtotal,
            deliveryCharge: calculatedDeliveryCharge,
            total: calculatedTotal,
            paymentMethod,
        });

        return res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error("Create order error:", error);

        return res.status(500).json({
            message: "Error creating order",
        });
    }
});

// Get logged-in user's orders
app.get("/api/orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userId,
        }).sort({ createdAt: -1 });

        res.json({
            orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);

        res.status(500).json({
            message: "Error fetching orders",
        });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});