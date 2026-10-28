const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Authentication token required",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the actual user from MongoDB
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        // Attach database user information to the request
        req.user = {
            userId: user._id,
            role: user.role || "customer",
        };

        next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;
