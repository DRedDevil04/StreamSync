const MovieSchema = new mongoose.Schema({
  movieId: String, // unique ID
  title: String,
  genre: [String],
  description: String,
  attachmentID: String,
  Rating: Number, // ID of the movie file in the storage
  duration: Number, // in minutes
});

module.exports = mongoose.model("Movie", MovieSchema);
