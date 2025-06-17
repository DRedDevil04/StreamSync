import { Router } from "express";
import { loginUser } from "../controllers/LoginController";
import { registerUser } from "../controllers/RegisterController";

const authRoutes = Router();

// Route for user registration
authRoutes.post("/register", registerUser);

// Route for user login
authRoutes.post("/login", loginUser);

export default authRoutes;
