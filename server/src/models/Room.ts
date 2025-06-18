import mongoose from "../config/dbConfig";

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  movieId: String,
  mode: {
    type: String,
    enum: ["public", "private"],
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Room", RoomSchema);
