import { useState, useEffect } from 'react';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';

const Reviews = () => {
  const { siteContent } = useAppContext();
  const data = siteContent.reviewsData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Continuous Auto Slider Animation (4 seconds interval)
  useEffect(() => {
    if (!isAutoplay || !data?.testimonials?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoplay, data]);

  if (!data || !data.testimonials.length) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % data.testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + data.testimonials.length) % data.testimonials.length);
  };

  const currentTestimonial = data.testimonials[currentIndex] || data.testimonials[0];
  const totalReviewsCount = data.totalCount || data.testimonials.length;

  return (
    <section className="w-full bg-[#020602] text-white font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none border-t border-[#a3e635]/20">
      
      {/* ---------------- 1. BACKGROUND NEON GLOWS & GRID ---------------- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[380px] bg-gradient-to-r from-[#a3e635]/15 via-[#bef264]/10 to-[#84cc16]/15 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>

      {/* Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* ---------------- 2. SECTION HEADER WITH QUANTITY BADGE ---------------- */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          
          <div className="flex items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(163,230,53,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            {/* Total Quantity Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#081b08] border border-[#a3e635]/40 text-white text-xs font-black shadow-lg">
              <Users className="w-3.5 h-3.5 text-[#a3e635]" />
              <span>{totalReviewsCount} Verified Reviews</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {data.heading.split('Traders')[0]}{' '}
            <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(163,230,53,0.4)]">
              Traders Worldwide
            </span>
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm">
            {data.subheading}
          </p>
        </div>

        {/* ---------------- 3. TESTIMONIAL SLIDER CARD ---------------- */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          {/* Outer Neon Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-[#a3e635]/30 via-[#bef264]/20 to-[#84cc16]/30 rounded-3xl blur-2xl opacity-75 animate-pulse"></div>

          <div className="relative rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/35 p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all duration-500">
            
            <Quote className="absolute top-6 right-8 w-20 h-20 text-[#a3e635]/10 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              
              {/* Profile Image & Status Badge */}
              <div className="relative shrink-0 group">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#a3e635] to-[#84cc16] rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#a3e635]/50 shadow-xl">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="absolute -bottom-2 -right-2 bg-[#a3e635] text-black p-1.5 rounded-xl shadow-lg border border-black flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 fill-black text-[#a3e635]" />
                </div>
              </div>

              {/* Review Text & Client Info */}
              <div className="space-y-4 text-center md:text-left flex-1">
                
                {/* Rating Stars */}
                <div className="flex items-center justify-center md:justify-start gap-1">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#a3e635] text-[#a3e635] drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]"
                    />
                  ))}
                </div>

                {/* Animated Review Body */}
                <p className="text-gray-200 text-sm sm:text-base italic font-normal leading-relaxed text-justify md:text-left min-h-[90px] transition-all duration-500 animate-in fade-in">
                  "{currentTestimonial.review}"
                </p>

                {/* Client Metadata */}
                <div className="pt-3 border-t border-[#a3e635]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-extrabold text-white group-hover:text-[#a3e635] transition-colors">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-xs text-[#a3e635] font-bold">
                      {currentTestimonial.role}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 bg-[#a3e635]/10 px-3 py-1 rounded-full border border-[#a3e635]/30 w-fit">
                    {currentTestimonial.location}
                  </span>
                </div>

              </div>

            </div>

            {/* ---------------- 4. CONTROLS & QUANTITY INDEX SLIDER ---------------- */}
            <div className="mt-8 pt-6 border-t border-[#a3e635]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Review Index Counter */}
              <div className="text-xs font-mono text-gray-400">
                Review <span className="text-[#a3e635] font-extrabold">{currentIndex + 1}</span> of <span className="text-white font-extrabold">{totalReviewsCount}</span>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-1.5 max-w-full overflow-x-auto py-1">
                {data.testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                      currentIndex === idx
                        ? 'w-6 bg-[#a3e635] shadow-[0_0_12px_rgba(163,230,53,0.8)]'
                        : 'w-2 bg-gray-700 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev/Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-[#081806] hover:bg-[#a3e635] text-gray-300 hover:text-black border border-[#a3e635]/30 hover:border-[#a3e635] transition-all duration-300 shadow-md group cursor-pointer"
                  aria-label="Previous Review"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-[#081806] hover:bg-[#a3e635] text-gray-300 hover:text-black border border-[#a3e635]/30 hover:border-[#a3e635] transition-all duration-300 shadow-md group cursor-pointer"
                  aria-label="Next Review"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Reviews;