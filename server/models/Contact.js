const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 5000,
    },

    // Customer uploaded product photos
    attachments: [
      {
        filename: {
          type: String,
          trim: true,
        },
        path: {
          type: String,
          trim: true,
        },
        mimetype: {
          type: String,
          trim: true,
        },
      },
    ],

    // Admin email replies ka history
    replies: [
      {
        message: {
          type: String,
          required: true,
          trim: true,
          maxlength: 5000,
        },
        adminEmail: {
          type: String,
          trim: true,
          lowercase: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    status: {
      type: String,
      enum: ["new", "read", "resolved"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);