import { Request, Response } from "express";
import Movie from "../models/Movie"

// Create a new movie
export const createMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      movieId,
      title,
      tags,
      description,
      attachmentID,
      Rating,
      duration,
    } = req.body;

    const newMovie = await Movie.create({
      movieId,
      title,
      tags,
      description,
      attachmentID,
      Rating,
      duration,
    });

    res
      .status(201)
      .json({ message: "Movie created successfully", movie: newMovie });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating movie", error: error.message });
  }
};

// Get all movies
export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching movies", error: error.message });
  }
};

// Get a single movie by ID
export const getMovieById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    res.status(200).json(movie);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching movie", error: error.message });
  }
};

// Update a movie by ID
export const updateMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedMovie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating movie", error: error.message });
  }
};

// Delete a movie by ID
export const deleteMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Movie deleted successfully", movie: deletedMovie });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting movie", error: error.message });
  }
};
