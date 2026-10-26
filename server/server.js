require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");
const PaymentAttempt = require("./models/PaymentAttempt");
const Wishlist = require("./models/Wishlist");
const Contact = require("./models/Contact");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");
const adminMiddleware = require("./middleware/adminMiddleware");
const sendEmail = require("./utils/sendEmail");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
app.use(cors());
app.use(express.json());
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }
    },
});
app.use("/uploads", express.static(uploadDir));


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
        filter.categories = {
            $regex: `^${category}$`,
            $options: "i",
        };
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


// Create Product with Image Upload
app.post(
    "/api/products",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    async (req, res) => {
        try {
            const {
                name,
                weight,
                price,
                oldPrice,
                categories,
                featured,
                isPremium,
                isNewLaunch,
                description,
                stock,
            } = req.body;
            console.log("PRODUCT FORM DATA:", req.body);
            console.log("UPLOADED IMAGE:", req.file?.filename);

            if (!name?.trim() || price === undefined || price === "") {
                return res.status(400).json({
                    message: "Product name and price are required.",
                });
            }

            const parsedPrice = Number(price);
            const parsedOldPrice =
                oldPrice !== undefined && oldPrice !== ""
                    ? Number(oldPrice)
                    : undefined;

            if (
                !Number.isFinite(parsedPrice) ||
                parsedPrice < 0 ||
                (parsedOldPrice !== undefined &&
                    (!Number.isFinite(parsedOldPrice) || parsedOldPrice < 0))
            ) {
                return res.status(400).json({
                    message: "Please enter valid prices.",
                });
            }
            const parsedStock =
                stock === undefined || stock === "" ? 0 : Number(stock);

            if (!Number.isInteger(parsedStock) || parsedStock < 0) {
                return res.status(400).json({
                    message: "Stock must be a non-negative whole number.",
                });
            }

            const parsedCategories = (categories || "")
                .split(",")
                .map((category) => category.trim())
                .filter(Boolean);

            const productData = {
                name: name.trim(),
                weight: weight || "",
                price: parsedPrice,
                image: req.file ? `/uploads/${req.file.filename}` : "",
                categories: parsedCategories,
                description: description || "",
                stock: parsedStock,
                featured: featured === "true",
                isPremium: isPremium === "true",
                isNewLaunch: isNewLaunch === "true",
            };

            if (parsedOldPrice !== undefined) {
                productData.oldPrice = parsedOldPrice;
            }

            const product = await Product.create(productData);

            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({
                message: "Error creating product",
                error: error.message,
            });
        }
    }
);



// Update Product
app.put(
    "/api/products/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    async (req, res) => {
        try {
            const { id } = req.params;

            // Validate product ID
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    message: "Invalid product ID"
                });
            }

            const existingProduct = await Product.findById(id);

            if (!existingProduct) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            const {
                name,
                weight,
                price,
                oldPrice,
                categories,
                featured,
                isPremium,
                isNewLaunch,
                description,
                stock,
            } = req.body;

            // Validate required fields
            if (!name?.trim() || price === undefined || price === "") {
                return res.status(400).json({
                    message: "Product name and price are required"
                });
            }

            const parsedPrice = Number(price);

            if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
                return res.status(400).json({
                    message: "Please enter a valid price"
                });
            }
            const parsedStock =
                stock === undefined || stock === "" ? 0 : Number(stock);

            if (!Number.isInteger(parsedStock) || parsedStock < 0) {
                return res.status(400).json({
                    message: "Stock must be a non-negative whole number.",
                });
            }

            const updates = {
                name: name.trim(),
                weight: weight || "",
                price: parsedPrice,
                categories: (categories || "")
                    .split(",")
                    .map(category => category.trim())
                    .filter(Boolean),

                featured: featured === "true",
                description: description || "",
                stock: parsedStock,
                isPremium: isPremium === "true",
                isNewLaunch: isNewLaunch === "true"

            };

            // Update or clear old price
            if (oldPrice !== undefined && oldPrice !== "") {
                const parsedOldPrice = Number(oldPrice);

                if (
                    !Number.isFinite(parsedOldPrice) ||
                    parsedOldPrice < 0
                ) {
                    return res.status(400).json({
                        message: "Please enter a valid old price"
                    });
                }

                updates.oldPrice = parsedOldPrice;
            } else {
                updates.$unset = { oldPrice: 1 };
            }

            // Change image only when a new image is uploaded
            if (req.file) {
                updates.image = `/uploads/${req.file.filename}`;
            }

            const product = await Product.findByIdAndUpdate(
                id,
                updates,
                {
                    new: true,
                    runValidators: true
                }
            );

            res.json(product);
        } catch (error) {
            res.status(500).json({
                message: "Error updating product",
                error: error.message
            });
        }
    }
);



