import { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Download,
  Upload,
  Globe2,
  Building2,
  CheckSquare,
  Square,
  ArrowRight,
  Printer,
  FileCheck,
  X,
  PhoneCall,
  TrendingUp,
} from 'lucide-react';

import { useAppContext } from '../../../context/AppContext.jsx';

const AccountManagement = () => {
  const {
    siteContent,
    accountManagementPdf,
    accountManagementPdfLoaded,
    accountManagementPdfError
  } = useAppContext();
  const data = siteContent.accountManagementPage;
  const copy = data?.pageCopy || {};
  const [selectedMarketId, setSelectedMarketId] = useState('forex');

  // Workflow Steps: 'terms' -> 'download_fill' -> 'success'
  const [currentStep, setCurrentStep] = useState('terms');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form & Upload States
  const [clientInfo, setClientInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    accountNumber: ''
  });
  const [signedFormFile, setSignedFormFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data?.markets?.length) return null;

  const currentMarket = data.markets.find((m) => m.id === selectedMarketId) || data.markets[0];

  const handleAcceptTerms = () => {
    if (!termsAccepted) return;
    setCurrentStep('download_fill');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSignedFormFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!signedFormFile) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setCurrentStep('success');
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 2500);
  };

  const handleDownloadForm = () => {
    if (!accountManagementPdf?.file) return;

    const url = URL.createObjectURL(accountManagementPdf.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = accountManagementPdf.name;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-12">
          
          {/* ---------------- 1. PAGE HEADER ---------------- */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(163,230,53,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {copy.brandPrefix} <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.5)]">{data.heading || 'Account Management'}</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {data.subheading}
            </p>
          </div>

          {/* ---------------- 2. MARKET SELECTOR TABS (FOREX vs PSX) ---------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {data.markets.map((market) => {
              const isSelected = currentMarket.id === market.id;
              const Icon = market.id === 'forex' ? Globe2 : Building2;

              return (
                <button
                  key={market.id}
                  onClick={() => {
                    setSelectedMarketId(market.id);
                    setCurrentStep('terms');
                    setTermsAccepted(false);
                    setSignedFormFile(null);
                  }}
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
                        {market.shortName || market.name} {copy.marketManagementSuffix}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-medium">{market.badge}</p>
                      {market.description && <p className="mt-1 text-left text-[10px] leading-relaxed text-gray-500">{market.description}</p>}
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

          {/* ---------------- 3. STEP 1: TERMS & CONDITIONS REVIEW ---------------- */}
          {currentStep === 'terms' && (
            <div className="p-6 sm:p-10 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl space-y-8 animate-in fade-in duration-300">
              
              <div className="border-b border-[#a3e635]/20 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase">
                    {copy.stepOneLabel}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                    {currentMarket.name} {copy.termsHeadingSuffix}
                  </h2>
                </div>

                <div className="p-3 rounded-2xl bg-[#081806] border border-[#a3e635]/30 text-xs font-extrabold text-[#a3e635] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{copy.profitSplitLabel}: {currentMarket.profitSharing}</span>
                </div>
              </div>

              {/* Specs Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#081806] border border-[#a3e635]/20">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">{copy.minimumEquityLabel}</div>
                  <div className="text-base font-black text-white">{currentMarket.minEquity}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#081806] border border-[#a3e635]/20">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">{copy.targetReturnLabel}</div>
                  <div className="text-base font-black text-[#a3e635]">{currentMarket.targetReturn}</div>
                </div>
              </div>

              {/* Legal Terms Box */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#a3e635]" />
                  {copy.clausesHeading}
                </h3>

                <div className="p-5 rounded-2xl bg-[#020802] border border-[#a3e635]/20 space-y-3 max-h-72 overflow-y-auto">
                  {currentMarket.terms.map((term, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-gray-300 leading-relaxed border-b border-[#a3e635]/10 pb-2.5 last:border-0">
                      <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accept Terms Checkbox */}
              <div
                onClick={() => setTermsAccepted(!termsAccepted)}
                className="p-4 rounded-2xl bg-[#081806] border border-[#a3e635]/30 flex items-center gap-3 cursor-pointer hover:border-[#a3e635] transition-colors"
              >
                {termsAccepted ? (
                  <CheckSquare className="w-5 h-5 text-[#a3e635]" />
                ) : (
                  <Square className="w-5 h-5 text-gray-500" />
                )}
                <span className="text-xs font-bold text-gray-200">
                  {copy.termsConsent} {currentMarket.name}.
                </span>
              </div>

              <button
                onClick={handleAcceptTerms}
                disabled={!termsAccepted}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(163,230,53,0.4)] hover:scale-105 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{copy.acceptTermsButton}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

            </div>
          )}

          {/* ---------------- 4. STEP 2: PRINT, FILL, SIGN & UPLOAD ---------------- */}
          {currentStep === 'download_fill' && (
            <div className="p-6 sm:p-10 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl space-y-8 animate-in fade-in duration-300">
              
              <div className="border-b border-[#a3e635]/20 pb-6">
                <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase">
                  {copy.stepTwoLabel}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {copy.agreementHeading}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {copy.agreementInstructions}
                </p>
              </div>

              {/* Action Box: Download Printable Form */}
              <div className="p-6 rounded-2xl bg-[#081806] border border-[#a3e635]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1">
                  <div className="text-sm font-black text-white flex items-center gap-2">
                    <Printer className="w-4 h-4 text-[#a3e635]" />
                    <span>{copy.downloadSectionHeading}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {copy.downloadInstructions}
                    {accountManagementPdfLoaded && accountManagementPdf && (
                      <span className="mt-1 block text-[10px] text-[#a3e635]">{accountManagementPdf.name}</span>
                    )}
                    {accountManagementPdfLoaded && !accountManagementPdf && (
                      <span className="mt-1 block text-[10px] text-amber-200">{copy.agreementPdfUnavailable}</span>
                    )}
                    {!accountManagementPdfLoaded && <span className="mt-1 block text-[10px]">Loading agreement PDF...</span>}
                    {accountManagementPdfError && (
                      <span role="alert" className="mt-1 block text-[10px] text-rose-300">{accountManagementPdfError}</span>
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadForm}
                  disabled={!accountManagementPdfLoaded || !accountManagementPdf?.file || Boolean(accountManagementPdfError)}
                  className="px-6 py-3 rounded-xl bg-[#a3e635] text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#84cc16] transition-colors cursor-pointer shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="w-4 h-4" />
                  <span>{copy.downloadButton}</span>
                </button>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300">{copy.fullNameLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={copy.fullNamePlaceholder}
                      value={clientInfo.fullName}
                      onChange={(e) => setClientInfo({ ...clientInfo, fullName: e.target.value })}
                      className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300">{copy.emailLabel}</label>
                    <input
                      type="email"
                      required
                      placeholder={copy.emailPlaceholder}
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300">{copy.phoneLabel}</label>
                    <input
                      type="tel"
                      required
                      placeholder={copy.phonePlaceholder}
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-300">{copy.accountNumberLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={copy.accountNumberPlaceholder}
                      value={clientInfo.accountNumber}
                      onChange={(e) => setClientInfo({ ...clientInfo, accountNumber: e.target.value })}
                      className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>
                </div>

                {/* File Upload Container */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 block">
                    {copy.uploadLabel}
                  </label>

                  {signedFormFile ? (
                    <div className="p-4 rounded-xl bg-[#a3e635]/15 border border-[#a3e635]/50 flex items-center justify-between text-xs text-white">
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="w-5 h-5 text-[#a3e635] shrink-0" />
                        <span className="truncate font-bold">{signedFormFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSignedFormFile(null)}
                        className="p-1 rounded-lg bg-black/40 hover:bg-black text-gray-300 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="p-8 rounded-2xl bg-[#081806] border-2 border-dashed border-[#a3e635]/30 hover:border-[#a3e635] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                      <Upload className="w-8 h-8 text-[#a3e635] group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-extrabold text-gray-200">
                        {copy.uploadButton}
                      </span>
                      <span className="text-[10px] text-gray-500">{copy.uploadRequirements}</span>
                      <input type="file" required accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('terms')}
                    className="px-6 py-3.5 rounded-xl bg-[#081806] border border-[#a3e635]/30 text-gray-300 font-bold text-xs hover:text-white cursor-pointer"
                  >
                    {copy.backButton}
                  </button>

                  <button
                    type="submit"
                    disabled={isUploading || !signedFormFile}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-40"
                  >
                    {isUploading ? copy.uploadingButton : copy.submitButton}
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ---------------- 5. STEP 3: SUCCESS CONFIRMATION ---------------- */}
          {currentStep === 'success' && (
            <div className="p-8 sm:p-12 rounded-3xl bg-[#040e04] border border-[#a3e635]/50 text-center space-y-6 shadow-[0_0_60px_rgba(163,230,53,0.3)] animate-in fade-in duration-500 max-w-2xl mx-auto">
              <div className="p-4 rounded-full bg-[#a3e635]/15 border border-[#a3e635]/40 text-[#a3e635] w-fit mx-auto animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 text-[#a3e635] text-[10px] font-black uppercase">
                  {copy.submissionBadge}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  {copy.successHeading}
                </h2>
                <p className="text-sm text-[#a3e635] font-extrabold">
                  {copy.successSubheading}
                </p>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                {copy.successDescription}
              </p>

              <div className="p-4 rounded-2xl bg-[#081806] border border-[#a3e635]/20 flex items-center justify-center gap-3 text-xs text-gray-300">
                <PhoneCall className="w-4 h-4 text-[#a3e635]" />
                <span>{copy.priorityHelplineLabel}: <strong>{copy.priorityHelplineNumber}</strong></span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setCurrentStep('terms');
                    setTermsAccepted(false);
                    setSignedFormFile(null);
                  }}
                  className="px-8 py-3 rounded-2xl bg-[#a3e635] text-black font-extrabold text-xs hover:bg-[#84cc16] transition-colors cursor-pointer"
                >
                  {copy.submitAnotherButton}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AccountManagement;