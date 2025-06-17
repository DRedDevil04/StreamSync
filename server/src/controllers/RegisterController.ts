import { Request, Response } from "express";
import bcrypt from "bcrypt";

// Mock user database (replace with actual database logic)
const users: { username: string; password: string }[] = [];

/**
 * Registers a new user.
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  // Check if the user already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully" });
};
