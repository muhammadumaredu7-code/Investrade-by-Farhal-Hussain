import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import logo from '../../../assets/logo2.png';
import {
  LayoutDashboard,
  Crown,
  GraduationCap,
  Zap,
  PenTool,
  UserRound,
  LogOut,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Package
} from 'lucide-react';

import dummyData from '../../../assets/dummyData.json';

const ClientSidebar = () => {
  const location = useLocation();
  const { signOut } = useClerk();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const sidebarData = dummyData.dashboardSidebar;

  if (!sidebarData) return null;

  const { user, navigation, logoutLabel } = sidebarData;

  const handleLogout = async () => {
    await signOut({ redirectUrl: '/home' });
  };

  // Icon Mapping Helper
  const getNavIcon = (iconName) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return LayoutDashboard;
      case 'Crown':
        return Crown;
      case 'GraduationCap':
        return GraduationCap;
      case 'Zap':
        return Zap;
      case 'Package':
        return Package;
      case 'PenTool':
        return PenTool;
      case 'UserEdit':
        return UserRound;
      default:
        return LayoutDashboard;
    }
  };

  const getNavIconStyle = (iconName) => {
    switch (iconName) {
      case 'Crown':
        return 'bg-amber-400/10 text-amber-300 group-hover:bg-amber-400/20';
      case 'GraduationCap':
        return 'bg-sky-400/10 text-sky-300 group-hover:bg-sky-400/20';
      case 'Zap':
        return 'bg-violet-400/10 text-violet-300 group-hover:bg-violet-400/20';
      case 'Package':
        return 'bg-cyan-400/10 text-cyan-300 group-hover:bg-cyan-400/20';
      case 'PenTool':
        return 'bg-pink-400/10 text-pink-300 group-hover:bg-pink-400/20';
      case 'UserEdit':
        return 'bg-cyan-400/10 text-cyan-300 group-hover:bg-cyan-400/20';
      default:
        return 'bg-emerald-400/10 text-emerald-300 group-hover:bg-emerald-400/20';
    }
  };

  return (
    <>
      {/* ---------------- MOBILE TOGGLE BUTTON ---------------- */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="client-dashboard-sidebar"
          aria-label={mobileOpen ? 'Close dashboard menu' : 'Open dashboard menu'}
          className="rounded-2xl border border-white/15 bg-black/55 p-3 text-[#a3e635] shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 hover:border-[#a3e635]/50 hover:bg-[#a3e635]/10 hover:shadow-[0_0_24px_rgba(163,230,53,0.2)] focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ---------------- MOBILE BACKDROP OVERLAY ---------------- */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-md z-40 animate-in fade-in duration-300"
        />
      )}

      {/* ---------------- SIDEBAR MAIN CONTAINER ---------------- */}
      <aside
        id="client-dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex h-screen h-dvh w-[min(18rem,88vw)] flex-col justify-between overflow-y-auto border-r border-white/[0.08] bg-black p-4 shadow-[12px_0_48px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-in-out sm:p-5 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } selection:bg-[#a3e635] selection:text-black`}
      >
        <div className="relative z-10 space-y-5 sm:space-y-6">
          
          {/* ---------------- 1. BRAND LOGO ---------------- */}
          <Link
            to="/home"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center py-2 px-3 rounded-2xl group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#a3e635]/15 via-transparent to-[#84cc16]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

            {!logoError ? (
              <img
                src={logo}
                alt="Investrade Logo"
                className="h-12 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(163,230,53,0.6)] group-hover:scale-105 transition-transform duration-300"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight">
                <div className="bg-gradient-to-br from-[#a3e635] to-[#65a30d] p-2 rounded-xl text-black shadow-[0_0_15px_rgba(163,230,53,0.5)]">
                  <TrendingUp className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span>In<span className="text-[#a3e635]">Vest</span>rade</span>
              </div>
            )}
          </Link>

          {/* ---------------- 2. USER PROFILE ICON & CARD (FROM JSON) ---------------- */}
          <div className="group relative flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/45 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_8px_28px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-[#a3e635]/30 hover:bg-black/60 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-11 w-11 rounded-xl border-2 border-white/20 object-cover transition-all duration-300 group-hover:border-[#a3e635]/70 group-hover:shadow-[0_0_16px_rgba(163,230,53,0.2)]"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#a3e635] rounded-full border-2 border-black shadow-[0_0_8px_#a3e635]"></span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-black text-white truncate">{user.name}</h4>
                <ShieldCheck className="w-3.5 h-3.5 text-[#a3e635] shrink-0" />
              </div>
              <p className="truncate text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                {user.badge}
              </p>
            </div>
          </div>

          {/* ---------------- 3. NAVIGATION LINKS (FROM JSON) ---------------- */}
          <nav aria-label="Dashboard navigation" className="space-y-1.5 pt-1">
            {navigation.map((item) => {
              const IconComp = getNavIcon(item.icon);
              const isActive = location.pathname === item.path
                || (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`));

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center justify-between rounded-2xl border px-3 py-2.5 text-xs font-extrabold backdrop-blur-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a3e635]/40 sm:px-4 sm:py-3 ${
                    isActive
                      ? 'border-[#a3e635]/35 bg-gradient-to-r from-[#a3e635]/20 via-emerald-400/10 to-transparent text-white shadow-[0_8px_26px_rgba(163,230,53,0.12)]'
                      : 'border-white/[0.06] bg-black/25 text-gray-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-black/55 hover:text-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] transition-all duration-300 group-hover:scale-105 ${getNavIconStyle(item.icon)} ${
                      isActive ? 'ring-1 ring-white/20 shadow-[0_0_18px_rgba(163,230,53,0.12)]' : ''
                    }`}>
                      <IconComp className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-4deg]" />
                    </span>
                    <span>{item.label}</span>
                  </div>

                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isActive ? 'text-[#bef264] translate-x-0.5' : 'text-gray-600 group-hover:text-white group-hover:translate-x-0.5'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

        </div>

        {/* ---------------- 4. LOGOUT BUTTON ---------------- */}
        <div className="relative z-10 mt-5 border-t border-white/10 pt-4">
          <button
            onClick={handleLogout}
            className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-white/[0.08] bg-black/35 px-3 py-3 text-xs font-extrabold text-gray-300 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-400/30 hover:bg-rose-950/35 hover:text-rose-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] focus:outline-none focus:ring-2 focus:ring-rose-400/40 sm:px-4"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
              <span>{logoutLabel}</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#a3e635] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

      </aside>
    </>
  );
};

export default ClientSidebar;