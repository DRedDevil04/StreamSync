const TagSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
  },

  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: false, // optional if it's from individual user
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  timestamp: {
    type: Number, // in seconds or milliseconds
    required: true,
  },

  comment: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tag", TagSchema);
