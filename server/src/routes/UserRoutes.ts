import { Router } from "express";
import router from "./VideoRouter";
import { updateTags } from "../controllers/editTagsController";

const userRoutes = Router();

router.post("/tags", updateTags);
//we can add more functionalities later here such as user profile management, settings, etc.

export default userRoutes;
