import { Request, Response } from "express";
import Group from "../models/Groups";

export default async function setGroupTags(req: Request, res: Response): Promise<void> {
  const { groupId } = req.params;
  const { tags } = req.body;
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

  group.tags = tags;
  await group.save();

  res.status(200).json({ message: "Group tags updated manually", tags });
}
