import { Router } from "express";
import { getFriends } from "../controllers/GetFriendController";
import { getRequests } from "../controllers/GetRequestsController";
import { sendRequest } from "../controllers/SendRequestsController";
import { handleRequests } from "../controllers/HandleRequestController";
import { removeFriend } from "../controllers/RemoveFriendController";
import { authenticate } from "../middleware/AuthMiddleware";

const FriendsRoutes = Router();

// Route to get the list of friends
FriendsRoutes.get("/friends", authenticate, getFriends);

// Route to get friend requests
FriendsRoutes.get("/requests", authenticate, getRequests);

// Route to send a friend request
FriendsRoutes.post("/requests/send", authenticate, sendRequest);

// Route to handle friend requests (accept/reject)
FriendsRoutes.post("/requests/handle", authenticate, handleRequests);

// Route to remove a friend
FriendsRoutes.delete("/friends/remove", authenticate, removeFriend);

export default FriendsRoutes;
