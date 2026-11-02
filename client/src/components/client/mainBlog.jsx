import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  BookOpen
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';

const MainBlog = () => {
  const { siteContent } = useAppContext();
  const blogs = siteContent.blogs;
  const [, setIsPaused] = useState(false);
  const sliderRef = useRef(null);

  // Manual Scroll Handlers
  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  if (!blogs.length) return null;

  return (
    <section className="w-full bg-[#020602] text-white font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none border-t border-[#a3e635]/20">
      
      {/* ---------------- 1. BACKGROUND GLOWS & GRID ---------------- */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-[#a3e635]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#84cc16]/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        {/* ---------------- 2. HEADER & NAVIGATION BUTTONS ---------------- */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(163,230,53,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>Market Research & Insights</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Latest <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(163,230,53,0.4)]">Investrade Blogs</span>
            </h2>

            <p className="text-gray-400 text-xs sm:text-sm max-w-xl">
              Stay updated with institutional trading strategies, crypto breakdowns, and macroeconomic market analysis.
            </p>
          </div>

          {/* Left / Right Control Arrows */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleScrollLeft}
              className="p-3 rounded-2xl bg-[#081806] hover:bg-[#a3e635] text-gray-300 hover:text-black border border-[#a3e635]/30 hover:border-[#a3e635] transition-all duration-300 shadow-md group cursor-pointer"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={handleScrollRight}
              className="p-3 rounded-2xl bg-[#081806] hover:bg-[#a3e635] text-gray-300 hover:text-black border border-[#a3e635]/30 hover:border-[#a3e635] transition-all duration-300 shadow-md group cursor-pointer"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ---------------- 3. CONTINUOUS SMOOTH CAROUSEL SLIDER ---------------- */}
        <div
          className="relative w-full overflow-x-auto scrollbar-none py-4"
          ref={sliderRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center gap-6 w-max">
            {blogs.map((item) => (
              <Link
                key={item.id}
                to={`/blog/${item.id}`}
                className="w-[310px] sm:w-[350px] shrink-0 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/20 hover:border-[#a3e635]/60 overflow-hidden backdrop-blur-xl transition-all duration-500 group hover:-translate-y-2 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex flex-col justify-between"
              >
                <div>
                  {/* Image & Category Tag */}
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040e04] via-transparent to-transparent opacity-80"></div>

                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#a3e635] text-[10px] font-extrabold border border-[#a3e635]/30">
                      {item.category}
                    </span>

                    {item.badge && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#a3e635] text-black text-[9px] font-black uppercase shadow-[0_0_10px_rgba(163,230,53,0.5)]">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#a3e635]" /> {item.readTime}
                      </span>
                      <span>{item.publishDate}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-white group-hover:text-[#a3e635] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-5 py-3.5 border-t border-[#a3e635]/15 bg-[#020802]/60 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.author.avatar}
                      alt={item.author.name}
                      className="w-6 h-6 rounded-lg object-cover border border-[#a3e635]/30"
                    />
                    <span className="font-bold text-gray-300 text-[11px] truncate max-w-[110px]">
                      {item.author.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Heart className="w-3.5 h-3.5 text-[#a3e635]" /> {item.likesCount || 0}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#a3e635] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ---------------- 4. VIEW ALL BLOGS BUTTON ---------------- */}
        <div className="flex justify-center pt-2">
          <Link
            to="/blog/1"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-[#081806] hover:bg-[#a3e635]/10 border border-[#a3e635]/30 hover:border-[#a3e635]/60 text-gray-200 hover:text-white font-extrabold text-xs transition-all duration-300 backdrop-blur-md shadow-lg group cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#a3e635]" />
            <span>Explore All Research Articles</span>
            <ArrowRight className="w-4 h-4 text-[#a3e635] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-none {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  );
};

export default MainBlog;