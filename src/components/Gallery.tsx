"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isTrackUnlocked, getDaysUntil, getTimeUntil } from '@/utils/date';
import { Clock } from 'lucide-react';
import ScratchOffImage from './ScratchOffImage';
import Lightbox from './Lightbox';

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

const IMAGES_DAY1: string[] = [
    "IMG_1254.JPEG",
    "IMG_1290.JPEG",
    "IMG_1292.JPEG",
    "IMG_1307.JPEG",
    "IMG_2104.JPG",
    "IMG_2139.JPG",
    "IMG_2140.JPEG",
    "IMG_3117.JPEG",
    "IMG_3119.JPG",
    "IMG_3122.JPEG",
    "IMG_3436.JPEG",
    "IMG_5365.JPG",
    "IMG_5383.JPG",
    "IMG_6995.JPG",
    "IMG_8156.JPG",
    "IMG_8161.JPG",
    "IMG_8165.JPG",
    "IMG_8172.JPG",
    "IMG_8183.JPG",
    "IMG_8190.JPG",
    "lp_image-1.JPEG",
    "lp_image-2.JPEG",
    "lp_image.JPEG",
  ];

const IMAGES_DAY2: string[] = [
    "IMG_0638.jpeg",
    "IMG_0639.jpeg",
    "IMG_0643.jpeg",
    "IMG_0647.jpeg",
    "IMG_0663.jpeg",
    "IMG_0665.jpeg",
    "IMG_0712.jpeg",
    "IMG_0724.jpeg",
    "IMG_0746.jpeg",
    "IMG_0799.jpeg",
    "IMG_0807.jpeg",
    "IMG_0929.jpeg",
    "IMG_0948.jpeg",
    "IMG_1004.jpeg",
    "IMG_1019.jpeg",
    "IMG_1134.jpeg",
    "IMG_1135.jpeg",
    "IMG_1137.jpeg",
    "IMG_1140.jpeg",
    "IMG_1250.jpeg",
    "IMG_1257.jpeg",
    "IMG_2527.jpeg",
    "lp_image.jpeg",
  ];

const IMAGES_DAY3: string[] = [
    "IMG_0666.jpeg",
    "IMG_0746.jpeg",
    "IMG_0767.jpeg",
    "IMG_0785.jpeg",
    "IMG_0929.jpeg",
    "IMG_0961.jpeg",
    "IMG_0987.jpeg",
    "IMG_1023.jpeg",
    "IMG_1135.jpeg",
    "IMG_1140.jpeg",
    "IMG_1225.jpeg",
    "IMG_1239.jpeg",
    "IMG_1395.jpeg",
    "IMG_1410.jpeg",
    "IMG_1725.jpeg",
    "IMG_1727.jpeg",
    "IMG_1970.jpeg",
    "IMG_2461.jpeg",
  ];

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allSections = [
    { day: 12, images: IMAGES_DAY1, label: "Part 1: The Beginning" },
    { day: 13, images: IMAGES_DAY2, label: "Part 2: Our Journey" },
    { day: 14, images: IMAGES_DAY3, label: "Part 3: Today & Forever" },
  ];

  const chromeColors = [
    '#F7CAC9', // Soft Pink
    '#D63447', // Red
    '#FFF5E1', // Cream
    '#D4AF37', // Gold
    '#FF8C94', // Soft Red
    '#FFB6C1', // Light Pink
    '#E6E6FA', // Lavender
    '#FFF0F5', // Lavender Blush
  ];

  // Flatten all unlocked images for lightbox navigation
  const unlockedImages = allSections.flatMap((section, sIdx) => 
    isTrackUnlocked(section.day) 
      ? section.images.map(src => ({ src, folder: `day${section.day - 11}` })) 
      : []
  );

  const hasAnyImages = IMAGES_DAY1.length > 0 || IMAGES_DAY2.length > 0 || IMAGES_DAY3.length > 0;

  if (!hasAnyImages) {
    return (
      <div className="mt-12 text-center p-12 border-2 border-dashed border-valentine-pink/30 rounded-3xl">
        <p className="text-valentine-soft italic">
          Your gallery is waiting for memories.
        </p>
      </div>
    );
  }

  const handleImageClick = (src: string, folder: string) => {
    const index = unlockedImages.findIndex(img => img.src === src && img.folder === folder);
    if (index !== -1) setLightboxIndex(index);
  };

  return (
    <div className="mt-12 space-y-12">
      <h2 className="text-4xl md:text-5xl font-bold text-valentine-red text-center font-sacramento">Our Memories</h2>
      
      {allSections.map((section, sectionIdx) => {
        const unlocked = isTrackUnlocked(section.day);
        const folder = `day${section.day - 11}`;

        if (section.images.length === 0 && unlocked) return null;

        return (
          <div key={section.day} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-grow bg-valentine-pink/30" />
              <h3 className="text-valentine-soft text-sm font-bold uppercase tracking-widest">
                {section.label}
              </h3>
              <div className="h-[1px] flex-grow bg-valentine-pink/30" />
            </div>

            {unlocked ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-2 md:gap-4 space-y-2 md:space-y-4">
                {section.images.map((src, index) => {
                  const rotation = ((index * 7 + sectionIdx * 13) % 6) - 3;
                  const borderRadius = 12 + ((index * 3) % 15);
                  const hasTape = (index + sectionIdx) % 4 === 0;
                  const tapeRotation = ((index * 17) % 20) - 10;
                  const chromeColor = chromeColors[(index + sectionIdx) % chromeColors.length];
                  
                  return (
                    <motion.div
                      key={src}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index % 6) * 0.1 }}
                      className="break-inside-avoid relative group pt-4 cursor-pointer"
                      style={{ rotate: `${rotation}deg` }}
                      onClick={() => {
                        handleImageClick(src, folder);
                      }}
                    >
                      {hasTape && (
                        <div 
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/40 backdrop-blur-sm shadow-sm z-10"
                          style={{ rotate: `${tapeRotation}deg` }}
                        />
                      )}
                      <ScratchOffImage
                        src={`/assets/images/${folder}/${src}`}
                        alt={`Memory ${index + 1}`}
                        id={`${folder}_${src}`}
                        borderRadius={`${borderRadius}px`}
                        chromeColor={chromeColor}
                        filter={`sepia(${(index % 3) * 5}%) brightness(${100 + (index % 5)}%)`}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 bg-white/30 backdrop-blur-sm border-2 border-dashed border-valentine-pink/30 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                <Clock size={48} aria-hidden="true" className="text-valentine-soft animate-pulse" />
                <div>
                  <p className="text-lg font-bold text-valentine-red">This part of our story is still locked</p>
                  <p className="text-valentine-soft mb-2 uppercase text-[10px] tracking-widest font-bold">Unlocking in</p>
                  <LiveCountdown day={section.day} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Lightbox
        images={unlockedImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex(prev => prev !== null ? (prev - 1 + unlockedImages.length) % unlockedImages.length : null)}
        onNext={() => setLightboxIndex(prev => prev !== null ? (prev + 1) % unlockedImages.length : null)}
      />
    </div>
  );
};

export default Gallery;
