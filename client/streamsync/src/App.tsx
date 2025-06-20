import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';
import { RoomPage } from './pages/Room';
import { JoinRoomPage } from './pages/JoinRoom'

const socket = io("http://localhost:3000");

// Room wrapper to extract roomId from URL
function RoomWrapper() {
  const roomId = window.location.pathname.split('/room/')[1];
  
  if (!roomId) {
    return <Navigate to="/" replace />;
  }
  
  return <RoomPage roomId={decodeURIComponent(roomId)} socket={socket} />;
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/room" element={<JoinRoomPage socket={socket}/>} />
          <Route path="/room/:roomId" element={<RoomWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;