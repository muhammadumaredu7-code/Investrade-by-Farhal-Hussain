import { useState, useEffect } from 'react';
import {
  Sparkles,
  Mail,
  CheckCircle2,
  ArrowRight,
  Users,
  ShieldCheck,
  Globe2
} from 'lucide-react';
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa';
import dummyData from '../../assets/dummyData.json';

const Team = () => {
  const data = dummyData.teamPage;
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  const categories = ['All', 'Executive', 'Risk Management', 'Technology', 'Analysis', 'Education'];

  const filteredMembers = activeCategory === 'All'
    ? data.members
    : data.members.filter((member) => member.category === activeCategory);
  const statIcons = [Users, ShieldCheck, Globe2];

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          
          {/* ---------------- 1. PAGE HEADER ---------------- */}
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(163,230,53,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              {data.heading.split('Investrade')[0]}{' '}
              <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.5)]">
                Investrade
              </span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
              {data.subheading}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
              {data.stats.map((stat, idx) => {
                const StatIcon = statIcons[idx % statIcons.length];
                const colors = [
                  'text-cyan-300 bg-cyan-400/10 border-cyan-300/20',
                  'text-violet-300 bg-violet-400/10 border-violet-300/20',
                  'text-amber-300 bg-amber-400/10 border-amber-300/20'
                ];
                return (
                <div key={stat.id} className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.015] border border-white/10 backdrop-blur-xl text-left transition-all hover:-translate-y-1 hover:border-white/20">
                  <div className={`w-10 h-10 rounded-xl border inline-flex items-center justify-center mb-4 ${colors[idx % colors.length]}`}>
                    <StatIcon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400 font-semibold mt-1">{stat.label}</div>
                </div>
                );
              })}
            </div>
          </div>

          {/* ---------------- 2. CATEGORY FILTERS ---------------- */}
          <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.35)]'
                    : 'bg-white/[0.035] text-gray-400 hover:text-white border border-white/10 hover:border-[#a3e635]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500">
            Showing <span className="text-gray-300 font-semibold">{filteredMembers.length}</span> team {filteredMembers.length === 1 ? 'member' : 'members'}
          </p>
          </div>

          {/* ---------------- 3. TEAM MEMBERS GRID ---------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-3xl bg-gradient-to-b from-white/[0.06] to-[#040e04]/95 border border-white/10 overflow-hidden hover:border-[#a3e635]/40 transition-all duration-500 group hover:-translate-y-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Role Badge */}
                  <div className="h-72 w-full overflow-hidden relative bg-[#08120a]">
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040e04] via-black/5 to-transparent"></div>

                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white/90 text-[10px] font-bold border border-white/15">
                      {member.experience}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-3 relative z-10 -mt-7">
                    <div className="inline-block px-3 py-1.5 rounded-full bg-[#a3e635]/10 text-[#c8f56b] text-[10px] font-extrabold uppercase tracking-wide border border-[#a3e635]/25">
                      {member.role}
                    </div>

                    <h3 className="text-xl font-extrabold text-white group-hover:text-[#c8f56b] transition-colors flex items-center gap-2">
                      {member.name}
                      <CheckCircle2 className="w-4 h-4 text-[#a3e635] fill-black" />
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed min-h-[4.5rem]">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Social Bar */}
                <div className="px-6 py-4 border-t border-white/[0.08] bg-black/20 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-500">Connect</span>
                  <div className="flex items-center gap-2">
                    {[ 
                      { key: 'whatsapp', label: 'WhatsApp', Icon: FaWhatsapp, color: 'text-[#25D366]', hover: 'hover:bg-[#25D366]/15 hover:border-[#25D366]/50 hover:shadow-[0_0_18px_rgba(37,211,102,0.25)]', href: member.socials?.whatsapp },
                      { key: 'email', label: 'Gmail', Icon: Mail, color: 'text-[#EA4335]', hover: 'hover:bg-[#EA4335]/15 hover:border-[#EA4335]/50 hover:shadow-[0_0_18px_rgba(234,67,53,0.25)]', href: member.socials?.email ? `mailto:${member.socials.email}` : undefined },
                      { key: 'facebook', label: 'Facebook', Icon: FaFacebookF, color: 'text-[#1877F2]', hover: 'hover:bg-[#1877F2]/15 hover:border-[#1877F2]/50 hover:shadow-[0_0_18px_rgba(24,119,242,0.25)]', href: member.socials?.facebook },
                      { key: 'instagram', label: 'Instagram', Icon: FaInstagram, color: 'text-[#E4405F]', hover: 'hover:bg-[#E4405F]/15 hover:border-[#E4405F]/50 hover:shadow-[0_0_18px_rgba(228,64,95,0.25)]', href: member.socials?.instagram }
                    ].map(({ key, label, Icon, color, hover, href }) => {
                      const className = `w-9 h-9 rounded-xl border border-white/10 bg-white/[0.035] inline-flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110 ${color} ${href && href !== '#' ? hover : 'opacity-80 cursor-not-allowed'}`;
                      return href && href !== '#' ? (
                        <a
                          key={key}
                          href={href}
                          aria-label={`${label} - ${member.name}`}
                          title={label}
                          target={key === 'email' ? undefined : '_blank'}
                          rel={key === 'email' ? undefined : 'noreferrer'}
                          className={className}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      ) : (
                        <span key={key} aria-label={`${label} profile not available`} title={`${label} profile not available`} className={className}>
                          <Icon className="w-4 h-4" />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ---------------- 4. JOIN TEAM CTA BANNER ---------------- */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#0a2208] via-[#10330d] to-[#0a2208] border border-[#a3e635]/40 p-8 sm:p-12 text-center overflow-hidden shadow-[0_0_60px_rgba(163,230,53,0.2)]">
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Want To Build The Future Of Trading With <span className="text-[#a3e635]">Investrade</span>?
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm">
                We are always seeking quantitative developers, risk managers, and financial market analysts.
              </p>
              <div className="pt-2 flex justify-center">
                <a
                  href="#"
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 shadow-[0_0_30px_rgba(163,230,53,0.5)] hover:scale-105"
                >
                  <span>Explore Careers</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default Team;