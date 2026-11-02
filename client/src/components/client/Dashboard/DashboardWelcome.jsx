import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Wallet,
  Zap,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Bot,
  Building2,
  Crown,
  BarChart3,
  Clock,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';


import dummyData from '../../../assets/dummyData.json';

const DashboardWelcome = () => {
  const data = dummyData.dashboardWelcomePage;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  const chartValues = data.chartData.map((point) => point.equity);
  const chartMin = Math.min(...chartValues);
  const chartMax = Math.max(...chartValues);
  const chartRange = chartMax - chartMin || 1;
  const chartPoints = data.chartData.map((point, index) => ({
    ...point,
    x: data.chartData.length > 1 ? (index / (data.chartData.length - 1)) * 500 : 250,
    y: 130 - ((point.equity - chartMin) / chartRange) * 110
  }));
  const chartLine = chartPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const chartArea = `${chartLine} L 500 150 L 0 150 Z`;
  const growthPercent = chartValues.length > 1
    ? Math.round(((chartValues[chartValues.length - 1] - chartValues[0]) / chartValues[0]) * 100)
    : 0;

  const metricStyles = [
    {
      border: 'hover:border-emerald-400/50',
      icon: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-300 group-hover:bg-emerald-300 group-hover:text-black',
      value: 'group-hover:text-emerald-300',
      change: 'text-emerald-300',
      glow: 'from-emerald-500/10'
    },
    {
      border: 'hover:border-violet-400/50',
      icon: 'border-violet-300/20 bg-violet-400/10 text-violet-300 group-hover:bg-violet-300 group-hover:text-black',
      value: 'group-hover:text-violet-300',
      change: 'text-violet-300',
      glow: 'from-violet-500/10'
    },
    {
      border: 'hover:border-sky-400/50',
      icon: 'border-sky-300/20 bg-sky-400/10 text-sky-300 group-hover:bg-sky-300 group-hover:text-black',
      value: 'group-hover:text-sky-300',
      change: 'text-sky-300',
      glow: 'from-sky-500/10'
    },
    {
      border: 'hover:border-amber-400/50',
      icon: 'border-amber-300/20 bg-amber-400/10 text-amber-300 group-hover:bg-amber-300 group-hover:text-black',
      value: 'group-hover:text-amber-300',
      change: 'text-amber-300',
      glow: 'from-amber-500/10'
    }
  ];

  const actionStyles = [
    'border-emerald-400/20 bg-emerald-400/10 text-emerald-300 group-hover:border-emerald-300/50 group-hover:bg-emerald-400/20',
    'border-sky-400/20 bg-sky-400/10 text-sky-300 group-hover:border-sky-300/50 group-hover:bg-sky-400/20',
    'border-amber-400/20 bg-amber-400/10 text-amber-300 group-hover:border-amber-300/50 group-hover:bg-amber-400/20',
    'border-violet-400/20 bg-violet-400/10 text-violet-300 group-hover:border-violet-300/50 group-hover:bg-violet-400/20'
  ];

  const getMetricIcon = (iconName) => {
    switch (iconName) {
      case 'Wallet':
        return Wallet;
      case 'Zap':
        return Zap;
      case 'GraduationCap':
        return GraduationCap;
      case 'ShieldCheck':
        return ShieldCheck;
      default:
        return Wallet;
    }
  };

  const getActionIcon = (iconName) => {
    switch (iconName) {
      case 'Bot':
        return Bot;
      case 'Building2':
        return Building2;
      case 'Crown':
        return Crown;
      case 'BarChart3':
        return BarChart3;
      default:
        return Bot;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020602] text-white selection:bg-[#a3e635] selection:text-black">
      {/* 1. SIDEBAR */}

      {/* 2. MAIN CONTENT AREA */}
      <main className="relative z-10 w-full min-w-0 space-y-6 px-4 pb-10 pt-20 sm:space-y-8 sm:px-6 lg:ml-72 lg:w-[calc(100%-18rem)] lg:px-8 lg:pt-8 2xl:px-12">
        
        {/* Background Ambient Cyber Glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-sky-500/10 to-violet-500/10 rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        {/* ---------------- 3. LIVE TICKER TAPE BAR ---------------- */}
        <div className="flex min-w-0 items-center gap-3 overflow-x-auto rounded-2xl border border-emerald-300/20 bg-gradient-to-r from-[#07130f] via-[#071016] to-[#100c19] p-3 shadow-xl shadow-black/20 backdrop-blur-xl sm:gap-5">
          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-300 sm:text-xs">
            <Activity className="w-3.5 h-3.5 animate-spin text-[#a3e635]" style={{ animationDuration: '4s' }} />
            <span>LIVE FEED</span>
          </div>

          <div className="flex shrink-0 items-center gap-5 sm:gap-8">
            {data.liveTickers.map((ticker) => (
              <div key={ticker.pair} className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs">
                <span className="font-extrabold text-gray-300">{ticker.pair}</span>
                <span className="font-mono font-bold text-white">{ticker.price}</span>
                <span className={`text-[10px] font-black flex items-center gap-0.5 ${ticker.isUp ? 'text-[#a3e635]' : 'text-red-400'}`}>
                  {ticker.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {ticker.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- 4. WELCOME BANNER ---------------- */}
        <div className="relative group overflow-hidden rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-[#071713] via-[#08101a] to-[#100b1a] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
          <div className="absolute -bottom-28 right-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
                <span>{data.statusBadge}</span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                {data.userGreeting}
              </h1>

              <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#a3e635]" />
                <span>Last Terminal Activity: {data.lastLogin}</span>
              </div>
            </div>

            <div className="flex w-full items-center gap-3 md:w-auto">
              <Link
                to="/dashboard/products"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] px-5 py-3.5 text-xs font-extrabold text-black shadow-[0_0_25px_rgba(163,230,53,0.3)] transition-all hover:shadow-[0_0_35px_rgba(163,230,53,0.55)] sm:px-6 sm:text-sm md:w-auto"
              >
                <Bot className="w-4 h-4 stroke-[2.5]" />
                <span>Deploy AI Bot</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ---------------- 5. METRICS CARDS ---------------- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5">
          {data.metrics.map((metric, index) => {
            const IconComp = getMetricIcon(metric.icon);
            const style = metricStyles[index % metricStyles.length];

            return (
              <div
                key={metric.id}
                className={`relative isolate flex min-w-0 flex-col justify-between space-y-4 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#09110f] via-[#070b10] to-[#0c0913] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1 ${style.border} sm:p-6`}
              >
                <div className={`pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${style.glow} to-transparent blur-2xl opacity-80`} />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 sm:text-xs">
                    {metric.title}
                  </span>
                  <div className={`rounded-2xl border p-3 transition-colors duration-300 ${style.icon}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className={`break-words text-2xl font-black text-white transition-colors sm:text-3xl ${style.value}`}>
                    {metric.value}
                  </div>
                  <div className={`flex items-center gap-1 text-[11px] font-bold ${style.change}`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{metric.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------------- 6. VISUAL GRAPHS SECTION (EQUITY TRAJECTORY + WIN-RATE DONUT) ---------------- */}
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-12 sm:gap-6">
          
          {/* Custom SVG Performance Chart (8 Cols) */}
          <div className="min-w-0 space-y-5 rounded-3xl border border-white/10 bg-gradient-to-br from-[#07110f] via-[#080b12] to-[#0a0712] p-5 shadow-2xl backdrop-blur-xl sm:space-y-6 sm:p-8 lg:col-span-8">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-400/10">
                    <LineChart className="w-5 h-5 text-emerald-300" />
                  </span>
                  Monthly Equity Trajectory
                </h3>
                <p className="mt-1 text-xs text-gray-400">Portfolio value across the latest reporting periods.</p>
              </div>

              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase text-emerald-300">
                +{growthPercent}% Growth
              </span>
            </div>

            <div className="relative h-56 w-full pt-3 sm:h-64">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none" role="img" aria-label="Equity growth chart">
                <defs>
                  <linearGradient id="equityAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                    <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="equityLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="55%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                {[25, 65, 105, 145].map((y) => (
                  <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 7" />
                ))}
                <path d={chartArea} fill="url(#equityAreaGradient)" />
                <path d={chartLine} fill="none" stroke="url(#equityLineGradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(56,189,248,0.45)]" />
                {chartPoints.map((point, index) => (
                  <g key={point.month}>
                    <circle cx={point.x} cy={point.y} r={index === chartPoints.length - 1 ? 5 : 3.5} fill="#07110f" stroke={index < 2 ? '#34d399' : index < 4 ? '#38bdf8' : '#a78bfa'} strokeWidth="2.5" />
                    <title>{`${point.month}: ${point.equity.toLocaleString()}`}</title>
                  </g>
                ))}
              </svg>
            </div>

            <div className="grid text-center font-mono text-[10px] text-gray-400 sm:text-xs" style={{ gridTemplateColumns: `repeat(${data.chartData.length}, minmax(0, 1fr))` }}>
              {chartPoints.map((point) => (
                <span key={point.month} className="truncate">{point.month}</span>
              ))}
            </div>
          </div>

          {/* Win-Rate Accuracy Donut Gauge (4 Cols) */}
          <div className="flex min-w-0 flex-col justify-between space-y-5 rounded-3xl border border-violet-300/15 bg-gradient-to-br from-[#0b0a13] via-[#080b12] to-[#06110f] p-5 shadow-2xl backdrop-blur-xl sm:space-y-6 sm:p-8 lg:col-span-4">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10">
                  <PieChart className="w-5 h-5 text-violet-300" />
                </span>
                Win/Loss Ratio
              </h3>
              <p className="text-xs text-gray-400">Bot execution accuracy gauge.</p>
            </div>

            {/* Circular Gauge Graphic */}
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <defs>
                  <linearGradient id="winRateGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="55%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <path
                  className="text-gray-800"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="drop-shadow-[0_0_10px_rgba(56,189,248,0.45)]"
                  strokeDasharray={`${data.winLossRatio.winPercentage}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="url(#winRateGradient)"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-white block">{data.winLossRatio.winPercentage}%</span>
                <span className="text-[10px] font-extrabold uppercase text-sky-300">WIN RATE</span>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 gap-3 text-center border-t border-white/10 pt-4">
              <div className="p-2.5 rounded-xl bg-emerald-400/[0.06] border border-emerald-300/15">
                <div className="text-[10px] text-gray-400 font-bold uppercase">Wins</div>
                <div className="text-sm font-black text-emerald-300">{data.winLossRatio.wins} Trades</div>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-400/[0.06] border border-rose-300/15">
                <div className="text-[10px] text-gray-400 font-bold uppercase">Losses</div>
                <div className="text-sm font-black text-rose-300">{data.winLossRatio.losses} Trades</div>
              </div>
            </div>
          </div>

        </div>

        {/* ---------------- 7. QUICK ACTIONS ---------------- */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#a3e635]" />
            Quick Terminal Actions
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
            {data.quickActions.map((act, index) => {
              const ActionIcon = getActionIcon(act.icon);
              const actionStyle = actionStyles[index % actionStyles.length];

              return (
                <Link
                  key={act.id}
                  to={act.path}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#080e0d] to-[#0a0b13] p-4 shadow-lg transition-all duration-300 group hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110 ${actionStyle}`}>
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <span className="min-w-0 break-words text-xs font-black text-white transition-colors group-hover:text-white sm:text-sm">
                      {act.label}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-sky-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardWelcome;