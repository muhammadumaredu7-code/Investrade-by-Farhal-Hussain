import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

import ClientSidebar from '../components/client/Dashboard/Sidebar.jsx';

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'email' or 'phone' (Can be passed via router state or default to email)
  const [verifyType, setVerifyType] = useState(location.state?.type === 'phone' ? 'phone' : 'email');
  const userEmail = location.state?.email || 'your registered email';
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resendDeadline, setResendDeadline] = useState(() => Date.now() + 59000);
  const [now, setNow] = useState(() => Date.now());
  const countdown = Math.max(0, Math.ceil((resendDeadline - now) / 1000));
  const canResend = countdown === 0;

  const resetVerificationState = () => {
    setCode('');
    setErrorMsg('');
    setSuccessMsg('');
    setResendDeadline(Date.now() + 59000);
    setNow(Date.now());
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [verifyType]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setErrorMsg('Please enter a valid 6-digit verification code.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const isPasswordFlow = location.state?.flow === 'change-password';
      const successText = isPasswordFlow
        ? '✅ Password verification complete. You can now update your password.'
        : `🎉 ${verifyType.toUpperCase()} Code verified successfully! Redirecting...`;

      setSuccessMsg(successText);
      setTimeout(() => {
        navigate('/edit-profile', {
          state: isPasswordFlow
            ? { passwordVerified: true, toast: 'Password verification complete. You can now update your password.' }
            : undefined,
        });
      }, 1500);
    }, 1500);
  };

  const handleResendCode = () => {
    setResendDeadline(Date.now() + 59000);
    setNow(Date.now());
    setErrorMsg('');
    setSuccessMsg(`A new ${verifyType.toUpperCase()} security code has been requested.`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020602] text-white selection:bg-cyan-300 selection:text-black">
      <ClientSidebar />

      <main className="relative z-10 flex min-h-screen w-full min-w-0 items-center justify-center px-4 pb-10 pt-20 sm:px-6 lg:ml-72 lg:w-[calc(100%-18rem)] lg:px-8 lg:py-10">
        
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[min(800px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-500/10 via-violet-500/10 to-emerald-500/10 blur-[150px]"></div>

        {/* Cyber Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-25 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"></div>

        <div className="relative z-10 w-full max-w-lg space-y-5 sm:space-y-6">
          
          {/* Back Navigation */}
          <button
            onClick={() => navigate('/edit-profile')}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-gray-300 transition-all hover:border-cyan-300/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
          >
            <ArrowLeft className="h-4 w-4 text-cyan-300" />
            <span>Back to Profile Settings</span>
          </button>

          {/* Success Toaster */}
          {(successMsg || errorMsg) && (
            <div role={errorMsg ? 'alert' : 'status'} aria-live="polite" className={`flex items-center gap-3 rounded-2xl border p-4 text-white animate-in fade-in slide-in-from-top-4 duration-300 ${errorMsg ? 'border-rose-300/30 bg-rose-400/10' : 'border-emerald-300/30 bg-emerald-400/10'}`}>
              {errorMsg
                ? <XCircle className="h-6 w-6 shrink-0 text-rose-300" />
                : <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-300" />}
              <p className="text-xs font-extrabold">{errorMsg || successMsg}</p>
            </div>
          )}

          {/* Verification Card */}
          <div className="space-y-6 rounded-3xl border border-violet-300/20 bg-gradient-to-br from-[#09131b]/95 via-[#0b0b17]/95 to-[#120b18]/95 p-5 text-center shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:space-y-7 sm:p-8">
            
            <div className="space-y-2">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-400/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-200">
                <Sparkles className="h-3 w-3 text-violet-300" />
                <span>End-to-End Security</span>
              </div>

              <h2 className="text-2xl font-black text-white sm:text-3xl">
                {verifyType === 'email' ? 'Email Code Verification' : 'Phone Code Verification'}
              </h2>

              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Enter the 6-digit security code sent to {verifyType === 'email' ? userEmail : 'your registered phone number'} to confirm changes.
              </p>
              {verifyType === 'email' && (
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-500/5 px-3 py-2 text-[11px] font-bold text-cyan-200">
                  {userEmail}
                </div>
              )}
            </div>

            {/* Type Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => {
                  setVerifyType('email');
                  resetVerificationState();
                }}
                aria-pressed={verifyType === 'email'}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all focus:outline-none focus:ring-2 focus:ring-white/30 ${
                  verifyType === 'email'
                    ? 'bg-gradient-to-r from-sky-300 to-cyan-300 text-[#061116] shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <Mail className={`h-3.5 w-3.5 ${verifyType === 'email' ? 'text-sky-800' : 'text-sky-300'}`} />
                <span>Email Code</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVerifyType('phone');
                  resetVerificationState();
                }}
                aria-pressed={verifyType === 'phone'}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all focus:outline-none focus:ring-2 focus:ring-white/30 ${
                  verifyType === 'phone'
                    ? 'bg-gradient-to-r from-violet-300 to-fuchsia-300 text-[#12091a] shadow-[0_0_15px_rgba(192,132,252,0.2)]'
                    : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <Phone className={`h-3.5 w-3.5 ${verifyType === 'phone' ? 'text-violet-800' : 'text-violet-300'}`} />
                <span>Phone SMS</span>
              </button>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="verification-code" className="block text-xs font-bold text-gray-300">
                  Enter 6-Digit {verifyType === 'email' ? 'Email' : 'SMS'} Code
                </label>
                <input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  required
                  autoComplete="one-time-code"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  aria-describedby="verification-code-help"
                  placeholder="••••••"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full rounded-2xl border border-cyan-300/25 bg-[#080d15] px-4 py-4 text-center font-mono text-2xl font-black tracking-[0.5em] text-cyan-200 shadow-inner outline-none transition placeholder:text-gray-600 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10 sm:text-3xl"
                />
                <p id="verification-code-help" className="text-[10px] text-gray-500">Use the 6-digit code sent to your registered {verifyType}.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 py-4 text-xs font-extrabold text-[#071018] shadow-[0_0_25px_rgba(56,189,248,0.2)] transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-200/50 disabled:cursor-wait disabled:opacity-50 sm:text-sm"
              >
                <span>{isLoading ? "Verifying Code..." : "Verify & Authorize Changes"}</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Resend Timer / Action */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-gray-400">
              <span>{canResend ? "Didn't receive the code?" : "You can request a new code in"}</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-extrabold text-cyan-200 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Code</span>
                </button>
              ) : (
                <span className="font-mono font-bold text-gray-300">00:{String(countdown).padStart(2, '0')}</span>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default VerifyCode;