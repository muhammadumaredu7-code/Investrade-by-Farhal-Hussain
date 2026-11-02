import { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  HelpCircle,
  ChevronDown,
  Headphones,
  Languages
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';
import { getContentIcon } from './ContentIcons.jsx';

const Contact = () => {
  const { siteContent } = useAppContext();
  const data = siteContent.contactPage;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 4000);
  };

  if (!data) return null;

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          {/* ---------------- 1. PAGE HEADER ---------------- */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(163,230,53,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {data.heading.split('Investrade')[0]}{' '}
              <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.5)]">
                Investrade
              </span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {data.subheading}
            </p>

            {/* Live Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {data.supportStats.map((stat, idx) => {
                const StatIcon = [Clock, CheckCircle2, Languages][idx % 3];
                const accent = [
                  'text-cyan-300 bg-cyan-400/10 border-cyan-300/20',
                  'text-emerald-300 bg-emerald-400/10 border-emerald-300/20',
                  'text-violet-300 bg-violet-400/10 border-violet-300/20'
                ][idx % 3];
                return (
                  <div key={stat.id} className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.015] border border-white/10 backdrop-blur-xl text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                    <div className={`w-9 h-9 rounded-xl border inline-flex items-center justify-center mb-3 ${accent}`}>
                      <StatIcon className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400 font-semibold mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------------- 2. MAIN SECTION: FORM & CONTACT INFO ---------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Direct Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                {data.contactInfo.map((info) => {
                  const IconComp = getContentIcon(info.icon);
                  const accent = {
                    Mail: 'text-rose-300 bg-rose-400/10 border-rose-300/25',
                    Phone: 'text-sky-300 bg-sky-400/10 border-sky-300/25',
                    MapPin: 'text-amber-300 bg-amber-400/10 border-amber-300/25'
                  }[info.icon] || 'text-violet-300 bg-violet-400/10 border-violet-300/25';

                  return (
                    <div
                      key={info.id}
                      className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.055] to-[#040e04]/90 border border-white/10 hover:border-white/20 transition-all duration-300 group shadow-xl backdrop-blur-xl flex items-start gap-4 hover:-translate-y-1"
                    >
                      <div className={`p-3.5 rounded-2xl border shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${accent}`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-extrabold text-white group-hover:text-gray-200 transition-colors">
                          {info.title}
                        </h4>
                        <p className="text-xs text-gray-400">{info.desc}</p>
                        <p className={`text-sm font-extrabold pt-1 ${accent.split(' ')[0]}`}>
                          {info.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0a2208] via-[#0d2e0a] to-[#0a2208] border border-[#a3e635]/40 flex items-center gap-4 shadow-2xl">
                <div className="p-3 rounded-2xl bg-[#a3e635] text-black shrink-0">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-ping"></span>
                    Support Desk: Online
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Our specialists are ready to help with your questions.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#a3e635]/30 via-[#bef264]/20 to-[#84cc16]/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>

              <div className="relative rounded-3xl bg-[#040e04]/95 border border-[#a3e635]/35 p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl space-y-6">
                <div className="space-y-2 border-b border-[#a3e635]/20 pb-4">
                  <h3 className="text-2xl font-black text-white">Send Us A Message</h3>
                  <p className="text-xs text-gray-400">Contact our team for assistance, account questions, or partnership inquiries.</p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-[#a3e635]/15 border border-[#a3e635]/50 text-center space-y-3 animate-in fade-in duration-500">
                    <CheckCircle2 className="w-12 h-12 text-[#a3e635] mx-auto" />
                    <h4 className="text-xl font-black text-white">Message Sent!</h4>
                    <p className="text-xs text-gray-300">
                      Thank you for contacting Investrade. Our team will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-300">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Juan Dela Cruz"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635] transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-300">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="juan@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-300">Inquiry Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#a3e635] transition-colors cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Funded Account Evaluation">Funded Account Evaluation</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Partnership & VIP">Partnership & VIP</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-300">Your Message *</label>
                      <textarea
                        rows="4"
                        required
                        placeholder="Write your message or question here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635] transition-colors"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] hover:from-[#bef264] hover:to-[#a3e635] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_25px_rgba(163,230,53,0.4)] hover:shadow-[0_0_35px_rgba(163,230,53,0.7)] cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ---------------- 3. FAQ ACCORDION SECTION ---------------- */}
          <div className="space-y-8 pt-8 border-t border-[#a3e635]/20">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Frequently Asked <span className="text-[#a3e635]">Questions</span>
              </h2>
              <p className="text-xs text-gray-400">Find quick answers to common questions about our services and support.</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {data.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#040e04] border border-[#a3e635]/20 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-gray-200 hover:text-[#a3e635] flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className={`w-4 h-4 shrink-0 ${['text-cyan-300', 'text-violet-300', 'text-amber-300'][idx % 3]}`} />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#a3e635] transition-transform duration-300 ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openFaq === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-400 border-t border-[#a3e635]/10 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default Contact;