"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Play, Film, X, Music } from 'lucide-react';
import confetti from 'canvas-confetti';

const SPOTIFY_TRACKS = [
  { id: "4riDfclV7kPDT9D58FpmHd", title: "Where it Began" },
  { id: "0TZOdKFWNYfnwewAP8R4D8", title: "The Journey" },
  { id: "657CttNzh41EseXiePl3qC", title: "Today & Always" },
  { id: "4S4QJfBGGrC8jRIjJHf1Ka", title: "Extra sang slap af" },
  { id: "1fRLjwhspxZPVdV5MOpFeg", title: "Ekstra sang" },
  { id: "7EAMXbLcL0qXmciM5SwMh2", title: "En sidste sang" },
  { id: "6lanR86llQI00Y7u7Xv99m", title: "A Thousand Years" },
  { id: "3U41pC4GqJA7YhUj9Y0YAn", title: "All of Me" },
  { id: "0tgVp06mRiyW0vT9stRfH2", title: "Perfect" },
  { id: "44AyOl6qXmSiiF9H3fsRJu", title: "Can't Help Falling in Love" },
  { id: "4cLdpErILMO8Db8pQVAVcZ", title: "" },
  { id: "3YeQsJs1FdLI3w0BqWwpmk", title: "" },
  { id: "4Uiw0Sl9yskBaC6P4DcdVD", title: "" },
  { id: "0axgY4AiWx0spzdQb1gSjg", title: "" },
  { id: "1158ckiB5S4cpsdYHDB9IF", title: "" },
  { id: "42VqL9BDuRmBegKAJna2Sz", title: "" },
  { id: "70L6nHORQsblY813yNqUR3", title: "" },
  { id: "2ASygm7048ssav4ekbehPS", title: "" },
  { id: "4FEr6dIdH6EqLKR0jB560J", title: "" },
  { id: "7J2gyNghNTzl4EsLhXp01Q", title: "" },
  { id: "2z9P9aQKHm03709hllGeu6", title: "" },
  { id: "57nzyJkoGuDMYdOqhBJRks", title: "" },
  { id: "2CMq2UImv0YssAzKb95YBH", title: "" },
  { id: "7feYYM8jrR0QBlHXq8xU8w", title: "" },
  { id: "5UWwZ5lm5PKu6eKsHAGxOk", title: "" },
  { id: "3AGphW2taL8GGpJrz6KBWX", title: "" },
  { id: "2JNzhmJH8MZzfvsXwjs8gQ", title: "" },
  { id: "3XgGQ1wjo5khvq2UImjyNF", title: "" },
  { id: "6SOmn0HMuY4Lq9XiUo8JZM", title: "" },
  { id: "7tPt2dXYfFGWwSjbTlwS6m", title: "" },
  { id: "6fd3KzSD1SZqPT1bAVexfl", title: "" },
  { id: "0cfjyjXRcOBpnnWPGIR0rq", title: "" },
  { id: "6IyoLWzljeR3ldQo4KWHT6", title: "" },
  { id: "6NW9E4jRERkQ7gz0UmST6N", title: "" },
  { id: "2djJ7lcqPyh549ifRt2bBs", title: "" },
  { id: "0HTIrbUwwFn984RzVZm5Fk", title: "" },
  { id: "4F8T0eOXgFDGsv6cOi1GdU", title: "" },
  { id: "6BxGGPBdNexcy53euZsrga", title: "" },
  { id: "1JjiTsqfpfMoukoIW9cM5O", title: "" },
  { id: "6nc4aB9sk6krDWqzQ6Sl2s", title: "" },
  { id: "4CCrZzRdeWYrWJ0DoN4XCa", title: "" },
  { id: "0TlLq3lA83rQOYtrqBqSct", title: "" },
  { id: "7GnvKk7jml8aIJbRbQKKvo", title: "" },
  { id: "0A2wCSknrYXGSoY0JGFmyy", title: "" },
  { id: "22AbXxQbMdVqEz7xJjhccG", title: "" },
  { id: "5PvVkf1Yuq3XyMqqjPiKPd", title: "" },
  { id: "1slDsIJxew9AOOA3v0xFzn", title: "" },
  { id: "2nAEYxNIEC5vh1HrLUbH7L", title: "" },
  { id: "6J3StFliRi0thTQv5erBtX", title: "" },
  { id: "00zk0uua6s2ifh0Nc3ppfW", title: "" },
  { id: "49m4032xGdVa21JJ0U5fX0", title: "" },
  { id: "7IwFPnzx0n38hUvRcjJq5n", title: "" },
  { id: "0NaUT74rJ0NHS62fewzatU", title: "" },
  { id: "0U3aESoLzNev5b6B0JJLU1", title: "" },
  { id: "0uybPES9gAbATpINhwgehj", title: "" },
  { id: "53MnFFUIhlOHnyE5aMOnZU", title: "" },
  { id: "6htWGNhskc5f0Xke88Vn5z", title: "" },
  { id: "3Z2gAgqqZ2gm1TyVuLQqgK", title: "" },
  { id: "2LPNXtjG3eaIbFBoaMN354", title: "" },
  { id: "0d28khcov6AiegSCpG5TuT", title: "" },
  { id: "26wxtmoH4uPUF1n5VlPxMc", title: "" },
  { id: "2YSzYUF3jWqb9YP9VXmpjE", title: "" },
  { id: "7MMr2rAbKCecToZUbDAQg9", title: "" },
  { id: "3tYxhPqkioZEV5el3DJxLQ", title: "" },
  { id: "1OAh8uOEOvTDqkKFsKksCi", title: "" },
  { id: "5FOamJTVE7MYt2eMZE4MYh", title: "" },
  { id: "4D1k6x4MXTaSnljSvAXhaf", title: "" },
  { id: "2c7sRekhMGlj7u1WIIzoQu", title: "" },
  { id: "3RzYbj6Rr6mSJCar4Ua86F", title: "" },
  { id: "5XXAkqaDUHTVyBCuVBzCWF", title: "" },
  { id: "7E9kejvFw8NDfuu4y3hqkp", title: "" },
  { id: "2m9Ho5nRJ1JwHBmSkzRQQq", title: "" },
  { id: "7zkM2VrMD0DvAxNrxZCICt", title: "" },
  { id: "7jbjfnCaAMpHv6uFz1F3wQ", title: "" },
  { id: "4Ovbv1o91fNP8tYLJmboX1", title: "" },
  { id: "61eJ7HqXGyHfmHIqJApX7v", title: "" },
  { id: "3tUufRrj0xTrfzvuRa5QhU", title: "" },
  { id: "4YQgOgIElFtEvwJQ9ArWL7", title: "" },
  { id: "7E1dQbOk1qcx9gEPUMBKsk", title: "" },
  { id: "1AWQoqb9bSvzTjaLralEkT", title: "" },
  { id: "7sdHMJvhKib3ReVPsZFbrf", title: "" },
  { id: "0oO1AbL92F6329z13C2qQH", title: "" },
  { id: "1a019wP7IdYLexwbmfZPm3", title: "" },
  { id: "12eAtj918bpsB4Vts8pCMu", title: "" },
  { id: "57wp7VFnV8X0pSVnYArGeJ", title: "" },
  { id: "7vOmSP2647oNUGGEhWd1cr", title: "" },
  { id: "27sKtH0PZpASkN8H3ZJOQf", title: "" },
  { id: "4HMop4Re0iucehmF7mgV27", title: "" },
  { id: "06tNJ27nVxbDwhiQMChWyr", title: "" },
  { id: "5E9qBEUja2yAjUPhQO8Gx7", title: "" },
  { id: "3oZZfVvLJuDYc4Vn3A63Fw", title: "" },
  { id: "4Q05V5rx4Uo2298kyAXvqM", title: "" },
  { id: "11B7WTuoInwUvuP1BnnGWW", title: "" },
  { id: "5mjHJx2xQe679j9dSnqeHR", title: "" },
  { id: "2lKj7blUKSUgRNnSjtzGD3", title: "" },
  { id: "2wGSgTmgSF3xjRrHkTc25R", title: "" },
  { id: "6jo3Sv2PWgX7oX2gSsvbI5", title: "" },
  { id: "6et5HwX6nTYddg7hDGAxug", title: "" },
  { id: "7jr6fz888xjUlsAD2tZzKR", title: "" },
  { id: "7ne2hzW4jaU5tacaCI4kJH", title: "" },
  { id: "0QdB2tkxPG1qMgAMwv6mRP", title: "" },
  { id: "4A8ts0wUeOYu7y11KAAPil", title: "" },
  { id: "1Kw8Z6tri1YKG1t98FhlFJ", title: "" },
  { id: "2Xf4RoFpi7n06ppsGKbxiq", title: "" },
  { id: "1auxYwYrFRqZP7t3s7w4um", title: "" },
  { id: "00Srvq2BtgG9afXY9kzB1V", title: "" },
  { id: "3xby7fOyqmeON8jsnom0AT", title: "" },
  { id: "6eHSPpnxgH80LPruTPBWMg", title: "" },
  { id: "4eIYnlcgI2chjQBuW1VRr7", title: "" },
  { id: "5YO5gbm5wNaqG4IpulEXzf", title: "" },
  { id: "2OwdUZPORY0EAdRBF9hSZD", title: "" },
  { id: "57lsYy0OZLNb5OQ7fEa3Hs", title: "" },
  { id: "6NjWCIYu1W8xa3HIvcIhd4", title: "" },
  { id: "0U10zFw4GlBacOy9VDGfGL", title: "" },
  { id: "7kQ5USXOqajlefGbavFfCe", title: "" },
  { id: "44U5sw3AvxKI0Sy0tYakll", title: "" },
  { id: "4oPLjuY1WgGTL0Ja1doDOn", title: "" },
  { id: "4w2Furap0ZzaiK4J14E9sR", title: "" },
  { id: "6vf6BcbLMlBsUYqW4PVWAS", title: "" },
  { id: "2yR2sziCF4WEs3klW1F38d", title: "" },
  { id: "6vtn0nuCRfBDw0lmgw6xUq", title: "" },
  { id: "1Fy9dZeZRqx8EEm0AypZkJ", title: "" },
  { id: "2zXkELHmggcgtoHUspOSFC", title: "" },
  { id: "6ZK4VMxfEYLPqpSvX2l4iY", title: "" },
  { id: "3GDxQBr7aghzWH0kA0N8yk", title: "" },
  { id: "7cFLFmj3fLV5wxhcFfol7u", title: "" },
  { id: "6Hh3KXHI7aabjuVJWbTmh3", title: "" },
  { id: "3iRoXGFrF8O0jTul6LAmus", title: "" },
];

