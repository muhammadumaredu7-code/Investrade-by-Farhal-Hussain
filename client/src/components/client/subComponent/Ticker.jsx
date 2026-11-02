import { useEffect, useRef } from 'react';

const Ticker = () => {
  const tickerContainerRef = useRef(null);

  useEffect(() => {
    const container = tickerContainerRef.current;
    if (!container) return undefined;

    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.textContent = JSON.stringify({
      symbols: [
        { proName: 'FX:EURUSD', title: 'EUR/USD' },
        { proName: 'FX:GBPUSD', title: 'GBP/USD' },
        { proName: 'OANDA:XAUUSD', title: 'Gold' },
        { proName: 'NASDAQ:QQQ', title: 'Nasdaq 100' },
        { proName: 'AMEX:SPY', title: 'S&P 500' },
        { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' }
      ],
      showSymbolLogo: true,
      colorTheme: 'dark',
      isTransparent: true,
      displayMode: 'adaptive',
      locale: 'en'
    });
    container.append(widget, script);

    return () => {
      container.replaceChildren();
    };
  }, []);

  return (
    <section
      aria-label="Live market ticker"
      className="pointer-events-none relative z-10 w-full select-none touch-none overflow-hidden border-y border-white/[0.08] bg-black/70 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
    >
      <div className="w-full bg-gradient-to-r from-white/[0.025] via-white/[0.01] to-white/[0.025]">
        <div
          ref={tickerContainerRef}
          className="tradingview-widget-container min-w-0 h-12 w-full overflow-hidden"
          aria-label="Live market prices and percentage changes"
        />
      </div>
    </section>
  );
};

export default Ticker;
