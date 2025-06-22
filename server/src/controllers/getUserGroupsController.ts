import { Request, Response } from "express";
import Group from "../models/Groups";

const getUserGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's ID

    // Find all groups where the user is a participant
    const groups = await Group.find({ members: userId }).populate(
      "members",
      "name email"
    );

    if (!groups || groups.length === 0) {
      res.status(404).json({ message: "No groups found for the user" });
      return;
    }

    res.status(200).json({ message: "Groups fetched successfully", groups });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching groups", error: error.message });
  }
};

export default getUserGroups;
