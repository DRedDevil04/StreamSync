import { Request, Response } from "express";
import Group from "../models/Groups";
import User from "../models/User";

export default async function addMemberToGroup(req: Request, res: Response): Promise<void> {
  const { groupId } = req.params;
  const { memberId } = req.body;
  const userId = req.user.id;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404).json({ message: "Group not found" });
    return;
  }

  if (group.createdBy.toString() !== userId) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }

  // Prevent adding duplicate members
  if (group.members.includes(memberId)) {
    res.status(400).json({ message: "User already in group" });
    return;
  }
  // Check if member is in creator's friends
  const user = await User.findById(userId).populate("friends");
  const friendIds = user.friends.map((f) => f._id.toString());
  if (!friendIds.includes(memberId)) {
    res.status(400).json({ message: "Only friends can be added" });
    return;
  }
  // Add member
  group.members.push(memberId);

  // Union tags
  const newMember = await User.findById(memberId);
  const allTags = new Set([...group.tags, ...(newMember.tags || [])]);
  group.tags = [...allTags];

  await group.save();

  res.status(200).json({ message: "Member added", group });
}
