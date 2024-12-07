import mongoose from "mongoose";

/**
 * Mongoose schema definition for users in Open Drive.
 * Represents user accounts with their personal information, authentication details, and subscription plan.
 *
 * @typedef {Object} UserSchema
 * @property {string} first_name - User's first name
 * @property {string} last_name - User's last name
 * @property {string} email - User's email address (used for authentication)
 * @property {number} [phone_number] - User's phone number (optional)
 * @property {string} password - Hashed password for authentication
 * @property {('user'|'admin'|'root')} role - User's role in the system (defaults to "user")
 * @property {mongoose.Types.ObjectId} [plan] - Reference to user's pricing plan
 * @property {Date} createdAt - Timestamp when the user account was created
 * @property {Date} updatedAt - Timestamp when the user account was last updated
 */
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_number: Number,
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "root"],
      default: "user",
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "prising",
    },
  },
  { timestamps: true }
);

/**
 * Mongoose model for managing user accounts in Open Drive.
 * Handles user authentication, profile management, and role-based access control.
 * 
 * @type {mongoose.Model<UserSchema>}
 */
export const users = mongoose.model("users", userSchema);
