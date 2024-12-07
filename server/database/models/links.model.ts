import mongoose from "mongoose";

/**
 * Mongoose schema definition for sharing links in Open Drive.
 * Represents a shareable link that provides access to one or more files.
 *
 * @typedef {Object} LinkSchema
 * @property {string} link - Unique URL for accessing shared files
 * @property {mongoose.Types.ObjectId[]} files - Array of references to shared files
 * @property {mongoose.Types.ObjectId} user - Reference to the user who created the link
 * @property {Date} expiresAt - Expiration date of the sharing link
 * @property {number} views - Number of times the link has been accessed
 * @property {mongoose.Types.ObjectId[]} viewers - Array of users who have viewed the shared files
 * @property {Date} createdAt - Timestamp when the link was created
 * @property {Date} updatedAt - Timestamp when the link was last updated
 */
const linksSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    files: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "files",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    viewers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
  },
  { timestamps: true }
);

/**
 * Mongoose model for managing sharing links in Open Drive.
 * Provides methods for creating, reading, updating, and deleting sharing links.
 * 
 * @type {mongoose.Model<LinkSchema>}
 */
export const links = mongoose.model("links", linksSchema);
