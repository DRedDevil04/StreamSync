import { Request, Response } from "express";
import FriendRequest from "../models/FriendRequests";

export const getRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requests = await FriendRequest.find({
    to: req.user.id,
    status: "pending",
  }).populate("from", "username");
  res.status(200).json({ requests });
};
