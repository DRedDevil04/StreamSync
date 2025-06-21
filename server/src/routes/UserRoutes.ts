import { Router } from "express";
import { updateTags } from "../controllers/editTagsController";

const userRoutes = Router();

userRoutes.post("/tags", updateTags);
//we can add more functionalities later here such as user profile management, settings, etc.

export default userRoutes;
