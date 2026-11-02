import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Users,
  ShieldCheck,
  Zap,
  Globe,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';

const MainAbout = () => {
  const { siteContent } = useAppContext();
  const data = siteContent.aboutSection;

  if (!data) return null;

  return (
    <section className="w-full bg-[#020602] text-white font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none border-y border-[#a3e635]/15">
      
      {/* ---------------- 1. FLOATING NEON GLOWS & CYBER GRID ---------------- */}
      <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#a3e635]/20 via-[#84cc16]/10 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-[#bef264]/10 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Cyber Background Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* ---------------- 2. LEFT VISUAL CARD (COLORFUL ICONS & BRANDING) ---------------- */}
          <div className="lg:col-span-5 relative group">
            
            {/* Outer Glowing Neon Aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#a3e635]/40 via-[#84cc16]/25 to-[#bef264]/40 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>

            <div className="relative rounded-3xl bg-gradient-to-b from-[#051406] via-[#030b03] to-[#010501] border border-[#a3e635]/35 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl space-y-7 group-hover:border-[#a3e635]/60 transition-all duration-500 hover:-translate-y-1">
              
              {/* Brand Typography (Replacing Image Logo) */}
              <div className="flex flex-col items-center justify-center py-4 border-b border-[#a3e635]/20 relative">
                <div className="flex items-center gap-3 text-white font-black text-3xl sm:text-4xl tracking-tight">
                  <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#a3e635] via-[#84cc16] to-[#bef264] text-black shadow-[0_0_25px_rgba(163,230,53,0.6)] group-hover:rotate-6 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <span>In<span className="text-[#a3e635] drop-shadow-[0_0_15px_rgba(163,230,53,0.5)]">Vest</span>rade</span>
                </div>
                <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#a3e635]/80 uppercase mt-2">
                  Institutional Intelligence
                </span>
              </div>

              {/* Colorful Feature Badges Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Badge 1: Blue/Cyan Accent */}
                <div className="p-4 rounded-2xl bg-[#04141d]/70 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 shadow-lg group/card">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 w-fit mb-2 group-hover/card:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-black text-white">100+</div>
                  <div className="text-[11px] font-semibold text-cyan-200/80">Live Webinars</div>
                </div>

                {/* Badge 2: Purple/Indigo Accent */}
                <div className="p-4 rounded-2xl bg-[#120a22]/70 border border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-300 shadow-lg group/card">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 w-fit mb-2 group-hover/card:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-black text-white">50K+</div>
                  <div className="text-[11px] font-semibold text-indigo-200/80">Active Learners</div>
                </div>

                {/* Badge 3: Amber/Orange Accent */}
                <div className="p-4 rounded-2xl bg-[#1d1204]/70 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 shadow-lg group/card">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 w-fit mb-2 group-hover/card:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-black text-white">1-on-1</div>
                  <div className="text-[11px] font-semibold text-amber-200/80">Pro Mentorship</div>
                </div>

                {/* Badge 4: Lime Accent */}
                <div className="p-4 rounded-2xl bg-[#0b1b08]/70 border border-[#a3e635]/30 hover:border-[#a3e635]/60 transition-all duration-300 shadow-lg group/card">
                  <div className="p-2 rounded-xl bg-[#a3e635]/20 text-[#a3e635] border border-[#a3e635]/30 w-fit mb-2 group-hover/card:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-black text-white">99.9%</div>
                  <div className="text-[11px] font-semibold text-[#a3e635]/90">Precision Analytics</div>
                </div>

              </div>

              {/* Bottom Quick Feature Tag */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#a3e635]/15 via-emerald-950/40 to-transparent border border-[#a3e635]/30 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#a3e635] text-black shrink-0 shadow-[0_0_15px_rgba(163,230,53,0.5)]">
                  <Zap className="w-4 h-4 fill-black" />
                </div>
                <div className="text-xs text-gray-300 leading-snug">
                  <span className="font-bold text-white block">Real-World Capital Growth</span>
                  Transparent strategies engineered for serious market players.
                </div>
              </div>

            </div>
          </div>

          {/* ---------------- 3. RIGHT OVERVIEW & ATTRACTIVE HEADING ---------------- */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Glowing Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold tracking-wider uppercase shadow-[0_0_15px_rgba(163,230,53,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '5s' }} />
              <span>{data.badge || "Empowering Global Traders"}</span>
            </div>

            {/* Main Attractive Heading & Slogan */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                {data.heading || "Welcome to Investrade"}{' '}
                <span className="block mt-1 bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(163,230,53,0.4)]">
                  Unlocking Institutional Mastery
                </span>
              </h2>
              <p className="text-sm sm:text-base font-bold text-[#a3e635]/90 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#a3e635]" />
                {data.subheading || "Dedicated to the world of financial markets!"}
              </p>
            </div>

            {/* Paragraphs */}
            <div className="space-y-3 text-gray-300 text-xs sm:text-sm leading-relaxed text-justify font-normal">
              <p className="bg-[#051206]/50 p-4 rounded-2xl border border-[#a3e635]/15">
                {data.paragraph1 || data.shortDescription}
              </p>
              {data.paragraph2 && (
                <p className="text-gray-400 pl-1">
                  {data.paragraph2}
                </p>
              )}
            </div>

            {/* Colorful Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {data.features?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#061808]/80 border border-[#a3e635]/20 hover:border-[#a3e635]/50 transition-all duration-300 hover:translate-x-1"
                >
                  <div className="p-1 rounded-lg bg-[#a3e635]/20 text-[#a3e635] border border-[#a3e635]/30">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">{item}</span>
                </div>
              ))}
            </div>

            {/* Read More Animated CTA */}
            <div className="pt-3">
              <Link
                to="/about"
                className="inline-flex items-center gap-3.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] hover:from-[#bef264] hover:to-[#a3e635] text-black font-extrabold text-xs sm:text-sm transition-all duration-300 shadow-[0_0_30px_rgba(163,230,53,0.4)] hover:shadow-[0_0_45px_rgba(163,230,53,0.7)] hover:-translate-y-1 group"
              >
                <span>Discover Complete Vision</span>
                <div className="p-1.5 rounded-xl bg-black/20 group-hover:translate-x-1.5 transition-transform duration-300">
                  <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
                </div>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default MainAbout;