/* Delete Product — Admin Only */
app.delete(
    "/api/products/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    message: "Invalid product ID",
                });
            }

            const product = await Product.findByIdAndDelete(id);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }

            return res.json({
                message: "Product deleted successfully",
                productId: product._id,
            });
        } catch (error) {
            console.error("Delete product error:", error);

            return res.status(500).json({
                message: "Error deleting product",
            });
        }
    }
);


// Register User
app.post("/api/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            mobile,
            dateOfBirth,
            gender,
        } = req.body;

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
            mobile,
            dateOfBirth: dateOfBirth || undefined,
            gender: gender || undefined,
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

app.get("/api/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        console.log("PROFILE ROLE CHECK:", user?.role);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.json({
            message: "Profile accessed successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "customer",
                mobile: user.mobile || "",
                dateOfBirth: user.dateOfBirth || null,
                gender: user.gender || "",
                address: user.address || {
                    street: "",
                    area: "",
                    city: "",
                    state: "",
                    pincode: "",
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching profile",
            error: error.message,
        });
    }
});


app.put("/api/profile", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            dateOfBirth,
            gender,
            address,
        } = req.body;

        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({
                message: "Name and email are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: req.user.userId },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already in use",
            });
        }

        let parsedDateOfBirth;

        if (dateOfBirth) {
            parsedDateOfBirth = new Date(dateOfBirth);

            if (Number.isNaN(parsedDateOfBirth.getTime())) {
                return res.status(400).json({
                    message: "Invalid date of birth",
                });
            }

            if (parsedDateOfBirth > new Date()) {
                return res.status(400).json({
                    message: "Date of birth cannot be in the future",
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                name: name.trim(),
                email: normalizedEmail,
                mobile: mobile?.trim() || "",
                dateOfBirth: parsedDateOfBirth || undefined,
                gender: gender || undefined,
                address: {
                    street: address?.street?.trim() || "",
                    area: address?.area?.trim() || "",
                    city: address?.city?.trim() || "",
                    state: address?.state?.trim() || "",
                    pincode: address?.pincode?.trim() || "",
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password -resetPasswordToken -resetPasswordExpires");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile || "",
                dateOfBirth: user.dateOfBirth || null,
                gender: user.gender || "",
                address: user.address || {
                    street: "",
                    area: "",
                    city: "",
                    state: "",
                    pincode: "",
                },
            },
        });
    } catch (error) {
        console.error("Profile update error:", error);

        return res.status(500).json({
            message: "Error updating profile",
        });
    }
});


