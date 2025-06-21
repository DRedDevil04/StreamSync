import { Request, Response } from "express";
import FriendRequest from "../models/FriendRequests";

export const sendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const from = req.user.id;
  const { to } = req.body;

  if (from === to) {
    res.status(400).json({ message: "Cannot send to yourself" });
    return;
  }

  const existing = await FriendRequest.findOne({ from, to });
  if (existing) {
    res.status(400).json({ message: "Request already sent" });
    return;
  }

  await FriendRequest.create({ from, to });
  res.status(200).json({ message: "Friend request sent" });
};
