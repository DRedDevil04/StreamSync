import User from "../models/User";
import UserSession from "../models/UserSession";
import mongoose from "mongoose";

export const getFeed = async (req: any, res: any) => {
  try {
    const userId = req.user.id; // Assumes you're using middleware like passport/jwt to set req.user
    const { page = 1, limit = 10 } = req.query;

    // Get user's friends
    const user = await User.findById(userId).select("friends").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const friendIds = user.friends;

    if (!friendIds.length)
      return res.json({ sessions: [], totalGroups: 0, page, totalPages: 0 });

    // Aggregate sessions of friends, group by roomId, sort by most recent joinedAt
    const sessions = await UserSession.aggregate([
      {
        $match: {
          userId: { $in: friendIds },
        },
      },
      {
        $sort: {
          joinedAt: -1,
        },
      },
      {
        $group: {
          _id: "$roomId",
          sessions: {
            $push: {
              userId: "$userId",
              joinedAt: "$joinedAt",
            },
          },
          latestSession: { $first: "$joinedAt" },
        },
      },
      {
        $sort: {
          latestSession: -1,
        },
      },
      {
        $facet: {
          metadata: [
            { $count: "totalGroups" },
            {
              $addFields: {
                page: Number(page),
                totalPages: {
                  $ceil: {
                    $divide: ["$totalGroups", Number(limit)],
                  },
                },
              },
            },
          ],
          data: [
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) },
          ],
        },
      },
    ]);

    const response = {
      sessions: sessions[0].data,
      ...sessions[0].metadata[0],
    };

    res.json(response);
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
