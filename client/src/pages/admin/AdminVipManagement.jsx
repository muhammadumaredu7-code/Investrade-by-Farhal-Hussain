import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  Check,
  Coins,
  Crown,
  Clock3,
  Edit,
  Globe2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Trash2,
  Users,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/adminSiderbar.jsx';
import dummyData from '../../assets/dummyData.json';
import { useAppContext } from '../../context/AppContext.jsx';

const emptyPricing = () => [{ duration: '', pricePKR: '', priceUSD: '', discount: '', isPopular: false }];

const createMarketForm = (market) => ({
  name: market?.name || '',
  badge: market?.badge || '',
  description: market?.description || '',
  features: market?.features?.join('\n') || '',
  pricing: market?.pricing?.map((plan) => ({ ...plan })) || emptyPricing()
});

const createSubscriptionForm = (subscription, markets) => {
  const market = markets.find((item) => item.id === subscription?.marketId) || markets[0];

  return {
    marketId: subscription?.marketId || market?.id || '',
    marketName: subscription?.marketName || market?.name || '',
    badge: subscription?.badge || market?.badge || '',
    plan: subscription?.plan || '',
    price: subscription?.price || '',
    startDate: subscription?.startDate || '',
    expiryDate: subscription?.expiryDate || '',
    status: subscription?.status || 'Active',
    accessLink: subscription?.accessLink || '',
    features: subscription?.features?.join('\n') || ''
  };
};

const marketIcons = {
  forex: Globe2,
  psx: Building2,
  pmex: Coins
};

