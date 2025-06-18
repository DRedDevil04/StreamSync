import { Request, Response } from "express";
import bcrypt from "bcrypt";

import User from "../models/User";

/**
 * Registers a new user.
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res
      .status(400)
      .json({ message: "Username,email and password are required" });
    return;
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user in the database
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
