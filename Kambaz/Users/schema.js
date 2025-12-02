import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    email: String,
    lastName: String,
    dob: String, // Changed from Date to String
    role: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN", "USER", "TA"],
      default: "USER",
    },
    loginId: String,
    section: String,
    lastActivity: String, // Changed from Date to String
    totalActivity: String,
  },
  { collection: "users", strict: false } // Added strict: false
);

export default userSchema;
