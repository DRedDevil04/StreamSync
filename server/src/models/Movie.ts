import mongoose from "../config/dbConfig";

const MovieSchema = new mongoose.Schema({
  movieId: String, // unique ID
  title: String,
  tags: [String],
  description: String,
  attachmentID: String,
  Rating: Number, // ID of the movie file in the storage
  duration: Number, // in minutes
});

export default mongoose.model("Movie", MovieSchema);
