import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import logo from '../../assets/logo2.png';
import {
  LayoutDashboard,
  Users,
  Crown,
  Zap,
  GraduationCap,
  Bot,
  BarChart3,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Package,
  ClipboardList
} from 'lucide-react';

import dummyData from '../../assets/dummyData.json';

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useClerk();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { adminUser, navigation, logoutLabel } = dummyData.adminSidebar;

  const handleLogout = async () => {
    await signOut({ redirectUrl: '/home' });
  };

  // Comprehensive Icon Mapping Helper
  const getAdminNavIcon = (iconName) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return LayoutDashboard;
      case 'Users':
        return Users;
      case 'Crown':
        return Crown;
      case 'Zap':
        return Zap;
      case 'GraduationCap':
        return GraduationCap;
      case 'Bot':
        return Bot;
      case 'Package':
        return Package;
      case 'ClipboardList':
        return ClipboardList;
      case 'BarChart3':
        return BarChart3;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Settings':
        return Settings;
      default:
        return LayoutDashboard;
    }
  };

  const getAdminNavIconStyle = (iconName) => {
    switch (iconName) {
      case 'Users':
        return 'border-sky-300/20 bg-sky-400/10 text-sky-300';
      case 'Crown':
        return 'border-amber-300/20 bg-amber-400/10 text-amber-300';
      case 'Zap':
        return 'border-orange-300/20 bg-orange-400/10 text-orange-300';
      case 'GraduationCap':
        return 'border-blue-300/20 bg-blue-400/10 text-blue-300';
      case 'Bot':
        return 'border-teal-300/20 bg-teal-400/10 text-teal-300';
      case 'Package':
        return 'border-violet-300/20 bg-violet-400/10 text-violet-300';
      case 'ClipboardList':
        return 'border-cyan-300/20 bg-cyan-400/10 text-cyan-300';
      case 'BarChart3':
        return 'border-emerald-300/20 bg-emerald-400/10 text-emerald-300';
      case 'ShieldAlert':
        return 'border-rose-300/20 bg-rose-400/10 text-rose-300';
      case 'Settings':
        return 'border-slate-300/20 bg-slate-400/10 text-slate-300';
      default:
        return 'border-cyan-300/20 bg-cyan-400/10 text-cyan-300';
    }
  };

  return (
    <>
      {/* ---------------- MOBILE TOGGLE BUTTON ---------------- */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="admin-dashboard-sidebar"
          aria-label={mobileOpen ? 'Close admin menu' : 'Open admin menu'}
          className="p-3 rounded-2xl bg-[#040e04] border border-amber-400/40 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] backdrop-blur-xl cursor-pointer"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ---------------- MOBILE BACKDROP OVERLAY ---------------- */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        />
      )}

      {/* ---------------- SIDEBAR MAIN CONTAINER ---------------- */}
      <aside
        id="admin-dashboard-sidebar"
        className={`fixed top-0 left-0 h-screen w-72 overflow-hidden bg-[#070b08]/98 border-r border-amber-300/15 z-40 flex flex-col justify-between p-5 backdrop-blur-2xl transition-transform duration-500 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } selection:bg-amber-400 selection:text-black`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-300/[0.06] to-transparent"></div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col space-y-5">
          
          {/* ---------------- 1. BRAND LOGO ---------------- */}
          <Link
            to="/home"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center py-2 px-3 rounded-2xl group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/15 via-transparent to-yellow-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

            {!logoError ? (
              <img
                src={logo}
                alt="Investrade Admin Logo"
                className="h-12 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] group-hover:scale-105 transition-transform duration-300"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight">
                <div className="bg-gradient-to-br from-amber-400 to-yellow-600 p-2 rounded-xl text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span>In<span className="text-amber-400">Vest</span>rade</span>
              </div>
            )}
          </Link>

          {/* ---------------- 2. ADMIN PROFILE CARD ---------------- */}
          <div className="p-3.5 rounded-2xl bg-[#040e04] border border-amber-400/30 shadow-lg backdrop-blur-xl flex items-center gap-3 relative group">
            <div className="relative">
              <img
                src={adminUser.avatar}
                alt={adminUser.name}
                className="w-11 h-11 rounded-xl object-cover border-2 border-amber-400/50 group-hover:border-amber-400 transition-colors"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-black shadow-[0_0_8px_#fbbf24]"></span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-black text-white truncate">{adminUser.name}</h4>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </div>
              <p className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider truncate">
                {adminUser.badge}
              </p>
            </div>
          </div>

          {/* ---------------- 3. NAVIGATION LINKS ---------------- */}
          <nav aria-label="Admin navigation" className="admin-nav-scrollbar min-h-0 flex-1 space-y-1.5 overflow-y-auto pt-1">
            {navigation.map((item) => {
              const IconComp = getAdminNavIcon(item.icon);
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path === '/admin/settings' ? '/edit-profile' : item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300/50 ${
                    isActive
                      ? 'border-amber-300/40 bg-amber-300/[0.12] text-white shadow-[inset_3px_0_0_#fbbf24,0_8px_20px_rgba(0,0,0,0.18)]'
                      : 'border-transparent text-gray-300 hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105 ${getAdminNavIconStyle(item.icon)} ${isActive ? 'ring-1 ring-white/20 shadow-[0_0_16px_rgba(251,191,36,0.12)]' : ''}`}>
                      <IconComp className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>{item.label}</span>
                  </div>

                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isActive ? 'text-amber-200 translate-x-0.5' : 'text-gray-600 group-hover:text-amber-300 group-hover:translate-x-0.5'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

        </div>

        {/* ---------------- 4. LOGOUT BUTTON ---------------- */}
        <div className="pt-4 border-t border-amber-400/20 relative z-10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-2xl bg-[#081806] hover:bg-red-500/15 border border-amber-400/30 hover:border-red-500/50 text-gray-300 hover:text-red-400 font-extrabold text-xs flex items-center justify-between transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
              <span>{logoutLabel}</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;