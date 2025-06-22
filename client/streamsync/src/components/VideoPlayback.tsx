import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Users,
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw,
} from "lucide-react";
import type { Socket } from "socket.io-client";
import Hls from "hls.js";

export default function FireTVVideoPlayer({
  socket,
  roomId,
}: {
  socket: Socket;
  roomId: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [joined, setJoined] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const videoSrc = "http://localhost:5000/api/video/sample.m3u8";
    if (video) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        video.volume = 1;
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
      }
    }
  }, []);

  // Socket sync events
  useEffect(() => {
    socket.on("play", () => {
      const video: any = videoRef.current;
      if (video && video.paused) video.play();
    });

    socket.on("pause", () => {
      const video: any = videoRef.current;
      if (video && !video.paused) video.pause();
    });

    socket.on("seek", (time: number) => {
      const video: any = videoRef.current;
      if (video) video.currentTime = time;
    });

    return () => {
      socket.off("play");
      socket.off("pause");
      socket.off("seek");
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let timeout: any;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  const togglePlayPause = () => {
    const video: any = videoRef.current;
    if (video) {
      if (video.paused) {
        setIsPlaying(true);
        video.play();
        if (joined) socket.emit("play");
      } else {
        setIsPlaying(false);
        video.pause();
        if (joined) socket.emit("pause");
      }
    }
  };

  const handleSeek = (newTime: number[]) => {
    const video: any = videoRef.current;
    if (video) {
      video.currentTime = newTime[0];
      if (joined) {
        socket.emit("seek", newTime[0]);
        socket.emit("play");
        video.play();
      }
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const video: any = videoRef.current;
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (video) {
      video.volume = volumeValue;
      setIsMuted(volumeValue === 0);
    }
  };

  const toggleMute = () => {
    const video: any = videoRef.current;
    if (video) {
      if (isMuted) {
        video.volume = volume;
        setIsMuted(false);
      } else {
        video.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const skipTime = (seconds: number) => {
    const video: any = videoRef.current;
    if (video) {
      const newTime = Math.max(
        0,
        Math.min(duration, video.currentTime + seconds)
      );
      video.currentTime = newTime;
      if (joined) socket.emit("seek", newTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    const video: any = videoRef.current;
    if (video) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        video.requestFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-900 to-slate-700 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold">
            🔥
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            FireStream
          </h1>
        </div>

        {joined && (
          <Badge
            variant="secondary"
            className="bg-green-600/20 text-green-400 border-green-500/30"
          >
            <Users className="w-4 h-4 mr-2" />
            Room: {roomId}
          </Badge>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Video Player */}
          <div
            className="relative bg-black rounded-xl overflow-hidden shadow-2xl group"
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover"
              onClick={togglePlayPause}
            >
              Your browser does not support the video tag.
            </video>

            {/* Loading Spinner */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              </div>
            )}

            {/* Play/Pause Overlay */}
            {!isPlaying && !isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={togglePlayPause}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                >
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              </div>
            )}

            {/* Controls */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  className="w-full"
                  onValueChange={handleSeek}
                />
                <div className="flex justify-between text-sm text-slate-300 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => skipTime(-10)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button
                    onClick={togglePlayPause}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>

                  <Button
                    onClick={() => skipTime(10)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={toggleMute}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      className="w-20"
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => skipTime(-30)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={toggleFullscreen}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Room Info */}
          <Card className="bg-black/40 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">
                    Connected to Room: {roomId}
                  </span>
                </div>
                <Button
                  onClick={() => setJoined(false)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Leave Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
