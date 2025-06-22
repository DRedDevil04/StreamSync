// components/RecommendedMovies.tsx
import React, { useEffect, useState } from 'react';
import api from '@/utils/axiosInstance';

interface Movie {
  id: string;
  title: string;
  attachmentId: string;
  tags: string[];
  rating: number;
  duration: string;
}

interface RecommendedMoviesProps {
  userIds: string[]; // Mongo ObjectIds as strings
  title?: string;
}

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ userIds, title = "Recommended For You" }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await api.post('/recommend/group', {
          user_ids: userIds,
        });

        const transformed = res.data.recommendations.map((m: any) => ({
          id: m._id,
          title: m.title,
          attachmentId: m.attachmentId,
          tags: m.tags || [],
          rating: m.Rating,
          duration: m.duration,
        }));

        setMovies(transformed);
      } catch (err) {
        console.error("Recommendation fetch error:", err);
        setError("Unable to fetch recommendations.");
      } finally {
        setLoading(false);
      }
    };

    if (userIds.length > 0) {
      fetchRecommendations();
    }
  }, [userIds]);

  if (loading) return <div className="text-gray-400">Loading Recommendations...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-4">
        {movies.map((movie) => (
          <div key={movie.id} className="w-64 bg-gray-800 rounded-md overflow-hidden">
            <img src={movie.attachmentId} alt={movie.title} className="w-full h-36 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
              <div className="text-sm text-gray-400">{movie.tags.join(', ')}</div>
              <div className="text-sm text-gray-400">⭐ {movie.rating}</div>
              <div className="text-sm text-gray-400">{movie.duration} mins</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedMovies;
