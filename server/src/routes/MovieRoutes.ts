import express from "express";
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../controllers/MovieController";

const router = express.Router();

// Route to create a new movie
router.post("/", createMovie);

// Route to get all movies
router.get("/", getMovies);

// Route to get a single movie by ID
router.get("/:id", getMovieById);

// Route to update a movie by ID
router.put("/:id", updateMovie);

// Route to delete a movie by ID
router.delete("/:id", deleteMovie);

export default router;
