import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BarChart3,
  Newspaper,
  Calendar,
  Clock,
  ExternalLink,
  Filter
} from 'lucide-react';


import dummyData from '../../../assets/dummyData.json';

const tradingViewWidgets = {
  'ticker-tape': {
    symbols: [
      { proName: 'FX:EURUSD', title: 'EUR/USD' },
      { proName: 'FX:GBPUSD', title: 'GBP/USD' },
      { proName: 'OANDA:XAUUSD', title: 'Gold' },
      { proName: 'NASDAQ:QQQ', title: 'Nasdaq 100 ETF' },
      { proName: 'AMEX:SPY', title: 'S&P 500 ETF' },
      { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' }
    ],
    showSymbolLogo: true,
    colorTheme: 'dark',
    isTransparent: true,
    displayMode: 'adaptive',
    locale: 'en'
  },
  'advanced-chart': {
    autosize: true,
    symbol: 'FX:EURUSD',
    interval: '60',
    timezone: 'Etc/UTC',
    theme: 'dark',
    style: '1',
    locale: 'en',
    allow_symbol_change: true,
    calendar: false,
    support_host: 'https://www.tradingview.com'
  },
  'technical-analysis': {
    interval: '1D',
    width: '100%',
    isTransparent: true,
    symbol: 'FX:EURUSD',
    showIntervalTabs: true,
    displayMode: 'single',
    colorTheme: 'dark',
    locale: 'en'
  },
  'market-overview': {
    colorTheme: 'dark',
    dateRange: '12M',
    showChart: true,
    locale: 'en',
    width: '100%',
    height: '550',
    isTransparent: true,
    showSymbolLogo: true,
    showFloatingTooltip: false,
    tabs: [
      {
        title: 'Forex',
        symbols: [
          { s: 'FX:EURUSD', d: 'EUR/USD' },
          { s: 'FX:GBPUSD', d: 'GBP/USD' },
          { s: 'FX:USDJPY', d: 'USD/JPY' }
        ]
      },
      {
        title: 'Indices',
        symbols: [
          { s: 'NASDAQ:QQQ', d: 'Nasdaq 100 ETF' },
          { s: 'AMEX:SPY', d: 'S&P 500 ETF' },
          { s: 'TVC:UKX', d: 'FTSE 100' }
        ]
      },
      {
        title: 'Commodities',
        symbols: [
          { s: 'OANDA:XAUUSD', d: 'Gold' },
          { s: 'OANDA:WTICOUSD', d: 'WTI Crude Oil' }
        ]
      },
      {
        title: 'Crypto',
        symbols: [
          { s: 'BITSTAMP:BTCUSD', d: 'Bitcoin' },
          { s: 'BITSTAMP:ETHUSD', d: 'Ethereum' }
        ]
      }
    ]
  },
  events: {
    colorTheme: 'dark',
    isTransparent: false,
    width: '100%',
    height: '650',
    locale: 'en',
    importanceFilter: '-1,0,1',
    currencyFilter: 'USD,EUR,GBP,JPY,CNY,AUD,CAD,NZD,CHF,PKR'
  },
  timeline: {
    feedMode: 'all_symbols',
    isTransparent: true,
    displayMode: 'regular',
    colorTheme: 'dark',
    width: '100%',
    height: '550',
    locale: 'en'
  }
};

const TradingViewWidget = ({ type, height }) => {
  const widgetContainerRef = useRef(null);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    const container = widgetContainerRef.current;
    if (!container) return undefined;

    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget';
    const script = document.createElement('script');
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${type}.js`;
    script.async = true;
    script.textContent = JSON.stringify(tradingViewWidgets[type]);
    script.onerror = () => setHasLoadError(true);
    container.append(widget, script);

    return () => {
      container.replaceChildren();
    };
  }, [type]);

  return (
    <>
      <div
        ref={widgetContainerRef}
        className="tradingview-widget-container w-full overflow-hidden"
        style={{ height }}
      />
      {hasLoadError && (
        <div className="p-5 text-center text-xs text-gray-300">
          <p>Live widget could not be loaded. Please check your connection or open it directly.</p>
          <a
            href={type === 'events' ? 'https://www.tradingview.com/economic-calendar/' : 'https://www.tradingview.com/markets/'}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 font-bold text-[#a3e635] hover:underline"
          >
            Open on TradingView <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </>
  );
};

const MarketWatch = () => {
  const data = dummyData.marketWatchPage;
  const [activeTab, setActiveTab] = useState('technicals'); // 'technicals', 'fundamentals', 'news'
  
  // News Category Dropdown State ('all', 'pakistani', 'international')
  const [newsCategory, setNewsCategory] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  // Filtered News Logic
  const filteredNews = newsCategory === 'all'
    ? data.newsData
    : data.newsData.filter((n) => n.category === newsCategory);

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          
          {/* ---------------- 1. PAGE HEADER ---------------- */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(163,230,53,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {data.heading.split('Market')[0]}{' '}
              <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.5)]">
                Market Watch
              </span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {data.subheading}
            </p>
          </div>

          {/* ---------------- 2. THREE CORE TABS (TECHNICALS, FUNDAMENTALS, NEWS) ---------------- */}
          <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto p-1.5 rounded-2xl bg-[#040e04] border border-[#a3e635]/30 shadow-xl">
            {[
              { id: 'technicals', label: 'Technicals', icon: BarChart3 },
              { id: 'fundamentals', label: 'Fundamentals', icon: Calendar },
              { id: 'news', label: 'Market News', icon: Newspaper }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.5)] scale-[1.02]'
                      : 'text-gray-400 hover:text-white hover:bg-[#081806]'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ---------------- 3. TAB 1: TECHNICAL ANALYSIS WIDGETS ---------------- */}
          {activeTab === 'technicals' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl overflow-hidden">
                <TradingViewWidget type="ticker-tape" height="72px" />
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#a3e635]/20 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#a3e635]" />
                      Live TradingView Chart
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Interactive chart with symbols, timeframes, drawing tools and indicators.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-[10px] font-black uppercase">
                    TradingView
                  </span>
                </div>

                <div className="h-[520px] sm:h-[620px] overflow-hidden rounded-2xl">
                  <TradingViewWidget type="advanced-chart" height="100%" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-5 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-xl backdrop-blur-xl">
                  <h3 className="text-lg font-black text-white mb-4">Technical Analysis</h3>
                  <TradingViewWidget type="technical-analysis" height="460px" />
                </div>
                <div className="p-5 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-xl backdrop-blur-xl">
                  <h3 className="text-lg font-black text-white mb-4">Market Overview</h3>
                  <TradingViewWidget type="market-overview" height="550px" />
                </div>
              </div>
            </div>
          )}

          {/* ---------------- 4. TAB 2: FUNDAMENTALS (FOREX FACTORY STYLE CALENDAR) ---------------- */}
          {activeTab === 'fundamentals' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl space-y-6 animate-in fade-in duration-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#a3e635]/20 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#a3e635]" />
                    Live Economic Calendar
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Live economic releases with impact levels, forecasts and previous values.</p>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-extrabold uppercase">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> High Impact</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-400"></span> Medium</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-300"></span> Low</span>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#a3e635]/15">
                <TradingViewWidget type="events" height="650px" />
              </div>

            </div>
          )}

          {/* ---------------- 5. TAB 3: FINANCIAL MARKET NEWS HUB (WITH DROPDOWN FILTER) ---------------- */}
          {activeTab === 'news' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl space-y-6 animate-in fade-in duration-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#a3e635]/20 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-[#a3e635]" />
                    Financial Market News Desk
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Real-time financial breaking news from authentic market sources.</p>
                </div>

                {/* News Dropdown Filter */}
                <div className="flex items-center gap-2 bg-[#081806] border border-[#a3e635]/30 rounded-2xl px-4 py-2">
                  <Filter className="w-4 h-4 text-[#a3e635]" />
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#040e04]">All Financial News</option>
                    <option value="pakistani" className="bg-[#040e04]">Pakistani Financial News (PSX / SBP)</option>
                    <option value="international" className="bg-[#040e04]">International News (Forex / Fed / Gold)</option>
                  </select>
                </div>
              </div>

              {newsCategory === 'all' && (
                <div className="rounded-2xl border border-[#a3e635]/20 overflow-hidden">
                <div className="px-5 py-4 bg-[#081806] border-b border-[#a3e635]/10">
                  <h4 className="text-sm font-black text-white">Global Live Headlines</h4>
                  <p className="text-[11px] text-gray-400 mt-1">Live headlines from TradingView. Choose a news category above to filter the image stories below.</p>
                </div>
                <TradingViewWidget type="timeline" height="550px" />
                </div>
              )}

              {/* News Feed Grid */}
              {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNews.map((news) => (
                  <div
                    key={news.id}
                    className="rounded-2xl bg-[#081806] border border-[#a3e635]/20 hover:border-[#a3e635]/50 transition-all overflow-hidden flex flex-col justify-between group"
                  >
                    <img
                      src={news.image}
                      alt=""
                      loading="lazy"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="p-6 space-y-3 flex flex-col justify-between flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-[#a3e635] uppercase">{news.source}</span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#a3e635]" /> {news.time}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white group-hover:text-[#a3e635] transition-colors leading-snug">
                        {news.title}
                      </h4>

                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                        {news.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#a3e635]/10 flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-[#a3e635]/10 text-[#a3e635] text-[10px] font-black uppercase">
                        {news.category}
                      </span>

                      <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-extrabold text-gray-300 hover:text-white flex items-center gap-1.5"
                      >
                        <span>Read Full Report</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#a3e635]" />
                      </a>
                    </div>
                    </div>
                  </div>
                ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#081806] border border-[#a3e635]/20 p-8 text-center text-sm text-gray-300">
                  No stories are currently available for this category.
                </div>
              )}

            </div>
          )}

        </div>
      </main>

    </div>
  );
};

export default MarketWatch;