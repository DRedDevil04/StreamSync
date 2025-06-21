import { Router } from "express";
import { authenticate } from "../middleware/AuthMiddleware";
import createGroup from "../controllers/createGroupController";
import deleteGroup from "../controllers/deleteGroupController";
import addMemberToGroup from "../controllers/addMemberToGroupController";
import removeMember from "../controllers/removeSomeoneController";
import setGroupTags from "../controllers/editGroupTagsConctroller";

const groupRoutes = Router();

// Route to create a group
groupRoutes.post("/create", authenticate, createGroup);

// Route to delete a group
groupRoutes.delete("/delete/:groupId", authenticate, deleteGroup);

// Route to add a member to a group
groupRoutes.post("/add-member/:groupId", authenticate, addMemberToGroup);

// Route to remove a member from a group
groupRoutes.post("/remove-member/:groupId", authenticate, removeMember);

// Route to edit group tags
groupRoutes.put("/edit-tags/:groupId", authenticate, setGroupTags);

export default groupRoutes;