/* Create Razorpay Payment Order */
app.post("/api/payment/create-order", authMiddleware, async (req, res) => {
    try {
        const { items, customer } = req.body;

        // 1. Validate checkout details
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
                message: "Complete checkout details are required",
            });
        }

        // 2. Validate product IDs and quantities
        const quantityMap = new Map();

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

            const productId = item.product.toString();
            const newQuantity =
                (quantityMap.get(productId) || 0) + item.quantity;

            if (!Number.isSafeInteger(newQuantity)) {
                return res.status(400).json({
                    message: "Invalid product quantity",
                });
            }

            quantityMap.set(productId, newQuantity);
        }

        const validatedItems = Array.from(
            quantityMap,
            ([product, quantity]) => ({
                product,
                quantity,
            })
        );

        // 3. Fetch actual products and prices from MongoDB
        const products = await Product.find({
            _id: { $in: validatedItems.map((item) => item.product) },
        });

        const productMap = new Map(
            products.map((product) => [
                product._id.toString(),
                product,
            ])
        );

        let subtotal = 0;

        for (const item of validatedItems) {
            const product = productMap.get(item.product);

            if (!product) {
                return res.status(400).json({
                    message: "One or more products were not found",
                });
            }

            if (
                !Number.isSafeInteger(product.price) ||
                product.price < 0
            ) {
                return res.status(400).json({
                    message: "Invalid product price",
                });
            }

            // Check current stock; stock is not deducted here.
            if (
                !Number.isSafeInteger(product.stock) ||
                product.stock < item.quantity
            ) {
                return res.status(409).json({
                    message: `${product.name} has insufficient stock.`,
                });
            }

            const itemTotal = product.price * item.quantity;

            if (!Number.isSafeInteger(itemTotal)) {
                return res.status(400).json({
                    message: "Invalid order amount",
                });
            }

            subtotal += itemTotal;
        }

        if (!Number.isSafeInteger(subtotal) || subtotal <= 0) {
            return res.status(400).json({
                message: "Invalid payment subtotal",
            });
        }

        // 4. Calculate total on the server
        const deliveryCharge = 40;
        const total = subtotal + deliveryCharge;
        const amountInPaise = total * 100;

        if (!Number.isSafeInteger(amountInPaise)) {
            return res.status(400).json({
                message: "Invalid payment amount",
            });
        }

        // 5. Create Razorpay order
        const paymentOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `user_${req.user.userId}_${Date.now()}`,
            notes: {
                userId: req.user.userId.toString(),
            },
        });

        // 6. Save the server-side payment attempt
        try {
            await PaymentAttempt.create({
                user: req.user.userId,
                razorpayOrderId: paymentOrder.id,
                items: validatedItems,
                customer: {
                    name: customer.name.trim(),
                    email: customer.email.trim(),
                    phone: customer.phone.trim(),
                    address: customer.address.trim(),
                },
                subtotal,
                deliveryCharge,
                total,
                paymentMethod: "Razorpay",
                status: "Pending",
            });
        } catch (saveError) {
            // Prevent an untracked payment order from being used.
            console.error("Save payment attempt error:", saveError);

            return res.status(500).json({
                message:
                    "Unable to save payment details. Please try again.",
            });
        }

        return res.status(201).json({
            message: "Payment order created",
            keyId: process.env.RAZORPAY_KEY_ID,
            razorpayOrderId: paymentOrder.id,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency,
        });
    } catch (error) {
        console.error("Create Razorpay order error:", error);

        return res.status(500).json({
            message: "Unable to create payment order",
        });
    }
});

