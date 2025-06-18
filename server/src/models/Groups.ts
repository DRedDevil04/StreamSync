import mongoose from "../config/dbConfig";

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  description: {
    type: String,
    default: "",
  },

  tags: [String], // overall group tags/interests

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Group", GroupSchema);
