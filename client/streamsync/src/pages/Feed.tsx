// // pages/FeedPage.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../utils/axiosInstance'; // 🔁 Axios instance

// interface User {
//   id: string;
//   username: string;
//   avatar: string;
// }

// interface Movie {
//   id: string;
//   title: string;
//   poster: string;
//   genre: string;
// }

// interface Room {
//   id: string;
//   name: string;
//   participantCount: number;
//   isPublic: boolean;
// }

// interface FeedItem {
//   id: string;
//   type: 'watching' | 'completed' | 'room_created' | 'room_joined' | 'rating';
//   user: User;
//   movie?: Movie;
//   room?: Room;
//   rating?: number;
//   comment?: string;
//   timestamp: string;
//   likes: number;
//   isLiked: boolean;
//   canJoin?: boolean;
// }

// type TimeFilter = 'now' | 'today' | 'week' | 'all';

// const FeedPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
//   const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeed = async () => {
//       try {
//         setIsLoading(true);
//         const response = await api.get('/feed');
//         const feed = response.data.map((item: any) => ({
//           id: item._id,
//           type: item.type,
//           user: {
//             id: item.user._id,
//             username: item.user.userName,
//             avatar: item.user.avatar || '/api/placeholder/40/40'
//           },
//           movie: item.movie
//             ? {
//                 id: item.movie._id,
//                 title: item.movie.title,
//                 poster: `/api/posters/${item.movie.attachmentID}`,
//                 genre: item.movie.tags?.[0] || 'General'
//               }
//             : undefined,
//           room: item.room
//             ? {
//                 id: item.room._id,
//                 name: item.room.name || 'Room',
//                 participantCount: item.room.participants?.length || 1,
//                 isPublic: item.room.isPublic || false
//               }
//             : undefined,
//           rating: item.rating,
//           comment: item.comment,
//           timestamp: new Date(item.timestamp).toLocaleString(),
//           likes: item.likes,
//           isLiked: false, // Optional: add real liked info later
//           canJoin: item.room?.isPublic ?? false
//         }));

//         setFeedItems(feed);
//       } catch (error) {
//         console.error('Failed to load feed:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFeed();
//   }, [timeFilter]);

//   const handleLike = (itemId: string) => {
//     setFeedItems(prev => prev.map(item => 
//       item.id === itemId 
//         ? { 
//             ...item, 
//             isLiked: !item.isLiked, 
//             likes: item.isLiked ? item.likes - 1 : item.likes + 1 
//           }
//         : item
//     ));
//   };

//   const handleJoinRoom = (roomId: string) => {
//     navigate(`/room/${roomId}`);
//   };

//   const handleViewMovie = (movieId: string) => {
//     navigate(`/movie/${movieId}`);
//   };

//   const handleViewProfile = (userId: string) => {
//     navigate(`/profile/${userId}`);
//   };

//   const renderFeedItem = (item: FeedItem) => {
//     const getActivityText = () => {
//       switch (item.type) {
//         case 'watching':
//           return (
//             <span>
//               is watching <strong>{item.movie?.title}</strong> in room "{item.room?.name}"
//             </span>
//           );
//         case 'completed':
//           return (
//             <span>
//               finished watching <strong>{item.movie?.title}</strong>
//             </span>
//           );
//         case 'room_created':
//           return (
//             <span>
//               created room "{item.room?.name}" for <strong>{item.movie?.title}</strong>
//             </span>
//           );
//         case 'room_joined':
//           return (
//             <span>
//               joined room "{item.room?.name}"
//             </span>
//           );
//         case 'rating':
//           return (
//             <span>
//               rated <strong>{item.movie?.title}</strong> {item.rating}/10
//             </span>
//           );
//         default:
//           return '';
//       }
//     };

//     return (
//       <div key={item.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
//         {/* Header */}
//         <div className="flex items-start space-x-3 mb-4">
//           <button onClick={() => handleViewProfile(item.user.id)}>
//             <img
//               src={item.user.avatar}
//               alt={item.user.username}
//               className="w-12 h-12 rounded-full hover:ring-2 hover:ring-purple-500 transition-all"
//             />
//           </button>
          
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center space-x-2 mb-1">
//               <button 
//                 onClick={() => handleViewProfile(item.user.id)}
//                 className="font-bold text-white hover:text-purple-400 transition-colors"
//               >
//                 {item.user.username}
//               </button>
//               <span className="text-gray-400">{getActivityText()}</span>
//             </div>
//             <p className="text-gray-400 text-sm">{item.timestamp}</p>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="mb-4">
//           {item.movie && (
//             <div className="flex space-x-4">
//               <button onClick={() => handleViewMovie(item.movie!.id)}>
//                 <img
//                   src={item.movie.poster}
//                   alt={item.movie.title}
//                   className="w-16 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
//                 />
//               </button>
              
