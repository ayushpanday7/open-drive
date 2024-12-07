/**
 * Database management module for Open Drive
 * @module database
 */

import mongoose, { Model } from "mongoose";
import dotenv from "dotenv";
import {
  CreateDocType,
  ModelNames,
  ModelsList,
  registeredModels,
  FilterQueryType,
  DocumentType,
  UpdateQueryType,
} from "./models";
import { INTERNAL_SERVER_ERROR_OBJECT } from "../constants";

/**
 * Response interface for database operations
 * @interface dbResponse
 */
interface dbResponse {
  /** HTTP status code */
  status: number;
  /** Response message */
  message: string;
  /** Response data */
  data: any;
}

/**
 * Database class responsible for managing MongoDB operations
 * @class Database
 * @description Handles all database operations including CRUD operations
 */
export class Database {
  /**
   * Establishes connection to MongoDB
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If DATABASE_CONNECTION_STRING is not defined
   * @throws {Error} If connection to database fails
   */
  static async connect(): Promise<void> {
    try {
      const connectionString = process.env.DATABASE_CONNECTION_STRING;
      if (!connectionString) {
        throw new Error("Database connection string is not defined in .env");
      }

      await mongoose.connect(connectionString);
      console.log("Successfully connected to database");
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }

  /**
   * Gets the Mongoose model for the specified model name
   * @static
   * @template RegisteredModel
   * @param {RegisteredModel} ModelName - Name of the registered model
   * @returns {Model<DocumentType<ModelsList[RegisteredModel]>>} Mongoose model
   */
  private static getModel<RegisteredModel extends ModelNames>(
    ModelName: RegisteredModel
  ) {
    return registeredModels[ModelName] as unknown as Model<
      DocumentType<ModelsList[RegisteredModel]>
    >;
  }

  /**
   * Creates a new document in the specified collection
   * @static
   * @async
   * @template registeredModel
   * @param {registeredModel} databaseName - Name of the collection
   * @param {CreateDocType<registeredModel>} doc - Document to create
   * @returns {Promise<dbResponse>} Response object with status and data
   */
  static async CREATE<registeredModel extends ModelNames>(
    databaseName: registeredModel,
    doc: CreateDocType<registeredModel>
  ): Promise<dbResponse> {
    const model = this.getModel(databaseName);
    try {
      const created = await model.create(doc);
      if (created) {
        return {
          status: 200,
          message: "success",
          data: created,
        };
      }
      console.log("created", created);
      return INTERNAL_SERVER_ERROR_OBJECT;
    } catch (error: unknown) {
      console.log("error while creating document", error);
      if (error instanceof mongoose.Error.ValidationError) {
        const ValidationErrors = extractValidationError(error);
        return {
          status: 400,
          message: "validation error",
          data: ValidationErrors,
        };
      }
      if (error instanceof mongoose.Error) {
        return {
          status: 500,
          message: error.message,
          data: null,
        };
      }
      return {
        status: 500,
        message: "unknown error occured",
        data: null,
      };
    }
  }

  /**
   * Updates a single document in the specified collection
   * @static
   * @async
   * @template ModelName
   * @param {ModelName} databaseName - Name of the collection
   * @param {FilterQueryType<ModelName>} filter - Filter criteria
   * @param {UpdateQueryType<ModelName>} doc - Update document
   * @returns {Promise<dbResponse>} Response object with status and data
   */
  static async UPDATE_ONE<ModelName extends ModelNames>(
    databaseName: ModelName,
    filter: FilterQueryType<ModelName>,
    doc: UpdateQueryType<ModelName>
  ) {
    const model = this.getModel(databaseName);
    try {
      const updated = await model.updateOne(filter, [doc]);
      if (updated.matchedCount === 0) {
        return {
          status: 404,
          message: "Document not found",
          data: null,
        };
      }
      if (updated.modifiedCount !== 0 && updated.matchedCount === 1) {
        return {
          status: 200,
          message: "No update is required",
          data: null,
        };
      }
      return {
        status: 200,
        message: "success",
        data: updated,
      };
    } catch (error) {
      console.log("error while updating document", error);
      return {
        status: 500,
        message: "internal server error",
        data: null,
      };
    }
  }

  /**
   * Updates multiple documents in the specified collection
   * @static
   * @async
   * @template ModelName
   * @param {ModelName} databaseName - Name of the collection
   * @param {FilterQueryType<ModelName>} filter - Filter criteria
   * @param {UpdateQueryType<ModelName>} doc - Update document
   * @returns {Promise<dbResponse>} Response object with status and data
   */
  static async UPDATE_MANY<ModelName extends ModelNames>(
    databaseName: ModelName,
    filter: FilterQueryType<ModelName>,
    doc: UpdateQueryType<ModelName>
  ) {
    const model = this.getModel(databaseName);
    try {
      const updated = await model.updateMany(filter, [doc]);
      if (updated.matchedCount === 0) {
        return {
          status: 404,
          message: "Document not found",
          data: null,
        };
      }
      return {
        status: 200,
        message: "success",
        data: updated,
      };
    } catch (error) {
      console.log("error while updating document", error);
      return {
        status: 500,
        message: "internal server error",
        data: null,
      };
    }
  }

  /**
   * Deletes a single document from the specified collection
   * @static
   * @async
   * @template ModelName
   * @param {ModelName} databaseName - Name of the collection
   * @param {FilterQueryType<ModelName>} filter - Filter criteria
   * @returns {Promise<dbResponse>} Response object with status and data
   */
  static async DELETE_ONE<ModelName extends ModelNames>(
    databaseName: ModelName,
    filter: FilterQueryType<ModelName>
  ) {
    const model = this.getModel(databaseName);
    try {
      const deleted = await model.deleteOne(filter);
      if (deleted.deletedCount === 0) {
        return {
          status: 404,
          message: "Document not found",
          data: null,
        };
      }
      return {
        status: 200,
        message: "success",
        data: deleted,
      };
    } catch (error) {
      console.log("error while deleting document", error);
      return {
        status: 500,
        message: "internal server error",
        data: null,
      };
    }
  }

  /**
   * Deletes multiple documents from the specified collection
   * @static
   * @async
   * @template ModelName
   * @param {ModelName} databaseName - Name of the collection
   * @param {FilterQueryType<ModelName>} filter - Filter criteria
   * @returns {Promise<dbResponse>} Response object with status and data
   */
  static async DELETE_MANY<ModelName extends ModelNames>(
    databaseName: ModelName,
    filter: FilterQueryType<ModelName>
  ) {
    const model = this.getModel(databaseName);
    try {
      const deleted = await model.deleteMany(filter);
      if (deleted.deletedCount === 0) {
        return {
          status: 404,
          message: "Document not found",
          data: null,
        };
      }
      return {
        status: 200,
        message: "success",
        data: deleted,
      };
    } catch (error) {
      console.log("error while deleting document", error);
      return {
        status: 500,
        message: "internal server error",
        data: null,
      };
    }
  }

  /**
   * Finds a single document in the specified collection
   * @static
   * @async
   * @template ModelName
   * @param {ModelName} databaseName - Name of the collection
   * @param {FilterQueryType<ModelName>} filter - Filter criteria
   * @returns {Promise<dbResponse>} Response object with status and data
   */
  static async FIND_ONE<ModelName extends ModelNames>(
    databaseName: ModelName,
    filter: FilterQueryType<ModelName>
  ) {
    const model = this.getModel(databaseName);
    try {
      const found = await model.findOne(filter);
      if (!found) {
        return {
          status: 404,
          message: "Document not found",
          data: null,
        };
      }
      return {
        status: 200,
        message: "success",
        data: found,
      };
    } catch (error) {
      console.log("error while finding document", error);
      return {
        status: 500,
        message: "internal server error",
        data: null,
      };
    }
  }

  /**
   * Finds multiple documents in the specified collection
   * @static
   * @async
   * @template ModelName
   * @param {ModelName} databaseName - Name of the collection
   * @param {FilterQueryType<ModelName>} filter - Filter criteria
   * @returns {Promise<dbResponse>} Response object with status and data
   */
  static async FIND_MANY<ModelName extends ModelNames>(
    databaseName: ModelName,
    filter: FilterQueryType<ModelName>
  ) {
    const model = this.getModel(databaseName);
    try {
      const found = await model.find(filter);
      if (found.length === 0) {
        return {
          status: 404,
          message: "Document not found",
          data: null,
        };
      }
      return {
        status: 200,
        message: "success",
        data: found,
      };
    } catch (error) {
      console.log("error while finding document", error);
      return {
        status: 500,
        message: "internal server error",
        data: null,
      };
    }
  }
}

/**
 * Extracts validation errors from mongoose validation error object
 * @param {mongoose.Error.ValidationError} error - Mongoose validation error
 * @returns {Array<{key: string, message: string}>} Array of validation errors
 */
function extractValidationError(
  error: mongoose.Error.ValidationError
): { key: string; message: string }[] {
  const validationErrors: { key: string; message: string }[] = [];

  for (const key in error.errors) {
    if (error.errors.hasOwnProperty(key)) {
      validationErrors.push({
        key: key,
        message: error.errors[key].message,
      });
    }
  }

  return validationErrors;
}

dotenv.config();
