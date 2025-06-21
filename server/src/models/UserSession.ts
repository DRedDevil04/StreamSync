import mongoose from "../config/dbConfig";

const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },

  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSessionSchema.index({ userId: 1, joinedAt: -1 });

export default mongoose.model("UserSession", UserSessionSchema);
