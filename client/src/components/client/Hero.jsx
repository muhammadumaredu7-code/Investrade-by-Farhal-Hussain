import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import brandLogo from '../../assets/logo2.png';
import {
  ArrowRight,
  Sparkles,
  PlayCircle,
  TrendingUp,
  Bot,
  GraduationCap
} from 'lucide-react';
import { getContentIcon } from './ContentIcons.jsx';


const Hero = () => {
  const { siteContent } = useAppContext();
  const heroData = siteContent.heroData;
  const logoSource = heroData.logoUrl || brandLogo;
  const [logoErrorUrl, setLogoErrorUrl] = useState('');
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);

  // Dynamic Animated Slogan Text Switcher
  useEffect(() => {
    if (!heroData || !heroData.slogans || !heroData.slogans.length) return;

    const interval = setInterval(() => {
      setFadeState(false);

      setTimeout(() => {
        setCurrentSloganIndex((prev) => (prev + 1) % heroData.slogans.length);
        setFadeState(true);
      }, 400);
    }, 3200);

    return () => clearInterval(interval);
  }, [heroData]);

  if (!heroData) return null;

  return (
    <section className="relative w-full min-h-screen bg-[#020602] text-white flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      
      {/* ---------------- 1. BACKGROUND NEON GLOWS & CYBER MESH ---------------- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.18)_0%,transparent_65%)] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[400px] sm:h-[500px] bg-gradient-to-tr from-[#84cc16]/25 via-[#a3e635]/15 to-transparent rounded-full blur-[160px] pointer-events-none animate-pulse"></div>

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"></div>

      {/* Floating Particles */}
      <div className="absolute top-24 left-12 w-2 h-2 bg-[#a3e635] rounded-full animate-ping opacity-75"></div>
      <div className="absolute top-44 right-20 w-2.5 h-2.5 bg-[#bef264] rounded-full animate-pulse"></div>
      <div className="absolute bottom-36 left-1/4 w-2 h-2 bg-[#84cc16] rounded-full animate-ping"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
        
        {/* ---------------- 2. TOP BADGE ---------------- */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(163,230,53,0.25)] backdrop-blur-md hover:scale-105 transition-transform duration-300 cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{heroData.badge}</span>
        </div>

        {/* ---------------- 3. FLOATING LOGO IMAGE ---------------- */}
        <div className="relative mb-6 group cursor-pointer w-full flex justify-center items-center">
          <div className="absolute w-[280px] sm:w-[450px] md:w-[550px] h-24 sm:h-36 bg-gradient-to-r from-[#a3e635]/30 via-[#bef264]/40 to-[#84cc16]/30 rounded-full blur-3xl opacity-85 group-hover:opacity-100 transition-opacity duration-700 animate-pulse pointer-events-none"></div>

          {logoErrorUrl !== logoSource ? (
            <img
              src={logoSource}
              alt="Investrade Logo"
              className="h-28 sm:h-44 md:h-52 w-auto object-contain relative z-10 filter drop-shadow-[0_0_35px_rgba(163,230,53,0.85)] group-hover:scale-105 transition-transform duration-500"
              onError={() => setLogoErrorUrl(logoSource)}
            />
          ) : (
            <div className="flex items-center gap-3 text-white font-extrabold text-4xl sm:text-6xl tracking-tight relative z-10">
              <div className="bg-gradient-to-br from-[#a3e635] to-[#65a30d] p-4 rounded-3xl text-black shadow-[0_0_35px_rgba(163,230,53,0.6)]">
                <TrendingUp className="w-12 h-12 stroke-[2.5]" />
              </div>
              <span>In<span className="text-[#a3e635]">Vest</span>rade</span>
            </div>
          )}
        </div>

        {/* ---------------- 4. DYNAMIC ANIMATED HEADLINE ---------------- */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.15] max-w-4xl mb-6 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
          <span className="text-white block">{heroData.mainTitleStatic}</span>
          
          <span
            className={`block mt-2 bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.6)] transition-all duration-500 ease-in-out transform ${
              fadeState
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-3 scale-95'
            }`}
          >
            {heroData.slogans[currentSloganIndex]}
          </span>
        </h1>

        {/* ---------------- 5. SUBTITLE ---------------- */}
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          {heroData.subtitle}
        </p>

        {/* ---------------- 6. CTA BUTTONS ---------------- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          <Link
            to={heroData.ctaPrimary.href}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] hover:from-[#bef264] hover:to-[#a3e635] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_0_30px_rgba(163,230,53,0.4)] hover:shadow-[0_0_45px_rgba(163,230,53,0.7)] hover:-translate-y-1 group cursor-pointer"
          >
            <Bot className="w-5 h-5 text-black stroke-[2.5]" />
            <span>{heroData.ctaPrimary.text}</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to={heroData.ctaSecondary.href}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#081706]/90 hover:bg-[#a3e635]/10 border border-[#a3e635]/30 hover:border-[#a3e635]/60 text-gray-200 hover:text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 backdrop-blur-md hover:-translate-y-1 group cursor-pointer"
          >
            <PlayCircle className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>{heroData.ctaSecondary.text}</span>
          </Link>

          <a
            href={heroData.cta.href}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-violet-400/10 hover:bg-violet-400/20 border border-violet-300/30 hover:border-violet-300/60 text-violet-100 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 backdrop-blur-md hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(167,139,250,0.2)] group cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 text-violet-300 group-hover:scale-110 transition-transform" />
            <span>{heroData.cta.text}</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* ---------------- 7. HIGHLIGHTS FEATURE BAR (FETCHED FROM JSON) ---------------- */}
        <div className="w-full max-w-4xl pt-8 border-t border-[#a3e635]/20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          {heroData.highlights.map((item) => {
            const IconComp = getContentIcon(item.icon);
            const colorClasses = {
              sky: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
              violet: 'bg-violet-400/10 text-violet-300 border-violet-400/30',
              emerald: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
              rose: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
              amber: 'bg-amber-400/10 text-amber-300 border-amber-400/30'
            }[item.color] || 'bg-amber-400/10 text-amber-300 border-amber-400/30';

            return (
              item.title === 'VIP Signal Groups' ? (
                <Link
                  key={item.id}
                  to="/vip-groups"
                  className="flex items-center justify-center sm:justify-start gap-3 p-3.5 rounded-2xl bg-[#a3e635]/5 border border-[#a3e635]/15 hover:border-[#a3e635]/40 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className={`p-2.5 rounded-xl border ${colorClasses} shrink-0`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-gray-200">{item.title}</div>
                    <div className="text-[11px] text-gray-400">{item.sub}</div>
                  </div>
                </Link>
              ) : (
                <div
                  key={item.id}
                  className="flex items-center justify-center sm:justify-start gap-3 p-3.5 rounded-2xl bg-[#a3e635]/5 border border-[#a3e635]/15 hover:border-[#a3e635]/40 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className={`p-2.5 rounded-xl border ${colorClasses} shrink-0`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-gray-200">{item.title}</div>
                    <div className="text-[11px] text-gray-400">{item.sub}</div>
                  </div>
                </div>
              )
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Hero;