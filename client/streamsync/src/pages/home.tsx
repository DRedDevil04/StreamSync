// pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  genre: string;
  rating: number;
  duration: string;
}

interface CarouselSection {
  title: string;
  movies: Movie[];
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - replace with API calls
  const carouselSections: CarouselSection[] = [
    {
      title: "Continue Watching",
      movies: [
        { id: '1', title: 'Inception', thumbnail: '/api/placeholder/300/200', genre: 'Sci-Fi', rating: 8.8, duration: '2h 28m' },
        { id: '2', title: 'The Dark Knight', thumbnail: '/api/placeholder/300/200', genre: 'Action', rating: 9.0, duration: '2h 32m' },
      ]
    },
    {
      title: "Because you watched Inception",
      movies: [
        { id: '3', title: 'Interstellar', thumbnail: '/api/placeholder/300/200', genre: 'Sci-Fi', rating: 8.6, duration: '2h 49m' },
        { id: '4', title: 'Tenet', thumbnail: '/api/placeholder/300/200', genre: 'Thriller', rating: 7.3, duration: '2h 30m' },
        { id: '5', title: 'The Matrix', thumbnail: '/api/placeholder/300/200', genre: 'Sci-Fi', rating: 8.7, duration: '2h 16m' },
      ]
    },
    {
      title: "Top Picks",
      movies: [
        { id: '6', title: 'Parasite', thumbnail: '/api/placeholder/300/200', genre: 'Thriller', rating: 8.5, duration: '2h 12m' },
        { id: '7', title: 'Joker', thumbnail: '/api/placeholder/300/200', genre: 'Drama', rating: 8.4, duration: '2h 2m' },
        { id: '8', title: 'Avengers: Endgame', thumbnail: '/api/placeholder/300/200', genre: 'Action', rating: 8.4, duration: '3h 1m' },
      ]
    },
    {
      title: "Horror",
      movies: [
        { id: '9', title: 'The Conjuring', thumbnail: '/api/placeholder/300/200', genre: 'Horror', rating: 7.5, duration: '1h 52m' },
        { id: '10', title: 'Hereditary', thumbnail: '/api/placeholder/300/200', genre: 'Horror', rating: 7.3, duration: '2h 7m' },
      ]
    },
    {
      title: "Hidden Gems",
      movies: [
        { id: '11', title: 'Arrival', thumbnail: '/api/placeholder/300/200', genre: 'Sci-Fi', rating: 7.9, duration: '1h 56m' },
        { id: '12', title: 'Ex Machina', thumbnail: '/api/placeholder/300/200', genre: 'Sci-Fi', rating: 7.7, duration: '1h 48m' },
      ]
    }
  ];

  const handlePlayClick = (movieId: string) => {
    navigate(`/watch/${movieId}`);
  };

  const handleDetailsClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-purple-900 to-blue-900 flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome Back!
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Continue watching or discover something new
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-8">
        {carouselSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
            
            {/* Horizontal Scrollable Carousel */}
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {section.movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-64 bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200"
                >
                  {/* Movie Thumbnail */}
                  <div className="relative">
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-full h-36 object-cover"
                    />
                    {/* Overlay Buttons */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handlePlayClick(movie.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        Play
                      </button>
                      <button
                        onClick={() => handleDetailsClick(movie.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                  
                  {/* Movie Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 truncate">{movie.title}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{movie.genre}</span>
                      <span>⭐ {movie.rating}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{movie.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;