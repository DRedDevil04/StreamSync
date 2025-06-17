import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Hls from 'hls.js';
import './App.css';

const socket = io("http://localhost:3000"); // or your server URL

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);

  // Attach HLS video source on mount
  useEffect(() => {
    const video = videoRef.current;
    const videoSrc = "http://localhost:3000/api/video/sample.m3u8";

    if (video) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
      }
    }
  }, []);

  // Sync events
  useEffect(() => {
    socket.on('play', () => {
      const video = videoRef.current;
      if (video && video.paused) video.play();
    });

    socket.on('pause', () => {
      const video = videoRef.current;
      if (video && !video.paused) video.pause();
    });

    socket.on('seek', (time: number) => {
      const video = videoRef.current;
      if (video) video.currentTime = time;
    });

    return () => {
      socket.off('play');
      socket.off('pause');
      socket.off('seek');
    };
  }, []);

  const joinRoom = () => {
    if (roomId.trim()) {
      socket.emit('joinRoom', roomId.trim());
      setJoined(true);
    }
  };

  const handlePlay = () => {
    if (joined) socket.emit('play');
  };

  const handlePause = () => {
    if (joined) socket.emit('pause');
  };

  const handleSeek = () => {
    if (joined && videoRef.current) {
      socket.emit('seek', videoRef.current.currentTime);
      socket.emit('play');
      videoRef.current.play();
    }
  };

  return (
    <div className="App">
      <h1>📺 Streaming Sync</h1>

      {!joined ? (
        <div>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <p>✅ Joined room: <strong>{roomId}</strong></p>
      )}

      <video
        ref={videoRef}
        width="640"
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeek}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default App;
