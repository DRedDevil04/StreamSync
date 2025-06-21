import React, { type JSX } from 'react';

// TypeScript interface matching your Mongoose schema
interface Movie {
  movieId: string;
  title: string;
  tag: string[];
  description: string;
  attachmentID: string;
  Rating: number;
  duration: number; // in minutes
}

// Props interface for the component
interface MovieProps {
  movie: Movie;
  onPlay?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MovieComponent: React.FC<MovieProps> = ({ 
  movie, 
  onPlay, 
  onEdit, 
  onDelete 
}) => {
  // Helper function to format duration
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Helper function to render star rating
  const renderStarRating = (rating: number): JSX.Element[] => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Movie Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
            ID: {movie.movieId}
          </span>
          <span>{formatDuration(movie.duration)}</span>
        </div>
      </div>

      {/* Movie Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {renderStarRating(movie.Rating)}
          </div>
          <span className="text-gray-600 text-sm">({movie.Rating}/5)</span>
        </div>

        {/* Tags */}
        {movie.tag && movie.tag.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {movie.tag.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {movie.description}
        </p>

        {/* Attachment Info */}
        {movie.attachmentID && (
          <div className="text-xs text-gray-500 mb-4">
            Attachment: {movie.attachmentID}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onPlay && (
            <button
              onClick={onPlay}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Play
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieComponent;

// Example usage:
/*
const exampleMovie: Movie = {
  movieId: "MOV001",
  title: "The Great Adventure",
  tag: ["Action", "Adventure", "Thriller"],
  description: "An epic journey through unknown territories filled with danger and excitement.",
  attachmentID: "file_123456789",
  Rating: 4.5,
  duration: 145
};

<MovieComponent 
  movie={exampleMovie}
  onPlay={() => console.log('Playing movie')}
  onEdit={() => console.log('Editing movie')}
  onDelete={() => console.log('Deleting movie')}
/>
*/