import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import '../App.css';
import MovieChat from '../components/Chat';
import FireTVVideoPlayer from '../components/VideoPlayback';
import type { Socket } from 'socket.io-client';
import { userInfo } from 'os';

export function RoomPage({ roomId, socket }: { roomId: string , socket: Socket }) {
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        name: 'Guest',
        color: '#ffffff',
        id: 'guest-' + Math.random().toString(36).substring(2, 15)
    });

  // Auto-join room when component mounts
  useEffect(() => {
    if (roomId && !joined) {
      socket.emit('joinRoom', roomId);
      setJoined(true);
    }
  }, [roomId, joined]);

  const leaveRoom = () => {
    socket.emit('leaveRoom', roomId);
    setJoined(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-900 to-slate-700">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Back to Home
              </button>
              <h1 className="text-xl font-bold text-white">
                Room: {roomId}
              </h1>
            </div>
            <button
              onClick={leaveRoom}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fire TV Style Player */}
            <FireTVVideoPlayer socket={socket} roomId={roomId}/>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-slate-700 h-full">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-white text-lg font-semibold">
                  Room Chat
                </h3>
              </div>
              <div className="p-4">
                <MovieChat socket={socket} userColor={userInfo.color} roomId={roomId}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}