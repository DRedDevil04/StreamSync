import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Users, MessageSquare, Play, Pause, SkipForward, SkipBack, Wifi, WifiOff } from 'lucide-react';

interface User {
  id: string;
  name: string;
  color: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  timestamp: number;
  type: 'message' | 'system' | 'movie-event';
}

interface MovieChatProps {
  socket?: any;
  currentUser: User;
  roomId: string;
}

const MovieChat: React.FC<MovieChatProps> = ({ socket, currentUser, roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [movieState, setMovieState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock socket for demo purposes
  const mockSocket = {
    emit: (event: string, data: any) => {
      console.log('Socket emit:', event, data);
      if (event === 'send-message') {
        setTimeout(() => {
          const mockMessage: Message = {
            id: Date.now().toString(),
            userId: currentUser.id,
            userName: currentUser.name,
            userColor: currentUser.color,
            content: data.content,
            timestamp: Date.now(),
            type: 'message'
          };
          setMessages(prev => [...prev, mockMessage]);
        }, 100);
      }
    },
    on: () => {},
    off: () => {}
  };

  const activeSocket = socket || mockSocket;

  useEffect(() => {
    if (!activeSocket) return;

    const handleConnect = () => {
      setIsConnected(true);
      activeSocket.emit('join-room', { roomId, user: currentUser });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleUserJoined = (data: { user: User; users: User[] }) => {
      setConnectedUsers(data.users);
      const systemMessage: Message = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        userColor: '#ff9500',
        content: `${data.user.name} joined the watch party`,
        timestamp: Date.now(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    const handleUserLeft = (data: { user: User; users: User[] }) => {
      setConnectedUsers(data.users);
      const systemMessage: Message = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        userColor: '#ff9500',
        content: `${data.user.name} left the watch party`,
        timestamp: Date.now(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    const handleMoviePlay = (data: { timestamp: number; userId: string; userName: string }) => {
      setMovieState(prev => ({ ...prev, isPlaying: true, currentTime: data.timestamp }));
      const movieMessage: Message = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        userColor: '#00d4aa',
        content: `${data.userName} resumed playback`,
        timestamp: Date.now(),
        type: 'movie-event'
      };
      setMessages(prev => [...prev, movieMessage]);
    };

    const handleMoviePause = (data: { timestamp: number; userId: string; userName: string }) => {
      setMovieState(prev => ({ ...prev, isPlaying: false, currentTime: data.timestamp }));
      const movieMessage: Message = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        userColor: '#ffb020',
        content: `${data.userName} paused playback`,
        timestamp: Date.now(),
        type: 'movie-event'
      };
      setMessages(prev => [...prev, movieMessage]);
    };

    const handleMovieSeek = (data: { timestamp: number; userId: string; userName: string }) => {
      setMovieState(prev => ({ ...prev, currentTime: data.timestamp }));
      const movieMessage: Message = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        userColor: '#e842e8',
        content: `${data.userName} jumped to ${formatTime(data.timestamp)}`,
        timestamp: Date.now(),
        type: 'movie-event'
      };
      setMessages(prev => [...prev, movieMessage]);
    };

    activeSocket.on('connect', handleConnect);
    activeSocket.on('disconnect', handleDisconnect);
    activeSocket.on('new-message', handleNewMessage);
    activeSocket.on('user-joined', handleUserJoined);
    activeSocket.on('user-left', handleUserLeft);
    activeSocket.on('movie-play', handleMoviePlay);
    activeSocket.on('movie-pause', handleMoviePause);
    activeSocket.on('movie-seek', handleMovieSeek);

    if (activeSocket.connected) {
      handleConnect();
    }

    return () => {
      activeSocket.off('connect', handleConnect);
      activeSocket.off('disconnect', handleDisconnect);
      activeSocket.off('new-message', handleNewMessage);
      activeSocket.off('user-joined', handleUserJoined);
      activeSocket.off('user-left', handleUserLeft);
      activeSocket.off('movie-play', handleMoviePlay);
      activeSocket.off('movie-pause', handleMoviePause);
      activeSocket.off('movie-seek', handleMovieSeek);
    };
  }, [activeSocket, currentUser, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (!newMessage.trim() || !activeSocket) return;

    activeSocket.emit('send-message', {
      roomId,
      content: newMessage.trim(),
      user: currentUser
    });

    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleMovieControl = (action: 'play' | 'pause' | 'seek', timestamp?: number) => {
    if (!activeSocket) return;

    switch (action) {
      case 'play':
        activeSocket.emit('movie-play', { roomId, timestamp: movieState.currentTime, user: currentUser });
        break;
      case 'pause':
        activeSocket.emit('movie-pause', { roomId, timestamp: movieState.currentTime, user: currentUser });
        break;
      case 'seek':
        if (timestamp !== undefined) {
          activeSocket.emit('movie-seek', { roomId, timestamp, user: currentUser });
        }
        break;
    }
  };

  const getMessageTypeStyles = (type: string) => {
    switch (type) {
      case 'system':
        return 'text-orange-400 italic text-sm';
      case 'movie-event':
        return 'text-cyan-400 font-medium text-sm';
      default:
        return 'text-gray-100';
    }
  };

  return (
    <div className="flex flex-col h-full max-w-md w-full bg-gray-950 border-l border-gray-800 text-white">
      {/* Header with Fire TV styling */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Watch Party</h2>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1 bg-green-900/50 px-2 py-1 rounded-full border border-green-700">
                <Wifi className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">LIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-red-900/50 px-2 py-1 rounded-full border border-red-700">
                <WifiOff className="w-3 h-3 text-red-400" />
                <span className="text-xs text-red-400 font-medium">OFFLINE</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Connected Users with Fire TV styling */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-orange-400">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{connectedUsers.length || 1}</span>
          </div>
          <div className="flex -space-x-2 overflow-hidden">
            {[currentUser, ...connectedUsers].slice(0, 6).map((user, index) => (
              <div key={user.id || index} className="relative">
                <Avatar className="w-7 h-7 border-2 border-gray-800 ring-1 ring-orange-500/30">
                  <AvatarFallback 
                    className="text-xs font-bold text-white"
                    style={{ backgroundColor: user.color || '#ff9500' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
            {connectedUsers.length > 5 && (
              <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center ring-1 ring-orange-500/30">
                <span className="text-xs font-bold text-orange-400">+{connectedUsers.length - 5}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movie Controls with Fire TV Remote styling */}
      <div className="bg-gray-900/50 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-orange-400 uppercase tracking-wide">Remote Control</span>
          <div className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            <span className="text-xs text-cyan-400 font-mono">{formatTime(movieState.currentTime)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleMovieControl('seek', Math.max(0, movieState.currentTime - 10))}
            className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white hover:border-orange-500 transition-all"
          >
            <SkipBack className="w-4 h-4" />
            <span className="ml-1 text-xs">10s</span>
          </Button>
          <Button
            size="sm"
            onClick={() => handleMovieControl(movieState.isPlaying ? 'pause' : 'play')}
            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-orange-500/25 transition-all"
          >
            {movieState.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            size="sm"
            onClick={() => handleMovieControl('seek', movieState.currentTime + 10)}
            className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white hover:border-orange-500 transition-all"
          >
            <SkipForward className="w-4 h-4" />
            <span className="ml-1 text-xs">10s</span>
          </Button>
        </div>
      </div>

      {/* Messages with TV-style scrolling */}
      <div className="flex-1 bg-black/20">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3 group hover:bg-gray-900/30 rounded-lg p-2 -mx-2 transition-colors">
                {message.type === 'message' && (
                  <Avatar className="w-8 h-8 flex-shrink-0 ring-1 ring-gray-700">
                    <AvatarFallback 
                      className="text-xs font-bold text-white"
                      style={{ backgroundColor: message.userColor }}
                    >
                      {message.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  {message.type === 'message' && (
                    <div className="flex items-baseline gap-2 mb-1">
                      <span 
                        className="font-bold text-sm"
                        style={{ color: message.userColor }}
                      >
                        {message.userName}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  )}
                  <p className={`text-sm break-words leading-relaxed ${getMessageTypeStyles(message.type)}`}>
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input with Fire TV style */}
      <div className="bg-gray-900 border-t border-gray-700 p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!isConnected}
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as any);
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            size="sm" 
            disabled={!newMessage.trim() || !isConnected}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-orange-500/25 transition-all"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs">
          <span className="text-gray-500">
            {isConnected ? 'Connected to watch party' : 'Connecting...'}
          </span>
          <span className="text-gray-500 font-mono">
            {newMessage.length}/500
          </span>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper with Fire TV theme
export default function MovieChatDemo() {
  const [currentUser] = useState<User>({
    id: 'user-1',
    name: 'John Doe',
    color: '#ff9500'
  });

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md h-full">
        <MovieChat
          currentUser={currentUser}
          roomId="movie-room-123"
          socket={null}
        />
      </div>
    </div>
  );
}