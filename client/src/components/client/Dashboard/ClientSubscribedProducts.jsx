import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Cpu,
  ExternalLink,
  Package,
  ShieldCheck,
  Sparkles,
  Wifi
} from 'lucide-react';

import Sidebar from './Sidebar.jsx';
import dummyData from '../../../assets/dummyData.json';

const formatDate = (date) => {
  if (!date) return 'Lifetime';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return 'Not available';
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsedDate);
};

const SubscriptionTimer = ({ expiresAt }) => {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!expiresAt) return undefined;

    const updateRemaining = () => {
      const milliseconds = new Date(expiresAt).getTime() - Date.now();
      if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      setRemaining({
        days: Math.floor(milliseconds / 86_400_000),
        hours: Math.floor((milliseconds / 3_600_000) % 24),
        minutes: Math.floor((milliseconds / 60_000) % 60),
        seconds: Math.floor((milliseconds / 1_000) % 60),
        expired: false
      });
    };

    updateRemaining();
    const timerId = window.setInterval(updateRemaining, 1_000);
    return () => window.clearInterval(timerId);
  }, [expiresAt]);

  if (!expiresAt) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-3.5 py-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-gray-300">
          <ShieldCheck className="h-4 w-4 text-emerald-300" /> License validity
        </span>
        <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
          Lifetime access
        </span>
      </div>
    );
  }

  if (!remaining) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-3.5 py-3 text-xs text-gray-300">
        <Clock3 className="h-4 w-4 text-cyan-300" /> Syncing live subscription timer...
      </div>
    );
  }

  if (remaining.expired) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-300/25 bg-rose-300/[0.07] px-3.5 py-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-rose-200">
          <AlertTriangle className="h-4 w-4" /> Subscription expired
        </span>
        <span className="font-mono text-xs font-bold text-rose-200">00d 00h 00m 00s</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-violet-300/20 bg-violet-300/[0.06] p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-xs font-semibold text-gray-300">
          <Clock3 className="h-4 w-4 text-violet-300" /> Time remaining
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-violet-200">Live countdown</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          ['Days', remaining.days],
          ['Hours', remaining.hours],
          ['Minutes', remaining.minutes],
          ['Seconds', remaining.seconds]
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-black/20 px-1 py-2">
            <span className="block font-mono text-sm font-bold text-white">{String(value).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase tracking-wide text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientSubscribedProducts = () => {
  const data = dummyData.adminProductsManagementPage;
  const products = dummyData.productsPage?.products || [];
  const purchases = Array.isArray(data?.purchases) ? data.purchases : [];
  const subscriptions = purchases.map((purchase) => {
    const product = products.find((item) => item.title === purchase.productTitle);
    const getSpec = (label) => product?.specs?.find((spec) => spec.label.toLowerCase() === label)?.value;

    return {
      ...purchase,
      productId: product?.id,
      title: purchase.productTitle,
      category: product?.category || 'Product',
      badge: product?.badge,
      shortDesc: product?.shortDesc,
      mediaUrl: product?.mediaUrl,
      planType: purchase.pricePaid,
      subscribedOn: purchase.purchasedOn,
      status: purchase.status === 'APPROVED' ? 'ACTIVE' : purchase.status,
      executionMode: getSpec('execution mode') || 'Account-linked execution',
      latency: getSpec('latency'),
      features: product?.features || []
    };
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070b12] text-white selection:bg-cyan-300 selection:text-[#071018]">
      <Sidebar />
      <main className="relative z-10 mx-auto w-full min-w-0 space-y-6 px-4 pb-12 pt-20 sm:space-y-8 sm:px-6 lg:ml-72 lg:w-[calc(100%-18rem)] lg:px-8 lg:pt-8 2xl:px-12">
        <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-violet-500/10 blur-[110px]" />

        <header className="relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#101b2a] via-[#111321] to-[#181329] p-5 shadow-2xl sm:p-8 lg:flex-row lg:items-center">
          <div className="min-w-0 space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-200 sm:text-xs">
              <Sparkles className="h-4 w-4" /> {data?.badge || 'Client subscriptions'}
            </span>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              {data?.heading || 'My Subscribed Products & Bots'}
            </h1>
            <p className="max-w-2xl text-xs leading-relaxed text-gray-300 sm:text-sm">
              {data?.subheading || 'Manage product access and monitor the remaining license time.'}
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3.5 text-sm font-extrabold text-[#071018] shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-200 sm:w-auto"
          >
            <Package className="h-4 w-4" /> Browse products <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section aria-label="Subscribed products" className="relative">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold sm:text-xl">Your subscriptions</h2>
              <p className="mt-1 text-xs text-gray-400 sm:text-sm">Live access status and license expiry countdown.</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-gray-300">
              {subscriptions.length} {subscriptions.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {subscriptions.length ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {subscriptions.map((subscription) => {
                const isPending = subscription.status?.toUpperCase() === 'PENDING';
                const expiringSoon = subscription.status?.toUpperCase() === 'EXPIRING SOON';

                return (
                  <article key={subscription.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101722]/95 shadow-xl transition hover:-translate-y-1 hover:border-cyan-300/25">
                    <div className="relative h-40 overflow-hidden sm:h-48">
                      {subscription.mediaUrl ? (
                        <img src={subscription.mediaUrl} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
                          <Bot className="h-12 w-12 text-cyan-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101722] via-[#101722]/15 to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
                        {subscription.category || 'Product'}
                      </span>
                      <span className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide backdrop-blur ${
                        isPending || expiringSoon
                          ? 'border-amber-300/30 bg-amber-300/15 text-amber-200'
                          : 'border-emerald-300/30 bg-emerald-300/15 text-emerald-200'
                      }`}>
                        {isPending ? <Clock3 className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
                        {subscription.status || 'ACTIVE'}
                      </span>
                      <div className="absolute bottom-4 left-5 right-5">
                        <h3 className="text-lg font-extrabold leading-snug text-white sm:text-xl">{subscription.title}</h3>
                        {subscription.badge && <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200">{subscription.badge}</p>}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
                      <p className="line-clamp-2 min-h-10 text-xs leading-relaxed text-gray-300 sm:text-sm">
                        {subscription.shortDesc || 'Product description is not available.'}
                      </p>

                      {isPending ? (
                        <div className="flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-3.5 py-3 text-xs text-amber-100">
                          <Clock3 className="h-4 w-4" /> Timer starts after purchase approval
                        </div>
                      ) : (
                        <SubscriptionTimer expiresAt={subscription.expiresAt} />
                      )}

                      <div className="space-y-2 rounded-xl border border-white/[0.06] bg-black/15 p-3.5">
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="flex items-center gap-2 text-gray-400"><ShieldCheck className="h-4 w-4 text-violet-300" /> Plan</span>
                          <span className="text-right font-semibold text-gray-200">{subscription.planType || 'Standard'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-2 text-xs">
                          <span className="flex items-center gap-2 text-gray-400"><Cpu className="h-4 w-4 text-sky-300" /> Execution</span>
                          <span className="max-w-[60%] text-right font-semibold text-gray-200">{subscription.executionMode || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-2 text-xs">
                          <span className="flex items-center gap-2 text-gray-400"><CalendarDays className="h-4 w-4 text-amber-300" /> Started</span>
                          <span className="font-semibold text-gray-200">{formatDate(subscription.subscribedOn)}</span>
                        </div>
                      </div>

                      {Array.isArray(subscription.features) && subscription.features.length > 0 && (
                        <ul className="space-y-2">
                          {subscription.features.map((feature, index) => (
                            <li key={`${subscription.id}-${index}`} className="flex items-start gap-2 text-xs leading-relaxed text-gray-300">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <footer className="flex gap-2 border-t border-white/[0.07] bg-black/15 p-4">
                      <Link to="/products" className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-2.5 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/15">
                        Renew subscription <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        to={subscription.productId ? `/product/${subscription.productId}` : '/products'}
                        aria-label={`View ${subscription.title} details`}
                        className="inline-flex h-10 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-300 transition hover:border-violet-300/30 hover:bg-violet-300/10 hover:text-violet-100"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </footer>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#101722]/90 px-5 py-12 text-center">
              <Bot className="mx-auto h-12 w-12 text-violet-200" />
              <h3 className="mt-4 text-xl font-bold">No subscriptions yet</h3>
              <p className="mt-2 text-sm text-gray-400">Browse the store to find a product for your trading workflow.</p>
              <Link to="/products" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-[#071018]">
                Explore products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ClientSubscribedProducts;
