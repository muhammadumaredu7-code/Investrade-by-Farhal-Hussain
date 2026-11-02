import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Globe2,
  Building2,
  Coins,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  Crown,
  ArrowRight,
  Activity,
} from 'lucide-react';

import ClientSidebar from './Sidebar.jsx';
import dummyData from '../../../assets/dummyData.json';
import { useAppContext } from '../../../context/AppContext.jsx';

const ClientSignals = () => {
  const data = dummyData.clientDashboardSignalsPage;
  const { signals: allSignals } = useAppContext();
  const [selectedMarketId, setSelectedMarketId] = useState('forex');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  // Filter Signals by Market & Status
  const filteredSignals = allSignals.filter((sig) => {
    const matchesMarket = sig.marketId === selectedMarketId;
    const matchesStatus = statusFilter === 'ALL' || sig.status === statusFilter;
    return matchesMarket && matchesStatus;
  });

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020602] text-white selection:bg-[#a3e635] selection:text-black">
      {/* ---------------- 1. CLIENT DASHBOARD SIDEBAR ---------------- */}
      <ClientSidebar />

      {/* ---------------- 2. MAIN CONTENT AREA ---------------- */}
      <main className="relative z-10 w-full min-w-0 space-y-6 px-4 pb-10 pt-20 sm:space-y-8 sm:px-6 lg:ml-72 lg:w-[calc(100%-18rem)] lg:px-8 lg:pt-8 2xl:px-12">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Mesh Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        {/* ---------------- 3. PAGE HEADER ---------------- */}
        <div className="relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-br from-[#09121d] via-[#0b0b18] to-[#120b19] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 md:flex-row md:items-center">
          <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="relative min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-400/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-200 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              {data.heading}
            </h1>

            <p className="max-w-2xl text-xs leading-relaxed text-gray-300 sm:text-sm">
              {data.subheading}
            </p>
          </div>

          <Link
            to="/vip-groups"
            className="relative flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 px-5 py-3.5 text-xs font-extrabold text-[#1a1004] shadow-[0_0_25px_rgba(251,191,36,0.2)] transition-all hover:brightness-110 sm:px-6 sm:text-sm md:w-auto"
          >
            <Crown className="w-4 h-4 stroke-[2.5]" />
            <span>Manage VIP Subscriptions</span>
          </Link>
        </div>

        {/* ---------------- 4. MARKET TABS (FOREX, PSX, PMEX) & STATUS FILTER ---------------- */}
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between sm:gap-4">
          
          {/* Market Tabs */}
          <div role="group" aria-label="Filter signals by market" className="grid min-w-0 flex-1 grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-gradient-to-r from-[#08131a] to-[#100b18] p-1.5 shadow-xl xl:max-w-2xl sm:gap-2">
            {[
              { id: 'forex', label: 'FOREX & GOLD', icon: Globe2, active: 'bg-cyan-300 text-[#061116] shadow-cyan-400/20' },
              { id: 'psx', label: 'PSX STOCKS', icon: Building2, active: 'bg-emerald-300 text-[#06130c] shadow-emerald-400/20' },
              { id: 'pmex', label: 'PMEX COMMODITIES', icon: Coins, active: 'bg-violet-300 text-[#10091b] shadow-violet-400/20' }
            ].map((m) => {
              const IconComp = m.icon;
              const isSelected = selectedMarketId === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMarketId(m.id)}
                  aria-pressed={isSelected}
                  className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl py-3 text-[10px] font-extrabold transition-all focus:outline-none focus:ring-2 focus:ring-white/30 sm:gap-2 sm:text-xs ${
                    isSelected
                      ? `${m.active} shadow-lg`
                      : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Status Sub-Filters */}
          <div role="group" aria-label="Filter signals by status" className="grid grid-cols-4 items-center gap-1 rounded-2xl border border-white/10 bg-[#080b12] p-1.5">
            {['ALL', 'ACTIVE', 'TP HIT', 'SL HIT'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                aria-pressed={statusFilter === st}
                className={`rounded-xl px-2 py-2 text-[9px] font-black uppercase transition-all focus:outline-none focus:ring-2 focus:ring-white/30 sm:px-3 sm:text-[10px] ${
                  statusFilter === st
                    ? st === 'ACTIVE'
                      ? 'border border-amber-300/30 bg-amber-400/15 text-amber-200'
                      : st === 'TP HIT'
                        ? 'border border-emerald-300/30 bg-emerald-400/15 text-emerald-200'
                        : st === 'SL HIT'
                          ? 'border border-rose-300/30 bg-rose-400/15 text-rose-200'
                          : 'border border-sky-300/30 bg-sky-400/15 text-sky-200'
                    : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>

        {/* ---------------- 5. PREMIUM SIGNALS FEED ---------------- */}
        {filteredSignals.length > 0 ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-2 sm:gap-6">
              {filteredSignals.map((sig) => {
                const isBuy = sig.type.includes('BUY');
                const isTpHit = sig.status === 'TP HIT';
                const isSlHit = sig.status === 'SL HIT';
                const isActive = sig.status === 'ACTIVE';

                return (
                  <div
                    key={sig.id}
                    className="group min-w-0 space-y-5 rounded-3xl border border-white/10 bg-gradient-to-br from-[#08131a] via-[#090b13] to-[#100b18] p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/25 sm:p-6"
                  >
                    {/* Signal Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`p-2.5 rounded-2xl border text-xs font-black flex items-center gap-1.5 ${
                            isBuy
                              ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200'
                              : 'border-rose-300/25 bg-rose-400/10 text-rose-200'
                          }`}
                        >
                          {isBuy ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{sig.type}</span>
                        </div>

                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-black text-white sm:text-base">{sig.pair}</h3>
                          <span className="text-[10px] text-gray-400 font-bold">Analyst: {sig.analyst}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 shadow-md ${
                          isActive
                            ? 'border-amber-300/30 bg-amber-400/10 text-amber-200'
                            : isTpHit
                              ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200'
                              : 'border-rose-300/30 bg-rose-400/10 text-rose-200'
                        }`}
                      >
                        {isActive && <Activity className="w-3 h-3 text-amber-300 animate-spin" />}
                        {isTpHit && <CheckCircle2 className="w-3 h-3 text-emerald-300" />}
                        {isSlHit && <XCircle className="w-3 h-3 text-red-400" />}
                        <span>{sig.status}</span>
                      </span>
                    </div>

                    {/* Entry, TP, SL Matrix */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="min-w-0 rounded-2xl border border-sky-300/15 bg-sky-400/[0.06] p-3">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Entry Price</div>
                        <div className="text-sm font-black text-white font-mono">{sig.entry}</div>
                      </div>

                      <div className="min-w-0 rounded-2xl border border-rose-300/15 bg-rose-400/[0.06] p-3">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Stop-Loss (SL)</div>
                        <div className="text-sm font-black text-red-400 font-mono">{sig.sl}</div>
                      </div>
                    </div>

                    {/* TP Targets Breakdown */}
                    <div className="space-y-2 rounded-2xl border border-violet-300/15 bg-violet-400/[0.04] p-3.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-gray-300">Take-Profit Targets</span>
                        <span className="text-violet-200">RR Ratio: {sig.rrRatio}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-extrabold">
                        <div className="min-w-0 break-words rounded-xl border border-emerald-300/20 bg-emerald-400/[0.06] p-2 text-emerald-200">
                          <span className="text-[9px] text-gray-400 block font-sans">TP 1</span>
                          {sig.tp1}
                        </div>
                        <div className="min-w-0 break-words rounded-xl border border-emerald-300/20 bg-emerald-400/[0.06] p-2 text-emerald-200">
                          <span className="text-[9px] text-gray-400 block font-sans">TP 2</span>
                          {sig.tp2}
                        </div>
                        <div className="min-w-0 break-words rounded-xl border border-emerald-300/20 bg-emerald-400/[0.06] p-2 text-emerald-200">
                          <span className="text-[9px] text-gray-400 block font-sans">TP 3</span>
                          {sig.tp3}
                        </div>
                      </div>
                    </div>

                    {/* Notes & Timestamp */}
                    <div className="flex flex-col gap-2 pt-2 text-[11px] font-medium text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                      <span className="break-words italic">"{sig.notes}"</span>
                      <span className="flex shrink-0 items-center gap-1 text-[10px] font-mono">
                        <Clock className="h-3 w-3 text-sky-300" /> {sig.time}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ---------------- 6. FALLBACK MODE: NO SIGNALS / NOT SUBSCRIBED ---------------- */
          <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-violet-300/20 bg-gradient-to-br from-[#09121d] via-[#0b0b18] to-[#120b19] p-6 text-center shadow-[0_0_50px_rgba(167,139,250,0.12)] animate-in fade-in duration-300 sm:p-12">
            <div className="mx-auto w-fit rounded-full border border-violet-300/25 bg-violet-400/10 p-4 text-violet-200">
              <Zap className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase text-amber-200">
                No Signals Active For Selected Filter
              </span>
              <h2 className="text-2xl font-black text-white sm:text-4xl">
                No Signals Match Your Current Market View
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                Check back shortly for new institutional setups or switch your market view to Forex, PSX, or PMEX.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                to="/vip-groups"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-200 to-orange-300 px-6 py-4 text-xs font-black text-[#1a1004] shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-all hover:brightness-110 sm:w-auto sm:px-10 sm:text-sm"
              >
                <span>JOIN VIP SIGNALS GROUP NOW</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ClientSignals;