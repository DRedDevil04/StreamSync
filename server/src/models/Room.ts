import mongoose from "../config/dbConfig";

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie", // Reference to the Movie model
  },
  mode: {
    type: String,
    enum: ["public", "private"],
    required: true,
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
  maxCapacity: {
    type: Number,
    default: 10,
  },
});

export default mongoose.model("Room", RoomSchema);
