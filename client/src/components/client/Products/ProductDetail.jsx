import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Cpu,
  ArrowLeft,
  X,
  Package,
  CreditCard,
  QrCode,
  Lock,
  Upload
} from 'lucide-react';

import { useAppContext } from '../../../context/AppContext.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useAppContext();
  const product = products.find((item) => item.id === id) || products[0] || null;
  const [planSelection, setPlanSelection] = useState(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProofStep, setIsProofStep] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return null;

  const pricingPlans = Array.isArray(product.pricingPlans) && product.pricingPlans.length
    ? product.pricingPlans
    : [{ id: 'standard', duration: 'Standard', pricePKR: product.pricePKR, priceUSD: product.priceUSD }];
  const selectedPlanId = planSelection?.productId === product.id ? planSelection.planId : null;
  const selectedPlan = pricingPlans.find((plan) => plan.id === selectedPlanId) || pricingPlans[0];

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'qr' && !paymentProof) return;
    setIsProcessing(true);
    window.setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  const openPurchaseModal = () => {
    setIsSuccess(false);
    setIsProofStep(false);
    setPaymentProof(null);
    setPaymentMethod('card');
    setIsPurchaseModalOpen(true);
  };

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-10">
          
          {/* Back Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#040e04] border border-[#a3e635]/20 text-xs font-bold text-gray-300 hover:text-white hover:border-[#a3e635]/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#a3e635]" />
              <span>Back to All Products</span>
            </Link>
            <Link
              to="/dashboard/products"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08] px-4 py-2 text-xs font-bold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
            >
              <Package className="h-4 w-4" />
              My subscribed products
            </Link>
          </div>

          {/* ---------------- 1. PRODUCT HEADER & BANNER ---------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-black uppercase">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-[#a3e635] text-black text-[10px] font-black uppercase shadow-lg">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {product.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {product.shortDesc}
              </p>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#040e04] border border-[#a3e635]/20">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Accuracy / Win-Rate</div>
                  <div className="text-base font-black text-[#a3e635]">{product.winRate}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#040e04] border border-[#a3e635]/20">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Active Users</div>
                  <div className="text-base font-black text-white">{product.subscribers}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#040e04] border border-[#a3e635]/20 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Price</div>
                  <div className="text-base font-black text-[#a3e635]">{selectedPlan.pricePKR}</div>
                </div>
              </div>
            </div>

            {/* Product Media Card */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#a3e635]/30 to-[#84cc16]/30 rounded-3xl blur-xl opacity-75"></div>
              <div className="relative rounded-3xl overflow-hidden border border-[#a3e635]/40 shadow-2xl h-80">
                <img
                  src={product.mediaUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>

          {/* ---------------- 2. DETAILED SPECS & FEATURES ---------------- */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl space-y-8">
            
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-white">Product Overview & Architecture</h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed text-justify">
                {product.detailedDescription}
              </p>
            </div>

            {/* Technical Specs Grid */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#a3e635]" />
                Technical Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.specs.map((spec, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#081806] border border-[#a3e635]/20 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-bold">{spec.label}</span>
                    <span className="text-xs font-black text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#a3e635]" />
                Included Product Features
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#081806] border border-[#a3e635]/20 text-xs text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t border-[#a3e635]/20 pt-6">
              <div>
                <h3 className="text-base font-extrabold text-white">Choose your duration</h3>
                <p className="mt-1 text-xs text-gray-400">Select the subscription period and view its individual price.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pricingPlans.map((plan) => {
                  const selected = selectedPlan.id === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setPlanSelection({ productId: product.id, planId: plan.id })}
                      aria-pressed={selected}
                      className={`relative rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 ${
                        selected
                          ? 'border-[#a3e635]/60 bg-[#a3e635]/[0.08] shadow-[0_0_20px_rgba(163,230,53,0.1)]'
                          : 'border-white/10 bg-white/[0.025] hover:border-[#a3e635]/30'
                      }`}
                    >
                      {plan.isPopular && (
                        <span className="absolute right-3 top-3 rounded-full bg-violet-300/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-violet-200">
                          Popular
                        </span>
                      )}
                      <span className="block text-xs font-semibold text-gray-300">{plan.duration}</span>
                      <span className="mt-2 block text-lg font-black text-[#a3e635]">{plan.pricePKR}</span>
                      <span className="mt-0.5 block text-xs font-medium text-gray-400">{plan.priceUSD}</span>
                      {plan.discount && <span className="mt-2 block text-[10px] font-semibold text-emerald-200">{plan.discount}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Purchase Button */}
            <div className="pt-4 border-t border-[#a3e635]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-gray-400 font-bold">{selectedPlan.duration} plan</div>
                <div className="text-2xl font-black text-[#a3e635]">{selectedPlan.pricePKR} <span className="text-xs text-gray-400">({selectedPlan.priceUSD})</span></div>
              </div>

              <button
                onClick={openPurchaseModal}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] hover:from-[#bef264] hover:to-[#a3e635] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(163,230,53,0.4)] hover:scale-105 cursor-pointer"
              >
                <span>Subscribe / Purchase Now</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* ---------------- 3. PURCHASE MODAL ---------------- */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#040e04] border border-[#a3e635]/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(163,230,53,0.3)] space-y-6">
            <div className="flex items-center justify-between border-b border-[#a3e635]/20 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-[10px] font-black uppercase">
                  Checkout · {selectedPlan.duration}
                </span>
                <h3 className="text-xl font-black text-white mt-1">{product.title}</h3>
                <p className="mt-1 text-xs font-bold text-[#a3e635]">{selectedPlan.pricePKR} ({selectedPlan.priceUSD})</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPurchaseModalOpen(false)}
                aria-label="Close checkout"
                className="p-2 rounded-xl bg-[#081806] text-gray-400 hover:text-white border border-[#a3e635]/30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#a3e635] mx-auto" />
                <h4 className="text-xl font-black text-white">Demo checkout complete</h4>
                <p className="text-xs leading-relaxed text-gray-300">
                  This website currently has no payment gateway connected. No card was charged, and the payment proof was not sent or saved.
                </p>
                <button
                  type="button"
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="mt-2 rounded-xl bg-[#a3e635] px-5 py-3 text-xs font-extrabold text-black hover:bg-[#84cc16]"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', Icon: CreditCard },
                    { id: 'qr', label: 'Scan QR Code', Icon: QrCode }
                  ].map(({ id: method, label, Icon }) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(method);
                        setIsProofStep(false);
                        setPaymentProof(null);
                      }}
                      className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-xs font-black transition ${
                        paymentMethod === method
                          ? 'border-[#a3e635] bg-[#a3e635] text-black'
                          : 'border-[#a3e635]/20 bg-[#081806] text-gray-300 hover:border-[#a3e635]/40'
                      }`}
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-4">
                    <p className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-xs leading-relaxed text-amber-100">
                      <Lock className="mr-2 inline h-4 w-4 align-text-bottom" />
                      Card payment is unavailable because this site has no payment processor connected. For your security, this page will not collect card details. Use a verified payment option once configured.
                    </p>
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-gray-300">
                      Amount due: <span className="font-extrabold text-[#a3e635]">{selectedPlan.pricePKR}</span>
                    </div>
                  </div>
                ) : isProofStep ? (
                  <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                    <div className="space-y-1 text-center">
                      <h4 className="text-sm font-extrabold text-white">Upload Payment Proof</h4>
                      <p className="text-xs text-gray-400">Attach a screenshot or bank payment slip.</p>
                    </div>
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#a3e635]/40 bg-[#081806] p-5 hover:border-[#a3e635]">
                      <Upload className="h-6 w-6 text-[#a3e635]" />
                      <span className="text-xs font-bold text-gray-200">{paymentProof?.name || 'Choose screenshot or payment slip'}</span>
                      <span className="text-[10px] text-gray-400">Image or PDF</span>
                      <input type="file" required accept="image/*,.pdf" onChange={(event) => setPaymentProof(event.target.files?.[0] || null)} className="sr-only" />
                    </label>
                    <button type="submit" disabled={isProcessing || !paymentProof} className="w-full rounded-xl bg-[#a3e635] py-3.5 text-xs font-extrabold text-black hover:bg-[#84cc16] disabled:opacity-60">
                      {isProcessing ? 'Continuing...' : 'Continue demo checkout'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4 text-center">
                    <p className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-3 text-left text-[11px] leading-relaxed text-amber-100">
                      QR transfer is a demo preview only. Verify payment details with the business before sending money; this form does not submit proof.
                    </p>
                    <div className="inline-block rounded-2xl border border-[#a3e635] bg-white p-4">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Investrade_Product_${product.id}_${selectedPlan.id}_${encodeURIComponent(selectedPlan.pricePKR)}`}
                        alt="Demo payment QR code"
                        className="mx-auto h-44 w-44 object-contain"
                      />
                    </div>
                    <div className="space-y-1 text-xs text-gray-300">
                      <p className="font-extrabold text-white">Demo transfer preview</p>
                      <p className="text-[11px] text-gray-400">Title: Investrade Financial Services | Meezan Bank</p>
                      <p className="font-mono text-xs font-black text-[#a3e635]">Account: 0102030405060708</p>
                    </div>
                    <button type="button" onClick={() => setIsProofStep(true)} className="w-full rounded-xl bg-[#a3e635] py-3.5 text-xs font-extrabold text-black hover:bg-[#84cc16]">
                      I Have Completed The Transfer
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;