import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import RecommendedMovies from '@/components/RecommendedMovies';

interface Movie {
  id: string;
  title: string;
  attachmentId: string;
  tags: string[];
  rating: number;
  duration: string;
}

const HomePage = () => {
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const mockMovies: Movie[] = [
      {
        id: '1',
        title: 'Inception',
        attachmentId: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg',
        tags: ['Sci-Fi', 'Thriller'],
        rating: 8.8,
        duration: '148',
      },
      {
        id: '2',
        title: 'The Dark Knight',
        attachmentId: 'data:image/jpeg;base64,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',  
        tags: ['Action', 'Crime'],
        rating: 9.0,
        duration: '152',
      },
      {
        id: '3',
        title: 'Interstellar',
        attachmentId: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        tags: ['Adventure', 'Drama'],
        rating: 8.6,
        duration: '169',
      },
    ];

    setWatchedMovies(mockMovies);
    setLoading(false);
  }, []);

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading your movies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-96 bg-gradient-to-r from-purple-900 to-blue-900 flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-xl text-gray-200">Continue your movie journey</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Continue Watching */}
        {watchedMovies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-4">
              {watchedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="w-64 bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <div className="relative">
                    <img
                      src={movie.attachmentId}
                      alt={movie.title}
                      className="w-full h-36 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-movie.jpg';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                      <div className="h-full bg-red-600" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                    <div className="text-sm text-gray-400 truncate">
                      {movie.tags.join(', ')}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-gray-400">⭐ {movie.rating}</div>
                      <div className="text-sm text-gray-400">{movie.duration} mins</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Show Recommended Movies Always */}
        <RecommendedMovies title="Recommended For You" />

        {/* Fallback if user has no watched movies */}
        {watchedMovies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              You haven't watched any movies yet
            </div>
            <button
              onClick={() => navigate('/browse')}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors"
            >
              Browse Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;


// useEffect(() => {
  //   // if (!user || user.id === null) return;
  //   console.log(user)
  //   if (!user.isAuthenticated || !user.id) {
  //     navigate('/login');
  //     return;
  //   }

  //   const fetchWatchedMovies = async () => {
  //     console.log("JEJJ")
  //     try {
  //       const res = await api.get(`/users/${user.id}/watched`);
  //       const transformedWatched = res.data.map((movie: any) => ({
  //         id: movie._id || movie.id,
  //         title: movie.title,
  //         attachmentId: movie.attachmentId || movie.attachmentID || '/placeholder-movie.jpg',
  //         tags: movie.tags || [],
  //         rating: movie.rating || movie.Rating || 0,
  //         duration: movie.duration,
  //       }));
  //       console.log(transformedWatched)
  //       setWatchedMovies(transformedWatched);
  //     } catch (err) {
  //       console.error("Failed to fetch user data:", err);
  //       setError("Failed to load your movies");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchWatchedMovies();
  // }, [navigate, user]);

  // const handleMovieClick = (movieId: string) => {
  //   navigate(`/movie/${movieId}`);
  // };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
  //       <div className="text-xl">Loading your movies...</div>
  //     </div>
  //   );
  // }
