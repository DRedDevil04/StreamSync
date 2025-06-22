import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import api from '@/utils/axiosInstance'; // Adjust the import path as necessary
const FriendRequest = () => {
  const [friendRequestUserId, setFriendRequestUserId] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSendFriendRequest = async () => {
    if (friendRequestUserId.trim()) {
      // Simulate sending friend request
      console.log('Sending friend request to:', friendRequestUserId);
      await api.post('connections/requests/send', { to: friendRequestUserId })
      // Show success alert
      setShowAlert(true);
      
      // Clear input
      setFriendRequestUserId('');
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSendFriendRequest();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Friend Request Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <UserPlus className="w-6 h-6 mr-2 text-blue-400" />
          Send Friend Request
        </h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={friendRequestUserId}
            onChange={(e) => setFriendRequestUserId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter User ID or Username"
            className="flex-1 bg-slate-800/70 text-white placeholder-slate-400 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
          />
          <button
            onClick={handleSendFriendRequest}
            disabled={!friendRequestUserId.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Send Request</span>
          </button>
        </div>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="bg-green-800/50 border border-green-600/50 text-green-200 p-4 rounded-xl flex items-center space-x-3 animate-in fade-in duration-300">
          <UserPlus className="w-5 h-5 text-green-400" />
          <span>Friend request sent successfully!</span>
        </div>
      )}
    </div>
  );
};

export default FriendRequest;