/* Verify Razorpay Payment */
app.post(
    "/api/payment/verify",
    authMiddleware,
    async (req, res) => {
        try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            } = req.body;

            // 1. Validate required payment details
            if (
                typeof razorpay_order_id !== "string" ||
                typeof razorpay_payment_id !== "string" ||
                typeof razorpay_signature !== "string"
            ) {
                return res.status(400).json({
                    message: "Payment verification details are required",
                });
            }

            // 2. Find this user's saved payment attempt
            const attempt = await PaymentAttempt.findOne({
                user: req.user.userId,
                razorpayOrderId: razorpay_order_id,
            });

            if (!attempt) {
                return res.status(404).json({
                    message: "Payment attempt not found",
                });
            }

            // 3. Check the Razorpay signature
            const expectedSignature = crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");

            const expectedBuffer = Buffer.from(
                expectedSignature,
                "hex"
            );
            const receivedBuffer = Buffer.from(
                razorpay_signature,
                "hex"
            );

            if (
                !/^[a-fA-F0-9]{64}$/.test(razorpay_signature) ||
                expectedBuffer.length !== receivedBuffer.length ||
                !crypto.timingSafeEqual(
                    expectedBuffer,
                    receivedBuffer
                )
            ) {
                return res.status(400).json({
                    message: "Invalid payment signature",
                });
            }

            // 4. Check if this payment already created an order
            const existingOrder = await Order.findOne({
                razorpayOrderId: razorpay_order_id,
                user: req.user.userId,
            });

            if (existingOrder) {
                if (
                    existingOrder.paymentStatus === "Paid" &&
                    existingOrder.razorpayPaymentId === razorpay_payment_id
                ) {
                    const attemptUpdate = await PaymentAttempt.updateOne(
                        {
                            _id: attempt._id,
                            user: req.user.userId,
                            razorpayOrderId: razorpay_order_id,
                        },
                        {
                            $set: {
                                status: "Verified",
                                razorpayPaymentId: razorpay_payment_id,
                            },
                        }
                    );
                    if (attemptUpdate.matchedCount !== 1) {
                        return res.status(409).json({
                            message:
                                "Order exists, but payment attempt recovery needs review.",
                        });
                    }

                    return res.status(200).json({
                        message: "Payment already verified",
                        order: existingOrder,
                    });
                }

                return res.status(409).json({
                    message: "Existing order requires payment verification review",
                });
            }

            const claimedAttempt = await PaymentAttempt.findOneAndUpdate(
                {
                    _id: attempt._id,
                    user: req.user.userId,
                    status: "Pending",
                },
                {
                    $set: {
                        status: "Verifying",
                    },
                },
                {
                    new: true,
                }
            );

            if (!claimedAttempt) {
                return res.status(409).json({
                    message: "This payment attempt is already being processed",
                });
            }

            // 5. Fetch payment details directly from Razorpay
            let payment;

            try {
                payment = await razorpay.payments.fetch(
                    razorpay_payment_id
                );
            } catch (fetchError) {
                console.error("Razorpay payment fetch failed:", {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    message: fetchError.message,
                });

                await PaymentAttempt.updateOne(
                    {
                        _id: attempt._id,
                        status: "Verifying",
                    },
                    {
                        $set: {
                            status: "NeedsReview",
                            razorpayPaymentId: razorpay_payment_id,
                        },
                    }
                );

                return res.status(503).json({
                    message:
                        "Payment status could not be confirmed. Please contact support before retrying.",
                });
            }

            const paymentDetailsMatch =
                payment.order_id === razorpay_order_id &&
                payment.amount === attempt.total * 100 &&
                payment.currency === "INR";

            if (payment.status !== "captured") {
                attempt.status = "Failed";
                await attempt.save();

                return res.status(400).json({
                    message: "Payment was not captured",
                });
            }

            if (!paymentDetailsMatch) {
                await PaymentAttempt.updateOne(
                    {
                        _id: attempt._id,
                        status: "Verifying",
                    },
                    {
                        $set: {
                            status: "NeedsReview",
                            razorpayPaymentId: razorpay_payment_id,
                        },
                    }
                );

                return res.status(409).json({
                    message:
                        "Payment was captured, but payment details do not match. Manual review is required.",
                });
            }
            // 6. Recheck stock and reserve it safely
            const products = await Product.find({
                _id: {
                    $in: attempt.items.map((item) => item.product),
                },
            });

            const productMap = new Map(
                products.map((product) => [
                    product._id.toString(),
                    product,
                ])
            );

            const validatedItems = [];

            for (const item of attempt.items) {
                const product = productMap.get(
                    item.product.toString()
                );

                if (!product) {
                    await PaymentAttempt.updateOne(
                        { _id: attempt._id, status: "Verifying" },
                        { $set: { status: "NeedsReview" } }
                    );

                    return res.status(409).json({
                        message:
                            "Payment was captured, but a product is unavailable. Please contact support for order review and refund handling.",
                    });
                }

                validatedItems.push({
                    product: product._id,
                    name: product.name,
                    image:
                        product.image ||
                        product.imageUrl ||
                        (Array.isArray(product.images)
                            ? product.images[0]
                            : product.images) ||
                        "",
                    price: product.price,
                    quantity: item.quantity,
                });
            }

            const stockChanges = [];
            let orderCreated = false;

            try {
                for (const item of validatedItems) {
                    const updatedProduct =
                        await Product.findOneAndUpdate(
                            {
                                _id: item.product,
                                stock: { $gte: item.quantity },
                            },
                            {
                                $inc: {
                                    stock: -item.quantity,
                                },
                            },
                            { new: true }
                        );

                    if (!updatedProduct) {
                        throw new Error(
                            `INSUFFICIENT_STOCK:${item.name}`
                        );
                    }

                    stockChanges.push({
                        product: item.product,
                        quantity: item.quantity,
                    });
                }

                // 7. Create the paid order from saved server data
                const order = await Order.create({
                    user: attempt.user,
                    items: validatedItems,
                    customer: attempt.customer,
                    subtotal: attempt.subtotal,
                    deliveryCharge: attempt.deliveryCharge,
                    total: attempt.total,
                    paymentMethod: "Razorpay",
                    paymentStatus: "Paid",
                    orderStatus: "Placed",
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                });
                orderCreated = true;

                attempt.status = "Verified";
                attempt.razorpayPaymentId = razorpay_payment_id;
                await attempt.save();

                return res.status(201).json({
                    message: "Payment verified and order placed",
                    order,
                });
            } catch (error) {
                // Restore stock only if the order was not created.
                if (!orderCreated) {
                    for (const change of [...stockChanges].reverse()) {
                        try {
                            await Product.updateOne(
                                { _id: change.product },
                                {
                                    $inc: {
                                        stock: change.quantity,
                                    },
                                }
                            );
                        } catch (restoreError) {
                            console.error("Stock restoration failed:", {
                                productId: change.product,
                                quantity: change.quantity,
                                message: restoreError.message,
                            });
                        }
                    }
                }

                if (
                    error.message?.startsWith("INSUFFICIENT_STOCK:")
                ) {
                    await PaymentAttempt.updateOne(
                        {
                            _id: attempt._id,
                            status: "Verifying",
                        },
                        {
                            $set: {
                                status: "NeedsReview",
                                razorpayPaymentId: razorpay_payment_id,
                            },
                        }
                    );

                    return res.status(409).json({
                        message:
                            "Payment was captured, but stock is unavailable. Order review and refund handling are required.",
                    });
                }



                throw error;
            }
        } catch (error) {
            console.error("Payment verification error:", {
                message: error.message,
                stack: error.stack,
            });

            return res.status(500).json({
                message: "Unable to verify payment",
            });
        }
    }
);


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
                image:
                    product.image ||
                    product.imageUrl ||
                    (Array.isArray(product.images)
                        ? product.images[0]
                        : product.images) ||
                    "",
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


        // 6. Deduct stock safely and create the order
        const stockChanges = [];

        try {
            // First, reserve stock for every ordered product.
            for (const item of validatedItems) {
                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        stock: { $gte: item.quantity },
                    },
                    {
                        $inc: { stock: -item.quantity },
                    },
                    { new: true }
                );

                if (!updatedProduct) {
                    throw new Error(
                        `INSUFFICIENT_STOCK:${item.name}`
                    );
                }

                stockChanges.push({
                    product: item.product,
                    quantity: item.quantity,
                });
            }

            // Create the order only after stock is reserved.
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
            // Restore reserved stock if reservation/order creation fails.
            for (const change of [...stockChanges].reverse()) {
                await Product.updateOne(
                    { _id: change.product },
                    { $inc: { stock: change.quantity } }
                );
            }

            if (error.message?.startsWith("INSUFFICIENT_STOCK:")) {
                return res.status(409).json({
                    message: `${error.message.split(":")[1]} has insufficient stock.`,
                });
            }

            throw error;
        }

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
        })
            .populate("items.product", "image name")
            .sort({ createdAt: -1 });

        const updatedOrders = orders.map((order) => {
            const orderObject = order.toObject();

            orderObject.items = orderObject.items.map((item) => ({
                ...item,
                image:
                    item.image ||
                    item.product?.image ||
                    "",
                name:
                    item.name ||
                    item.product?.name ||
                    "",
            }));

            return orderObject;
        });


        res.json({
            orders: updatedOrders,
        });
    } catch (error) {
        console.error("Get orders error:", error);

        res.status(500).json({
            message: "Error fetching orders",
        });
    }
});

