"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTimeTogether, isTrackUnlocked, getDaysUntil, getTimeUntil } from '@/utils/date';
import { Heart, Music, Clock, RefreshCw, Bell, Download, X } from 'lucide-react';
import Gallery from './Gallery';
import SecretCinema from './SecretCinema';
import Ambiance from './Ambiance';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    electronAPI?: {
      closeApp: () => void;
      isElectron: boolean;
    };
  }
}

const LiveCountdown = ({ day, hour = 0 }: { day: number, hour?: number }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntil(day, hour));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntil(day, hour));
    }, 1000);
    return () => clearInterval(timer);
  }, [day, hour]);

  return (
    <div className="flex gap-1 text-[10px] font-mono font-bold text-valentine-soft">
      <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
      <span>:</span>
      <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
      <span>:</span>
      <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  );
};

// UnlockableNote: Handles timer, unlock button, and displays note content after user unlock
const UnlockableNote = ({ id, day, hour = 0, content }: { id: string, day: number, hour?: number, content: React.ReactNode }) => {
  const [timerDone, setTimerDone] = React.useState(false);
  const [unlocked, setUnlocked] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(getTimeUntil(day, hour));
  const storageKey = `user_unlocked_${id}`;

  React.useEffect(() => {
    const userUnlocked = localStorage.getItem(storageKey) === 'true';
    setUnlocked(userUnlocked);
    const interval = setInterval(() => {
      const t = getTimeUntil(day, hour);
      setTimeLeft(t);
      if (t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        setTimerDone(true);
      } else {
        setTimerDone(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [day, hour, storageKey]);

  const handleUnlock = () => {
    localStorage.setItem(storageKey, 'true');
    setUnlocked(true);
  };

  if (!timerDone) {
    // Show countdown + tooltip before unlock is available
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2 text-valentine-soft relative">
        <Clock size={24} aria-hidden="true" />
        <div className="group relative">
          <span className="font-mono text-xs">{String(timeLeft.hours).padStart(2, '0')}h:{String(timeLeft.minutes).padStart(2, '0')}m:{String(timeLeft.seconds).padStart(2, '0')}s</span>
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-black/80 text-[10px] text-white opacity-0 group-hover:opacity-100 transition text-center pointer-events-none z-10 whitespace-nowrap">
            Unlock available in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    // Timer done, waiting for user to unlock
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2 text-valentine-soft">
        <button 
          className="bg-valentine-red text-white px-4 py-2 rounded-full shadow font-bold hover:bg-valentine-red/90 transition-all focus:outline-none relative group"
          onClick={handleUnlock}
        >
          Unlock
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-black/80 text-[10px] text-white opacity-0 group-hover:opacity-100 transition text-center pointer-events-none z-10 whitespace-nowrap">
            Click to unlock this note!
          </div>
        </button>
      </div>
    );
  }
  // Unlocked
  return <>{content}</>;
};

const Dashboard = () => {
  const [time, setTime] = useState(getTimeTogether());
  const [showAdmin, setShowAdmin] = useState(false);
  const [isDebugUnlocked, setIsDebugUnlocked] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [unlockedStatus, setUnlockedStatus] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    setIsDebugUnlocked(localStorage.getItem('debug_unlock_all') === 'true');

    // Initial status
    const initialStatus: Record<string, boolean> = {
      day13: isTrackUnlocked(13),
      day14: isTrackUnlocked(14),
      today1pm: isTrackUnlocked(12, 13)
    };
    setUnlockedStatus(initialStatus);

    const timer = setInterval(() => {
      setTime(getTimeTogether());
      
      // Check for live unlocks
      const currentStatus = {
        day13: isTrackUnlocked(13),
        day14: isTrackUnlocked(14),
        today1pm: isTrackUnlocked(12, 13)
      };

      let newlyUnlocked = false;
      Object.entries(currentStatus).forEach(([key, val]) => {
        if (val && !initialStatus[key]) {
          newlyUnlocked = true;
          initialStatus[key] = true;
        }
      });

      if (newlyUnlocked) {
        setUnlockedStatus({...initialStatus});
        triggerUnlockEffect();
      }
    }, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'R') {
        setShowAdmin(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const triggerUnlockEffect = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D63447', '#F7CAC9', '#D4AF37']
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };


  const handleTitleTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      setShowAdmin(true);
      setTapCount(0);
    }
    // Reset tap count after 3 seconds of inactivity
    setTimeout(() => setTapCount(0), 3000);
  };

  const handleReset = () => {
    localStorage.removeItem('valentine_completed');
    localStorage.removeItem('debug_unlock_all');
    
    // Clear all scratch states
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('scratch_')) {
        localStorage.removeItem(key);
      }
    });
    
    window.location.reload();
  };

  const toggleDebugUnlock = () => {
    const newValue = !isDebugUnlocked;
    localStorage.setItem('debug_unlock_all', newValue.toString());
    setIsDebugUnlocked(newValue);
    window.location.reload();
  };

  const LockedState = ({ day, hour = 0 }: { day: number, hour?: number }) => {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2 text-valentine-soft">
        <Clock size={40} aria-hidden="true" />
        <p className="text-sm font-medium">Unlocks in</p>
        <LiveCountdown day={day} hour={hour} />
      </div>
    );
  };

  const LockedNote = ({ day, hour = 0 }: { day: number, hour?: number }) => {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2 text-valentine-soft">
        <Clock size={24} aria-hidden="true" />
        <LiveCountdown day={day} hour={hour} />
      </div>
    );
  };

  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  const bentoItems = [
    {
      id: 'download',
      title: 'Our Sanctuary App',
      size: 'md:col-span-2 col-span-1 row-span-1',
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-4 p-6 bg-gradient-to-r from-valentine-pink/20 to-valentine-red/10 rounded-2xl">
          <div className="text-center">
            <p className="text-sm text-valentine-red font-bold uppercase tracking-widest mb-1">Desktop Experience</p>
            <p className="text-xs text-valentine-soft font-medium">Keep our sanctuary forever on your Windows computer</p>
          </div>
          <a 
            href="https://valentine-flax-alpha.vercel.app/download" // Placeholder link
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-valentine-red text-white rounded-full text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all group"
          >
            <Download size={24} aria-hidden="true" className="group-hover:animate-bounce" />
            Download for Windows (.exe)
          </a>
        </div>
      )
    },
    {
      id: 'timer',
      title: 'Our Time Together',
      size: 'md:col-span-2 col-span-1 row-span-1',
      content: (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center h-full items-center">
          {Object.entries(time).map(([unit, value]) => (
            <div key={unit} className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold text-valentine-red">{value}</span>
              <span className="text-[10px] uppercase tracking-wider text-valentine-soft">{unit}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'feb12',
      title: 'Feb 12: Where it Began',
      size: 'col-span-1 row-span-1',
      content: (
        <div className="w-full h-full min-h-[152px] md:min-h-[352px]">
          <iframe 
            style={{ borderRadius: '12px' }} 
            src="https://open.spotify.com/embed/track/4riDfclV7kPDT9D58FpmHd?utm_source=generator" 
            width="100%" height="100%" frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="min-h-[152px] md:min-h-[352px]"
          ></iframe>
        </div>
      )
    },
    {
      id: 'feb13',
      title: 'Feb 13: The Journey',
      size: 'col-span-1 row-span-1',
      content: isTrackUnlocked(13) ? (
        <div className="w-full h-full min-h-[152px] md:min-h-[352px]">
          <iframe 
            style={{ borderRadius: '12px' }} 
            src="https://open.spotify.com/embed/track/0TZOdKFWNYfnwewAP8R4D8?utm_source=generator" 
            width="100%" height="100%" frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="min-h-[152px] md:min-h-[352px]"
          ></iframe>
        </div>
      ) : (
        <LockedState day={13} />
      )
    },
    {
      id: 'feb14',
      title: 'Feb 14: Today & Always',
      size: 'md:col-span-2 col-span-1 row-span-1',
      content: isTrackUnlocked(14) ? (
        <div className="w-full h-full min-h-[152px] md:min-h-[352px]">
          <iframe 
            style={{ borderRadius: '12px' }} 
            src="https://open.spotify.com/embed/track/657CttNzh41EseXiePl3qC?utm_source=generator" 
            width="100%" height="100%" frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="min-h-[152px] md:min-h-[352px]"
          ></iframe>
        </div>
      ) : (
        <LockedState day={14} />
      )
    },
    {
      id: 'note1',
      title: 'Note',
      size: 'col-span-1 row-span-1',
content: (
  <UnlockableNote 
    id="note1" 
    day={12} 
    content={<div className="italic text-base text-valentine-red p-2 leading-relaxed h-full flex items-center justify-center text-center">Min lille abe &lt;3</div>}
  />
),
    },
    {
      id: 'note2',
      title: 'Note',
      size: 'col-span-1 row-span-1',
      content: (
  <UnlockableNote
    id="note2"
    day={12}
    content={<div className="italic text-base text-valentine-red p-2 leading-relaxed h-full flex items-center justify-center text-center">"Biblioteket :)"</div>}
  />
),
    },
    {
      id: 'note7',
      title: 'Note',
      size: 'md:col-span-2 col-span-1 row-span-1',
      content: (
  <UnlockableNote
    id="note7"
    day={12}
    hour={13}
    content={
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-2">
        <p className="italic text-base text-valentine-red text-center font-bold">"Ekstra sang slap af :)"</p>
        <div className="w-full h-full min-h-[152px] md:min-h-[352px]">
          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/track/4S4QJfBGGrC8jRIjJHf1Ka?utm_source=generator"
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="min-h-[152px] md:min-h-[352px]"
          ></iframe>
        </div>
      </div>
    }
  />
),
    },
    {
      id: 'note3',
      title: 'Note',
      size: 'md:col-span-2 col-span-1 row-span-1',
      content: (
  <UnlockableNote
    id="note3"
    day={13}
    content={
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-2">
        <p className="italic text-base text-valentine-red text-center font-bold">"Ekstra sang :)"</p>
        <div className="w-full h-full min-h-[152px] md:min-h-[352px]">
          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/track/1fRLjwhspxZPVdV5MOpFeg?utm_source=generator"
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="min-h-[152px] md:min-h-[352px]"
          ></iframe>
        </div>
      </div>
    }
  />
),
    },
    {
      id: 'note4',
      title: 'Note',
      size: 'col-span-1 row-span-1',
content: (
  <UnlockableNote
    id="note4"
    day={13}
    content={<div className="italic text-base text-valentine-red p-2 leading-relaxed h-full flex items-center justify-center text-center">"Tegne på ipad på maccen :)"</div>}
  />
),
    },
    {
      id: 'note5',
      title: 'Note',
      size: 'col-span-1 row-span-1',
      content: (
  <UnlockableNote
    id="note5"
    day={14}
    content={
      <div className="italic text-base text-valentine-red p-2 leading-relaxed h-full flex items-center justify-center text-center">
        <a href="https://www.instagram.com/p/DRcVHc8kwUe/" target="_blank" rel="noopener noreferrer" className="hover:underline break-all text-valentine-red">
          https://www.instagram.com/p/DRcVHc8kwUe/
        </a>
      </div>
    }
  />
),
    },
    {
      id: 'note6',
      title: 'Note',
      size: 'col-span-1 row-span-1',
      content: (
  <UnlockableNote
    id="note6"
    day={14}
    content={<div className="italic text-base text-valentine-red p-2 leading-relaxed h-full flex items-center justify-center text-center">"Bakken :)"</div>}
  />
),
    },
    {
      id: 'note8',
      title: 'Note',
      size: 'md:col-span-2 col-span-1 row-span-1',
      content: (
  <UnlockableNote
    id="note8"
    day={14}
    content={
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-2">
        <p className="italic text-base text-valentine-red text-center font-bold">"En sidste sang :)"</p>
        <div className="w-full h-full min-h-[152px] md:min-h-[352px]">
          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/track/7EAMXbLcL0qXmciM5SwMh2?utm_source=generator"
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="min-h-[152px] md:min-h-[352px]"
          ></iframe>
        </div>
      </div>
    }
  />
),
    }
  ];

  const widgetItems = bentoItems.filter(item => !item.id.startsWith('note'));
  const noteItems = bentoItems.filter(item => item.id.startsWith('note'));

  return (
    <div className="min-h-screen bg-valentine-cream p-4 md:p-8 relative">
      <Ambiance />
      
      {isElectron && (
        <button 
          onClick={() => window.electronAPI?.closeApp()}
          className="fixed top-4 right-4 z-[400] p-2 bg-valentine-red text-white rounded-full shadow-lg hover:bg-valentine-red/80 transition-colors"
          aria-label="Close application"
        >
          <X size={20} aria-hidden="true" />
        </button>
      )}

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[300] bg-white border-2 border-valentine-red px-6 py-3 rounded-full shadow-xl flex items-center gap-3"
          >
            <Bell className="text-valentine-red animate-bounce" size={20} aria-hidden="true" />
            <span className="text-valentine-red font-bold text-sm">New memory unlocked!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <header className="text-center space-y-2" style={{ WebkitAppRegion: 'drag' } as any}>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleTitleTap}
            className="text-4xl md:text-6xl font-bold text-valentine-red cursor-pointer select-none no-drag"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            Our Sanctuary
          </motion.h1>
          <p className="text-valentine-soft font-medium text-sm md:text-base">Everything I love about us, in one place.</p>
        </header>

        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {widgetItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className={`${item.size} bg-white/50 backdrop-blur-sm border-2 border-valentine-pink/20 rounded-3xl p-6 shadow-sm flex flex-col`}
              >
                <h3 className="text-valentine-soft text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  {item.id.startsWith('feb') ? <Music size={14} aria-hidden="true" /> : <Clock size={14} aria-hidden="true" />}
                  {item.title}
                </h3>
                <div className="flex-grow">
                  {item.content}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-grow bg-valentine-pink/30" />
            <h2 className="text-3xl font-bold text-valentine-red font-sacramento text-5xl px-4">Notes</h2>
            <div className="h-[1px] flex-grow bg-valentine-pink/30" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {noteItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className={`${item.size} bg-white/50 backdrop-blur-sm border-2 border-valentine-pink/20 rounded-3xl p-6 shadow-sm flex flex-col`}
              >
                <h3 className="text-valentine-soft text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Heart size={14} aria-hidden="true" />
                  {item.title}
                </h3>
                <div className="flex-grow">
                  {item.content}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <Gallery />
        <SecretCinema />
      </div>

      {/* Secret Admin Panel */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-valentine-red">Admin Panel</h2>
              <button onClick={() => setShowAdmin(false)} className="text-valentine-soft font-bold">Close</button>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-valentine-soft mb-2">Controls</h3>
                <div className="space-y-4">
                  <button 
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 w-full py-4 border-2 border-valentine-red text-valentine-red rounded-xl font-bold hover:bg-valentine-red hover:text-white transition-colors"
                  >
                    <RefreshCw size={20} aria-hidden="true" /> Reset Experience
                  </button>

                  {isLocalhost && (
                    <button 
                      onClick={toggleDebugUnlock}
                      className={`flex items-center justify-center gap-2 w-full py-4 border-2 ${isDebugUnlocked ? 'border-green-500 text-green-500' : 'border-gray-400 text-gray-400'} rounded-xl font-bold transition-colors`}
                    >
                      <Heart size={20} aria-hidden="true" className={isDebugUnlocked ? 'fill-green-500' : ''} />
                      {isDebugUnlocked ? 'Debug: All Unlocked' : 'Debug: Lock to Date'}
                    </button>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
