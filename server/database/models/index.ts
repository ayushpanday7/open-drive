import { Model } from "mongoose";
import { users } from "./user.model";

// User document interface
export interface IUser {
    username: string;
    password: string;
    email: string;
}

// Export models instance
export const models = { users };

// Define specific model types
export type Models = {
    users: typeof users;  // This makes it specific to users model
};