const AdminVipManagement = () => {
  const {
    vipMarkets: markets,
    setVipMarkets,
    vipSubscriptions,
    setVipSubscriptions
  } = useAppContext();
  const [activeTab, setActiveTab] = useState('packages');
  const [selectedMarketId, setSelectedMarketId] = useState(() => markets[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarketId, setEditingMarketId] = useState(null);
  const [marketForm, setMarketForm] = useState(createMarketForm());
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState(null);
  const [subscriptionForm, setSubscriptionForm] = useState(() => createSubscriptionForm(null, markets));
  const [subscriptionSearch, setSubscriptionSearch] = useState('');
  const [subscriptionMarketFilter, setSubscriptionMarketFilter] = useState('all');
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] = useState('all');
  const pageCopy = dummyData.vipGroupsPage;
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const selectedMarket = markets.find((market) => market.id === selectedMarketId) || markets[0];
  const clientProfile = dummyData.dashboardSidebar.user;
  const clientDirectoryRecord = dummyData.adminUserManagement.usersList.find(
    (user) => user.email === clientProfile.email
  );
  const profileAvatar = clientDirectoryRecord?.avatar || clientProfile.avatar;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timerId = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const getTimeRemaining = (expiryDate, status) => {
    const expiryTime = expiryDate ? new Date(expiryDate).getTime() : NaN;
    if (status !== 'Active' || !Number.isFinite(expiryTime)) return null;

    const remaining = expiryTime - currentTime;
    if (remaining <= 0) return 'Expired';

    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const getSubscriptionStatus = (subscription) => {
    const expiryTime = subscription.expiryDate ? new Date(subscription.expiryDate).getTime() : NaN;
    if (subscription.status === 'Active' && Number.isFinite(expiryTime) && expiryTime <= currentTime) return 'Expired';
    return subscription.status;
  };

  const filteredSubscriptions = vipSubscriptions.filter((subscription) => {
    const searchText = [
      clientProfile.name,
      clientProfile.email,
      clientDirectoryRecord?.phone,
      subscription.id,
      subscription.marketName,
      subscription.plan,
      subscription.price
    ].filter(Boolean).join(' ').toLowerCase();
    const matchesSearch = searchText.includes(subscriptionSearch.trim().toLowerCase());
    const matchesMarket = subscriptionMarketFilter === 'all' || subscription.marketId === subscriptionMarketFilter;
    const matchesStatus = subscriptionStatusFilter === 'all' || getSubscriptionStatus(subscription) === subscriptionStatusFilter;
    return matchesSearch && matchesMarket && matchesStatus;
  });

  const clearSubscriptionFilters = () => {
    setSubscriptionSearch('');
    setSubscriptionMarketFilter('all');
    setSubscriptionStatusFilter('all');
  };

  const notify = (message, isError = false) => {
    const showToast = isError ? toast.error : toast.success;
    showToast(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10140f',
        border: '1px solid rgba(251, 191, 36, 0.35)',
        borderRadius: '12px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
        color: '#f3f4f6',
        fontSize: '13px',
        fontWeight: 600,
        padding: '12px 16px'
      }
    });
  };

  const openMarketModal = (market = null) => {
    setEditingMarketId(market?.id || null);
    setMarketForm(createMarketForm(market));
    setIsModalOpen(true);
  };

  const closeMarketModal = () => {
    setIsModalOpen(false);
    setEditingMarketId(null);
    setMarketForm(createMarketForm());
  };

  const updatePricing = (index, key, value) => {
    setMarketForm((current) => ({
      ...current,
      pricing: current.pricing.map((plan, planIndex) => (
        planIndex === index ? { ...plan, [key]: value } : plan
      ))
    }));
  };

  const handleSaveMarket = (event) => {
    event.preventDefault();
    const pricing = marketForm.pricing
      .filter((plan) => plan.duration.trim() && plan.pricePKR.trim() && plan.priceUSD.trim())
      .map((plan) => ({
        duration: plan.duration.trim(),
        pricePKR: plan.pricePKR.trim(),
        priceUSD: plan.priceUSD.trim(),
        discount: plan.discount.trim(),
        ...(plan.isPopular ? { isPopular: true } : {})
      }));

    if (!marketForm.name.trim() || !marketForm.badge.trim() || !marketForm.description.trim()) {
      notify('Complete the market name, badge, and description', true);
      return;
    }
    if (!marketForm.features.split('\n').some((feature) => feature.trim()) || pricing.length === 0) {
      notify('Add at least one feature and one complete pricing plan', true);
      return;
    }

    const existingMarket = markets.find((market) => market.id === editingMarketId);
    const newId = marketForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const savedMarket = {
      id: existingMarket?.id || `${newId}-${Date.now()}`,
      name: marketForm.name.trim(),
      badge: marketForm.badge.trim(),
      description: marketForm.description.trim(),
      features: marketForm.features.split('\n').map((feature) => feature.trim()).filter(Boolean),
      pricing
    };
    const updatedMarkets = existingMarket
      ? markets.map((market) => (market.id === existingMarket.id ? savedMarket : market))
      : [...markets, savedMarket];

    setVipMarkets(updatedMarkets);
    setSelectedMarketId(savedMarket.id);
    closeMarketModal();
    notify(existingMarket ? 'VIP market package updated' : 'VIP market package added');
  };

  const handleDeleteMarket = (market) => {
    if (markets.length <= 1) {
      notify('At least one VIP market package must remain', true);
      return;
    }
    if (!window.confirm(`Delete ${market.name} and its package plans?`)) return;

    const updatedMarkets = markets.filter((item) => item.id !== market.id);
    setVipMarkets(updatedMarkets);
    if (selectedMarketId === market.id) setSelectedMarketId(updatedMarkets[0].id);
    notify('VIP market package deleted');
  };

  const openSubscriptionModal = (subscription = null) => {
    setEditingSubscriptionId(subscription?.id || null);
    setSubscriptionForm(createSubscriptionForm(subscription, markets));
    setIsSubscriptionModalOpen(true);
  };

  const closeSubscriptionModal = () => {
    setIsSubscriptionModalOpen(false);
    setEditingSubscriptionId(null);
    setSubscriptionForm(createSubscriptionForm(null, markets));
  };

  const handleSaveSubscription = (event) => {
    event.preventDefault();
    const market = markets.find((item) => item.id === subscriptionForm.marketId);
    if (!market) {
      notify('Select an available VIP market', true);
      return;
    }
    if (!subscriptionForm.plan.trim() || !subscriptionForm.price.trim() || !subscriptionForm.startDate.trim()) {
      notify('Complete the plan, price, and subscribed date', true);
      return;
    }

    const existingSubscription = vipSubscriptions.find((item) => item.id === editingSubscriptionId);
    const savedSubscription = {
      id: existingSubscription?.id || `sub_${market.id}_${Date.now()}`,
      marketId: market.id,
      marketName: market.name,
      badge: market.badge,
      plan: subscriptionForm.plan.trim(),
      price: subscriptionForm.price.trim(),
      startDate: subscriptionForm.startDate.trim(),
      expiryDate: subscriptionForm.expiryDate.trim() || null,
      status: subscriptionForm.status,
      accessLink: subscriptionForm.accessLink.trim() || null,
      features: subscriptionForm.features.split('\n').map((feature) => feature.trim()).filter(Boolean)
    };
    const updatedSubscriptions = existingSubscription
      ? vipSubscriptions.map((item) => (item.id === existingSubscription.id ? savedSubscription : item))
      : [...vipSubscriptions, savedSubscription];

    setVipSubscriptions(updatedSubscriptions);
    closeSubscriptionModal();
    notify(existingSubscription ? 'VIP subscription updated' : 'VIP subscription added');
  };

  const handleDeleteSubscription = (subscription) => {
    if (!window.confirm(`Delete the ${subscription.marketName} subscription?`)) return;
    setVipSubscriptions((current) => current.filter((item) => item.id !== subscription.id));
    notify('VIP subscription deleted');
  };

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-[#020602] text-white selection:bg-amber-400 selection:text-black">
      <AdminSidebar />
      <main className="relative z-10 min-w-0 flex-1 space-y-6 px-4 pb-8 pt-20 sm:space-y-8 sm:px-8 sm:pb-10 sm:pt-8 lg:ml-72">
        <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/80">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {pageCopy.badge}
            </p>
            <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">{activeTab === 'packages' ? 'VIP Market Packages' : 'VIP Subscriptions'}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">{activeTab === 'packages' ? pageCopy.subheading : dummyData.clientDashboardVipPage.subheading}</p>
          </div>
          {activeTab === 'packages' ? (
            <button
              type="button"
              onClick={() => openMarketModal()}
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-[#161306] transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 sm:w-auto"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add market package
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openSubscriptionModal()}
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-[#161306] transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 sm:w-auto"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add VIP subscription
            </button>
          )}
        </header>

        <nav aria-label="VIP management views" className="grid w-full max-w-lg grid-cols-2 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1 sm:rounded-2xl">
          <button type="button" onClick={() => setActiveTab('packages')} aria-pressed={activeTab === 'packages'} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${activeTab === 'packages' ? 'bg-amber-300 text-black' : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'}`}>
            <Crown className="h-4 w-4" aria-hidden="true" /> Packages
          </button>
          <button type="button" onClick={() => setActiveTab('subscriptions')} aria-pressed={activeTab === 'subscriptions'} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${activeTab === 'subscriptions' ? 'bg-amber-300 text-black' : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'}`}>
            <Users className="h-4 w-4" aria-hidden="true" /> Subscriptions ({vipSubscriptions.length})
          </button>
        </nav>

        {activeTab === 'packages' && (markets.length > 0 ? (
          <>
            <nav aria-label="VIP markets" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {markets.map((market) => {
                const MarketIcon = marketIcons[market.id] || Crown;
                const isSelected = selectedMarket?.id === market.id;

                return (
                  <button
                    key={market.id}
                    type="button"
                    onClick={() => setSelectedMarketId(market.id)}
                    aria-pressed={isSelected}
                    className={`group flex min-h-20 min-w-0 items-center gap-3 rounded-xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 ${
                      isSelected
                        ? 'border-amber-300/35 bg-amber-300/[0.08] shadow-[0_10px_28px_rgba(0,0,0,0.2)]'
                        : 'border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${isSelected ? 'border-amber-200/30 bg-amber-300/15 text-amber-200' : 'border-white/[0.08] bg-white/[0.04] text-gray-400 group-hover:text-amber-200'}`}>
                      <MarketIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-sm font-semibold text-white">{market.name}</span>
                      <span className="mt-1 block break-words text-xs text-gray-400">{market.badge}</span>
                    </span>
                    {isSelected && <ArrowUpRight className="h-4 w-4 shrink-0 text-amber-200" aria-hidden="true" />}
                  </button>
                );
              })}
            </nav>

            {selectedMarket && (
              <section aria-labelledby="selected-market-heading" className="space-y-6 rounded-2xl border border-white/[0.08] bg-[#080a08]/85 p-4 sm:rounded-3xl sm:p-7">
                <div className="flex flex-col gap-5 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <span className="inline-flex max-w-full break-words rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1 text-[10px] font-bold uppercase text-amber-200">{selectedMarket.badge}</span>
                    <h2 id="selected-market-heading" className="mt-3 break-words text-xl font-bold text-white sm:text-2xl">{selectedMarket.name}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">{selectedMarket.description}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => openMarketModal(selectedMarket)} aria-label="Edit selected market" title="Edit market" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-amber-300/20 bg-amber-300/[0.06] text-amber-200 transition-colors hover:bg-amber-300/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => handleDeleteMarket(selectedMarket)} aria-label="Delete selected market" title="Delete market" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-300/20 bg-rose-400/[0.06] text-rose-300 transition-colors hover:bg-rose-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                  <section aria-labelledby="market-features-heading">
                    <h3 id="market-features-heading" className="mb-3 text-sm font-semibold text-white">Features</h3>
                    <ul className="space-y-2">
                      {selectedMarket.features.map((feature, index) => (
                        <li key={`${index}-${feature}`} className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm leading-relaxed text-gray-300">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section aria-labelledby="market-pricing-heading">
                    <h3 id="market-pricing-heading" className="mb-3 text-sm font-semibold text-white">Pricing plans</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedMarket.pricing.map((plan, index) => (
                        <article key={`${plan.duration}-${index}`} className={`rounded-xl border p-4 transition-colors ${plan.isPopular ? 'border-amber-300/30 bg-amber-300/[0.06]' : 'border-white/[0.08] bg-white/[0.025]'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-white">{plan.duration}</h4>
                            {plan.isPopular && <span className="shrink-0 rounded-full bg-amber-300/10 px-2 py-1 text-[9px] font-bold uppercase text-amber-200">{plan.discount || 'Popular'}</span>}
                          </div>
                          <p className="mt-3 text-lg font-bold text-amber-200">{plan.pricePKR}</p>
                          <p className="mt-1 text-xs text-gray-400">{plan.priceUSD}</p>
                          {plan.discount && !plan.isPopular && <p className="mt-2 text-xs text-emerald-300">{plan.discount}</p>}
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="rounded-2xl border border-dashed border-white/[0.12] px-5 py-12 text-center sm:rounded-3xl">
            <Crown className="mx-auto h-8 w-8 text-amber-200" aria-hidden="true" />
            <h2 className="mt-3 text-base font-semibold text-white">No VIP market packages</h2>
            <p className="mt-1 text-sm text-gray-400">Add a package to publish it on the client VIP page.</p>
          </section>
        ))}

        {activeTab === 'subscriptions' && (
          <section aria-label="VIP subscriptions" className="space-y-4">
            <div className="grid gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-[minmax(0,1fr)_180px_180px_auto] xl:items-end">
              <label className="block min-w-0 space-y-1.5 text-[11px] font-semibold text-gray-400">
                Search subscriptions
                <span className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                  <input type="search" value={subscriptionSearch} onChange={(event) => setSubscriptionSearch(event.target.value)} placeholder="Name, email, phone, or plan" className="min-h-10 w-full rounded-lg border border-white/[0.1] bg-black/30 py-2 pl-9 pr-3 text-sm font-normal text-white outline-none transition-colors placeholder:text-gray-600 focus:border-amber-300/40" />
                </span>
              </label>
              <label className="block space-y-1.5 text-[11px] font-semibold text-gray-400">
                Market
                <select value={subscriptionMarketFilter} onChange={(event) => setSubscriptionMarketFilter(event.target.value)} className="min-h-10 w-full rounded-lg border border-white/[0.1] bg-[#10140f] px-3 py-2 text-sm font-normal text-white outline-none focus:border-amber-300/40">
                  <option value="all">All markets</option>
                  {markets.map((market) => <option key={market.id} value={market.id}>{market.name}</option>)}
                </select>
              </label>
              <label className="block space-y-1.5 text-[11px] font-semibold text-gray-400">
                Status
                <select value={subscriptionStatusFilter} onChange={(event) => setSubscriptionStatusFilter(event.target.value)} className="min-h-10 w-full rounded-lg border border-white/[0.1] bg-[#10140f] px-3 py-2 text-sm font-normal text-white outline-none focus:border-amber-300/40">
                  <option value="all">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Expired">Expired</option>
                </select>
              </label>
              <button type="button" onClick={clearSubscriptionFilters} aria-label="Clear subscription filters" title="Clear filters" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/[0.1] px-3 text-xs font-semibold text-gray-300 transition-colors hover:border-amber-300/30 hover:text-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="xl:hidden">Clear filters</span>
              </button>
            </div>

            <div className="flex items-center justify-between px-1 text-xs text-gray-500">
              <span>Showing {filteredSubscriptions.length} of {vipSubscriptions.length} subscriptions</span>
            </div>

            {filteredSubscriptions.length > 0 ? filteredSubscriptions.map((subscription) => {
              const effectiveStatus = getSubscriptionStatus(subscription);

              return (
              <article key={subscription.id} className="rounded-2xl border border-white/[0.08] bg-[#080a08]/85 p-4 transition-colors hover:border-amber-300/20 sm:p-6">
                <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex min-w-0 items-center gap-3">
                      <img src={profileAvatar} alt={clientProfile.name} className="h-11 w-11 shrink-0 rounded-xl border border-white/10 object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{clientProfile.name}</p>
                        <p className="truncate text-xs text-gray-400">{clientProfile.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="break-words text-base font-semibold text-white">{subscription.marketName}</h2>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${effectiveStatus === 'Active' ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200' : effectiveStatus === 'Expired' ? 'border-rose-300/20 bg-rose-400/10 text-rose-200' : 'border-gray-400/20 bg-gray-400/10 text-gray-300'}`}>{effectiveStatus}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{subscription.badge} <span className="px-1 text-gray-600">·</span> {subscription.marketId}</p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-200">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                      {getTimeRemaining(subscription.expiryDate, subscription.status) || 'No active expiry countdown'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => openSubscriptionModal(subscription)} aria-label={`Edit ${subscription.marketName} subscription`} title="Edit subscription" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/20 bg-amber-300/[0.06] text-amber-200 transition-colors hover:bg-amber-300/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => handleDeleteSubscription(subscription)} aria-label={`Delete ${subscription.marketName} subscription`} title="Delete subscription" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-300/20 bg-rose-400/[0.06] text-rose-300 transition-colors hover:bg-rose-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <dl className="grid gap-x-6 gap-y-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div><dt className="text-[10px] font-semibold uppercase text-gray-500">Subscription ID</dt><dd className="mt-1 break-all text-xs text-gray-200">{subscription.id}</dd></div>
                  <div><dt className="text-[10px] font-semibold uppercase text-gray-500">Plan</dt><dd className="mt-1 text-sm font-medium text-white">{subscription.plan}</dd></div>
                  <div><dt className="text-[10px] font-semibold uppercase text-gray-500">Price</dt><dd className="mt-1 text-sm font-semibold text-amber-200">{subscription.price}</dd></div>
                  <div><dt className="text-[10px] font-semibold uppercase text-gray-500">Start / Expiry</dt><dd className="mt-1 break-words text-xs text-gray-200">{subscription.startDate} <span className="text-gray-600">/</span> {subscription.expiryDate || 'N/A'}</dd></div>
                </dl>
                <div className="grid gap-4 border-t border-white/[0.06] pt-4 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-[10px] font-semibold uppercase text-gray-500">Features</h3>
                    <ul className="space-y-1.5">{subscription.features.map((feature, index) => <li key={`${subscription.id}-${index}`} className="flex items-start gap-2 text-xs leading-relaxed text-gray-300"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" aria-hidden="true" />{feature}</li>)}</ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-[10px] font-semibold uppercase text-gray-500">Access link</h3>
                    {subscription.accessLink ? <a href={subscription.accessLink} target="_blank" rel="noreferrer" className="break-all text-xs text-sky-300 underline decoration-sky-300/30 underline-offset-4 hover:text-sky-200">{subscription.accessLink}</a> : <p className="text-xs text-gray-500">N/A</p>}
                  </div>
                </div>
              </article>
              );
            }) : vipSubscriptions.length > 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.12] px-5 py-12 text-center">
                <Search className="mx-auto h-7 w-7 text-gray-500" aria-hidden="true" />
                <h2 className="mt-3 text-base font-semibold text-white">No matching subscriptions</h2>
                <p className="mt-1 text-sm text-gray-400">Try another name, phone number, market, or status.</p>
                <button type="button" onClick={clearSubscriptionFilters} className="mt-4 text-xs font-semibold text-amber-200 hover:text-amber-100">Clear filters</button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/[0.12] px-5 py-12 text-center">
                <Users className="mx-auto h-8 w-8 text-amber-200" aria-hidden="true" />
                <h2 className="mt-3 text-base font-semibold text-white">No VIP subscriptions</h2>
                <p className="mt-1 text-sm text-gray-400">Add an existing subscription record to show it on the client dashboard.</p>
              </div>
            )}
          </section>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="market-modal-title" className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-amber-300/20 bg-[#080a08] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:p-7">
            <header className="mb-5 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h2 id="market-modal-title" className="text-lg font-bold text-white">{editingMarketId ? 'Edit market package' : 'Add market package'}</h2>
                <p className="mt-1 text-xs text-gray-400">These fields are shown on the client VIP packages page.</p>
              </div>
              <button type="button" onClick={closeMarketModal} aria-label="Close dialog" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <form onSubmit={handleSaveMarket} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs font-medium text-gray-300">
                  Market name
                  <input required value={marketForm.name} onChange={(event) => setMarketForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-amber-300/50" />
                </label>
                <label className="space-y-1.5 text-xs font-medium text-gray-300">
                  Badge
                  <input required value={marketForm.badge} onChange={(event) => setMarketForm((current) => ({ ...current, badge: event.target.value }))} className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-amber-300/50" />
                </label>
              </div>

              <label className="block space-y-1.5 text-xs font-medium text-gray-300">
                Description
                <textarea required rows={3} value={marketForm.description} onChange={(event) => setMarketForm((current) => ({ ...current, description: event.target.value }))} className="w-full resize-y rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm leading-relaxed text-white outline-none transition-colors focus:border-amber-300/50" />
              </label>

              <label className="block space-y-1.5 text-xs font-medium text-gray-300">
                Features <span className="font-normal text-gray-500">(one per line)</span>
                <textarea required rows={5} value={marketForm.features} onChange={(event) => setMarketForm((current) => ({ ...current, features: event.target.value }))} className="w-full resize-y rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm leading-relaxed text-white outline-none transition-colors focus:border-amber-300/50" />
              </label>

              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-200">Pricing plans</legend>
                {marketForm.pricing.map((plan, index) => (
                  <div key={index} className="grid gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] lg:items-end">
                    <label className="space-y-1 text-[11px] text-gray-400">Duration<input required value={plan.duration} onChange={(event) => updatePricing(index, 'duration', event.target.value)} className="mt-1 w-full rounded-md border border-white/[0.1] bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-amber-300/50" /></label>
                    <label className="space-y-1 text-[11px] text-gray-400">Price PKR<input required value={plan.pricePKR} onChange={(event) => updatePricing(index, 'pricePKR', event.target.value)} className="mt-1 w-full rounded-md border border-white/[0.1] bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-amber-300/50" /></label>
                    <label className="space-y-1 text-[11px] text-gray-400">Price USD<input required value={plan.priceUSD} onChange={(event) => updatePricing(index, 'priceUSD', event.target.value)} className="mt-1 w-full rounded-md border border-white/[0.1] bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-amber-300/50" /></label>
                    <label className="space-y-1 text-[11px] text-gray-400">Discount<input value={plan.discount} onChange={(event) => updatePricing(index, 'discount', event.target.value)} className="mt-1 w-full rounded-md border border-white/[0.1] bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-amber-300/50" /></label>
                    <label className="flex min-h-10 items-center gap-2 text-xs text-gray-300"><input type="checkbox" checked={Boolean(plan.isPopular)} onChange={(event) => updatePricing(index, 'isPopular', event.target.checked)} className="accent-amber-300" />Popular</label>
                    <button type="button" disabled={marketForm.pricing.length === 1} onClick={() => setMarketForm((current) => ({ ...current, pricing: current.pricing.filter((_, planIndex) => planIndex !== index) }))} aria-label={`Remove ${plan.duration || 'pricing'} plan`} className="flex h-9 w-9 items-center justify-center rounded-md text-rose-300 transition-colors hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-30">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setMarketForm((current) => ({ ...current, pricing: [...current.pricing, { duration: '', pricePKR: '', priceUSD: '', discount: '', isPopular: false }] }))} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.1] px-3 text-xs font-medium text-gray-300 transition-colors hover:border-amber-300/30 hover:text-amber-200">
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add pricing plan
                </button>
              </fieldset>

              <footer className="flex flex-col-reverse gap-2 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeMarketModal} className="min-h-10 rounded-lg border border-white/[0.1] px-4 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.05]">Cancel</button>
                <button type="submit" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-bold text-black transition-colors hover:bg-amber-200">
                  <Save className="h-4 w-4" aria-hidden="true" /> Save package
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isSubscriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="subscription-modal-title" className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-amber-300/20 bg-[#080a08] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:p-7">
            <header className="mb-5 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h2 id="subscription-modal-title" className="text-lg font-bold text-white">{editingSubscriptionId ? 'Edit VIP subscription' : 'Add VIP subscription'}</h2>
                <p className="mt-1 text-xs text-gray-400">Manage the same subscription fields shown on the client dashboard.</p>
              </div>
              <button type="button" onClick={closeSubscriptionModal} aria-label="Close dialog" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <form onSubmit={handleSaveSubscription} className="space-y-4">
              <label className="block space-y-1.5 text-xs font-medium text-gray-300">
                Market
                <select required value={subscriptionForm.marketId} onChange={(event) => setSubscriptionForm((current) => ({ ...current, marketId: event.target.value }))} className="w-full rounded-lg border border-white/[0.1] bg-[#10140f] px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300/50">
                  {markets.map((market) => <option key={market.id} value={market.id}>{market.name}</option>)}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs font-medium text-gray-300">Plan<input required value={subscriptionForm.plan} onChange={(event) => setSubscriptionForm((current) => ({ ...current, plan: event.target.value }))} className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300/50" /></label>
                <label className="space-y-1.5 text-xs font-medium text-gray-300">Price<input required value={subscriptionForm.price} onChange={(event) => setSubscriptionForm((current) => ({ ...current, price: event.target.value }))} className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300/50" /></label>
                <label className="space-y-1.5 text-xs font-medium text-gray-300">Start date<input required value={subscriptionForm.startDate} onChange={(event) => setSubscriptionForm((current) => ({ ...current, startDate: event.target.value }))} placeholder="YYYY-MM-DD or N/A" className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300/50" /></label>
                <label className="space-y-1.5 text-xs font-medium text-gray-300">Expiry date<input value={subscriptionForm.expiryDate} onChange={(event) => setSubscriptionForm((current) => ({ ...current, expiryDate: event.target.value }))} placeholder="YYYY-MM-DD or blank" className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300/50" /></label>
              </div>

              <label className="block space-y-1.5 text-xs font-medium text-gray-300">
                Status
                <select value={subscriptionForm.status} onChange={(event) => setSubscriptionForm((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-lg border border-white/[0.1] bg-[#10140f] px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300/50">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <label className="block space-y-1.5 text-xs font-medium text-gray-300">Access link<input type="url" value={subscriptionForm.accessLink} onChange={(event) => setSubscriptionForm((current) => ({ ...current, accessLink: event.target.value }))} placeholder="https://t.me/..." className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300/50" /></label>

              <label className="block space-y-1.5 text-xs font-medium text-gray-300">
                Features <span className="font-normal text-gray-500">(one per line)</span>
                <textarea rows={4} value={subscriptionForm.features} onChange={(event) => setSubscriptionForm((current) => ({ ...current, features: event.target.value }))} className="w-full resize-y rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm leading-relaxed text-white outline-none focus:border-amber-300/50" />
              </label>

              <footer className="flex flex-col-reverse gap-2 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeSubscriptionModal} className="min-h-10 rounded-lg border border-white/[0.1] px-4 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.05]">Cancel</button>
                <button type="submit" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-bold text-black transition-colors hover:bg-amber-200">
                  <Save className="h-4 w-4" aria-hidden="true" /> Save subscription
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminVipManagement;