// ================= ADMIN ORDERS API =================

// Get all orders (Admin only)
app.get(
    "/api/admin/orders",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const orders = await Order.find()
                .populate("user", "name email")
                .populate("items.product", "name image")
                .sort({ createdAt: -1 });

            return res.json({ orders });
        } catch (error) {
            console.error("Admin fetch orders error:", error);

            return res.status(500).json({
                message: "Error fetching admin orders",
            });
        }
    }
);

// Update order status (Admin only)
app.patch(
    "/api/admin/orders/:id/status",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { orderStatus } = req.body;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    message: "Invalid order ID",
                });
            }

            const allowedStatuses = [
                "Placed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
            ];

            if (!allowedStatuses.includes(orderStatus)) {
                return res.status(400).json({
                    message: "Invalid order status",
                });
            }

            const order = await Order.findByIdAndUpdate(
                id,
                { $set: { orderStatus } },
                { new: true, runValidators: true }
            );

            if (!order) {
                return res.status(404).json({
                    message: "Order not found",
                });
            }

            return res.json({
                message: "Order status updated successfully",
                order,
            });
        } catch (error) {
            console.error("Admin update order status error:", error);

            return res.status(500).json({
                message: "Error updating order status",
            });
        }
    }
);

/* Wishlist Routes */

