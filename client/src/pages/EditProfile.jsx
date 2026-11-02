import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/react';
import toast from 'react-hot-toast';
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  Save,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

import dummyData from '../assets/dummyData.json';

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const activeRole = user?.publicMetadata?.role === 'admin' ? 'admin' : 'client';
  const fallbackPath = activeRole === 'admin' ? '/admin/dashboard' : '/dashboard';

  const [profile, setProfile] = useState(() => (
    dummyData.unifiedProfilePage?.roles?.[activeRole] || {}
  ));

  // Admin Specific Security Options
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [ipWhitelisting, setIpWhitelisting] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [isPasswordVerified, setIsPasswordVerified] = useState(() => Boolean(location.state?.passwordVerified));
  const inputClassName = 'w-full rounded-xl border border-white/10 bg-[#080d13] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-white/20 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10';
  const iconInputClassName = `${inputClassName} pl-11`;

  const triggerToast = (msg) => {
    toast.success(msg, {
      duration: 3000,
      style: {
        background: '#0b1220',
        color: '#f8fafc',
        border: '1px solid rgba(52,211,153,0.35)',
        boxShadow: '0 18px 45px rgba(15,23,42,0.65)',
        borderRadius: '16px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: 700,
      },
      iconTheme: {
        primary: '#34d399',
        secondary: '#0b1220',
      },
    });
  };

  const triggerErrorToast = (msg) => {
    toast.error(msg, {
      duration: 3000,
      style: {
        background: '#1f0d10',
        color: '#fff1f2',
        border: '1px solid rgba(251,113,133,0.4)',
        boxShadow: '0 18px 45px rgba(15,23,42,0.65)',
        borderRadius: '16px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: 700,
      },
      iconTheme: {
        primary: '#fb7185',
        secondary: '#1f0d10',
      },
    });
  };

  useEffect(() => {
    if (location.state?.toast) {
      triggerToast(location.state.toast);
    }
  }, [location.state?.toast]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Avatar Image Upload Preview Handler
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, avatar: previewUrl }));
      triggerToast('🎉 Profile image preview updated!');
    }
  };

  // Form Submit Handler
  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (isPasswordVerified && passwordForm.newPassword) {
      if (passwordForm.newPassword.length < 8) {
        triggerErrorToast('Password must be at least 8 characters long.');
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        triggerErrorToast('New password and confirm password do not match.');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (isPasswordVerified) {
        setPasswordForm({ newPassword: '', confirmPassword: '' });
        setIsPasswordVerified(false);
        triggerToast('✅ Password updated successfully.');
        return;
      }

      triggerToast('✅ Profile & security settings saved!');
    }, 1800);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020602] text-white selection:bg-[#a3e635] selection:text-black">
      {/* ---------------- 1. CLIENT DASHBOARD SIDEBAR ---------------- */}

      {/* ---------------- TOASTER NOTIFICATION ---------------- */}
      {/* ---------------- 2. MAIN CONTENT AREA ---------------- */}
      <main className="relative z-10 w-full min-w-0 space-y-6 px-4 pb-10 pt-20 sm:space-y-8 sm:px-6 lg:px-8 lg:pt-8 2xl:px-12">
        
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute left-1/3 top-1/4 h-[400px] w-[min(800px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-500/10 via-violet-500/10 to-emerald-500/10 blur-[150px]"></div>

        {/* Cyber Mesh Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-25 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)]"></div>

        <button
          type="button"
          onClick={() => navigate(location.key === 'default' ? fallbackPath : -1)}
          className="relative inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back</span>
        </button>

        {/* ---------------- 3. PAGE HEADER ---------------- */}
        <div className="relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-[#071713] via-[#08101a] to-[#100b1a] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-200 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>{dummyData.unifiedProfilePage?.badge || 'Control Center'}</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              {dummyData.unifiedProfilePage?.heading || 'Profile & Security'}
            </h1>

            <p className="max-w-xl text-xs leading-relaxed text-gray-300 sm:text-sm">
              {dummyData.unifiedProfilePage?.subheading}
            </p>
          </div>
        </div>

        {/* ---------------- 4. UNIFIED PROFILE FORM ---------------- */}
        <form onSubmit={handleProfileSubmit} className="relative space-y-5 sm:space-y-7">
          
          {/* SECTION A: PROFILE AVATAR & CREDENTIALS */}
          <div className="space-y-5 rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#08131a]/95 via-[#080b12]/95 to-[#0d0a16]/95 p-5 shadow-2xl backdrop-blur-xl sm:space-y-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <h3 className="flex items-center gap-2 text-base font-black text-white">
                <span className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-2"><User className="h-4 w-4 text-cyan-300" /></span>
                {activeRole === 'admin' ? 'Administrator Credentials' : 'Client Credentials'}
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                  activeRole === 'admin'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-[#a3e635]/20 text-[#a3e635] border-[#a3e635]/40'
                }`}
              >
                {profile.badge || activeRole}
              </span>
            </div>

            {/* Avatar Upload Container */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                  alt={profile.fullName}
                  className={`h-24 w-24 rounded-3xl border-2 object-cover shadow-lg transition-transform group-hover:scale-105 sm:h-28 sm:w-28 ${
                    activeRole === 'admin' ? 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)]' : 'border-[#a3e635] shadow-[0_0_25px_rgba(163,230,53,0.3)]'
                  }`}
                />

                <label
                  htmlFor="profile-avatar"
                  aria-label="Change profile image"
                  className={`absolute -bottom-2 -right-2 p-3 rounded-2xl text-black cursor-pointer shadow-lg transition-transform hover:scale-110 ${
                    activeRole === 'admin' ? 'bg-amber-400 hover:bg-amber-300' : 'bg-[#a3e635] hover:bg-[#84cc16]'
                  }`}
                >
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    id="profile-avatar"
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="min-w-0 space-y-1 text-center sm:text-left">
                <h4 className="text-lg font-black text-white">{profile.fullName || 'User Name'}</h4>
                <p className={`text-xs font-bold ${activeRole === 'admin' ? 'text-amber-300' : 'text-[#a3e635]'}`}>
                  {profile.occupation}
                </p>
                <p className="text-[11px] text-gray-400">Click camera icon to change profile image.</p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="profile-name" className="text-xs font-bold text-gray-300">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
                  <input
                    type="text"
                    id="profile-name"
                    required
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className={iconInputClassName}
                  />
                </div>
              </div>

              {/* Date of Birth (D.O.B) */}
              <div className="space-y-1">
                <label htmlFor="profile-dob" className="text-xs font-bold text-gray-300">Date of Birth (D.O.B) *</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-300" />
                  <input
                    type="date"
                    id="profile-dob"
                    required
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    className={iconInputClassName}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label htmlFor="profile-email" className="text-xs font-bold text-gray-300">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-300" />
                  <input
                    type="email"
                    id="profile-email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className={iconInputClassName}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label htmlFor="profile-phone" className="text-xs font-bold text-gray-300">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300" />
                  <input
                    type="tel"
                    id="profile-phone"
                    required
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className={iconInputClassName}
                  />
                </div>
              </div>

              {/* Telegram Handle */}
              <div className="space-y-1">
                <label htmlFor="profile-telegram" className="text-xs font-bold text-gray-300">Telegram Username</label>
                <input
                  type="text"
                  id="profile-telegram"
                  placeholder="@username"
                  value={profile.telegramHandle}
                  onChange={(e) => setProfile({ ...profile, telegramHandle: e.target.value })}
                  className={inputClassName}
                />
              </div>

              {/* TradingView Username */}
              <div className="space-y-1">
                <label htmlFor="profile-tradingview" className="text-xs font-bold text-gray-300">TradingView Username</label>
                <input
                  type="text"
                  id="profile-tradingview"
                  placeholder="TradingView_Handle"
                  value={profile.tradingViewHandle}
                  onChange={(e) => setProfile({ ...profile, tradingViewHandle: e.target.value })}
                  className={inputClassName}
                />
              </div>

            </div>
          </div>

          {/* SECTION B: PASSWORD CHANGE VERIFICATION */}
          {!isPasswordVerified ? (
            <section className="flex flex-col gap-5 rounded-3xl border border-violet-300/15 bg-gradient-to-br from-[#0d0b18]/95 via-[#090b12]/95 to-[#08131a]/95 p-5 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex min-w-0 items-start gap-4">
                <span className="shrink-0 rounded-2xl border border-violet-300/20 bg-violet-400/10 p-3">
                  <KeyRound className="h-5 w-5 text-violet-300" />
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">Change your password</h3>
                  <p className="text-xs leading-relaxed text-gray-400">
                    Verify your email or phone first, then choose a new password.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard/verify-code', { state: { type: 'email', flow: 'change-password', email: profile.email || 'your registered email' } })}
                className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-300 to-cyan-300 px-5 py-3 text-xs font-extrabold text-[#0b0b14] shadow-[0_0_24px_rgba(139,92,246,0.18)] transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-violet-200/50 sm:w-auto sm:text-sm"
              >
                <KeyRound className="h-4 w-4" />
                <span>Change Password</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          ) : (
            <section className="flex flex-col gap-5 rounded-3xl border border-violet-300/15 bg-gradient-to-br from-[#0d0b18]/95 via-[#090b12]/95 to-[#08131a]/95 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex min-w-0 items-start gap-4 border-b border-white/10 pb-4">
                <span className="shrink-0 rounded-2xl border border-violet-300/20 bg-violet-400/10 p-3">
                  <KeyRound className="h-5 w-5 text-violet-300" />
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">Set your new password</h3>
                  <p className="text-xs leading-relaxed text-gray-400">
                    Verified for {profile.email || 'your email'}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="new-password" className="text-xs font-bold text-gray-300">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirm-password" className="text-xs font-bold text-gray-300">Confirm Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className={inputClassName}
                  />
                </div>
              </div>
            </section>
          )}

          {/* SECTION C: ADMIN SECURITY OVERRIDES */}
          {activeRole === 'admin' && (
            <div className="space-y-4 rounded-3xl border border-amber-300/20 bg-gradient-to-br from-[#171108]/70 to-[#0c0b12]/95 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in duration-300 sm:p-8">
              <h3 className="flex items-center gap-2 border-b border-amber-300/15 pb-4 text-base font-black text-amber-200">
                <span className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-2"><ShieldCheck className="h-4 w-4 text-amber-300" /></span>
                System Admin Security Controls
              </h3>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <button
                  type="button"
                  aria-pressed={twoFactorEnabled}
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-amber-300/15 bg-black/20 p-4 text-left transition hover:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                >
                  <div>
                    <div className="text-xs font-bold text-white">Require 2FA For Admin Access</div>
                    <div className="text-[10px] text-gray-400">Enforce Google Authenticator OTP</div>
                  </div>
                  {twoFactorEnabled ? (
                    <ToggleRight className="w-7 h-7 text-amber-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-gray-600" />
                  )}
                </button>

                <button
                  type="button"
                  aria-pressed={ipWhitelisting}
                  onClick={() => setIpWhitelisting(!ipWhitelisting)}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-amber-300/15 bg-black/20 p-4 text-left transition hover:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                >
                  <div>
                    <div className="text-xs font-bold text-white">Restrict Admin Login by IP</div>
                    <div className="text-[10px] text-gray-400">Limit login to authorized office IPs</div>
                  </div>
                  {ipWhitelisting ? (
                    <ToggleRight className="w-7 h-7 text-amber-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-extrabold shadow-xl transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-wait disabled:opacity-50 sm:text-sm ${
                activeRole === 'admin'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-black shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                  : 'bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] text-black shadow-[0_0_30px_rgba(163,230,53,0.4)]'
              }`}
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>
                {isSubmitting
                  ? "Encrypting & Saving Profile..."
                  : `Save ${activeRole === 'admin' ? 'Administrator' : 'Client'} Settings`}
              </span>
            </button>
          </div>

        </form>

      </main>
    </div>
  );
};

export default EditProfile;