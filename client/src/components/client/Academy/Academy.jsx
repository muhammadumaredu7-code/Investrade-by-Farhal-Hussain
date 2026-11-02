import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Clock,
} from 'lucide-react';



import dummyData from '../../../assets/dummyData.json';
import { useAppContext } from '../../../context/AppContext.jsx';

const Academy = () => {
  const data = dummyData.academyPage;
  const { academyCourses } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  const categories = ['All', 'Forex', 'PSX Stocks', 'Algorithmic AI'];

  const filteredCourses = activeCategory === 'All'
    ? academyCourses
    : academyCourses.filter((course) => course.category === activeCategory);

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-14">
          
          {/* ---------------- 1. PAGE HEADER ---------------- */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(163,230,53,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Investrade <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.5)]">Academy</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {data.subheading}
            </p>
          </div>

          {/* ---------------- 2. CATEGORY FILTERS ---------------- */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.5)] scale-105'
                    : 'bg-[#040e04] text-gray-400 hover:text-white border border-[#a3e635]/20 hover:border-[#a3e635]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ---------------- 3. COURSES CATALOG GRID ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/academy/${course.id}`}
                className="rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/25 overflow-hidden hover:border-[#a3e635]/60 transition-all duration-500 group hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="h-52 w-full overflow-hidden relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040e04] via-transparent to-transparent opacity-80"></div>

                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#a3e635] text-[10px] font-extrabold border border-[#a3e635]/30">
                      {course.category}
                    </span>

                    {course.badge && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#a3e635] text-black text-[9px] font-black uppercase shadow-lg">
                        {course.badge}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#a3e635]" /> {course.duration}
                      </span>
                      <span className="text-[#a3e635] font-bold">{course.level}</span>
                    </div>

                    <h3 className="text-lg font-black text-white group-hover:text-[#a3e635] transition-colors leading-snug line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {course.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-6 py-4 border-t border-[#a3e635]/15 bg-[#020802]/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-7 h-7 rounded-lg object-cover border border-[#a3e635]/30"
                    />
                    <span className="font-bold text-gray-300 text-xs truncate max-w-[100px]">
                      {course.instructor.name}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-[#a3e635]">{course.pricePKR}</div>
                    <div className="text-[10px] text-gray-400 font-bold">({course.priceUSD})</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      
    </div>
  );
};

export default Academy;