import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  Globe2,
  Coins,
  Crown,
  Clock,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';

import ClientSidebar from './Sidebar.jsx';
import dummyData from '../../../assets/dummyData.json';
import { useAppContext } from '../../../context/AppContext.jsx';

const ClientVipGroups = () => {
  const navigate = useNavigate();
  const data = dummyData.clientDashboardVipPage;
  const { vipSubscriptions: subscriptions } = useAppContext();
  const [selectedMarketId, setSelectedMarketId] = useState('forex'); // 'forex', 'psx', 'pmex'
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Find Active Subscription for Selected Market
  const currentSub = subscriptions.find(
    (sub) => sub.marketId === selectedMarketId
  );

  useEffect(() => {
    if (!currentSub || !currentSub.expiryDate || currentSub.status !== 'Active') {
      return;
    }

    const interval = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(interval);
  }, [currentSub]);

  const expiryTimestamp = currentSub?.expiryDate ? new Date(currentSub.expiryDate).getTime() : 0;
  const remainingMilliseconds = Number.isFinite(expiryTimestamp)
    ? Math.max(0, expiryTimestamp - now)
    : 0;
  const timeLeft = {
    days: Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remainingMilliseconds / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remainingMilliseconds / (1000 * 60)) % 60),
    seconds: Math.floor((remainingMilliseconds / 1000) % 60)
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020602] text-white selection:bg-[#a3e635] selection:text-black">
      {/* ---------------- 1. CLIENT DASHBOARD SIDEBAR ---------------- */}
      <ClientSidebar />

      {/* ---------------- 2. MAIN CONTENT AREA ---------------- */}
      <main className="relative z-10 w-full min-w-0 space-y-6 px-4 pb-10 pt-20 sm:space-y-8 sm:px-6 lg:ml-72 lg:w-[calc(100%-18rem)] lg:px-8 lg:pt-8 2xl:px-12">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Mesh Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        {/* ---------------- 3. PAGE HEADER ---------------- */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#041204] via-[#092207] to-[#041204] border border-[#a3e635]/35 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {data.heading}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
              {data.subheading}
            </p>
          </div>

          <Link
            to="/vip-groups"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(163,230,53,0.4)] hover:scale-105 transition-all cursor-pointer shrink-0"
          >
            <Crown className="w-4 h-4 stroke-[2.5]" />
            <span>Browse All VIP Packages</span>
          </Link>
        </div>

        {/* ---------------- 4. MARKET TABS (FOREX, PSX, PMEX) ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'forex',
              name: 'FOREX & GOLD VIP',
              badge: 'Global FX',
              icon: Globe2,
              selectedStyle: 'bg-gradient-to-r from-cyan-400/20 via-[#0a2008] to-[#040e04] border-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.2)]',
              iconStyle: 'bg-cyan-300 text-[#041014] border-cyan-200',
              idleIconStyle: 'bg-cyan-300/10 text-cyan-300 border-cyan-300/20'
            },
            {
              id: 'psx',
              name: 'PSX EQUITY VIP',
              badge: 'KSE-100 Stocks',
              icon: Building2,
              selectedStyle: 'bg-gradient-to-r from-emerald-400/20 via-[#0a2008] to-[#040e04] border-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.2)]',
              iconStyle: 'bg-emerald-300 text-[#04120d] border-emerald-200',
              idleIconStyle: 'bg-emerald-300/10 text-emerald-300 border-emerald-300/20'
            },
            {
              id: 'pmex',
              name: 'PMEX COMMODITIES VIP',
              badge: 'Futures',
              icon: Coins,
              selectedStyle: 'bg-gradient-to-r from-violet-400/20 via-[#0a2008] to-[#040e04] border-violet-300 shadow-[0_0_30px_rgba(167,139,250,0.2)]',
              iconStyle: 'bg-violet-300 text-[#100a1c] border-violet-200',
              idleIconStyle: 'bg-violet-300/10 text-violet-300 border-violet-300/20'
            }
          ].map((market) => {
            const isSelected = selectedMarketId === market.id;
            const MarketIcon = market.icon;
            const sub = subscriptions.find((s) => s.marketId === market.id);
            const isActive = sub && sub.status === 'Active';

            return (
              <button
                key={market.id}
                onClick={() => setSelectedMarketId(market.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                  isSelected
                    ? `${market.selectedStyle} scale-[1.02]`
                    : 'bg-[#040e04]/80 border-[#a3e635]/20 hover:border-[#a3e635]/50 hover:bg-[#081806]'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div
                    className={`p-3 rounded-xl border ${
                      isSelected ? market.iconStyle : market.idleIconStyle
                    }`}
                  >
                    <MarketIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                      {market.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold">{market.badge}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                    isActive
                      ? 'bg-[#a3e635]/15 text-[#a3e635] border-[#a3e635]/40'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  {isActive ? 'Active' : 'Not Subscribed'}
                </span>
              </button>
            );
          })}
        </div>

        {/* ---------------- 5. SUBSCRIPTION STATUS CONTENT ---------------- */}
        {currentSub && currentSub.status === 'Active' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Countdown Clock Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/35 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#a3e635]/20 pb-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 text-[#a3e635] text-[10px] font-black uppercase border border-[#a3e635]/30">
                    {currentSub.badge}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-white mt-2">
                    {currentSub.marketName}
                  </h2>
                </div>

                <a
                  href={currentSub.accessLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#a3e635] text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#84cc16] transition-all shadow-[0_0_20px_rgba(163,230,53,0.4)] cursor-pointer shrink-0"
                >
                  <span>Open Telegram VIP Channel</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Countdown Grid */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-gray-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#a3e635] animate-pulse" />
                  <span>Subscription Validity Remaining Time:</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {[
                    { label: 'Days', val: timeLeft.days },
                    { label: 'Hours', val: timeLeft.hours },
                    { label: 'Minutes', val: timeLeft.minutes },
                    { label: 'Seconds', val: timeLeft.seconds }
                  ].map((unit, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-[#081806] border border-[#a3e635]/25 text-center"
                    >
                      <div className="text-2xl sm:text-4xl font-black text-[#a3e635] font-mono">
                        {String(unit.val).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Details */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-[#a3e635]/20 pb-4">
                <ShieldCheck className="w-5 h-5 text-[#a3e635]" />
                Subscription Plan Breakdown Table
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#a3e635]/20 text-[11px] font-black uppercase text-gray-400">
                      <th className="py-3 px-4">Market Group</th>
                      <th className="py-3 px-4">Plan Duration</th>
                      <th className="py-3 px-4">Price Paid</th>
                      <th className="py-3 px-4">Subscribed Date</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#a3e635]/10 text-xs">
                    <tr className="hover:bg-[#081806] transition-colors">
                      <td className="py-4 px-4 font-extrabold text-white">{currentSub.marketName}</td>
                      <td className="py-4 px-4 font-bold text-[#a3e635]">{currentSub.plan}</td>
                      <td className="py-4 px-4 font-mono font-bold text-gray-200">{currentSub.price}</td>
                      <td className="py-4 px-4 font-mono text-gray-400">{currentSub.startDate}</td>
                      <td className="py-4 px-4 font-mono text-gray-400">
                        {new Date(currentSub.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="px-3 py-1 rounded-full bg-[#a3e635]/20 text-[#a3e635] border border-[#a3e635]/40 text-[10px] font-black uppercase">
                          {currentSub.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Subscribed Features */}
              <div className="pt-4 border-t border-[#a3e635]/15 space-y-3">
                <h4 className="text-xs font-black text-gray-300 uppercase tracking-wider">
                  Included Group Privileges:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentSub.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#081806] border border-[#a3e635]/20 text-xs text-gray-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ---------------- 6. FALLBACK MODE: JOIN NOW CTA ---------------- */
          <div className="p-8 sm:p-12 rounded-3xl bg-[#040e04] border border-[#a3e635]/40 text-center space-y-6 shadow-[0_0_50px_rgba(163,230,53,0.2)] max-w-3xl mx-auto animate-in fade-in duration-300">
            <div className="p-4 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 w-fit mx-auto animate-pulse">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-[10px] font-black uppercase border border-amber-400/30">
                No Active Subscription Found
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                You Have Not Subscribed To {selectedMarketId.toUpperCase()} VIP Group Yet!
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                Unlock daily institutional signals, buying ranges, target profit levels, and direct master analyst guidance.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => navigate('/vip-groups')}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] hover:from-[#bef264] hover:to-[#a3e635] text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(163,230,53,0.5)] hover:scale-105 transition-all cursor-pointer"
              >
                <span>JOIN VIP GROUP NOW</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ClientVipGroups;