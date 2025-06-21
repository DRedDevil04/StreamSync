import React, { useState, useEffect } from 'react';
import { User, Film, Users, Star, Clock, ThumbsUp, RefreshCw } from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  avatar?: string;
  preferences?: string[];
}

interface Movie {
  id: string;
  title: string;
  poster: string;
  genre: string[];
  rating: number;
  duration: number;
  year: number;
  description: string;
  matchScore: number;
}

interface RecommendationPageProps {
  roomId: string;
  users: User[];
  onMovieSelect?: (movie: Movie) => void;
  recommendationEngine?: {
    getRecommendations: (users: User[]) => Promise<Movie[]>;
  };
}

const RecommendationPage: React.FC<RecommendationPageProps> = ({
  roomId,
  users,
  onMovieSelect,
  recommendationEngine
}) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Fetch recommendations when users change
  useEffect(() => {
    fetchRecommendations();
  }, [users]);

  const fetchRecommendations = async () => {
    if (!users.length) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use the provided recommendation engine or fallback to mock data
      let movieRecommendations: Movie[];
      
      if (recommendationEngine) {
        movieRecommendations = await recommendationEngine.getRecommendations(users);
      } else {
        // Mock recommendations for demo purposes
        movieRecommendations = await getMockRecommendations(users);
      }
      
      setRecommendations(movieRecommendations);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
      console.error('Recommendation fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock recommendation function (replace with your actual implementation)
  const getMockRecommendations = async (users: User[]): Promise<Movie[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: '1',
        title: 'The Matrix',
        poster: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=The+Matrix',
        genre: ['Action', 'Sci-Fi'],
        rating: 8.7,
        duration: 136,
        year: 1999,
        description: 'A computer hacker learns about the true nature of reality.',
        matchScore: 95
      },
      {
        id: '2',
        title: 'Inception',
        poster: 'https://via.placeholder.com/300x450/1a1a1a/FFFFFF?text=Inception',
        genre: ['Action', 'Drama', 'Sci-Fi'],
        rating: 8.8,
        duration: 148,
        year: 2010,
        description: 'A thief who steals corporate secrets through dream-sharing technology.',
        matchScore: 92
      },
      {
        id: '3',
        title: 'Interstellar',
        poster: 'https://via.placeholder.com/300x450/2d2d2d/FFFFFF?text=Interstellar',
        genre: ['Adventure', 'Drama', 'Sci-Fi'],
        rating: 8.6,
        duration: 169,
        year: 2014,
        description: 'A team of explorers travel through a wormhole in space.',
        matchScore: 89
      }
    ];
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    if (onMovieSelect) {
      onMovieSelect(movie);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Movie Recommendations</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-gray-300">Room: {roomId}</span>
            </div>
            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Users in Room */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Users in Room ({users.length})</h2>
          <div className="flex flex-wrap gap-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* No Users State */}
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <Film className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold mb-2">No Users in Room</h3>
            <p className="text-gray-400">Wait for users to join the room to get personalized recommendations.</p>
          </div>
        )}

        {/* Recommendations Grid */}
        {!loading && recommendations.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Recommended Movies ({recommendations.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie)}
                  className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    selectedMovie?.id === movie.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-600 px-2 py-1 rounded-full text-sm font-semibold">
                      {movie.matchScore}% Match
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 truncate">{movie.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{movie.year}</p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{movie.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{formatDuration(movie.duration)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {movie.genre.map((g) => (
                        <span
                          key={g}
                          className="bg-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {movie.description}
                    </p>
                    
                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      Select Movie
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Recommendations State */}
        {!loading && users.length > 0 && recommendations.length === 0 && !error && (
          <div className="text-center py-12">
            <Film className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold mb-2">No Recommendations Found</h3>
            <p className="text-gray-400">
              We couldn't find any recommendations based on the current users' preferences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPage;