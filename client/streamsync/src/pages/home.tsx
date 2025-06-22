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
        attachmentId: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
        tags: ['Sci-Fi', 'Thriller'],
        rating: 8.8,
        duration: '148',
      },
      {
        id: '2',
        title: 'The Dark Knight',
        attachmentId: 'https://image.tmdb.org/t/p/w500/rqAHkvXldb9tHlnbQDwOzRi0yVD.jpg',
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
