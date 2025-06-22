import React, { useState, useEffect } from 'react';
import { Users, Plus, ChevronRight, Search, Settings, UserPlus, MessageCircle, Calendar, ArrowLeft, X, Loader2, Check } from 'lucide-react';
import api from '@/utils/axiosInstance';
import { useSelector } from 'react-redux';

interface Group {
  name: string;
  members: string;
  createdBy: string;
  description: string;
}

interface Friend {
  username: string;
  displayName: string;
}

interface GroupsApiService {
  fetchGroups: () => Promise<Group[]>;
  createGroup: (group: Omit<Group, 'members'> & { selectedFriends: string[] }) => Promise<Group>;
  getFriends: () => Promise<Friend[]>;
}

// Mock API service - replace with your actual API calls
const apiService: GroupsApiService = {
  fetchGroups: async () => {
    const res = await api.get('group/my-groups');
    return res.data.groups
  },

  createGroup: async (group: Omit<Group, 'members'> & { selectedFriends: string[] }) => {
    console.log('Creating group with data:',group);
    const res = await api.post('group/create', group);
    return res.data;
  },

  getFriends: async () => {
    const res = await api.get('connections/friends');
    return res.data.friends
  }
};

const Groups = () => {
  const [activeView, setActiveView] = useState<'main' | 'create' | 'view'>('main');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userid = useSelector((state: any) => state.user.id); 

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    createdBy: userid 
  });

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  // Simple client-side search
  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredGroups(groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredGroups(groups);
    }
  }, [searchTerm, groups]);

  // Load friends when switching to create view
  useEffect(() => {
    if (activeView === 'create') {
      fetchFriends();
    }
  }, [activeView]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await apiService.fetchGroups();
      setGroups(data);
      setFilteredGroups(data);
    } catch (err) {
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const data = await apiService.getFriends();
      setFriends(data);
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  };

  const toggleFriendSelection = (username: string) => {
    setSelectedFriends(prev => 
      prev.includes(username) 
        ? prev.filter(f => f !== username)
        : [...prev, username]
    );
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setCreateLoading(true);
    setError(null);
    try {
      const createdGroup = await apiService.createGroup({
        ...newGroup,
        selectedFriends
      });
      setGroups(prev => [createdGroup, ...prev]);
      setNewGroup({ name: '', description: '', createdBy: userid });
      setSelectedFriends([]);
      setActiveView('main');
    } catch (err) {
      setError('Failed to create group');
    } finally {
      setCreateLoading(false);
    }
  };

  const getGroupAvatar = (groupName: string) => {
    const avatars: { [key: string]: string } = {
      'Gaming Enthusiasts': '🎮',
      'Movie Night Club': '🎬',
      'Tech Talk': '💻',
      'Fitness Warriors': '💪'
    };
    return avatars[groupName] || '👥';
  };

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Groups</h1>
          <p className="text-slate-400">Connect with like-minded people</p>
        </div>
        <button
          onClick={() => setActiveView('create')}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Create Group</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-300 hover:text-red-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-3 text-slate-400">Loading groups...</span>
        </div>
      ) : (
        <>
          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div
                key={group.name}
                onClick={() => {
                  setSelectedGroup(group);
                  setActiveView('view');
                }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200 cursor-pointer group hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{getGroupAvatar(group.name)}</div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
                
                <h3 className="text-white font-semibold text-lg mb-2">{group.name}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{group.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{group.members} members</span>
                  </div>
                  <span className="text-xs text-slate-500">by {group.createdBy}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredGroups.length === 0 && !loading && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No groups found</h3>
              <p className="text-slate-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a group!'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderCreateView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => {
            setActiveView('main');
            setSelectedFriends([]);
          }}
          className="mr-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
          disabled={createLoading}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Create New Group</h1>
          <p className="text-slate-400">Start your own community</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center justify-between">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Create Form */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Group Name *</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter group name..."
                  disabled={createLoading}
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description *</label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24 resize-none"
                  placeholder="Describe your group..."
                  disabled={createLoading}
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Created By</label>
                <input
                  type="text"
                  value={newGroup.createdBy}
                  onChange={(e) => setNewGroup({ ...newGroup, createdBy: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Your username..."
                  disabled={createLoading}
                />
              </div>

              {/* Selected Friends Display */}
              {selectedFriends.length > 0 && (
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Selected Friends ({selectedFriends.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFriends.map(username => (
                      <span
                        key={username}
                        className="bg-orange-600/20 border border-orange-600/50 text-orange-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>@{username}</span>
                        <button
                          onClick={() => toggleFriendSelection(username)}
                          className="text-orange-300 hover:text-orange-200"
                          disabled={createLoading}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => {
                  setActiveView('main');
                  setSelectedFriends([]);
                }}
                disabled={createLoading}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={!newGroup.name.trim() || !newGroup.description.trim() || createLoading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {createLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Group</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Friends Sidebar */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">
            Add Friends {selectedFriends.length > 0 && `(${selectedFriends.length} selected)`}
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {friends.length > 0 ? (
              friends.map((friend) => {
                const isSelected = selectedFriends.includes(friend.username);
                return (
                  <div 
                    key={friend.username} 
                    onClick={() => !createLoading && toggleFriendSelection(friend.username)}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-orange-600/20 border border-orange-600/50' 
                        : 'hover:bg-slate-700/50'
                    } ${createLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                      {friend.username.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isSelected ? 'text-orange-300' : 'text-white'}`}>
                        {friend.displayName || friend.username}
                      </p>
                      <p className={`text-xs ${isSelected ? 'text-orange-400' : 'text-slate-400'}`}>
                        @{friend.username}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No friends found</p>
                <button
                  onClick={fetchFriends}
                  className="mt-2 text-orange-500 hover:text-orange-400 text-sm"
                >
                  Try loading again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderViewGroup = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => setActiveView('main')}
            className="mr-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{getGroupAvatar(selectedGroup?.name || '')}</div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{selectedGroup?.name}</h1>
              <p className="text-slate-400">{selectedGroup?.members} members • Created by {selectedGroup?.createdBy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center justify-between">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Group Content */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-3">About this group</h3>
            <p className="text-slate-300">{selectedGroup?.description}</p>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Activity feed will be populated via API</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200">
                <UserPlus className="w-5 h-5" />
                <span>Join Group</span>
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>Start Discussion</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Group Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Members</span>
                <span className="text-white font-semibold">{selectedGroup?.members}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Created By</span>
                <span className="text-white font-medium">@{selectedGroup?.createdBy}</span>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Group Rules</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>• Be respectful to all members</p>
              <p>• Stay on topic</p>
              <p>• No spam or self-promotion</p>
              <p>• Follow community guidelines</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {activeView === 'main' && renderMainView()}
      {activeView === 'create' && renderCreateView()}
      {activeView === 'view' && renderViewGroup()}
    </div>
  );
};

export default Groups;