// Get logged-in user's wishlist
app.get("/api/wishlist", authMiddleware, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user.userId,
        }).populate(
            "products",
            "name weight price oldPrice image featured rating categories"
        );

        return res.json({
            wishlist: wishlist
                ? wishlist.products.map((product) => ({ product }))
                : [],
        });
    } catch (error) {
        console.error("Get wishlist error:", error);
        return res.status(500).json({
            message: "Error fetching wishlist",
        });
    }
});

// Add product to wishlist
app.post("/api/wishlist", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const productExists = await Product.exists({ _id: productId });

        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }

        let wishlist = await Wishlist.findOne({
            user: req.user.userId,
        });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user.userId,
                products: [],
            });
        }

        const alreadyExists = wishlist.products.some(
            (id) => id.toString() === productId
        );

        if (alreadyExists) {
            return res.json({ message: "Product already in wishlist" });
        }

        wishlist.products.push(productId);
        await wishlist.save();

        return res.status(201).json({
            message: "Product added to wishlist",
        });
    } catch (error) {
        console.error("Add wishlist error:", error);
        return res.status(500).json({
            message: "Error adding product to wishlist",
        });
    }
});

// Remove product from wishlist
app.delete(
    "/api/wishlist/:productId",
    authMiddleware,
    async (req, res) => {
        try {
            const { productId } = req.params;

            if (!mongoose.isValidObjectId(productId)) {
                return res.status(400).json({ message: "Invalid product ID" });
            }

            const wishlist = await Wishlist.findOne({
                user: req.user.userId,
            });

            if (!wishlist) {
                return res.status(404).json({ message: "Wishlist not found" });
            }

            wishlist.products = wishlist.products.filter(
                (id) => id.toString() !== productId
            );

            await wishlist.save();

            return res.json({
                message: "Product removed from wishlist",
            });
        } catch (error) {
            console.error("Remove wishlist error:", error);
            return res.status(500).json({
                message: "Error removing product from wishlist",
            });
        }
    }
);


/* Contact Form API */
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (
            !name?.trim() ||
            !email?.trim() ||
            !subject?.trim() ||
            !message?.trim()
        ) {
            return res.status(400).json({
                message: "Please fill in all required fields.",
            });
        }

        // Validate field lengths
        if (
            name.trim().length > 100 ||
            email.trim().length > 254 ||
            subject.trim().length > 150 ||
            message.trim().length > 5000
        ) {
            return res.status(400).json({
                message: "One or more fields exceed the allowed length.",
            });
        }

        // Basic email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            return res.status(400).json({
                message: "Please enter a valid email address.",
            });
        }

        // Save contact message in MongoDB
        const contact = await Contact.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
        });

        return res.status(201).json({
            message: "Your message has been submitted successfully!",
            contactId: contact._id,
        });
    } catch (error) {
        console.error("Contact form error:", error);

        return res.status(500).json({
            message: "Unable to submit your message. Please try again later.",
        });
    }
});


