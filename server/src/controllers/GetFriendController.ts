import { Request, Response } from "express";
import User from "../models/User";

export const getFriends = async (req: Request, res: Response) => {
  try {
    console.log("Fetching friends for user:", req.user.id);
    const user = await User.findById(req.user.id).populate({
      path: "friends",
      select: "username email tags watchedMovies", // Include watchedMovies
      // populate: {
      //   path: "watchedMovies.movie", // Populate the movie details
      //   match: { mode: "public" }, // Filter movies with public mode
      //   select: "title genre description duration", // Include specific movie fields
      // },
    });

    res.status(200).json({ friends: user.friends });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
