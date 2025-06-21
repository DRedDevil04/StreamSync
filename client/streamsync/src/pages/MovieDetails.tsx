// pages/MovieDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Movie {
  id: string;
  title: string;
  poster: string;
  trailer: string;
  synopsis: string;
  cast: string[];
  genre: string[];
  rating: number;
  duration: string;
  releaseYear: number;
  director: string;
}

interface FriendRating {
  id: string;
  username: string;
  avatar: string;
  rating: number;
  comment: string;
}

interface Comment {
  id: string;
  username: string;
  avatar: string;
  comment: string;
  timestamp: string;
}

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [friendRatings, setFriendRatings] = useState<FriendRating[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Mock data - replace with API call
    const mockMovie: Movie = {
      id: id || '1',
      title: 'Inception',
      poster: '/api/placeholder/400/600',
      trailer: '/api/placeholder/800/450',
      synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page'],
      genre: ['Sci-Fi', 'Thriller', 'Action'],
      rating: 8.8,
      duration: '2h 28m',
      releaseYear: 2010,
      director: 'Christopher Nolan'
    };

    const mockFriendRatings: FriendRating[] = [
      { id: '1', username: 'john_doe', avatar: '/api/placeholder/40/40', rating: 9, comment: 'Mind-blowing movie!' },
      { id: '2', username: 'sarah_wilson', avatar: '/api/placeholder/40/40', rating: 8, comment: 'Great concept but confusing at times' },
    ];

    const mockComments: Comment[] = [
      { id: '1', username: 'alex_smith', avatar: '/api/placeholder/40/40', comment: 'Just watched this again, still amazing!', timestamp: '2 hours ago' },
      { id: '2', username: 'mike_jones', avatar: '/api/placeholder/40/40', comment: 'Perfect for a movie night with friends', timestamp: '1 day ago' },
    ];

    setMovie(mockMovie);
    setFriendRatings(mockFriendRatings);
    setComments(mockComments);
  }, [id]);

  const handleStartWatching = () => {
    navigate(`/watch/${id}`);
  };

  const handleCreateRoom = () => {
    navigate(`/rooms?movie=${id}`);
  };

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    // API call to add/remove from watchlist
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        username: 'current_user',
        avatar: '/api/placeholder/40/40',
        comment: newComment,
        timestamp: 'Just now'
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Trailer */}
      <div className="relative h-96 bg-gray-800">
        <img
          src={movie.trailer}
          alt={movie.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        
        <div className="absolute bottom-8 left-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
          <div className="flex items-center space-x-4 text-lg">
            <span>⭐ {movie.rating}</span>
            <span>{movie.duration}</span>
            <span>{movie.releaseYear}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Movie Info */}
          <div className="lg:col-span-2">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={handleStartWatching}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors flex items-center space-x-2"
              >
                <span>▶</span>
                <span>Start Watching</span>
              </button>
              
              <button
                onClick={handleCreateRoom}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors flex items-center space-x-2"
              >
                <span>👥</span>
                <span>Watch Together</span>
              </button>
              
              <button
                onClick={handleAddToWatchlist}
                className={`${isInWatchlist ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2`}
              >
                <span>{isInWatchlist ? '✓' : '+'}</span>
                <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

            {/* Movie Details */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{movie.synopsis}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold mb-2">Director</h3>
                  <p className="text-gray-300">{movie.director}</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g, index) => (
                      <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="font-bold mb-2">Cast</h3>
                  <p className="text-gray-300">{movie.cast.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Comments</h2>
              
              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-4">
                  <img
                    src="/api/placeholder/40/40"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full bg-gray-700 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                    />
                    <button
                      type="submit"
                      className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4 p-4 bg-gray-700 rounded-lg">
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold">{comment.username}</span>
                        <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-300">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Social & Poster */}
          <div className="space-y-6">
            {/* Movie Poster */}
            <div className="bg-gray-800 rounded-lg p-6">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Friend Ratings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Friend Ratings</h3>
              <div className="space-y-4">
                {friendRatings.map((rating) => (
                  <div key={rating.id} className="flex items-start space-x-3">
                    <img
                      src={rating.avatar}
                      alt={rating.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{rating.username}</span>
                        <div className="flex items-center space-x-1">
                          <span>⭐</span>
                          <span>{rating.rating}/10</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{rating.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;