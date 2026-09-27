'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LATEST_ANNOUNCEMENTS, ASSOCIATION_INFO } from '@/data/associationData';
import { 
  ChevronLeft, ChevronRight, Calendar, Bell, ArrowRight, 
  ShieldCheck, FileText, Users, Sparkles, Phone 
} from 'lucide-react';

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto loop through the latest updates & events
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LATEST_ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentUpdate = LATEST_ANNOUNCEMENTS[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? LATEST_ANNOUNCEMENTS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % LATEST_ANNOUNCEMENTS.length);
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped Left -> Next Slide
      nextSlide();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      // Swiped Right -> Previous Slide
      prevSlide();
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-950/70 via-slate-900 to-blue-950/80 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-4 sm:left-10 w-60 sm:w-80 h-60 sm:h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Looping Marquee Ticker */}
      <div className="relative z-10 border-b border-slate-800 bg-sky-950/70 backdrop-blur-sm py-2 px-3 sm:px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] sm:text-xs font-bold whitespace-nowrap border border-amber-500/30 flex-shrink-0">
            <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce" />
            <span>UPDATES:</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="inline-block animate-marquee text-[11px] sm:text-xs text-slate-300">
              <span className="mx-3 sm:mx-4 font-medium text-white">📢 Community General Body Meeting</span>
              <span className="text-slate-500">•</span>
              <span className="mx-3 sm:mx-4">🌟 Online Membership Registration open for all Ponnappa Nadar Nagar residents</span>
              <span className="text-slate-500">•</span>
              <span className="mx-3 sm:mx-4 text-emerald-400">💡 LED street light infrastructure maintenance ongoing</span>
              <span className="text-slate-500">•</span>
              <span className="mx-3 sm:mx-4 font-medium text-sky-300">🤝 Online membership enrollment open for all residents</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Association Hero Introduction */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[11px] sm:text-sm font-medium mx-auto lg:mx-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 flex-shrink-0" />
              <span>Government Registered • {ASSOCIATION_INFO.regdNo}</span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-lg sm:text-2xl font-bold text-amber-400 tracking-wide font-sans leading-snug">
                {ASSOCIATION_INFO.nameTamil}
              </h2>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
                Association for Ponnappa Nadar Nagar Residents Amenity
              </h1>
              <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Dedicated to the welfare, infrastructure, street illumination, sanitation, and safety of all residents in Ponnappa Nadar Nagar, Nagercoil.
              </p>
            </div>

            {/* Quick Action Buttons - Stacked on Mobile with full touch width */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1 sm:pt-2">
              <Link
                href="/membership"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 active:scale-98 transition-transform"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Fill Membership Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#heads"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 active:scale-98 transition-transform"
              >
                <Users className="w-4 h-4 text-sky-400" />
                <span>Office Bearers Directory</span>
              </a>
            </div>

            {/* Quick Community Stats Chips - Seamless 3-Column Mobile Fit */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-slate-800 text-left">
              <div className="bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
                <div className="text-[10px] sm:text-xs text-slate-400 font-medium">Registration</div>
                <div className="text-sm sm:text-xl font-bold text-amber-400">Open Now</div>
                <div className="text-[9px] sm:text-[11px] text-slate-400 truncate">Direct entry</div>
              </div>
              <div className="bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
                <div className="text-[10px] sm:text-xs text-slate-400 font-medium">Eligibility</div>
                <div className="text-sm sm:text-xl font-bold text-sky-400">All Residents</div>
                <div className="text-[9px] sm:text-[11px] text-slate-400 truncate">Owners & Tenants</div>
              </div>
              <div className="bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
                <div className="text-[10px] sm:text-xs text-slate-400 font-medium">Location</div>
                <div className="text-sm sm:text-xl font-bold text-emerald-400">Nagercoil - 4</div>
                <div className="text-[9px] sm:text-[11px] text-slate-400 truncate">P.N. Nagar Colony</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Loop Showcase Card (Touch-Swipeable on Mobile) */}
          <div
            className="lg:col-span-5"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/95 p-4 sm:p-6 border border-slate-700/80 shadow-2xl backdrop-blur-md">
              
              {/* Header inside slider card */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Association Feed</h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400">Swipe or wait to auto-loop</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {currentIndex + 1} / {LATEST_ANNOUNCEMENTS.length}
                </span>
              </div>

              {/* Slider Content */}
              <div className="min-h-[240px] sm:min-h-[260px] flex flex-col justify-between py-3 sm:py-4 transition-all duration-300">
                <div className="space-y-2.5 sm:space-y-3">
                  {currentUpdate.image && (
                    <div className="relative h-28 sm:h-36 w-full rounded-xl overflow-hidden border border-slate-700 shadow-inner">
                      <img
                        src={currentUpdate.image}
                        alt={currentUpdate.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                        {currentUpdate.tag}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {currentUpdate.date}
                    </span>
                    <span className="text-[11px] sm:text-xs text-sky-400 font-semibold">• {currentUpdate.category}</span>
                  </div>

                  <h4 className="text-sm sm:text-lg font-bold text-white leading-snug">
                    {currentUpdate.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                    {currentUpdate.description}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                  <span>Category: <strong className="text-sky-300">{currentUpdate.category}</strong></span>
                  <span className="text-slate-500 hidden sm:inline italic">Swipe or hover</span>
                </div>
              </div>

              {/* Slider Navigation controls */}
              <div className="flex items-center justify-between pt-1">
                {/* Dots indicator */}
                <div className="flex items-center gap-1.5">
                  {LATEST_ANNOUNCEMENTS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentIndex === idx ? 'w-5 sm:w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Left/Right Buttons with Touch-friendly hit target */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white transition-colors border border-slate-700 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    aria-label="Previous announcement"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white transition-colors border border-slate-700 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    aria-label="Next announcement"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
