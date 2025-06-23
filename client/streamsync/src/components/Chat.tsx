import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Users, MessageSquare,Wifi, WifiOff } from 'lucide-react';
import type { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';

interface User {
  id: string;
  name: string;
  color: string;
}

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  type: 'message' | 'system';
}


export default function MovieChat ({ socket, userColor, roomId }: { socket: Socket, userColor: string, roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = useSelector((state: any) => state.user);

  const activeSocket = socket

  useEffect(() => {
    if (!activeSocket) return;

    const handleConnect = () => {
      setIsConnected(true);
      console.log('Connected to chat socket');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected from chat socket');
    };

    const handleChatMessage = (messageData: { user: string; text: string; timestamp: string }) => {
      const newMessage: Message = {
        id: Date.now().toString() + Math.random(),
        user: messageData.user,
        text: messageData.text,
        timestamp: messageData.timestamp,
        type: 'message'
      };
      setMessages(prev => [...prev, newMessage]);
    };

    // Socket event listeners
    activeSocket.on('connect', handleConnect);
    activeSocket.on('disconnect', handleDisconnect);
    activeSocket.on('chatMessage', handleChatMessage);

    // Check if already connected
    if (activeSocket.connected) {
      handleConnect();
    }

    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome-' + Date.now(),
      user: 'System',
      text: `Welcome to the watch party! Session: ${roomId}`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    setMessages(prev => [...prev, welcomeMessage]);

    return () => {
      activeSocket.off('connect', handleConnect);
      activeSocket.off('disconnect', handleDisconnect);
      activeSocket.off('chatMessage', handleChatMessage);
    };
  }, [activeSocket, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (!newMessage.trim() || !activeSocket || !isConnected) return;

    // Send message using your socket controller structure
    activeSocket.emit('chatMessage', {
      user: currentUser.name,
      text: newMessage.trim()
    });
    const message: Message = {
      id: Date.now().toString() + Math.random(),
      user: currentUser.username,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'message'
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    inputRef.current?.focus();
  };

  const getMessageTypeStyles = (type: string) => {
    switch (type) {
      case 'system':
        return 'text-orange-400 italic text-sm';
      default:
        return 'text-gray-100';
    }
  };

  const getUserColor = (userName: string) => {
    if (userName === currentUser.name) return userColor;
    if (userName === 'System') return '#ff9500';
    
    // Generate consistent color based on username
    const colors = ['#e842e8', '#00d4aa', '#ffb020', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    const hash = userName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
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
        
        {/* Session Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-orange-400">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Session: {roomId}</span>
          </div>
          <div className="flex items-center">
            <Avatar className="w-7 h-7 border-2 border-gray-800 ring-1 ring-orange-500/30">
              <AvatarFallback 
                className="text-xs font-bold text-white"
                style={{ backgroundColor: currentUser.color }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
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
                      style={{ backgroundColor: getUserColor(message.user) }}
                    >
                      {message.user.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  {message.type === 'message' && (
                    <div className="flex items-baseline gap-2 mb-1">
                      <span 
                        className="font-bold text-sm"
                        style={{ color: getUserColor(message.user) }}
                      >
                        {message.user}
                        {message.user === currentUser.name && (
                          <span className="text-xs text-gray-500 ml-1">(you)</span>
                        )}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  )}
                  <p className={`text-sm break-words leading-relaxed ${getMessageTypeStyles(message.type)}`}>
                    {message.text}
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
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
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
            {isConnected ? `Connected • Session: ${roomId}` : 'Connecting...'}
          </span>
          <span className="text-gray-500 font-mono">
            {newMessage.length}/500
          </span>
        </div>
      </div>
    </div>
  );
};