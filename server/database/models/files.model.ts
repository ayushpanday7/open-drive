import mongoose from "mongoose";

/**
 * Mongoose schema definition for file storage in Open Drive.
 * Represents a file uploaded to the system with its metadata and sharing properties.
 *
 * @typedef {Object} FileSchema
 * @property {mongoose.Types.ObjectId} uploaded_by - Reference to the user who uploaded the file
 * @property {string} fieldname - Name of the form field used for file upload
 * @property {string} originalname - Original name of the uploaded file
 * @property {string} encoding - File encoding type
 * @property {string} mimetype - MIME type of the file
 * @property {string} destination - Directory path where the file is stored
 * @property {string} filename - Generated unique filename in the system
 * @property {string} path - Complete file path in the storage system
 * @property {number} size - File size in bytes
 * @property {('public'|'private')} visibility - File visibility status
 * @property {mongoose.Types.ObjectId[]} shared - List of users with whom the file is shared
 * @property {Date} [deletedAt] - Timestamp when the file was marked as deleted (soft delete)
 */
const fileSchema = new mongoose.Schema(
  {
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      usersref: "",
    },
    fieldname: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    encoding: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    shared: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


/**
 * Mongoose model for file storage in Open Drive.
 * @type {mongoose.Model<FileSchema>}
 */
export const files = mongoose.model("files", fileSchema);
