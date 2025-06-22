import React, { useState } from 'react';
import { Users, UserPlus, Search, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FriendRequest from '@/components/FriendRequest';
import ViewRequests from '@/components/ViewRequests';
import FriendsList from '@/components/ListFriends';
import Groups from '@/components/Groups';



const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [friendRequestUserId, setFriendRequestUserId] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSendFriendRequest = () => {
    if (friendRequestUserId.trim()) {
      setShowAlert(true);
      setFriendRequestUserId('');
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const tabItems = [
    { id: 'find', label: 'Find Friends', icon: Search },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'requests', label: 'View Requests', icon: Clock }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'find':
        return <FriendsList />;
      case 'groups':
        return <Groups />;
      case 'requests':
        return <ViewRequests />;
      default:
        return <FindFriends />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Friends</h1>
          <p className="text-slate-400 text-lg">Connect with friends and join communities</p>
        </div>

        <FriendRequest/>

        {/* Sub Navigation */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <nav className="flex">
            {tabItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 text-lg font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-slate-700/70 text-white border-b-2 border-blue-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 min-h-96">
          {renderContent()}
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-500 text-sm">
          <p>Use your remote's directional pad to navigate • Press OK to select</p>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;