//               <div className="flex-1">
//                 <button 
//                   onClick={() => handleViewMovie(item.movie!.id)}
//                   className="text-white font-bold text-lg hover:text-purple-400 transition-colors"
//                 >
//                   {item.movie.title}
//                 </button>
//                 <p className="text-gray-400 text-sm mb-2">{item.movie.genre}</p>
                
//                 {item.rating && (
//                   <div className="flex items-center space-x-2 mb-2">
//                     <div className="flex items-center space-x-1">
//                       {[...Array(5)].map((_, i) => (
//                         <span
//                           key={i}
//                           className={`text-lg ${
//                             i < (item.rating! / 2) ? 'text-yellow-400' : 'text-gray-600'
//                           }`}
//                         >
//                           ⭐
//                         </span>
//                       ))}
//                     </div>
//                     <span className="text-white font-medium">{item.rating}/10</span>
//                   </div>
//                 )}
                
//                 {item.comment && (
//                   <p className="text-gray-300 text-sm italic">"{item.comment}"</p>
//                 )}
//               </div>
//             </div>
//           )}

//           {item.room && item.canJoin && (
//             <div className="mt-4 p-4 bg-gray-700 rounded-lg">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h4 className="text-white font-medium">{item.room.name}</h4>
//                   <p className="text-gray-400 text-sm">
//                     {item.room.participantCount} {item.room.participantCount === 1 ? 'person' : 'people'} watching
//                     {item.room.isPublic ? ' • Public' : ' • Private'}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => handleJoinRoom(item.room!.id)}
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
//                 >
//                   Join Room
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex items-center justify-between pt-4 border-t border-gray-700">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => handleLike(item.id)}
//               className={`flex items-center space-x-2 transition-colors ${
//                 item.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
//               }`}
//             >
//               <span className="text-lg">{item.isLiked ? '❤️' : '🤍'}</span>
//               <span className="text-sm">{item.likes}</span>
//             </button>
            
//             <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
//               <span className="text-lg">💬</span>
//               <span className="text-sm">Comment</span>
//             </button>
            
//             <button className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors">
//               <span className="text-lg">📤</span>
//               <span className="text-sm">Share</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading feed...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="container mx-auto px-6 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-4">Activity Feed</h1>
//           <p className="text-gray-400">See what your friends are watching</p>
//         </div>

//         {/* Time Filter */}
//         <div className="mb-8">
//           <div className="flex space-x-2">
//             {(['now', 'today', 'week', 'all'] as TimeFilter[]).map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setTimeFilter(filter)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   timeFilter === filter
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
//                 }`}
//               >
//                 {filter === 'now' ? 'Now Playing' : 
//                  filter === 'today' ? 'Today' :
//                  filter === 'week' ? 'This Week' : 'All Time'}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Feed Items */}
//         <div className="space-y-6">
//           {feedItems.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-lg mb-4">No activity to show</div>
//               <p className="text-gray-500">
//                 Follow some friends or join rooms to see activity in your feed!
//               </p>
//             </div>
//           ) : (
//             feedItems.map(renderFeedItem)
//           )}
//         </div>

//         {/* Load More Button */}
//         {feedItems.length > 0 && (
//           <div className="mt-8 text-center">
//             <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
//               Load More
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FeedPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  avatar: string;
}

interface Movie {
  id: string;
  title: string;
  poster: string;
  genre: string;
}

interface Room {
  id: string;
  name: string;
  participantCount: number;
  isPublic: boolean;
}

interface FeedItem {
  id: string;
  type: 'watching' | 'completed' | 'room_created' | 'room_joined' | 'rating';
  user: User;
  movie?: Movie;
  room?: Room;
  rating?: number;
  comment?: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  canJoin?: boolean;
}

type TimeFilter = 'now' | 'today' | 'week' | 'all';

