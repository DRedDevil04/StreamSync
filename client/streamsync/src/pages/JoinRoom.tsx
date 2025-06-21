import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../App.css';
import type { Socket } from 'socket.io-client';


export function JoinRoomPage({ socket }: { socket: Socket }) {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const joinRoom = () => {
    if (roomId.trim()) {
      socket.emit('joinRoom', roomId.trim());
      navigate(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-900 to-slate-700 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
            📺 Streaming Sync
          </h1>
          <p className="text-xl text-slate-300">
            Watch videos together in perfect sync
          </p>
        </div>

        <div className="max-w-md mx-auto bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
              />
            </div>
            
            <button
              onClick={joinRoom}
              disabled={!roomId.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              Join Room
            </button>

            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Or create a new room with any ID
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}