app.get(
    "/api/admin/dashboard-stats",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const [
                totalProducts,
                totalOrders,
                totalCustomers,
                totalContacts,
            ] = await Promise.all([
                Product.countDocuments(),
                Order.countDocuments(),
                User.countDocuments({ role: { $ne: "admin" } }),
                Contact.countDocuments(),
            ]);

            return res.json({
                totalProducts,
                totalOrders,
                totalCustomers,
                totalContacts,
            });
        } catch (error) {
            console.error("Dashboard stats error:", error);

            return res.status(500).json({
                message: "Error fetching dashboard statistics",
            });
        }
    }
);

app.get(
    "/api/admin/recent-orders",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const orders = await Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select(
                    "customer total paymentMethod paymentStatus orderStatus createdAt"
                )
                .lean();

            return res.json({ orders });
        } catch (error) {
            console.error("Recent orders error:", error);

            return res.status(500).json({
                message: "Error fetching recent orders",
            });
        }
    }
);


app.get(
    "/api/admin/sales-overview",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const now = new Date();
            const startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            startDate.setDate(startDate.getDate() - 6);

            const dailyData = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: now },
                        orderStatus: { $ne: "Cancelled" },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            day: { $dayOfMonth: "$createdAt" },
                        },
                        orders: { $sum: 1 },
                        orderValue: { $sum: "$total" },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            const days = [];

            for (let i = 0; i < 7; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);

                const match = dailyData.find(
                    (item) =>
                        item._id.year === date.getFullYear() &&
                        item._id.month === date.getMonth() + 1 &&
                        item._id.day === date.getDate()
                );

                days.push({
                    date: date.toISOString().slice(0, 10),
                    orders: match?.orders || 0,
                    orderValue: match?.orderValue || 0,
                });
            }

            return res.json({
                period: "Last 7 days",
                days,
                totalOrders: days.reduce((sum, day) => sum + day.orders, 0),
                totalOrderValue: days.reduce(
                    (sum, day) => sum + day.orderValue,
                    0
                ),
            });
        } catch (error) {
            console.error("Sales overview error:", error);

            return res.status(500).json({
                message: "Error fetching sales overview",
            });
        }
    }
);


/* Mark a Razorpay payment as failed after checking Razorpay */
app.post(
    "/api/payment/failed",
    authMiddleware,
    async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id } = req.body;

            if (
                typeof razorpay_order_id !== "string" ||
                typeof razorpay_payment_id !== "string"
            ) {
                return res.status(400).json({
                    message: "Payment details are required",
                });
            }

            const attempt = await PaymentAttempt.findOne({
                user: req.user.userId,
                razorpayOrderId: razorpay_order_id,
            });

            if (!attempt) {
                return res.status(404).json({
                    message: "Payment attempt not found",
                });
            }

            // Never change an already verified payment.
            if (attempt.status === "Verified") {
                return res.status(409).json({
                    message: "This payment is already verified",
                });
            }

            // Confirm the payment status directly with Razorpay.
            const payment = await razorpay.payments.fetch(
                razorpay_payment_id
            );

            if (
                payment.order_id !== razorpay_order_id ||
                payment.status !== "failed"
            ) {
                return res.status(409).json({
                    message:
                        "Razorpay has not confirmed this payment as failed",
                });
            }

            // Update only a pending attempt; do not overwrite other states.
            const updatedAttempt = await PaymentAttempt.findOneAndUpdate(
                {
                    _id: attempt._id,
                    user: req.user.userId,
                    status: "Pending",
                },
                {
                    $set: {
                        status: "Failed",
                        razorpayPaymentId: razorpay_payment_id,
                    },
                },
                { new: true }
            );

            if (!updatedAttempt) {
                return res.status(409).json({
                    message:
                        "Payment attempt is already being processed or needs review",
                });
            }

            return res.status(200).json({
                message: "Failed payment recorded",
                status: updatedAttempt.status,
            });
        } catch (error) {
            console.error("Record failed payment error:", {
                message: error.message,
            });

            return res.status(503).json({
                message:
                    "Payment failure could not be confirmed. Please check payment status before retrying.",
            });
        }
    }
);



// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});