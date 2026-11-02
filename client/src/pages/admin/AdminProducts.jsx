import { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Search,
  BellRing,
  X,
  Save,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Clock3,
  ImagePlus,
  Upload
} from 'lucide-react';

import AdminSidebar from '../../components/admin/adminSiderbar.jsx';
import dummyData from '../../assets/dummyData.json';
import { useAppContext } from '../../context/AppContext.jsx';

const getProductPricingPlans = (product) => (
  Array.isArray(product.pricingPlans) && product.pricingPlans.length
    ? product.pricingPlans.map((plan) => ({ ...plan }))
    : [{
        id: 'standard',
        duration: 'Standard',
        pricePKR: product.pricePKR || '',
        priceUSD: product.priceUSD || '',
        discount: '',
        isPopular: false
      }]
);

const getPurchaseTimer = (purchase, now) => {
  if (purchase.status === 'PENDING') return { label: 'Starts after approval', state: 'pending' };
  if (purchase.status !== 'APPROVED' && purchase.status !== 'EXPIRED') {
    return { label: 'Not active', state: 'inactive' };
  }
  if (!purchase.expiresAt) return { label: 'Lifetime access', state: 'lifetime' };

  const expiryTime = new Date(purchase.expiresAt).getTime();
  if (!Number.isFinite(expiryTime)) return { label: 'Expiry date unavailable', state: 'unavailable' };

  const remaining = expiryTime - now;
  if (remaining <= 0) return { label: 'Expired', state: 'expired' };

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining / 3_600_000) % 24);
  const minutes = Math.floor((remaining / 60_000) % 60);
  const seconds = Math.floor((remaining / 1_000) % 60);

  return {
    label: `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`,
    state: 'active'
  };
};

