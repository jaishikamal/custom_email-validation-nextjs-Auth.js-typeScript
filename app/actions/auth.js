"use server";

import User from "@/models/user";
import { connectDB, disconnectDB } from "@/lib/MongoDB";
import bcrypt from "bcryptjs";

/**
 * Check if a user exists by email
 * @param {string} email - User email to check
 * @returns {Promise<{user: object|null, success: boolean, error?: string}>}
 */
export async function checkUserExists(email) {
  try {
    if (!email) {
      return {
        user: null,
        success: false,
        error: "Email is required",
      };
    }

    await connectDB();
    const user = await User.findOne({ email }).select("_id");
    return {
      user,
      success: true,
    };
  } catch (error) {
    console.error("Error checking user existence:", error);
    return {
      user: null,
      success: false,
      error: "An error occurred while checking user existence.",
    };
  } finally {
    await disconnectDB();
  }
}

/**
 * Register a new user
 * @param {string} name - User's name
 * @param {string} address - User's address
 * @param {string} email - User's email
 * @param {string} password - User's password (will be hashed)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function registerUser(name, address, email, password) {
  try {
    // Validation
    if (!name || !email || !password) {
      return {
        success: false,
        message: "Name, email, and password are required",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    // Create new user
    await User.create({ name, address, email, password: hashedPassword });
    
    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      message: error.message || "Error registering user",
    };
  } finally {
    await disconnectDB();
  }
}

/**
 * Verify user credentials (for authentication)
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, user?: object, message?: string}>}
 */
export async function verifyUserCredentials(email, password) {
  try {
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    await connectDB();
    const user = await User.findOne({ email });
    
    if (!user) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        address: user.address,
      },
    };
  } catch (error) {
    console.error("Error verifying credentials:", error);
    return {
      success: false,
      message: "An error occurred during authentication",
    };
  } finally {
    await disconnectDB();
  }
}
