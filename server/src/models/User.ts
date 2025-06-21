import mongoose from "../config/dbConfig";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    watchedMovies: [
      {
        movie: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Movie", // Reference to the Movie model
        },
        mode: {
          type: String,
          enum: ["private", "public"],
          default: "private",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    tags: [String], // For interest matching (e.g., ["comedy", "horror"])

    socketId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