const AdminProducts = () => {
  const { products, setProducts } = useAppContext();
  const data = dummyData.productsPage;
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'purchases'

  // Local State Lists for CRUD
  const [purchasesList, setPurchasesList] = useState(() => dummyData.adminProductsManagementPage?.purchases || []);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Modal State for Product Create / Edit
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Bots & Signals',
    badge: 'POPULAR',
    shortDesc: '',
    pricingPlans: [{ id: 'new-plan', duration: '', pricePKR: '', priceUSD: '', discount: '', isPopular: false }],
    winRate: '88%',
    subscribers: '100+',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    detailedDescription: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timerId = window.setInterval(() => setCurrentTime(Date.now()), 1_000);
    return () => window.clearInterval(timerId);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- PRODUCTS CRUD HANDLERS ---
  const handleOpenProductModal = (product = null) => {
    setImagePreviewError(false);
    if (product) {
      setEditingProduct(product);
      setProductForm({
        title: product.title,
        category: product.category,
        badge: product.badge || 'POPULAR',
        shortDesc: product.shortDesc,
        pricingPlans: getProductPricingPlans(product),
        winRate: product.winRate,
        subscribers: product.subscribers,
        mediaUrl: product.mediaUrl,
        detailedDescription: product.detailedDescription || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        title: '',
        category: 'Bots & Signals',
        badge: 'NEW BOT',
        shortDesc: '',
        pricingPlans: [{ id: 'new-plan', duration: '1 Month', pricePKR: '', priceUSD: '', discount: '', isPopular: false }],
        winRate: '85.0%',
        subscribers: '50+',
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
        detailedDescription: ''
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const pricingPlans = productForm.pricingPlans
      .map((plan) => ({
        ...plan,
        duration: plan.duration.trim(),
        pricePKR: plan.pricePKR.trim(),
        priceUSD: plan.priceUSD.trim(),
        discount: plan.discount.trim()
      }));

    if (!productForm.title.trim() || pricingPlans.length === 0 || pricingPlans.some((plan) => (
      !plan.duration || !plan.pricePKR || !plan.priceUSD
    ))) {
      triggerToast('Please complete the product name and every pricing plan.');
      return;
    }

    const firstPlan = pricingPlans[0];
    const productDetails = {
      ...productForm,
      title: productForm.title.trim(),
      pricingPlans,
      pricePKR: `${firstPlan.pricePKR} (${firstPlan.duration})`,
      priceUSD: `${firstPlan.priceUSD} (${firstPlan.duration})`
    };

    if (editingProduct) {
      // Update existing product
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productDetails } : p))
      );
      triggerToast('✅ Product details updated successfully!');
    } else {
      // Create new product
      const newProductObj = {
        id: `prod_${Date.now()}`,
        ...productDetails,
        features: [
          'Sub-second Telegram & Terminal Signal Delivery',
          'Automated Risk-to-Reward Calculator',
          'Compatible with MT4, MT5 & TradingView'
        ],
        specs: [
          { label: 'Latency', value: '< 10 Milliseconds' },
          { label: 'Platform', value: 'MT4 / MT5 / Webhook' }
        ]
      };
      setProducts((previousProducts) => [newProductObj, ...previousProducts]);
      triggerToast('🎉 New FinTech Product published to catalog!');
    }

    setShowProductModal(false);
  };

  const handleDeleteProduct = (id, title) => {
    if (window.confirm(`Are you sure you want to delete product "${title}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      triggerToast(`🗑️ Product "${title}" removed.`);
    }
  };

  const updatePricingPlan = (planId, field, value) => {
    setProductForm((current) => ({
      ...current,
      pricingPlans: current.pricingPlans.map((plan) => (
        plan.id === planId ? { ...plan, [field]: value } : plan
      ))
    }));
  };

  const addPricingPlan = () => {
    setProductForm((current) => ({
      ...current,
      pricingPlans: [
        ...current.pricingPlans,
        { id: `plan-${Date.now()}-${current.pricingPlans.length}`, duration: '', pricePKR: '', priceUSD: '', discount: '', isPopular: false }
      ]
    }));
  };

  const removePricingPlan = (planId) => {
    setProductForm((current) => ({
      ...current,
      pricingPlans: current.pricingPlans.filter((plan) => plan.id !== planId)
    }));
  };

  const handleProductImageUpload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast('Choose a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Product images must be 5 MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProductForm((current) => ({ ...current, mediaUrl: reader.result }));
        setImagePreviewError(false);
      }
    };
    reader.onerror = () => triggerToast('Unable to read this image. Please try another file.');
    reader.readAsDataURL(file);
  };

  // --- PURCHASES APPROVAL HANDLERS ---
  const handlePurchaseStatus = (id, newStatus) => {
    setPurchasesList((prev) =>
      prev.map((pur) => (pur.id === id ? { ...pur, status: newStatus } : pur))
    );
    triggerToast(`Purchase order marked as "${newStatus}"`);
  };

  if (!data) return null;

  // Search Filter
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPurchases = purchasesList.filter(
    (pur) =>
      pur.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pur.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pur.productTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getDisplayStatus = (purchase) => (
    purchase.status === 'APPROVED' && purchase.expiresAt
      && new Date(purchase.expiresAt).getTime() <= currentTime
      ? 'EXPIRED'
      : purchase.status
  );
  const getTimerStyle = (state) => {
    if (state === 'expired') return 'border-rose-400/25 bg-rose-400/10 text-rose-200';
    if (state === 'active') return 'border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200';
    if (state === 'lifetime') return 'border-violet-400/20 bg-violet-400/[0.07] text-violet-200';
    if (state === 'pending') return 'border-amber-400/20 bg-amber-400/[0.07] text-amber-200';
    return 'border-white/10 bg-white/[0.04] text-gray-400';
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020602] text-white selection:bg-amber-400 selection:text-black">
      {/* ---------------- 1. ADMIN SIDEBAR ---------------- */}
      <AdminSidebar />

      {/* ---------------- TOASTER ---------------- */}
      {toastMessage && (
        <div className="fixed right-4 top-24 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border-2 border-amber-400 bg-[#1c1800] p-4 text-white shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-in fade-in duration-300 sm:right-8 sm:max-w-md">
          <BellRing className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
          <p className="text-xs font-extrabold">{toastMessage}</p>
        </div>
      )}

      {/* ---------------- 2. MAIN CONTENT AREA ---------------- */}
      <main className="relative z-10 mx-auto min-h-screen w-full min-w-0 space-y-6 px-4 pb-10 pt-20 sm:space-y-8 sm:px-6 lg:ml-72 lg:w-[calc(100%-18rem)] lg:px-8 lg:pt-8 2xl:px-12">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-amber-400/20 via-yellow-500/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* ---------------- 3. PAGE HEADER ---------------- */}
        <div className="flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-amber-400/35 bg-gradient-to-r from-[#0e0c02] via-[#1c1800] to-[#0e0c02] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-7 xl:flex-row xl:items-center">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{dummyData.adminProductsManagementPage?.badge || 'Store Control'}</span>
            </div>

            <h1 className="break-words text-2xl font-black tracking-tight text-white sm:text-3xl xl:text-4xl">
              Products & Purchases Control
            </h1>

            <p className="max-w-2xl text-xs leading-relaxed text-gray-300 sm:text-sm">
              {dummyData.adminProductsManagementPage?.subheading}
            </p>
          </div>

          {activeTab === 'manage' && (
            <button
              onClick={() => handleOpenProductModal()}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 px-5 py-3.5 text-xs font-extrabold text-black shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-200 sm:w-auto sm:text-sm"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New FinTech Product</span>
            </button>
          )}
        </div>

        {/* ---------------- 4. MAIN TOGGLE TABS (Manage Products vs Purchases History) ---------------- */}
        <div className="flex min-w-0 flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="grid w-full min-w-0 grid-cols-2 gap-1.5 rounded-2xl border border-amber-400/30 bg-[#080702] p-1.5 shadow-xl lg:max-w-2xl">
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[10px] font-extrabold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-200/50 sm:gap-2 sm:px-3 sm:text-xs ${
                activeTab === 'manage'
                  ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-[1.02]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span className="truncate">Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('purchases')}
              className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[10px] font-extrabold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-200/50 sm:gap-2 sm:px-3 sm:text-xs ${
                activeTab === 'purchases'
                  ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-[1.02]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="truncate">Purchases ({purchasesList.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'manage' ? 'Search products...' : 'Search buyer email or item...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121003] border border-amber-400/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PRODUCTS MANAGEMENT (CRUD)                        */}
        {/* ======================================================== */}
        {activeTab === 'manage' && (
          <div className="grid min-w-0 grid-cols-1 gap-4 animate-in fade-in duration-300 xl:grid-cols-2 2xl:gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-3xl bg-[#080702]/90 border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Media Banner */}
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={prod.mediaUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080702] via-transparent to-transparent opacity-90"></div>

                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-extrabold border border-amber-400/30">
                      {prod.category}
                    </span>

                    {prod.badge && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase shadow-md">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                      {prod.title}
                    </h3>

                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {prod.shortDesc}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        <CalendarDays className="h-3.5 w-3.5 text-amber-300" />
                        {getProductPricingPlans(prod).length} pricing {getProductPricingPlans(prod).length === 1 ? 'option' : 'options'}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {getProductPricingPlans(prod).map((plan) => (
                          <div key={plan.id} className="min-w-0 rounded-xl border border-amber-400/15 bg-[#121003] p-2.5">
                            <span className="block truncate text-[10px] font-semibold text-gray-400">{plan.duration}</span>
                            <span className="mt-1 block truncate font-mono text-xs font-bold text-amber-300">{plan.pricePKR}</span>
                            <span className="mt-0.5 block truncate font-mono text-[10px] text-gray-300">{plan.priceUSD}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                      <span>Win Rate: <strong className="text-amber-300">{prod.winRate}</strong></span>
                      <span>Subscribers: <strong className="text-white">{prod.subscribers}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-6 py-4 border-t border-amber-400/15 bg-[#121003]/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleOpenProductModal(prod)}
                    className="flex-1 py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Product Details</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(prod.id, prod.title)}
                    title="Delete Product"
                    className="p-2.5 rounded-xl bg-[#080702] border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CLIENT PURCHASES & SUBSCRIPTIONS AUDIT            */}
        {/* ======================================================== */}
        {activeTab === 'purchases' && (
          <div className="min-w-0 space-y-5 rounded-2xl border border-amber-400/30 bg-[#080702]/90 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in duration-300 sm:space-y-6 sm:rounded-3xl sm:p-6 lg:p-8">
            <h3 className="flex items-start gap-2 border-b border-amber-400/20 pb-4 text-base font-black text-white sm:text-lg">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              Client Product Purchasing Subscriptions ({filteredPurchases.length})
            </h3>

            <div className="space-y-3 lg:hidden">
              {filteredPurchases.map((pur) => {
                const timer = getPurchaseTimer(pur, currentTime);
                const displayStatus = getDisplayStatus(pur);

                return (
                  <article key={pur.id} className="space-y-3 rounded-xl border border-amber-400/15 bg-[#121003]/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="break-words text-sm font-bold text-white">{pur.userName}</h4>
                      <p className="break-all text-[10px] text-gray-400">{pur.email}</p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-black uppercase ${
                      displayStatus === 'APPROVED'
                        ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                        : displayStatus === 'PENDING'
                          ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
                          : 'border-red-400/30 bg-red-400/10 text-red-300'
                    }`}>
                      {displayStatus}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/[0.06] pt-3 text-xs">
                    <div className="col-span-2 min-w-0">
                      <dt className="text-[10px] text-gray-500">Product</dt>
                      <dd className="break-words font-semibold text-amber-200">{pur.productTitle}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10px] text-gray-500">Amount paid</dt>
                      <dd className="break-words font-mono font-semibold text-gray-200">{pur.pricePaid}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10px] text-gray-500">Purchase date</dt>
                      <dd className="break-words text-gray-300">{pur.purchasedOn}</dd>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <dt className="text-[10px] text-gray-500">Subscription timer</dt>
                      <dd className={`mt-1 inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-bold ${getTimerStyle(timer.state)}`}>
                        {timer.state === 'active' || timer.state === 'pending' ? <Clock3 className="h-3.5 w-3.5" /> : null}
                        {timer.label}
                      </dd>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <dt className="text-[10px] text-gray-500">Payment method</dt>
                      <dd className="break-words text-gray-300">{pur.paymentMethod}</dd>
                    </div>
                  </dl>
                  {displayStatus === 'PENDING' && (
                    <div className="flex gap-2 border-t border-white/[0.06] pt-3">
                      <button
                        type="button"
                        onClick={() => handlePurchaseStatus(pur.id, 'APPROVED')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-3 py-2.5 text-xs font-bold text-black transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePurchaseStatus(pur.id, 'REJECTED')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500/15 px-3 py-2.5 text-xs font-bold text-red-200 transition hover:bg-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  )}
                  </article>
                );
              })}
              {filteredPurchases.length === 0 && (
                <p className="rounded-xl border border-white/[0.07] p-6 text-center text-sm text-gray-400">No purchases match your search.</p>
              )}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-amber-400/15 lg:block">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-amber-400/20 text-[11px] font-black uppercase text-gray-400">
                    <th className="py-3 px-4">Client Name & Email</th>
                    <th className="py-3 px-4">Purchased Product</th>
                    <th className="py-3 px-4">Amount Paid</th>
                    <th className="py-3 px-4">Method / Channel</th>
                    <th className="py-3 px-4">Purchase Date</th>
                    <th className="py-3 px-4">Subscription Timer</th>
                    <th className="py-3 px-4 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-400/10 text-xs">
                  {filteredPurchases.map((pur) => {
                    const timer = getPurchaseTimer(pur, currentTime);
                    const displayStatus = getDisplayStatus(pur);

                    return (
                      <tr key={pur.id} className="transition-colors hover:bg-[#121003]">
                      <td className="py-4 px-4">
                        <div className="font-black text-white">{pur.userName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{pur.email}</div>
                      </td>

                      <td className="py-4 px-4 font-bold text-amber-300">{pur.productTitle}</td>

                      <td className="py-4 px-4 font-mono font-bold text-white">{pur.pricePaid}</td>

                      <td className="py-4 px-4 text-gray-300">{pur.paymentMethod}</td>

                      <td className="py-4 px-4 text-gray-400 font-mono">{pur.purchasedOn}</td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-bold ${getTimerStyle(timer.state)}`}>
                          {timer.state === 'active' || timer.state === 'pending' ? <Clock3 className="h-3.5 w-3.5" /> : null}
                          {timer.label}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        {displayStatus === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePurchaseStatus(pur.id, 'APPROVED')}
                              title="Approve Subscription"
                              aria-label={`Approve ${pur.userName}'s purchase`}
                              className="p-1.5 rounded-lg bg-amber-400 text-black hover:bg-yellow-300 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePurchaseStatus(pur.id, 'REJECTED')}
                              title="Reject Purchase"
                              aria-label={`Reject ${pur.userName}'s purchase`}
                              className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                              displayStatus === 'APPROVED'
                                ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30'
                                : displayStatus === 'EXPIRED'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : 'bg-red-500/20 text-red-400 border-red-500/50'
                            }`}
                          >
                            {displayStatus}
                          </span>
                        )}
                      </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ---------------- 5. CREATE / EDIT PRODUCT MODAL ---------------- */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-5">
          <div className="relative my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col space-y-4 overflow-hidden rounded-2xl border border-amber-400/40 bg-[#080702] p-4 shadow-[0_0_50px_rgba(251,191,36,0.35)] animate-in fade-in duration-300 sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-3xl sm:p-6 lg:p-8">
            
            <button
              onClick={() => setShowProductModal(false)}
              type="button"
              aria-label="Close product form"
              className="absolute right-4 top-4 z-10 rounded-lg p-1 text-gray-400 transition hover:bg-amber-400/10 hover:text-white sm:right-6 sm:top-6"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="flex shrink-0 items-center gap-2 pr-10 text-lg font-black text-white sm:text-xl">
              <Bot className="w-5 h-5 text-amber-400" />
              {editingProduct ? 'Edit FinTech Product' : 'Add New FinTech Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="min-h-0 space-y-4 overflow-y-auto overscroll-contain pr-1 sm:pr-2">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Investrade AI Signal Engine"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Bots & Signals">Bots & Signals</option>
                    <option value="Staking & Earn">Staking & Earn</option>
                    <option value="Copy Trading">Copy Trading</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Badge Label</label>
                  <input
                    type="text"
                    placeholder="e.g. MOST POPULAR"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-amber-400/20 bg-[#0d0b03] p-4">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-white">
                    <ImagePlus className="h-4 w-4 text-amber-300" /> Product image
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
                    Upload an image up to 5 MB or paste a direct image URL.
                  </p>
                </div>

                <div className="relative h-40 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  {productForm.mediaUrl && !imagePreviewError ? (
                    <img
                      src={productForm.mediaUrl}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                      onError={() => setImagePreviewError(true)}
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-500">
                      <ImagePlus className="h-8 w-8" />
                      <span className="text-xs">Image preview</span>
                    </div>
                  )}
                  <label className="absolute bottom-3 right-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-black/75 px-3 py-2 text-xs font-bold text-white backdrop-blur transition hover:border-amber-300/40 hover:text-amber-200">
                    <Upload className="h-3.5 w-3.5" />
                    Upload image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                <label className="block space-y-1 text-[10px] font-semibold text-gray-400">
                  Image URL
                  <input
                    type="url"
                    placeholder="https://example.com/product-image.jpg"
                    value={productForm.mediaUrl}
                    onChange={(event) => {
                      setProductForm((current) => ({ ...current, mediaUrl: event.target.value }));
                      setImagePreviewError(false);
                    }}
                    className="w-full rounded-lg border border-amber-400/20 bg-[#121003] px-3 py-2 text-xs text-white outline-none focus:border-amber-300/60"
                  />
                </label>
              </div>

              <div className="space-y-3 rounded-2xl border border-amber-400/20 bg-[#0d0b03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-extrabold text-white">
                      <CalendarDays className="h-4 w-4 text-amber-300" /> Duration pricing
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
                      Set a separate PKR and USD price for every subscription duration.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addPricingPlan}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/25 bg-amber-300/[0.08] px-3 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-300/15"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add duration
                  </button>
                </div>

                <div className="space-y-3">
                  {productForm.pricingPlans.map((plan, index) => (
                    <div key={plan.id} className="grid grid-cols-1 gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-3 sm:grid-cols-2">
                      <label className="space-y-1 text-[10px] font-semibold text-gray-400">
                        Duration *
                        <input
                          type="text"
                          required
                          placeholder="e.g. 1 Month, 1 Year, Lifetime"
                          value={plan.duration}
                          onChange={(event) => updatePricingPlan(plan.id, 'duration', event.target.value)}
                          className="w-full rounded-lg border border-amber-400/20 bg-[#121003] px-3 py-2 text-xs text-white outline-none focus:border-amber-300/60"
                        />
                      </label>
                      <label className="space-y-1 text-[10px] font-semibold text-gray-400">
                        PKR price *
                        <input
                          type="text"
                          required
                          placeholder="e.g. 12,000 PKR"
                          value={plan.pricePKR}
                          onChange={(event) => updatePricingPlan(plan.id, 'pricePKR', event.target.value)}
                          className="w-full rounded-lg border border-amber-400/20 bg-[#121003] px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-300/60"
                        />
                      </label>
                      <label className="space-y-1 text-[10px] font-semibold text-gray-400">
                        USD price *
                        <input
                          type="text"
                          required
                          placeholder="e.g. $45"
                          value={plan.priceUSD}
                          onChange={(event) => updatePricingPlan(plan.id, 'priceUSD', event.target.value)}
                          className="w-full rounded-lg border border-amber-400/20 bg-[#121003] px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-300/60"
                        />
                      </label>
                      <label className="space-y-1 text-[10px] font-semibold text-gray-400">
                        Offer label
                        <input
                          type="text"
                          placeholder="e.g. Save 20%"
                          value={plan.discount || ''}
                          onChange={(event) => updatePricingPlan(plan.id, 'discount', event.target.value)}
                          className="w-full rounded-lg border border-amber-400/20 bg-[#121003] px-3 py-2 text-xs text-white outline-none focus:border-amber-300/60"
                        />
                      </label>
                      <div className="col-span-full flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 pb-2 text-[10px] font-semibold text-gray-300">
                          <input
                            type="checkbox"
                            checked={Boolean(plan.isPopular)}
                            onChange={(event) => updatePricingPlan(plan.id, 'isPopular', event.target.checked)}
                            className="accent-amber-400"
                          />
                          Popular
                        </label>
                        <button
                          type="button"
                          onClick={() => removePricingPlan(plan.id)}
                          disabled={productForm.pricingPlans.length === 1}
                          aria-label={`Remove pricing duration ${index + 1}`}
                          title={productForm.pricingPlans.length === 1 ? 'At least one pricing duration is required' : 'Remove duration'}
                          className="mb-1 rounded-lg border border-rose-400/20 p-2 text-rose-300 transition hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Win Rate</label>
                  <input
                    type="text"
                    placeholder="e.g. 88.4%"
                    value={productForm.winRate}
                    onChange={(e) => setProductForm({ ...productForm, winRate: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Subscribers Count</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,420+"
                    value={productForm.subscribers}
                    onChange={(e) => setProductForm({ ...productForm, subscribers: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Short Description *</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Brief summary..."
                  value={productForm.shortDesc}
                  onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}
                  className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sticky bottom-0 flex flex-col-reverse justify-end gap-2 border-t border-amber-400/10 bg-[#080702] pt-3 sm:flex-row sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#121003] text-gray-300 text-xs font-bold hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 hover:bg-yellow-300 transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingProduct ? 'Save Product' : 'Publish Product'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;