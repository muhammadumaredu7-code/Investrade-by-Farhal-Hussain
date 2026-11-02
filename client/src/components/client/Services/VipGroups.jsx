import { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Building2,
  Globe2,
  Coins,
  CreditCard,
  QrCode,
  X,
  Lock,
  ArrowRight,
  RefreshCw,
  BellRing,
  Upload
} from 'lucide-react';


import dummyData from '../../../assets/dummyData.json';
import { useAppContext } from '../../../context/AppContext.jsx';

const VipGroups = () => {
  const data = dummyData.vipGroupsPage;
  const { vipMarkets: markets } = useAppContext();
  const [selectedMarketId, setSelectedMarketId] = useState(() => (
    markets.find((market) => market.id === 'psx')?.id || markets[0]?.id || ''
  ));
  
  // Payment Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'qr'
  const [autoRecurring, setAutoRecurring] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProofStep, setIsProofStep] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);

  // Card Form State
  const [cardDetails, setCardDetails] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // Toaster Message State
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  const currentMarket = markets.find((market) => market.id === selectedMarketId) || markets[0];

  const handlePurchaseClick = (pkg) => {
    setSelectedPackage(pkg);
    setIsProofStep(false);
    setPaymentProof(null);
    setIsModalOpen(true);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'qr' && !paymentProof) {
      triggerToast('Please upload your payment screenshot or slip to continue.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsModalOpen(false);

      if (paymentMethod === 'card' && autoRecurring) {
        triggerToast(`🎉 Subscription Active! ${selectedPackage.pricePKR} will be auto-debited monthly. Welcome to ${currentMarket.name}!`);
      } else {
        triggerToast(`✅ Payment Successful! You are now subscribed to ${currentMarket.name} (${selectedPackage.duration}).`);
      }

      // Reset Card Inputs
      setCardDetails({ name: '', cardNumber: '', expiry: '', cvv: '' });
      setPaymentProof(null);
      setIsProofStep(false);
    }, 2000);
  };

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black relative">

      {/* ---------------- TOASTER MESSAGE NOTIFICATION ---------------- */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-md p-4 rounded-2xl bg-[#081f08] border-2 border-[#a3e635] text-white shadow-[0_0_30px_rgba(163,230,53,0.6)] flex items-start gap-3 animate-in fade-in slide-in-from-top-5 duration-300">
          <BellRing className="w-6 h-6 text-[#a3e635] shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-0.5 text-xs">
            <span className="font-extrabold text-[#a3e635] block text-sm">Investrade VIP Notification</span>
            <p className="text-gray-200 leading-relaxed font-medium">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-gray-400 hover:text-white ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-14">
          
          {/* ---------------- 1. PAGE HEADER ---------------- */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(163,230,53,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Investrade <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.5)]">VIP Community</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {data.subheading}
            </p>
          </div>

          {/* ---------------- 2. MARKET SELECTOR TABS (PSX, FOREX, PMEX) ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {markets.map((market) => {
              const isSelected = selectedMarketId === market.id;
              let Icon = Building2;
              if (market.id === 'forex') Icon = Globe2;
              if (market.id === 'pmex') Icon = Coins;

              return (
                <button
                  key={market.id}
                  onClick={() => setSelectedMarketId(market.id)}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#a3e635]/20 via-[#0a2008] to-[#040e04] border-[#a3e635] shadow-[0_0_30px_rgba(163,230,53,0.35)] scale-[1.02]'
                      : 'bg-[#040e04]/80 border-[#a3e635]/20 hover:border-[#a3e635]/50 hover:bg-[#081806]'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div
                      className={`p-3 rounded-xl border ${
                        isSelected
                          ? 'bg-[#a3e635] text-black border-[#a3e635]'
                          : 'bg-[#a3e635]/10 text-[#a3e635] border-[#a3e635]/20'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        {market.id.toUpperCase()} VIP
                      </h3>
                      <p className="text-[11px] text-gray-400 font-medium">{market.badge}</p>
                    </div>
                  </div>

                  <div
                    className={`w-3.5 h-3.5 rounded-full border ${
                      isSelected
                        ? 'bg-[#a3e635] border-[#a3e635] shadow-[0_0_10px_#a3e635]'
                        : 'border-gray-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* ---------------- 3. COMMUNITY FEATURES CONTAINER ---------------- */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#a3e635]/20 pb-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-black uppercase">
                  {currentMarket.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {currentMarket.name}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {currentMarket.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {currentMarket.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#081806] border border-[#a3e635]/20 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- 4. PACKAGES & PRICING CARDS ---------------- */}
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-black text-white">Select Membership Plan</h3>
              <p className="text-xs text-gray-400">Choose your preferred duration and start getting institutional trade setups.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentMarket.pricing.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 transition-all duration-300 relative group ${
                    pkg.isPopular
                      ? 'bg-gradient-to-b from-[#0a2208] via-[#040e04] to-[#020602] border-[#a3e635] shadow-[0_0_30px_rgba(163,230,53,0.3)] scale-[1.03]'
                      : 'bg-[#040e04] border-[#a3e635]/20 hover:border-[#a3e635]/50'
                  }`}
                >
                  {pkg.discount && (
                    <span className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-[#a3e635] text-black text-[10px] font-black uppercase shadow-lg">
                      {pkg.discount}
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">
                      » {pkg.duration}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-2xl sm:text-3xl font-black text-[#a3e635]">
                        {pkg.pricePKR}
                      </div>
                      <div className="text-[11px] font-bold text-gray-400">
                        (~ {pkg.priceUSD})
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchaseClick(pkg)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] hover:from-[#bef264] hover:to-[#a3e635] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:scale-105 cursor-pointer"
                  >
                    <span>PURCHASE NOW</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* ---------------- 5. PAYMENT MODAL WITH RECURRING SWITCH & QR ---------------- */}
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#040e04] border border-[#a3e635]/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(163,230,53,0.3)] space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#a3e635]/20 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-[10px] font-black uppercase">
                  Checkout - {currentMarket.name.split(' ')[0]}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedPackage.duration} Subscription ({selectedPackage.pricePKR})
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-[#081806] text-gray-400 hover:text-white border border-[#a3e635]/30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#a3e635] text-black border-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.4)]'
                    : 'bg-[#081806] text-gray-300 border-[#a3e635]/20 hover:border-[#a3e635]/40'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'qr'
                    ? 'bg-[#a3e635] text-black border-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.4)]'
                    : 'bg-[#081806] text-gray-300 border-[#a3e635]/20 hover:border-[#a3e635]/40'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR Code</span>
              </button>
            </div>

            {/* METHOD 1: CREDIT / DEBIT CARD WITH AUTO-RECURRING SWITCH */}
            {paymentMethod === 'card' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                
                {/* Auto Recurring Toggle */}
                <div className="p-4 rounded-2xl bg-[#081806] border border-[#a3e635]/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <RefreshCw className="w-5 h-5 text-[#a3e635] animate-spin" style={{ animationDuration: '8s' }} />
                    <div>
                      <div className="text-xs font-extrabold text-white">Auto-Debit Monthly Subscription</div>
                      <div className="text-[10px] text-gray-400">Automatically cut payment every month</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoRecurring(!autoRecurring)}
                    className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                      autoRecurring ? 'bg-[#a3e635] justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-black shadow-md"></div>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Cardholder Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Muhammad Ali"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Card Number *</label>
                  <input
                    type="text"
                    required
                    maxLength="19"
                    placeholder="4532 •••• •••• 8901"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300">Expiry Date *</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300">CVV / CVC *</label>
                    <input
                      type="password"
                      required
                      maxLength="4"
                      placeholder="•••"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-[#a3e635] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(163,230,53,0.5)] hover:bg-[#84cc16] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? "Processing Security Payment..." : `Pay ${selectedPackage.pricePKR} Securely`}</span>
                </button>
              </form>
            )}

            {/* METHOD 2: SCAN QR CODE METHOD */}
            {paymentMethod === 'qr' && (
              isProofStep ? (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-1 text-center">
                    <h4 className="text-sm font-extrabold text-white">Upload Payment Proof</h4>
                    <p className="text-xs text-gray-400">Please attach a screenshot or bank payment slip.</p>
                  </div>

                  <label className="p-5 rounded-2xl bg-[#081806] border border-dashed border-[#a3e635]/40 hover:border-[#a3e635] flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-[#a3e635]" />
                    <span className="text-xs font-bold text-gray-200">
                      {paymentProof ? paymentProof.name : 'Choose screenshot or payment slip'}
                    </span>
                    <span className="text-[10px] text-gray-400">Image or PDF</span>
                    <input
                      type="file"
                      required
                      accept="image/*,.pdf"
                      onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                      className="sr-only"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-[#a3e635] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(163,230,53,0.5)] hover:bg-[#84cc16] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? 'Confirming Payment...' : 'Submit Payment Proof'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="p-4 rounded-2xl bg-white border border-[#a3e635] inline-block shadow-[0_0_25px_rgba(163,230,53,0.3)]">
                    {/* Generated Dynamic QR Code Placeholder */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Investrade_VIP_${selectedMarketId}_${selectedPackage.pricePKR}`}
                      alt="Raast / Bank Scan QR Code"
                      className="w-44 h-44 object-contain mx-auto"
                    />
                  </div>

                  <div className="space-y-1 text-xs text-gray-300">
                    <p className="font-extrabold text-white">Scan with Raast or Any Banking App</p>
                    <p className="text-[11px] text-gray-400">Title: Investrade Financial Services | Meezan Bank</p>
                    <p className="text-xs font-mono text-[#a3e635] font-black">Account: 0102030405060708</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsProofStep(true)}
                    className="w-full py-3.5 rounded-xl bg-[#a3e635] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(163,230,53,0.5)] hover:bg-[#84cc16] transition-all cursor-pointer"
                  >
                    I Have Completed The Transfer
                  </button>
                </div>
              )
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default VipGroups;