import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: Number,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin", "root"],
        default: "user"
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "plans"
    },
})

export const users = mongoose.model("users", userSchema);