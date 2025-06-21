import { Request, Response } from "express";
import Group from "../models/Groups";

const removeMember = async function removeMember(
  req: Request,
  res: Response
): Promise<void> {
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

  group.members = group.members.filter((m) => m.toString() !== memberId);
  await group.save();

  res.status(200).json({ message: "Member removed", group });
};

export default removeMember;