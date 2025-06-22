import { Request, Response } from "express";
import FriendRequest from "../models/FriendRequests";
import User from "../models/User";

export const handleRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { requestId, action } = req.body; // action: 'accept' or 'reject'
  const request = await FriendRequest.findById(requestId);
  if (!request || request.to.toString() !== req.user.id) {
    res.status(403).json({ message: "Unauthorized or not found" });
    return;
  }

  request.status = action === "accept" ? "accepted" : "rejected";
  await request.save();

  if (action === "accept") {
    const [fromUser, toUser] = await Promise.all([
      User.findById(request.from),
      User.findById(request.to),
    ]);

    if (!fromUser.friends.includes(request.to))
      fromUser.friends.push(request.to);
    if (!toUser.friends.includes(request.from))
      toUser.friends.push(request.from);

    await fromUser.save();
    await toUser.save();
  }

  res.status(200).json({
    message: `Request ${action}ed`,
    from_id: request.from,
    to_id: request.to,
    status: request.status,
  });
};
