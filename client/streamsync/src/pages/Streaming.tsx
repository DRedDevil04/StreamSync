import React, { useEffect, useState } from 'react';
import { Play, Info, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Movie type
interface Movie {
  movieId: string;
  title: string;
  tags: string[];
  description: string;
  attachmentID: string;
  Rating: number;
  duration: number;
}

// MovieCard component
const MovieCard: React.FC<{ movie: Movie; size?: 'normal' | 'large'; onClick?: () => void }> = ({ movie, size = 'normal', onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 bg-gray-800 ${
        size === 'large' ? 'w-80 h-48' : 'w-64 h-36'
      } ${isHovered ? 'scale-105 z-10' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-2xl mb-2">🎬</div>
          <div className="text-sm">Thumbnail</div>
          <div className="text-xs opacity-75">{movie.attachmentID}</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
        <h3 className={`text-white font-bold ${size === 'large' ? 'text-lg' : 'text-sm'} mb-1 line-clamp-1`}>{movie.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>{movie.Rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{movie.duration}m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// CategoryRow component
const CategoryRow: React.FC<{
  title: string;
  movies: Movie[];
  onMovieSelect?: (movie: Movie) => void;
}> = ({ title, movies, onMovieSelect }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 300;
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(scrollPosition + scrollAmount, (movies.length - 4) * 280);
    setScrollPosition(newPosition);
    containerRef.current.style.transform = `translateX(-${newPosition}px)`;
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 px-6">{title}</h2>
      <div className="relative group px-6">
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
          disabled={scrollPosition === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
          disabled={scrollPosition >= (movies.length - 4) * 280}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="overflow-hidden">
          <div ref={containerRef} className="flex gap-4 transition-transform duration-300 ease-in-out">
            {movies.map(movie => (
              <div key={movie.movieId}>
                <MovieCard movie={movie} onClick={() => onMovieSelect?.(movie)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// HeroSection component
const HeroSection: React.FC<{
  movie: Movie;
  onPlay?: (movie: Movie) => void;
  onInfo?: (movie: Movie) => void;
}> = ({ movie, onPlay, onInfo }) => (
  <div className="relative h-96 flex items-center px-6 mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
    <div className="relative z-10 max-w-2xl">
      <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>
      <div className="flex items-center gap-4 text-white mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="text-lg">{movie.Rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-5 h-5" />
          <span className="text-lg">{movie.duration} min</span>
        </div>
        <div className="flex gap-2">
          {movie.tags.map(tag => (
            <span key={tag} className="bg-orange-600 bg-opacity-70 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="text-xl text-gray-200 mb-6 leading-relaxed max-w-xl line-clamp-3">{movie.description}</p>
      <div className="flex gap-4">
        <button
          onClick={() => onPlay?.(movie)}
          className="bg-white text-black px-8 py-3 rounded-md text-lg font-semibold flex items-center gap-3 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <Play className="w-6 h-6" /> Play Now
        </button>
        <button
          onClick={() => onInfo?.(movie)}
          className="bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded-md text-lg font-semibold flex items-center gap-3 hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <Info className="w-6 h-6" /> More Info
        </button>
      </div>
    </div>
  </div>
);

// StreamingPage component
const StreamingPage: React.FC<{
  movies: Movie[];
  categories: { name: string; movies: Movie[] }[];
  featuredMovie?: Movie;
  onPlayMovie?: (movie: Movie) => void;
  onMovieInfo?: (movie: Movie) => void;
  onMovieSelect?: (movie: Movie) => void;
}> = ({ movies, categories, featuredMovie, onPlayMovie, onMovieInfo, onMovieSelect }) => {
  const [currentFeatured, setCurrentFeatured] = useState<Movie | null>(featuredMovie || null);

  useEffect(() => {
    if (!featuredMovie && movies.length > 0) {
      setCurrentFeatured(movies[0]);
      const interval = setInterval(() => {
        setCurrentFeatured(current => {
          if (!current) return movies[0];
          const currentIndex = movies.findIndex(movie => movie.movieId === current.movieId);
          const nextIndex = (currentIndex + 1) % movies.length;
          return movies[nextIndex];
        });
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [movies, featuredMovie]);

  const defaultCategories = categories.length > 0 ? categories : [
    { name: 'All Movies', movies }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {currentFeatured && (
        <HeroSection
          movie={currentFeatured}
          onPlay={onPlayMovie}
          onInfo={onMovieInfo}
        />
      )}
      <div className="space-y-8 pb-16">
        {defaultCategories.map((category, index) => (
          <CategoryRow
            key={`${category.name}-${index}`}
            title={category.name}
            movies={category.movies}
            onMovieSelect={onMovieSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default StreamingPage;
