"use client";

import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Sparkles,
  Star,
  Moon,
  Sun,
  Image as ImageIcon,
  Music,
  X,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";

type HeartAnimation = {
  id: number;
  x: number;
  delay: number;
  size: number;
  duration: number;
  isExplosion?: boolean;
  rotation?: number;
};

type ImageItem = {
  id: number;
  url: string;
  caption: string;
  date?: string;
};

export default function ShrutiLovePage() {
  const [message, setMessage] = useState("");
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [hearts, setHearts] = useState<HeartAnimation[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [noClicks, setNoClicks] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sample images - Replace these URLs with your actual images
  const images: ImageItem[] = [
    {
      id: 1,
      url: "/IMG-20250707-WA0002.jpg",
      caption: "Our first smile together 😊",
    },
    {
      id: 2,
      url: "/IMG_0235.jpg",
      caption: "You light up my world ✨",
    },
    {
      id: 3,
      url: "/IMG_0236.JPG",
      caption: "Every moment with you is magic 💫",
    },
    {
      id: 4,
      url: "/IMG-20260720-WA0000.jpg",
      caption: "My favorite person 💕",
    },
  ];

  const noMessages = [
    "Are you sure? 🥺",
    "Think again! 💕",
    "Don't break my heart! 💔",
    "I'll keep asking! 😤",
    "You can't escape! 🏃",
    "I love you! ❤️",
    "Just say yes! 🙏",
    "My heart is yours! 💝",
    "Please? 🥹",
    "Forever waiting! ⏳",
  ];

  useEffect(() => {
    const getButtonBounds = () => {
      const rect = noButtonRef.current?.getBoundingClientRect();
      return {
        width: rect?.width ?? 140,
        height: rect?.height ?? 48,
      };
    };

    const clampPosition = ({ x, y }: { x: number; y: number }) => {
      const { width, height } = getButtonBounds();
      const margin = 16;
      return {
        x: Math.min(Math.max(x, margin), window.innerWidth - width - margin),
        y: Math.min(Math.max(y, margin), window.innerHeight - height - margin),
      };
    };

    const updateInitialPosition = () => {
      setNoPosition(
        clampPosition({
          x: window.innerWidth / 2 + 100,
          y: window.innerHeight / 2 + 50,
        }),
      );
    };

    updateInitialPosition();
    window.addEventListener("resize", updateInitialPosition);

    // Create floating hearts periodically
    const interval = setInterval(() => {
      setHearts((prev) => {
        if (prev.length >= 20) {
          // Remove oldest hearts when limit reached
          return [
            ...prev.slice(-15),
            {
              id: Date.now(),
              x: Math.random() * 100,
              delay: Math.random() * 2,
              size: Math.random() * 25 + 10,
              duration: Math.random() * 4 + 3,
              rotation: Math.random() * 360,
            },
          ];
        }
        return [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 100,
            delay: Math.random() * 2,
            size: Math.random() * 25 + 10,
            duration: Math.random() * 4 + 3,
            rotation: Math.random() * 360,
          },
        ];
      });
    }, 400);

    // Auto-show hint after 5 seconds
    const hintTimeout = setTimeout(() => {
      setShowHint(true);
    }, 5000);

    // 🔥 AUTOPLAY MUSIC - Attempt to play when page loads
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          console.log("🎵 Music started playing!");
        } catch (error) {
          console.log(
            "⚠️ Autoplay prevented by browser. User interaction required.",
          );
          // Most browsers require user interaction first
          // The music button will still work for manual play
        }
      }
    };

    // Try to autoplay immediately
    playAudio();

    // Also try to autoplay on any user interaction (as a fallback)
    const handleUserInteraction = () => {
      if (!isPlaying && audioRef.current) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    // Add event listeners for user interaction fallback
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      clearInterval(interval);
      clearTimeout(hintTimeout);
      window.removeEventListener("resize", updateInitialPosition);
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []); // Remove isPlaying from dependencies to avoid re-running

  const moveNoButton = () => {
    const rect = noButtonRef.current?.getBoundingClientRect();
    const buttonWidth = rect?.width ?? 140;
    const buttonHeight = rect?.height ?? 48;
    const margin = 20;

    // Calculate safe bounds
    const maxX = Math.max(window.innerWidth - buttonWidth - margin * 2, 0);
    const maxY = Math.max(window.innerHeight - buttonHeight - margin * 2, 0);

    // Generate random position with some bias towards edges for fun
    const x = Math.random() * maxX + margin;
    const y = Math.random() * maxY + margin;

    setNoPosition({ x, y });
    setNoClicks((prev) => prev + 1);

    // Show hint after 3 clicks
    if (noClicks >= 2) {
      setShowHint(true);
    }
  };

  const handleYesClick = () => {
    setMessage("Yay! ❤️ I knew it! You just made my day! ✨");
    setShowCelebration(true);

    // Create explosion of hearts
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        setHearts((prev) => [
          ...prev,
          {
            id: Date.now() + i,
            x: Math.random() * 100,
            delay: Math.random() * 1.5,
            size: Math.random() * 40 + 15,
            duration: Math.random() * 5 + 3,
            isExplosion: true,
            rotation: Math.random() * 720,
          },
        ]);
      }, i * 80);
    }

    // Play celebration sound if available
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const getNoButtonText = () => {
    if (noClicks < noMessages.length) {
      return noMessages[noClicks];
    }
    return "Just say yes! 💕";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-gradient-to-br from-purple-900 via-pink-600 to-red-500 px-2 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8 lg:py-8">
      {/* Hidden Audio Player */}
      <audio ref={audioRef} loop>
        <source src="/Barbaad.mp3" type="audio/mpeg" />
      </audio>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-rose-300/10 blur-3xl animate-pulse delay-500"></div>

        {/* Floating Icons */}
        <div className="absolute top-10 left-10 animate-bounce-slow">
          <Star className="w-8 h-8 text-yellow-300/50" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce-slow delay-1000">
          <Moon className="w-8 h-8 text-yellow-200/50" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce-slow delay-500">
          <Sun className="w-8 h-8 text-yellow-300/50" />
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce-slow delay-700">
          <Sparkles className="w-8 h-8 text-white/50" />
        </div>
      </div>

      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className={`absolute text-red-400 pointer-events-none ${
            heart.isExplosion ? "animate-float-explosion" : "animate-float"
          }`}
          style={{
            left: `${heart.x}%`,
            top: `${heart.isExplosion ? 50 : 100}%`,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            opacity: heart.isExplosion ? 1 : 0.5,
            transform: `rotate(${heart.rotation || 0}deg)`,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Music Toggle Button */}
      <button
        onClick={toggleMusic}
        className="fixed top-3 right-3 z-20 bg-white/10 backdrop-blur-md rounded-full p-2.5 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20 sm:top-4 sm:right-4 sm:p-3"
      >
        <Music className={`w-6 h-6 ${isPlaying ? "animate-pulse" : ""}`} />
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="mx-auto rounded-3xl border border-white/20 bg-white/10 p-5 text-center shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] sm:p-8 md:p-10 lg:p-12">
          {/* Header with Glitch Effect */}
          <div className="mb-8">
            <h1 className="relative mb-4 animate-pulse-slow text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="relative inline-block">
                💕 Shruti 💕
                <span className="absolute inset-0 text-pink-300 blur-sm animate-pulse">
                  💕 Shruti 💕
                </span>
              </span>
            </h1>
            <div className="flex justify-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-red-400 animate-pulse" />
              <Heart className="w-8 h-8 text-pink-400 animate-pulse delay-100" />
              <Heart className="w-8 h-8 text-rose-400 animate-pulse delay-200" />
            </div>

            {/* Purposing Line with Gradient */}
            <div className="mb-6 rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-pink-500/10 p-4 backdrop-blur-sm sm:p-6">
              <p className="text-lg font-semibold italic text-white/95 sm:text-xl md:text-2xl">
                "This page runs on code, but my love for you runs on forever.
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-200 to-pink-200 animate-pulse-slow">
                  All I need is one 'Yes' to make it real."
                </span>
              </p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="text-3xl animate-bounce">🌹</span>
                <span className="text-3xl animate-bounce delay-100">💕</span>
                <span className="text-3xl animate-bounce delay-200">✨</span>
              </div>
            </div>

            <p className="text-xl font-semibold text-white/90 sm:text-2xl md:text-3xl">
              Will You Be My Valentine? 💝
            </p>
            <p className="mt-2 text-base sm:text-lg text-white/70 italic">
              {`"Every love story is beautiful, but ours is my favorite" ✨`}
            </p>
          </div>

          {/* Image Gallery Section with Masonry Layout */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ImageIcon className="w-6 h-6 text-white/80 animate-pulse" />
              <h3 className="text-xl font-semibold text-white">
                Our Beautiful Memories
              </h3>
              <ImageIcon className="w-6 h-6 text-white/80 animate-pulse delay-100" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                  onClick={() => setSelectedImage(image)}
                  onMouseEnter={() => setHoveredImage(image.id)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <Image
                    src={image.url}
                    alt={image.caption}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-48"
                   
                    width={400}
                    height={300}
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-4">
                    <p className="text-white text-sm font-medium text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {image.caption}
                    </p>
                  
                  </div>
                  <div className="absolute top-2 right-2 bg-pink-500/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                  {hoveredImage === image.id && (
                    <div className="absolute inset-0 border-2 border-white/30 rounded-2xl pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-white/60 text-sm mt-3 animate-pulse">
              👆 Tap on any memory to relive the moment
            </p>
          </div>

          {/* Buttons with Enhanced Interaction */}
          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={handleYesClick}
              className="group relative w-full max-w-[280px] overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-base font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-2xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                Yes, Absolutely! 💖
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>

            <button
              ref={noButtonRef}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              style={{
                position: "fixed",
                left: `${noPosition.x}px`,
                top: `${noPosition.y}px`,
                transition: "all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
                minWidth: 120,
                maxWidth: "calc(100vw - 2rem)",
                zIndex: 30,
              }}
              className="relative rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:px-6 sm:py-4 sm:text-base"
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                {getNoButtonText()}
                {noClicks > 0 && (
                  <span className="text-xs opacity-50">#{noClicks + 1}</span>
                )}
              </span>
            </button>
          </div>

          {/* Hint Message */}
          {showHint && !message && (
            <div className="mt-4 animate-fade-in-up">
              <p className="text-sm text-white/80 bg-white/10 rounded-full px-4 py-2 inline-block backdrop-blur-sm border border-white/20">
                💡 The &quot;No&quot; button is playing hard to get... try
                catching it!
              </p>
            </div>
          )}

          {/* Response Message with Confetti Effect */}
          {message && (
            <div className="mt-8 animate-fade-in-up">
              <div className="rounded-2xl bg-gradient-to-br from-white/20 to-pink-500/20 p-6 backdrop-blur-sm border border-white/30">
                <p className="text-2xl font-bold text-white">{message}</p>
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                  {[...Array(8)].map((_, i) => (
                    <Heart
                      key={i}
                      className="w-6 h-6 text-red-400 animate-bounce"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        transform: `rotate(${i * 45}deg)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Celebration with Animated Emojis */}
          {showCelebration && (
            <div className="mt-6 animate-fade-in-up">
              <div className="flex justify-center gap-4 flex-wrap">
                <span className="text-5xl animate-bounce">🎉</span>
                <span className="text-5xl animate-bounce delay-100">🥳</span>
                <span className="text-5xl animate-bounce delay-200">💕</span>
                <span className="text-5xl animate-bounce delay-300">✨</span>
                <span className="text-5xl animate-bounce delay-400">🎊</span>
                <span className="text-5xl animate-bounce delay-500">🌹</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Animated Text */}
        <p className="text-center text-white/60 text-sm mt-6 animate-pulse-slow">
          Made with 💖 just for you, Shruti
        </p>
      </div>

      {/* Image Modal with Enhanced UI */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 backdrop-blur-xl animate-fade-in-up sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-pink-500/10 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative">
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="h-auto max-h-[75vh] w-full object-contain sm:max-h-[80vh]"
                width={400}
                height={300}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
            <div className="p-4 text-center sm:p-6">
              <p className="text-xl font-semibold text-white sm:text-2xl">
                {selectedImage.caption}
              </p>
              {selectedImage.date && (
                <p className="text-white/60 text-sm mt-1">
                  📅 {selectedImage.date}
                </p>
              )}
              <div className="flex justify-center gap-3 mt-4">
                <Heart className="w-8 h-8 text-red-400 fill-red-400 animate-pulse" />
                <Heart className="w-8 h-8 text-pink-400 fill-pink-400 animate-pulse delay-100" />
                <Heart className="w-8 h-8 text-rose-400 fill-rose-400 animate-pulse delay-200" />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-100vh) rotate(360deg) scale(0.8);
            opacity: 0;
          }
        }
        @keyframes float-explosion {
          0% {
            transform: translateY(0) scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-300px) scale(2) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(0deg);
          }
          100% {
            transform: translateX(200%) rotate(0deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-float-explosion {
          animation: float-explosion ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
