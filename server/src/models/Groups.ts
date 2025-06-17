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

module.exports = mongoose.model("Group", GroupSchema);
