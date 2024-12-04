import mongoose from "mongoose";
import dotenv from 'dotenv';
import { models } from "./models";
import { INTERNAL_SERVER_ERROR_OBJECT } from "../constants";
import express, { Express } from 'express';
import multer from 'multer';

interface dbResponse {
    status: number;
    message: string;
    data: any;
}

dotenv.config();

/**
 * Database class responsible for managing MongoDB connections
 * @class Database
 * @description Handles database connection operations using mongoose
 */
export class Database {
    /**
     * Establishes a connection to MongoDB using the connection string from environment variables
     * @async
     * @method connect
     * @throws {Error} If DATABASE_CONNECTION_STRING is not defined in .env
     * @throws {Error} If connection to database fails
     * @returns {Promise<void>} Resolves when connection is successful
     */
    async connect(): Promise<void> {
        try {
            const connectionString = process.env.DATABASE_CONNECTION_STRING;
            if (!connectionString) {
                throw new Error('Database connection string is not defined in .env');
            }
            
            await mongoose.connect(connectionString);
            console.log('Successfully connected to database');
        } catch (error) {
            console.error('Error connecting to database:', error);
            throw error;
        }
    }

    /**
     * Creates a new document in the specified model collection
     * 
     * @param {string} modelName - The name of the mongoose model to create the document in
     * @param {any} data - The data to create the document with
     * @returns {Promise<dbResponse>} A promise that resolves to a database response object
     * 
     * @throws {mongoose.Error.ValidationError} When the document fails validation
     * @throws {mongoose.Error.CastError} When data types don't match the schema
     * 
     * @example
     * // Create a new user
     * const response = await Database.CREATE('User', {
     *   email: 'user@example.com',
     *   password: 'hashedPassword123'
     * });
     * 
     * @example
     * // Handle potential errors
     * try {
     *   const response = await Database.CREATE('User', userData);
     *   if (response.status === 200) {
     *     // Document created successfully
     *   }
     * } catch (error) {
     *   // Handle error
     * }
     */
    static async CREATE(model: string, data: Record<string, any>, files?: Array<any>): Promise<dbResponse>{
        try {
            const modelInstance = models[model];
            const result = await modelInstance.create(data);
            // check if user not created then return different response
            if (!result) {
                return {
                    status: 400,
                    message: "Document not created",
                    data: null
                }
            }
            return {
                status: 200,
                message: "Document created successfully",
                data: result
            }
        } catch (error: unknown) {
            // handle if validation error or duplicate key error
            if (error instanceof mongoose.Error.ValidationError) {
                // Check for duplicate key errors specifically
                const duplicateKeys = Object.keys(error.errors).filter(key => 
                    error.errors[key]?.kind === 'unique' || 
                    (error.errors[key] as any)?.code === 11000
                );

                if (duplicateKeys.length > 0) {
                    return {
                        status: 409,
                        message: `Duplicate key ${duplicateKeys.join(', ')} already exists`,
                        data: null
                    }
                }
                return {
                    status: 400,
                    message: error.message,
                    data: null
                }
            }

            // Handle other mongoose errors
            if (error instanceof mongoose.Error.CastError) {
                return {
                    status: 400,
                    message: "Invalid data type in document",
                    data: null
                }
            }

            // Handle MongoDB server errors (like duplicate key errors that might slip through)
            if ((error as any).code === 11000) {
                return {
                    status: 409,
                    message: "Duplicate key already exists",
                    data: null
                }
            }

            // Fallback for any other unexpected errors
            console.error('Unexpected error in database CREATE:', error);
            return INTERNAL_SERVER_ERROR_OBJECT;
        }
    }
}