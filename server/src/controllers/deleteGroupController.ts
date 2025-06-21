import { Request, Response } from "express";
import Group from "../models/Groups";

export default async function deleteGroup(req: Request, res: Response): Promise<void> {
  const { groupId } = req.params;
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

  await Group.findByIdAndDelete(groupId);
  res.status(200).json({ message: "Group deleted" });
}
