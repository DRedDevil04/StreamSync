import { Request, Response } from "express";
import Group from "../models/Groups";
import User from "../models/User";

 const createGroup = 
  async function createGroup(req: Request, res: Response): Promise<void> {
    const { name, members, description } = req.body;
    const userId = req.user.id; // assuming auth middleware

    const user = await User.findById(userId).populate("friends");

    const friendIds = user.friends.map((f) => f._id.toString());
    const isValidMembers = members.every((id) => friendIds.includes(id));

    if (!isValidMembers) {
      res.status(400).json({ message: "Can only add friends to group" });
      return;
    }

    const allTags = await User.find({ _id: { $in: members } }, "tags");
    const unionTags = [...new Set(allTags.flatMap((u) => u.tags))];

    const group = await Group.create({
      name,
      members,
      createdBy: userId,
      description,
      tags: unionTags,
    });

    res.status(201).json(group);
  };

  export default createGroup;
