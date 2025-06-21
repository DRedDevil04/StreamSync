import { Request, Response } from "express";
import User from "../models/User";

export const updateTags = async function updateUserTags(
  req: Request,
  res: Response
) {
  const { tags } = req.body;
  const userId = req.user.id;

  const user = await User.findByIdAndUpdate(userId, { tags }, { new: true });

  res.status(200).json({ message: "User tags updated", user });
};
