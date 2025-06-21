import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import './App.css';
import { RoomPage } from './pages/Room';
import { JoinRoomPage } from './pages/JoinRoom';
import { useParams } from 'react-router-dom';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

const socket = io("http://localhost:3000");

function RoomWrapper({ socket }: {socket: Socket}) {
  const { roomId } = useParams();

  if (!roomId) return <Navigate to="/" replace />;
  
  return <RoomPage roomId={decodeURIComponent(roomId)} socket={socket} />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/" element={<JoinRoomPage socket={socket} />} />
          <Route path="/room/:roomId" element={<RoomWrapper socket={socket} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
