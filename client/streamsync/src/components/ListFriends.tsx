import React, { useState, useEffect } from 'react';
import { Users, Search, MessageCircle, MoreVertical, UserMinus, Volume2, VolumeX, Crown, Gamepad2, Circle } from 'lucide-react';
import api from '@/utils/axiosInstance';

interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar?: string | null;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: Date;
  mutualFriends: number;
  currentGame?: string;
  isMuted: boolean;
  isFavorite: boolean;
}

const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Mock API function - replace with your actual API call
  const fetchFriends = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate API call
     const response = await api.get("/connections/friends")
        console.log('Fetched friends:', response.data.friends);
      // Mock data - replace with actual API endpoint
      
      
      setFriends(response.data.friends);
    } catch (err) {
      console.error('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter friends based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(friend =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [friends, searchQuery]);

  const getStatusColor = (status: Friend['status']): string => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const handleMessage = (friendId: string): void => {
    console.log(`Opening chat with friend: ${friendId}`);
    // Implement chat functionality
  };

  const handleToggleMute = (friendId: string): void => {
    setFriends(prev => prev.map(friend =>
      friend.id === friendId ? { ...friend, isMuted: !friend.isMuted } : friend
    ));
  };

  const handleToggleFavorite = (friendId: string): void => {
    setFriends(prev => prev.map(friend =>
      friend.id === friendId ? { ...friend, isFavorite: !friend.isFavorite } : friend
    ));
  };

  const handleRemoveFriend = (friendId: string): void => {
    if (confirm('Are you sure you want to remove this friend?')) {
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
    }
  };

  const toggleDropdown = (friendId: string): void => {
    setActiveDropdown(activeDropdown === friendId ? null : friendId);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Sort friends: favorites first, then by status (online > away > busy > offline)
  const sortedFriends = [...filteredFriends].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    
    const statusOrder = { online: 0, away: 1, busy: 2, offline: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading friends...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <Search className="w-6 h-6 text-slate-400" />
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-slate-400 border-none outline-none text-lg"
        />
      </div>

      {/* Friends Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Friends ({sortedFriends.length})
        </h2>
        <div className="text-slate-400 text-sm">
          {friends.filter(f => f.status === 'online').length} online
        </div>
      </div>

      {/* Friends List */}
      {sortedFriends.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">
            {searchQuery ? 'No friends found matching your search' : 'No friends yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {sortedFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="flex items-center space-x-3">
                {/* Avatar with Status */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                    {friend.avatar ? (
                      <img
                        src={friend.avatar}
                        alt={friend.displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Users className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  {/* Status Indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${getStatusColor(friend.status)}`} />
                  {/* Favorite Crown */}
                  {friend.isFavorite && (
                    <Crown className="absolute -top-1 -left-1 w-4 h-4 text-yellow-500" />
                  )}
                </div>

                {/* Friend Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-medium truncate">
                      {friend.username}
                    </h3>
                    {friend?.isMuted && (
                      <VolumeX className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">@{friend.username}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {friend.currentGame && friend.status !== 'offline' && (
                      <Gamepad2 className="w-3 h-3 text-slate-500" />
                    )}
                    {friend?.mutualFriends > 0 && (
                      <>
                        <Circle className="w-1 h-1 text-slate-600 fill-current" />
                        <span className="text-slate-500 text-xs">
                          {friend.mutualFriends} mutual
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMessage(friend.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    title="Send message"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>

                  {/* More Options Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(friend.id);
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeDropdown === friend.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-slate-700 rounded-lg shadow-lg border border-slate-600 z-10">
                        <button
                          onClick={() => {
                            handleToggleFavorite(friend.id);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-white hover:bg-slate-600 transition-colors flex items-center space-x-2"
                        >
                          <Crown className="w-4 h-4" />
                          <span>{friend.isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
                        </button>
                        <button
                          onClick={() => {
                            handleToggleMute(friend.id);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-white hover:bg-slate-600 transition-colors flex items-center space-x-2"
                        >
                          {friend.isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                          <span>{friend.isMuted ? 'Unmute' : 'Mute'}</span>
                        </button>
                        <button
                          onClick={() => {
                            handleRemoveFriend(friend.id);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-600 transition-colors flex items-center space-x-2"
                        >
                          <UserMinus className="w-4 h-4" />
                          <span>Remove friend</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;