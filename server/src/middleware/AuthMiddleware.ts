import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate requests using JWT.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
