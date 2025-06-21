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
import HomePage from './pages/home';
import StreamingPage from './pages/Streaming';
import MovieDetailsPage from './pages/MovieDetails';
import WatchSoloPage from './pages/WatchSolo';
import FeedPage from './pages/Feed';
import RecommendationPage from './pages/Recommendation';
// import FriendsPage from './pages/Friends';
// import RoomsPage from './pages/Rooms';
// import ProfilePage from './pages/Profile';
// import SearchPage from './pages/Search';

const socket = io("http://localhost:3000");

function RoomWrapper({ socket }: { socket: Socket }) {
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
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<JoinRoomPage socket={socket} />} />
          <Route
            path="/streaming"
            element={
              <StreamingPage
                movies={[
                  {
                    movieId: "123",
                    title: "Inception",
                    tags: ["Sci-Fi", "Thriller"],
                    description: "A skilled thief leads a team into people's dreams to steal secrets.",
                    attachmentID: "inception-thumbnail.jpg",
                    Rating: 8.8,
                    duration: 148
                  },
                  {
                    movieId: "456",
                    title: "Interstellar",
                    tags: ["Sci-Fi", "Adventure"],
                    description: "A team of explorers travel through a wormhole in space to save humanity.",
                    attachmentID: "interstellar-thumbnail.jpg",
                    Rating: 8.6,
                    duration: 169
                  }
                ]}
                categories={[
                  {
                    name: "Top Picks",
                    movies: [
                      {
                        movieId: "123",
                        title: "Inception",
                        tags: ["Sci-Fi", "Thriller"],
                        description: "A skilled thief leads a team into people's dreams to steal secrets.",
                        attachmentID: "inception-thumbnail.jpg",
                        Rating: 8.8,
                        duration: 148
                      }
                    ]
                  },
                  {
                    name: "Sci-Fi Collection",
                    movies: [
                      {
                        movieId: "456",
                        title: "Interstellar",
                        tags: ["Sci-Fi", "Adventure"],
                        description: "A team of explorers travel through a wormhole in space to save humanity.",
                        attachmentID: "interstellar-thumbnail.jpg",
                        Rating: 8.6,
                        duration: 169
                      }
                    ]
                  }
                ]}
              />
            }
          />
          <Route
            path="/grouprecommendation"
            element={
              <RecommendationPage
                roomId="123"
                users={[
                  { id: "u1", name: "Alice", preferences: ["Sci-Fi", "Drama"] },
                  { id: "u2", name: "Bob", preferences: ["Action", "Thriller"] },
                  { id: "u3", name: "Charlie", preferences: ["Comedy", "Romance"] }
                ]}
              />
            }
          />

          <Route path="/room/:roomId" element={<RoomWrapper socket={socket} />} />
          <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
          <Route path="/watch/:movieId" element={<WatchSoloPage />} />
          <Route path="/feed" element={<FeedPage />} />
          {/* <Route path="/room/:roomId" element={<ProtectedRoute><RoomWrapper socket={socket} /></ProtectedRoute>}/>
          <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>}/>
          <Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>}/> */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
