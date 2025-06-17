const mongoose = require("mongoose");

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

    groups: [
      {
        name: String,
        members: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],

    watchedMovies: [
      {
        movieId: String,
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

module.exports = mongoose.model("User", UserSchema);