const SecretCinema = () => {
  const [passcode, setPasscode] = useState(['', '', '', '']);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [showCinema, setShowCinema] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(SPOTIFY_TRACKS[0].id);
  const [stoppedTracks, setStoppedTracks] = useState<Record<string, number>>({});

  const CORRECT_CODE = '1402';

  // Detect when an iframe is clicked to stop other playing tracks
  useEffect(() => {
    const handleBlur = () => {
      // Small timeout to allow document.activeElement to update
      setTimeout(() => {
        if (document.activeElement instanceof HTMLIFrameElement) {
          const iframeId = document.activeElement.id;
          if (iframeId.startsWith('spotify-cinema-')) {
            const trackId = iframeId.replace('spotify-cinema-', '');
            
            if (trackId !== selectedTrack) {
              setStoppedTracks(prev => ({
                ...prev,
                [selectedTrack]: Date.now() // Force reload of the previous track
              }));
              setSelectedTrack(trackId);
            }
          }
        }
      }, 100);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [selectedTrack]);

  useEffect(() => {
    const saved = localStorage.getItem('secret_cinema_unlocked');
    if (saved === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPasscode = [...passcode];
    newPasscode[index] = value.slice(-1);
    setPasscode(newPasscode);
    setError(false);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !passcode[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const checkPasscode = () => {
    const enteredCode = passcode.join('');
    if (enteredCode === CORRECT_CODE) {
      setIsUnlocked(true);
      localStorage.setItem('secret_cinema_unlocked', 'true');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#D63447', '#F7CAC9', '#D4AF37']
      });
    } else {
      setError(true);
      setPasscode(['', '', '', '']);
      document.getElementById('digit-0')?.focus();
    }
  };

  useEffect(() => {
    if (passcode.every(digit => digit !== '')) {
      checkPasscode();
    }
  }, [passcode]);

  if (showCinema) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[500] bg-black flex flex-row overflow-hidden"
      >
        {/* Sidebar - Music Selector */}
        <div className="w-[850px] h-full bg-zinc-950/20 backdrop-blur-3xl border-r border-white/5 flex flex-col p-12 shrink-0 overflow-y-auto custom-scrollbar z-10">
          <div className="flex items-center gap-3 text-valentine-red mb-12 px-2 shrink-0">
            <Music size={28} className="animate-pulse" />
            <h3 className="font-bold text-sm tracking-[0.4em] uppercase opacity-60 text-white/80">Cinema Soundtrack</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-12 pb-32">
            {SPOTIFY_TRACKS.map((track) => (
              <div 
                key={track.id} 
                className={`relative transition-all duration-700 cursor-pointer min-w-[320px] ${selectedTrack === track.id ? 'scale-105 opacity-100 z-10' : 'opacity-25 hover:opacity-50 scale-95'}`}
                onClick={() => {
                  if (track.id !== selectedTrack) {
                    setStoppedTracks(prev => ({ ...prev, [selectedTrack]: Date.now() }));
                    setSelectedTrack(track.id);
                  }
                }}
              >
                {selectedTrack === track.id && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute -inset-8 bg-valentine-red/30 blur-[80px] rounded-3xl" 
                  />
                )}
                <div className="relative z-10 shadow-2xl">
                  <iframe
                    id={`spotify-cinema-${track.id}`}
                    key={`${track.id}-${stoppedTracks[track.id] || 'initial'}`}
                    style={{ borderRadius: '24px' }}
                    src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="shadow-black/80 shadow-2xl min-w-full"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Video */}
        <div className="flex-grow flex flex-col items-center justify-center p-4 relative bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
          <button 
            onClick={() => setShowCinema(false)}
            className="absolute top-8 right-8 text-white/20 hover:text-white transition-all z-50 p-3 hover:bg-white/5 rounded-full"
          >
            <X size={32} />
          </button>

          <div className="h-[85vh] aspect-[9/16] bg-black rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(214,52,71,0.2)] border-[16px] border-zinc-900/95 relative">
            {/* iPhone-style Notch/Dynamic Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-9 bg-zinc-900 rounded-b-3xl z-20" />
            
            <video 
              src="/assets/videos/joyful_moments.mov" 
              controls 
              autoPlay 
              muted
              loop
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mt-8 flex items-center gap-8">
            <div className="h-[1px] w-20 bg-valentine-red/10" />
            <h2 className="text-4xl font-bold text-valentine-red font-sacramento text-7xl leading-none">Our Joyful Moments</h2>
            <div className="h-[1px] w-20 bg-valentine-red/10" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <section className="mt-20 mb-12 py-12 px-6 rounded-3xl bg-white/30 backdrop-blur-md border-2 border-valentine-pink/20 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-valentine-red/20 to-transparent" />
      
      {!isUnlocked ? (
        <div className="max-w-xs mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-valentine-pink/20 text-valentine-red mb-2">
            <Lock size={32} />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-valentine-red mb-1">Secret Cinema</h2>
            <p className="text-valentine-soft text-sm">Enter the 4-digit passcode to unlock a special memory.</p>
          </div>

          <motion.div 
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex justify-center gap-3"
          >
            {passcode.map((digit, idx) => (
              <input
                key={idx}
                id={`digit-${idx}`}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleInput(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none
                  ${error ? 'border-red-500 bg-red-50' : 'border-valentine-pink/30 focus:border-valentine-red bg-white/50'}
                  ${digit ? 'text-valentine-red' : 'text-transparent'}`}
                autoComplete="off"
              />
            ))}
          </motion.div>

          {error && (
            <p className="text-red-500 text-xs font-bold animate-pulse">Incorrect passcode. Try again!</p>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto space-y-6"
        >
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-valentine-red/20 blur-xl rounded-full animate-pulse" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-valentine-red text-white shadow-xl">
              <Film size={40} />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-valentine-red font-sacramento text-5xl mb-2">Unlocked!</h2>
            <p className="text-valentine-soft">Our secret cinema is ready for you.</p>
          </div>

          <button 
            onClick={() => setShowCinema(true)}
            className="group flex items-center justify-center gap-3 mx-auto px-10 py-4 bg-valentine-red text-white rounded-full text-xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Play size={24} className="fill-current" />
            Start Movie
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default SecretCinema;
