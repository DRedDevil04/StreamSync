import { Request, Response } from "express";
import FriendRequest from "../models/FriendRequests";
import User from "../models/User";

export const sendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const from = req.user.id;
  const { to } = req.body;

  let to_id: any;

  if (!to || typeof to !== "string" || !to.trim()) {
    res.status(400).json({ message: "Recipient username is required" });
    return;
  }

  const to_user = await User.findOne({ username: to.trim() });
  if (!to_user) {
    res.status(404).json({ message: "Recipient user not found" });
    return;
  }
  to_id = to_user._id;

  if (from === String(to_id)) {
    res.status(400).json({ message: "Cannot send to yourself" });
    return;
  }

  console.log("Sending request from:", from, "to:", to_id);
  const existing = await FriendRequest.findOne({ from, to: to_id });
  if (existing) {
    res.status(400).json({ message: "Request already sent" });
    return;
  }

  await FriendRequest.create({ from, to: to_id });
  res.status(200).json({ message: "Friend request sent" });
};
