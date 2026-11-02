import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Globe2,
  Building2,
  Coins,
  ArrowRight,
  FileText,
  Zap,
  Wallet,
  Lock,
  X,
  ExternalLink,
  UserCheck,
  Briefcase,
  GraduationCap,
  House,
  UserRound,
  Check
} from 'lucide-react';

import { useAppContext } from '../../../context/AppContext';

const occupationIconMap = {
  BriefcaseBusiness: Briefcase,
  GraduationCap,
  House,
  UserRound
};

const AccountOpening = () => {
  const navigate = useNavigate();
  const { addAccountRequest, siteContent } = useAppContext();
  const pageData = siteContent.accountOpeningPage;
  const occupationOptions = pageData.occupationOptions || [];
  const [selectedMarketId, setSelectedMarketId] = useState('forex');

  // PSX Selection Modal State
  const [isPsxModalOpen, setIsPsxModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedOccupations, setSelectedOccupations] = useState([]);
  const [requestForm, setRequestForm] = useState(() => Object.fromEntries(
    (pageData?.requestFields || []).map((field) => [field.key, ''])
  ));



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!pageData?.markets?.length) return null;

  const currentMarket =
    pageData.markets.find((m) => m.id === selectedMarketId) || pageData.markets[0];

  const getRequestFieldValue = (fieldId) => {
    const field = pageData.requestFields?.find((item) => item.id === fieldId);
    return field ? requestForm[field.key] || '' : '';
  };

  // Primary Button Click Handler
  const handleProceedClick = () => {
    if (selectedMarketId === 'psx') setIsPsxModalOpen(true);
    else setIsRequestModalOpen(true);
  };

  const handleExternalRequestSubmit = (event) => {
    event.preventDefault();
    const referralUrl = currentMarket.registrationUrl?.trim()
      || (selectedMarketId === 'forex'
        ? pageData.referralLinks.exnessIb
        : selectedMarketId === 'pmex' ? pageData.referralLinks.pmexPortal : '');
    if (!referralUrl) {
      toast.error('Registration link is not configured for this market. Please contact our team.');
      return;
    }

    try {
      addAccountRequest({
        market: currentMarket.name,
        marketId: selectedMarketId,
        accountType: currentMarket.accountType || `${currentMarket.name} account`,
        fullName: getRequestFieldValue('fullName').trim(),
        email: getRequestFieldValue('email').trim(),
        phone: getRequestFieldValue('phone').trim(),
        message: getRequestFieldValue('message').trim(),
        formResponses: requestForm,
        source: 'Account opening page'
      });
      window.open(referralUrl, '_blank', 'noopener,noreferrer');
      setIsRequestModalOpen(false);
      setRequestForm(Object.fromEntries((pageData.requestFields || []).map((field) => [field.key, ''])));
      toast.success('Request received. Your broker registration page is opening.');
    } catch (error) {
      console.error('Unable to submit account request.', error);
      toast.error('Your request could not be saved. Please try again.');
    }
  };

  const toggleOccupation = (occupationId) => {
    setSelectedOccupations((current) =>
      current.includes(occupationId)
        ? current.filter((id) => id !== occupationId)
        : [...current, occupationId]
    );
  };

  const isSaahulatEligible = selectedOccupations.some((occupation) =>
    occupationOptions.some((option) => option.id === occupation && option.eligibleTypes?.includes('sahulat'))
  );
  const isNormalEligible = selectedOccupations.some((occupation) =>
    occupationOptions.some((option) => option.id === occupation && option.eligibleTypes?.includes('normal'))
  );

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">

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
              <span>{pageData.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.5)]">
                {pageData.heading}
              </span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {pageData.subheading}
            </p>
          </div>

          {/* ---------------- 2. MARKET SELECTOR TABS (PSX, FOREX, PMEX) ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {pageData.markets.map((market) => {
              const isSelected = currentMarket.id === market.id;
              let Icon = Globe2;
              if (market.id === 'psx') Icon = Building2;
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
                        {market.name.split(' ')[0]}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-medium">{market.badge}</p>
                    </div>
                  </div>

                  <div
                    className={`w-3 h-3 rounded-full border ${
                      isSelected
                        ? 'bg-[#a3e635] border-[#a3e635] shadow-[0_0_10px_#a3e635]'
                        : 'border-gray-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* ---------------- 3. DETAILED MARKET REQUIREMENTS CARD ---------------- */}
          <div className="relative group max-w-5xl mx-auto">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#a3e635]/30 via-[#bef264]/20 to-[#84cc16]/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>

            <div className="relative rounded-3xl bg-[#040e04]/95 border border-[#a3e635]/35 p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl space-y-10">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#a3e635]/20 pb-8">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-black uppercase">
                    {currentMarket.badge}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">
                    {currentMarket.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                    {currentMarket.description}
                  </p>
                </div>

                <button
                  onClick={handleProceedClick}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] hover:from-[#bef264] hover:to-[#a3e635] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_30px_rgba(163,230,53,0.4)] hover:scale-105 shrink-0 cursor-pointer"
                >
                  <span>Proceed Account Registration</span>
                  {selectedMarketId === 'forex' ? (
                    <ExternalLink className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#081806] border border-[#a3e635]/20 flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-[#a3e635] shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Min Initial Deposit</div>
                    <div className="text-sm font-black text-white">{currentMarket.minDeposit}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#081806] border border-[#a3e635]/20 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-[#a3e635] shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Execution Speed</div>
                    <div className="text-sm font-black text-white">{currentMarket.executionSpeed}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#081806] border border-[#a3e635]/20 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-[#a3e635] shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Leverage / Margin</div>
                    <div className="text-sm font-black text-white">{currentMarket.maxLeverage}</div>
                  </div>
                </div>
              </div>

              {/* Requirements & Benefits Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Requirements Checklist */}
                <div className="p-6 rounded-2xl bg-[#020802] border border-[#a3e635]/20 space-y-4">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#a3e635]" />
                    Document Requirements
                  </h3>
                  <div className="space-y-3">
                    {currentMarket.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Benefits */}
                <div className="p-6 rounded-2xl bg-[#020802] border border-[#a3e635]/20 space-y-4">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#a3e635]" />
                    Account Features & Benefits
                  </h3>
                  <div className="space-y-3">
                    {currentMarket.benefits.map((ben, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ---------------- 4. PSX OCCUPATION CLASSIFIER MODAL ---------------- */}
      {isPsxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#040e04] border border-[#a3e635]/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(163,230,53,0.3)] space-y-6">
            <div className="flex items-center justify-between border-b border-[#a3e635]/20 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-[10px] font-black uppercase">
                  PSX Account Classifier
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Select Your Employment Status
                </h3>
              </div>
              <button
                onClick={() => setIsPsxModalOpen(false)}
                className="p-2 rounded-xl bg-[#081806] text-gray-400 hover:text-white border border-[#a3e635]/30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Occupation Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-300">Select all occupations that apply</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {occupationOptions.map((item) => {
                  const ItemIcon = occupationIconMap[item.icon] || UserCheck;
                  const isSelected = selectedOccupations.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleOccupation(item.id)}
                      aria-pressed={isSelected}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#a3e635]/20 border-[#a3e635] text-white shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                          : 'bg-[#081806] border-[#a3e635]/20 text-gray-300 hover:border-[#a3e635]/50'
                      }`}
                    >
                      <ItemIcon className={`w-5 h-5 ${isSelected ? 'text-[#a3e635]' : 'text-gray-400'}`} />
                      <span className="text-xs font-extrabold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Dynamic Account Recommendation Box */}
            {selectedOccupations.length > 0 && (
              <div className="pt-2 animate-in fade-in duration-300">
                {isSaahulatEligible && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#a3e635]/15 via-[#082006] to-[#040e04] border border-[#a3e635]/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#a3e635] text-black text-[10px] font-black uppercase">
                        Recommended: PSX Saahulat Account
                      </span>
                      <Check className="w-5 h-5 text-[#a3e635]" />
                    </div>

                    <h4 className="text-base font-black text-white">Simplified Account Opening (No Income Proof Needed)</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Based on your selected occupations ({selectedOccupations.map((occupation) => occupationOptions.find((item) => item.id === occupation)?.label).join(', ')}), you may be eligible for a PSX Saahulat Account. Review the official requirements before applying.
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => navigate('/psx-registration?type=sahulat')}
                        className="w-full py-3 rounded-xl bg-[#a3e635] text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#84cc16] transition-colors cursor-pointer"
                      >
                        <span>Open PSX Saahulat Account Now</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {isNormalEligible && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/15 via-[#04121a] to-[#040e04] border border-sky-400/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-sky-400 text-black text-[10px] font-black uppercase">
                        Recommended: PSX Normal Trading Account
                      </span>
                      <Check className="w-5 h-5 text-sky-400" />
                    </div>

                    <h4 className="text-base font-black text-white">Full Standard Trading Account (Unlimited Limits)</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Based on your selected occupations ({selectedOccupations.map((occupation) => occupationOptions.find((item) => item.id === occupation)?.label).join(', ')}), you may be eligible for a PSX Normal / Regular Account. Review the official requirements before applying.
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => navigate('/psx-registration?type=normal')}
                        className="w-full py-3 rounded-xl bg-sky-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-sky-300 transition-colors cursor-pointer"
                      >
                        <span>Open PSX Normal Account Now</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md">
          <form
            onSubmit={handleExternalRequestSubmit}
            className="relative my-auto w-full max-w-xl space-y-5 rounded-3xl border border-[#a3e635]/35 bg-[#040e04] p-5 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#a3e635]/15 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#a3e635]">Account assistance request</span>
                <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">{currentMarket.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">
                  Share your contact details before continuing to the external registration portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                aria-label="Close request form"
                className="rounded-xl border border-white/10 p-2 text-gray-400 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(pageData.requestFields || []).map((field) => (
                <label key={field.id || field.key} className={`space-y-1.5 text-xs font-semibold text-gray-300 ${field.type === 'textarea' || field.key === 'fullName' ? 'sm:col-span-2' : ''}`}>
                  {field.label} {field.required ? '*' : <span className="font-normal text-gray-500">(optional)</span>}
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={requestForm[field.key] || ''}
                      onChange={(event) => setRequestForm((current) => ({ ...current, [field.key]: event.target.value }))}
                      className="w-full resize-y rounded-xl border border-white/10 bg-[#081806] px-4 py-3 text-sm text-white outline-none transition focus:border-[#a3e635]/60"
                    />
                  ) : (
                    <input
                      required={field.required}
                      type={['text', 'email', 'tel'].includes(field.type) ? field.type : 'text'}
                      autoComplete={field.autocomplete || 'off'}
                      placeholder={field.placeholder}
                      value={requestForm[field.key] || ''}
                      onChange={(event) => setRequestForm((current) => ({ ...current, [field.key]: event.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-[#081806] px-4 py-3 text-sm text-white outline-none transition focus:border-[#a3e635]/60"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] p-3 text-[11px] leading-relaxed text-gray-300">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
              We only save these contact and account-request details in this browser session. Do not enter identity or bank details here.
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a3e635] px-5 py-3 text-sm font-extrabold text-black transition hover:bg-[#bef264]"
            >
              Submit request and continue
              <ExternalLink className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default AccountOpening;