const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true);

        const mockFeed: FeedItem[] = [
          {
            id: '1',
            type: 'watching',
            user: {
              id: 'u1',
              username: 'Devam',
              avatar: '/api/placeholder/40/40'
            },
            movie: {
              id: 'm1',
              title: 'Inception',
              poster: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
              genre: 'Sci-Fi'
            },
            room: {
              id: 'r1',
              name: 'Dreamers Room',
              participantCount: 5,
              isPublic: true
            },
            rating: 9,
            comment: 'Mind = Blown 🤯',
            timestamp: new Date().toISOString(),
            likes: 17,
            isLiked: false,
            canJoin: true
          },
          {
            id: '2',
            type: 'completed',
            user: {
              id: 'u2',
              username: 'Arpit',
              avatar: '/api/placeholder/40/40'
            },
            movie: {
              id: 'm2',
              title: 'Pulp Fiction',
              poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
              genre: 'Crime'
            },
            comment: 'Masterpiece!',
            timestamp: new Date().toISOString(),
            likes: 10,
            isLiked: true
          }
        ];

        const feed = mockFeed.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp).toLocaleString()
        }));

        setFeedItems(feed);
      } catch (error) {
        console.error('Failed to load mock feed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [timeFilter]);

  const handleLike = (itemId: string) => {
    setFeedItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1
            }
          : item
      )
    );
  };

  const handleJoinRoom = (roomId: string) => navigate(`/room/${roomId}`);
  const handleViewMovie = (movieId: string) => navigate(`/movie/${movieId}`);
  const handleViewProfile = (userId: string) => navigate(`/profile/${userId}`);

  const renderFeedItem = (item: FeedItem) => {
    const getActivityText = () => {
      switch (item.type) {
        case 'watching':
          return (
            <span>
              is watching <strong>{item.movie?.title}</strong> in room "{item.room?.name}"
            </span>
          );
        case 'completed':
          return (
            <span>
              finished watching <strong>{item.movie?.title}</strong>
            </span>
          );
        case 'room_created':
          return (
            <span>
              created room "{item.room?.name}" for <strong>{item.movie?.title}</strong>
            </span>
          );
        case 'room_joined':
          return (
            <span>
              joined room "{item.room?.name}"
            </span>
          );
        case 'rating':
          return (
            <span>
              rated <strong>{item.movie?.title}</strong> {item.rating}/10
            </span>
          );
        default:
          return '';
      }
    };

    return (
      <div key={item.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
        <div className="flex items-start space-x-3 mb-4">
          <button onClick={() => handleViewProfile(item.user.id)}>
            <img
              src={item.user.avatar}
              alt={item.user.username}
              className="w-12 h-12 rounded-full hover:ring-2 hover:ring-purple-500 transition-all"
            />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <button
                onClick={() => handleViewProfile(item.user.id)}
                className="font-bold text-white hover:text-purple-400 transition-colors"
              >
                {item.user.username}
              </button>
              <span className="text-gray-400">{getActivityText()}</span>
            </div>
            <p className="text-gray-400 text-sm">{item.timestamp}</p>
          </div>
        </div>

        <div className="mb-4">
          {item.movie && (
            <div className="flex space-x-4">
              <button onClick={() => handleViewMovie(item.movie!.id)}>
                <img
                  src={item.movie.poster}
                  alt={item.movie.title}
                  className="w-16 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                />
              </button>

              <div className="flex-1">
                <button
                  onClick={() => handleViewMovie(item.movie!.id)}
                  className="text-white font-bold text-lg hover:text-purple-400 transition-colors"
                >
                  {item.movie.title}
                </button>
                <p className="text-gray-400 text-sm mb-2">{item.movie.genre}</p>

                {item.rating && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < item.rating! / 2 ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-white font-medium">{item.rating}/10</span>
                  </div>
                )}

                {item.comment && (
                  <p className="text-gray-300 text-sm italic">"{item.comment}"</p>
                )}
              </div>
            </div>
          )}

          {item.room && item.canJoin && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{item.room.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {item.room.participantCount} watching •{' '}
                    {item.room.isPublic ? 'Public' : 'Private'}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinRoom(item.room!.id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Join Room
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleLike(item.id)}
              className={`flex items-center space-x-2 transition-colors ${
                item.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <span className="text-lg">{item.isLiked ? '❤️' : '🤍'}</span>
              <span className="text-sm">{item.likes}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading feed...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Activity Feed</h1>
          <p className="text-gray-400">See what your friends are watching</p>
        </div>

        <div className="mb-8">
          <div className="flex space-x-2">
            {(['now', 'today', 'week', 'all'] as TimeFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {filter === 'now' ? 'Now Playing' : 
                 filter === 'today' ? 'Today' :
                 filter === 'week' ? 'This Week' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {feedItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No activity to show</div>
          ) : (
            feedItems.map(renderFeedItem)
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
