import mongoose from "../config/dbConfig";

const FriendRequestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

FriendRequestSchema.index({ from: 1, to: 1 }, { unique: true }); // Prevent duplicate requests

export default mongoose.model("FriendRequest", FriendRequestSchema);
