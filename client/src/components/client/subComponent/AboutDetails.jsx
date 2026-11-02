import { useState } from 'react';
import {
  Sparkles,
  Users,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Award,
  Video,
  Compass,
  GraduationCap,
  BarChart3,
  Headphones,
  Lightbulb
} from 'lucide-react';
import { getContentIcon } from '../ContentIcons.jsx';
import { useAppContext } from '../../../context/AppContext.jsx';
import brandLogo from '../../../assets/logo2.png';



const About = () => {
  const { siteContent } = useAppContext();
  const data = siteContent.aboutPage;
  const logoSource = data.hero.logoUrl || brandLogo;
  const [logoErrorUrl, setLogoErrorUrl] = useState('');
  const statIcons = [
    { Icon: BarChart3, color: 'text-cyan-300', background: 'bg-cyan-400/10 border-cyan-300/20' },
    { Icon: Users, color: 'text-violet-300', background: 'bg-violet-400/10 border-violet-300/20' },
    { Icon: Award, color: 'text-amber-300', background: 'bg-amber-400/10 border-amber-300/20' },
    { Icon: Headphones, color: 'text-emerald-300', background: 'bg-emerald-400/10 border-emerald-300/20' }
  ];
  const storyIcons = [Compass, Video, Award];
  const storyAccents = [
    { icon: 'text-cyan-300 bg-cyan-400/10 border-cyan-300/20', glow: 'bg-cyan-400/10', check: 'text-cyan-300' },
    { icon: 'text-violet-300 bg-violet-400/10 border-violet-300/20', glow: 'bg-violet-400/10', check: 'text-violet-300' },
    { icon: 'text-amber-300 bg-amber-400/10 border-amber-300/20', glow: 'bg-amber-400/10', check: 'text-amber-300' }
  ];
  const valueAccents = {
    ShieldCheck: 'text-emerald-300 bg-emerald-400/10 border-emerald-300/20',
    Globe2: 'text-cyan-300 bg-cyan-400/10 border-cyan-300/20',
    Users: 'text-violet-300 bg-violet-400/10 border-violet-300/20',
    Target: 'text-amber-300 bg-amber-400/10 border-amber-300/20'
  };
  const timelineIcons = [Lightbulb, GraduationCap, TrendingUp];
  const timelineAccents = [
    { icon: 'text-amber-300 bg-amber-400/10 border-amber-300/20', year: 'text-amber-300' },
    { icon: 'text-cyan-300 bg-cyan-400/10 border-cyan-300/20', year: 'text-cyan-300' },
    { icon: 'text-violet-300 bg-violet-400/10 border-violet-300/20', year: 'text-violet-300' }
  ];

  if (!data) return null;

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">
      {/* Header */}

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-2/3 right-10 w-96 h-96 bg-[#a3e635]/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Cyber Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-28">
          
          {/* 1. HERO HEADER */}
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(163,230,53,0.25)] backdrop-blur-md hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.hero.badge}</span>
            </div>

            {/* Large Glowing Logo */}
            <div className="relative mb-8 group cursor-pointer flex justify-center items-center">
              <div className="absolute w-[280px] sm:w-[480px] h-24 bg-gradient-to-r from-[#a3e635]/30 via-[#bef264]/40 to-[#84cc16]/30 rounded-full blur-2xl opacity-85 group-hover:opacity-100 transition-opacity duration-700 animate-pulse pointer-events-none"></div>

              {logoErrorUrl !== logoSource ? (
                <img
                  src={logoSource}
                  alt="Investrade"
                  className="h-24 sm:h-36 w-auto object-contain relative z-10 filter drop-shadow-[0_0_35px_rgba(163,230,53,0.85)] group-hover:scale-105 transition-transform duration-500"
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

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
              {data.hero.title.split('Global')[0]} Global{' '}
              <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.5)]">
                {data.hero.title.split('Global')[1] || 'Financial Markets'}
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl font-normal">
              {data.hero.description}
            </p>
          </div>

          {/* 2. STATS BAR */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {data.stats.map((stat, idx) => {
              const { Icon, color, background } = statIcons[idx % statIcons.length];
              return (
                <div
                  key={stat.id}
                  className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.015] border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl group hover:-translate-y-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className={`inline-flex rounded-2xl border p-3 ${background} ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`mt-2 h-1.5 w-10 rounded-full ${background.split(' ')[0]}`} />
                  </div>
                  <div className={`text-3xl sm:text-4xl font-black ${color} group-hover:scale-[1.03] origin-left transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-extrabold text-gray-100 mt-2">{stat.label}</div>
                  <div className="text-xs text-gray-500 mt-1.5">{stat.sub}</div>
                </div>
              );
            })}
          </div>

          {/* 3. DETAILED STORY & MISSION CARDS */}
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Our Journey & <span className="text-[#a3e635]">Philosophy</span>
              </h2>
              <p className="text-gray-400 text-sm">
                Built on the foundation of education, transparency, and objective market commentary.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.detailedStory.map((item, idx) => {
                const StoryIcon = storyIcons[idx % storyIcons.length];
                const accent = storyAccents[idx % storyAccents.length];
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.055] to-white/[0.015] border border-white/10 hover:border-white/20 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between hover:-translate-y-1"
                  >
                    <div className={`absolute -right-6 -bottom-6 w-36 h-36 ${accent.glow} rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-all`}></div>

                    <div className="space-y-4">
                      <div className={`p-3 rounded-2xl border inline-flex shadow-lg ${accent.icon}`}>
                        <StoryIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-extrabold text-white group-hover:text-gray-200 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed text-justify">
                        {item.content}
                      </p>
                    </div>

                    <div className={`pt-6 border-t border-white/10 flex items-center gap-2 text-xs font-bold ${accent.check}`}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Investrade Verified Standard</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. VALUES GRID */}
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                What Sets <span className="text-[#a3e635]">Us Apart</span>
              </h2>
              <p className="text-gray-400 text-sm">
                Empowering investors with tailored tools and dedicated mentorship.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.values.map((val) => {
                const IconComp = getContentIcon(val.icon);

                return (
                  <div
                    key={val.id}
                    className="p-6 rounded-3xl bg-[#051105]/60 border border-[#a3e635]/15 hover:border-[#a3e635]/40 transition-all duration-300 hover:bg-[#a3e635]/10 group hover:-translate-y-1"
                  >
                    <div className={`p-3.5 rounded-2xl border inline-block mb-4 group-hover:scale-110 transition-transform ${valueAccents[val.icon] || 'text-emerald-300 bg-emerald-400/10 border-emerald-300/20'}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-extrabold text-gray-100 mb-2 group-hover:text-white transition-colors">
                      {val.title}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. ROADMAP TIMELINE */}
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Our Evolution <span className="text-[#a3e635]">Timeline</span>
              </h2>
              <p className="text-gray-400 text-sm">
                From a small financial learning group to a global multi-asset platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {data.timeline.map((item, idx) => {
                const TimelineIcon = timelineIcons[idx % timelineIcons.length];
                const accent = timelineAccents[idx % timelineAccents.length];
                return (
                  <div
                    key={idx}
                    className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.055] to-white/[0.015] border border-white/10 hover:border-white/20 transition-all duration-300 relative group hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-2xl border ${accent.icon}`}>
                        <TimelineIcon className="w-5 h-5" />
                      </div>
                      <div className={`text-xl font-black ${accent.year}`}>
                        {item.year}
                      </div>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-white/15 to-transparent mb-5"></div>
                    <h3 className="text-lg font-extrabold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. CALL TO ACTION BANNER */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#0a2208] via-[#10330d] to-[#0a2208] border border-[#a3e635]/40 p-8 sm:p-12 text-center overflow-hidden shadow-[0_0_60px_rgba(163,230,53,0.2)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.15)_0%,transparent_70%)] pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Start Your Financial Journey With <span className="text-[#a3e635]">Investrade</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Join our live trading sessions, webinars, and coaching to unlock your full investing potential.
              </p>
              <div className="pt-2 flex justify-center">
                <a
                  href="#"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] hover:from-[#bef264] hover:to-[#a3e635] text-black font-extrabold text-sm sm:text-base flex items-center gap-2 transition-all duration-300 shadow-[0_0_30px_rgba(163,230,53,0.5)] hover:scale-105"
                >
                  <span>Join Our Sessions</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default About;