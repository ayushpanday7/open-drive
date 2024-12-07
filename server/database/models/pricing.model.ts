import mongoose from "mongoose";

/**
 * Mongoose schema definition for pricing plans in Open Drive.
 * Defines different subscription tiers with their features and storage limits.
 *
 * @typedef {Object} PricingSchema
 * @property {string} name - Name of the pricing plan (e.g., "Basic", "Pro", "Enterprise")
 * @property {number} value - Cost of the plan in currency units
 * @property {string} description - Detailed description of the pricing plan
 * @property {number} storage - Storage limit in bytes for this plan
 * @property {Array<string>} [features] - List of features included in this plan
 * @property {Date} createdAt - Timestamp when the plan was created
 * @property {Date} updatedAt - Timestamp when the plan was last updated
 */
const prisingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    storage: {
      type: Number,
      required: true,
    },
    features: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose model for managing pricing plans in Open Drive.
 * Handles the creation and management of subscription tiers and their features.
 *
 * @type {mongoose.Model<PricingSchema>}
 */
export const pricing = mongoose.model("prising", prisingSchema);
