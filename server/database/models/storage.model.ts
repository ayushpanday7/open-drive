import mongoose from "mongoose";

/**
 * Mongoose schema definition for user storage management in Open Drive.
 * Tracks storage allocation and usage for each user based on their pricing plan.
 *
 * @typedef {Object} StorageSchema
 * @property {mongoose.Types.ObjectId} user - Reference to the user who owns this storage allocation
 * @property {number} max_size - Maximum storage limit in bytes allocated to the user
 * @property {number} used_size - Current storage usage in bytes by the user
 * @property {mongoose.Types.ObjectId} instance - Reference to the pricing plan that defines this storage allocation
 * @property {Date} createdAt - Timestamp when the storage record was created
 * @property {Date} updatedAt - Timestamp when the storage record was last updated
 */
const storageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    max_size: {
      type: Number,
      required: true,
    },
    used_size: {
      type: Number,
      required: true,
    },
    instance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "prising",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Mongoose model for managing user storage allocations in Open Drive.
 * Handles tracking and updating storage usage for users based on their subscription plans.
 * 
 * @type {mongoose.Model<StorageSchema>}
 */
export const storage = mongoose.model("storage", storageSchema);
