import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock user database (replace with actual database logic)
const users: { username: string; password: string }[] = [];

/**
 * Logs in a user.
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  // Find the user
  const user = users.find((user) => user.username === username);
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  // Compare the password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, "your_jwt_secret", { expiresIn: "1h" });

  res.status(200).json({ message: "Login successful", token });
};
