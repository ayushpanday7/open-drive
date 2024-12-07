import mongoose from "mongoose";

/**
 * Mongoose schema definition for activity logs in Open Drive.
 * Tracks user activities and system events with detailed context information.
 *
 * @typedef {Object} ActivitySchema
 * @property {mongoose.Types.ObjectId} user - Reference to the user who performed the activity
 * @property {string} message - Description of the activity or event
 * @property {string} [refresh_token] - JWT refresh token associated with the activity
 * @property {string} [browser] - Browser information where the activity occurred
 * @property {string} [os] - Operating system information
 * @property {string} [ip] - IP address from where the activity originated
 * @property {Date} date - Timestamp of the activity (defaults to current time)
 * @property {Date} createdAt - Timestamp when the log was created
 * @property {Date} updatedAt - Timestamp when the log was last updated
 */
const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
    },
    browser: {
      type: String,
    },
    os: {
      type: String,
    },
    ip: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * Mongoose model for managing activity logs in Open Drive.
 * Used for tracking and querying user activities and system events.
 * 
 * @type {mongoose.Model<ActivitySchema>}
 */
export const logs = mongoose.model("logs", activitySchema);
