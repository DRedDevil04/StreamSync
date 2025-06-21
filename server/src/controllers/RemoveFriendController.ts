import { Request, Response } from "express";
import User from "../models/User";

export const removeFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user.id;
  const friendId = req.body.friendId;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }

    // Remove from both friend lists
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
