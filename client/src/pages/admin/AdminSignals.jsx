import { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Globe2,
  Building2,
  Coins,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  TrendingDown,
  Send,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

import AdminSidebar from '../../components/admin/adminSiderbar.jsx';
import dummyData from '../../assets/dummyData.json';
import { useAppContext } from '../../context/AppContext.jsx';

const AdminSignals = () => {
  const data = dummyData.clientDashboardSignalsPage;
  const { signals, setSignals } = useAppContext();
  const [selectedMarket, setSelectedMarket] = useState('forex'); // 'forex', 'psx', 'pmex'

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSignalId, setEditingSignalId] = useState(null);
  const [signalForm, setSignalForm] = useState({
    marketId: 'forex',
    pair: '',
    type: 'BUY / LONG',
    entry: '',
    tp1: '',
    tp2: '',
    tp3: '',
    sl: '',
    rrRatio: '1:2.5',
    status: 'ACTIVE',
    analyst: 'Master Strategist',
    notes: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const triggerToast = (msg, isError = false) => {
    const showToast = isError ? toast.error : toast.success;
    showToast(msg, { duration: 3000, position: 'top-right' });
  };

  // Filter Signals by Selected Market Tab
  const activeMarketSignals = signals.filter((s) => s.marketId === selectedMarket);

  // Open Modal for New Signal
  const handleOpenNewModal = () => {
    setEditingSignalId(null);
    setSignalForm({
      marketId: selectedMarket,
      pair: '',
      type: 'BUY / LONG',
      entry: '',
      tp1: '',
      tp2: '',
      tp3: '',
      sl: '',
      rrRatio: '1:2.5',
      status: 'ACTIVE',
      analyst: 'System Administrator',
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (signal) => {
    setEditingSignalId(signal.id);
    setSignalForm({
      marketId: signal.marketId,
      pair: signal.pair || '',
      type: signal.type || 'BUY / LONG',
      entry: signal.entry || '',
      tp1: signal.tp1 || '',
      tp2: signal.tp2 || '',
      tp3: signal.tp3 || '',
      sl: signal.sl || '',
      rrRatio: signal.rrRatio || '1:2.5',
      status: signal.status || 'ACTIVE',
      analyst: signal.analyst || '',
      notes: signal.notes || ''
    });
    setShowModal(true);
  };

  // Save/Publish Signal
  const handleSaveSignal = (e) => {
    e.preventDefault();
    if (!signalForm.pair || !signalForm.entry || !signalForm.sl) {
      triggerToast('Please fill required fields: pair, entry, and stop-loss', true);
      return;
    }

    if (editingSignalId) {
      setSignals((prev) =>
        prev.map((s) => (s.id === editingSignalId ? { ...s, ...signalForm } : s))
      );
      triggerToast('Signal updated successfully');
    } else {
      const newSignalObj = {
        id: `sig_${signalForm.marketId}_${Date.now()}`,
        ...signalForm,
        time: 'Just Now'
      };
      setSignals((current) => [newSignalObj, ...current]);
      triggerToast(`New ${signalForm.marketId.toUpperCase()} signal published`);
    }

    setEditingSignalId(null);
    setShowModal(false);
  };

  // Status Change Shortcut (ACTIVE -> TP HIT / SL HIT)
  const handleStatusChange = (id, newStatus) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    triggerToast(`Signal status marked as "${newStatus}"`);
  };

  // Delete Signal
  const handleDeleteSignal = (id) => {
    if (window.confirm('Are you sure you want to delete this signal dispatch?')) {
      setSignals((prev) => prev.filter((s) => s.id !== id));
      triggerToast('Signal removed from feed');
    }
  };

  return (
    <div className="bg-[#020602] min-h-screen text-white flex selection:bg-amber-400 selection:text-black overflow-hidden relative">
      {/* ---------------- 1. ADMIN SIDEBAR ---------------- */}
      <AdminSidebar />

      {/* ---------------- 2. MAIN CONTENT AREA ---------------- */}
      <main className="flex-1 lg:ml-72 p-4 sm:p-8 pt-20 lg:pt-8 relative z-10 space-y-8 max-w-7xl">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-amber-400/20 via-yellow-500/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* ---------------- 3. PAGE HEADER ---------------- */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0e0c02] via-[#1c1800] to-[#0e0c02] border border-amber-400/35 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data?.badge || 'Signals Console'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {data?.heading || 'Signals Manager'}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
              {data?.subheading || 'Publish new trade setups or update active signals across Forex, PSX, and PMEX.'}
            </p>
          </div>

          <button
            onClick={handleOpenNewModal}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:scale-105 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Publish New Signal</span>
          </button>
        </div>

        {/* ---------------- 4. MARKET TABS SELECTOR ---------------- */}
        <div className="grid grid-cols-3 gap-3 p-1.5 rounded-2xl bg-[#080702] border border-amber-400/30 max-w-xl shadow-xl">
          {[
            { id: 'forex', label: 'Forex & Gold', icon: Globe2 },
            { id: 'psx', label: 'PSX Stocks', icon: Building2 },
            { id: 'pmex', label: 'PMEX Commodities', icon: Coins }
          ].map((m) => {
            const IconC = m.icon;
            const isSelected = selectedMarket === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setSelectedMarket(m.id)}
                className={`py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-[1.02]'
                    : 'text-gray-400 hover:text-white bg-[#121003]'
                }`}
              >
                <IconC className="w-4 h-4" />
                <span className="uppercase">{m.id}</span>
              </button>
            );
          })}
        </div>

        {/* ---------------- 5. SIGNALS FEED ---------------- */}
        {activeMarketSignals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {activeMarketSignals.map((sig) => {
              const isBuy = sig.type.includes('BUY');
              const isActive = sig.status === 'ACTIVE';
              const isTpHit = sig.status === 'TP HIT';

              return (
                <div
                  key={sig.id}
                  className="p-6 rounded-3xl bg-[#080702]/90 border border-amber-400/30 hover:border-amber-400/60 transition-all shadow-2xl backdrop-blur-xl space-y-5"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-amber-400/15 pb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`p-2.5 rounded-2xl border text-xs font-black flex items-center gap-1.5 ${
                          isBuy
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                            : 'bg-red-500/15 text-red-400 border-red-500/40'
                        }`}
                      >
                        {isBuy ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{sig.type}</span>
                      </span>

                      <div>
                        <h3 className="text-base font-black text-white">{sig.pair}</h3>
                        <span className="text-[10px] text-gray-400 font-bold">Analyst: {sig.analyst}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                          isActive
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                            : isTpHit
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-red-500/20 text-red-400 border-red-500/50'
                        }`}
                      >
                        {sig.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(sig)}
                        aria-label={`Edit ${sig.pair} signal`}
                        title="Edit signal"
                        className="p-1.5 rounded-lg bg-[#121003] border border-amber-400/30 text-amber-300 hover:bg-amber-400 hover:text-black transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSignal(sig.id)}
                        aria-label={`Delete ${sig.pair} signal`}
                        title="Delete signal"
                        className="p-1.5 rounded-lg bg-[#121003] border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Matrix */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-[#121003] border border-amber-400/20">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Entry</div>
                      <div className="text-sm font-black text-white font-mono">{sig.entry}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#121003] border border-amber-400/20">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Stop-Loss (SL)</div>
                      <div className="text-sm font-black text-red-400 font-mono">{sig.sl}</div>
                    </div>
                  </div>

                  {/* TP Breakdown */}
                  <div className="p-3 rounded-2xl bg-[#121003] border border-amber-400/20 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-300">
                      <span>Take Profit Targets</span>
                      <span className="text-amber-400">RR: {sig.rrRatio}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-black">
                      <div className="p-2 rounded-xl bg-[#080702] border border-amber-400/30 text-amber-300">
                        <span className="text-[9px] text-gray-400 block font-sans">TP 1</span>
                        {sig.tp1}
                      </div>
                      <div className="p-2 rounded-xl bg-[#080702] border border-amber-400/30 text-amber-300">
                        <span className="text-[9px] text-gray-400 block font-sans">TP 2</span>
                        {sig.tp2}
                      </div>
                      <div className="p-2 rounded-xl bg-[#080702] border border-amber-400/30 text-amber-300">
                        <span className="text-[9px] text-gray-400 block font-sans">TP 3</span>
                        {sig.tp3}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-amber-400/10">
                    <span className="text-[10px] text-gray-400 italic truncate">"{sig.notes}"</span>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStatusChange(sig.id, 'TP HIT')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black hover:bg-emerald-500 hover:text-black cursor-pointer"
                      >
                        Mark TP HIT
                      </button>
                      <button
                        onClick={() => handleStatusChange(sig.id, 'SL HIT')}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-black hover:bg-red-500 hover:text-white cursor-pointer"
                      >
                        Mark SL HIT
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-[#080702] border border-amber-400/30 text-center space-y-4">
            <p className="text-gray-400 text-sm">No signals currently published for {selectedMarket.toUpperCase()}.</p>
            <button
              onClick={handleOpenNewModal}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs"
            >
              Dispatch First Signal
            </button>
          </div>
        )}

      </main>

      {/* ---------------- PUBLISH NEW SIGNAL MODAL ---------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#080702] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 relative shadow-[0_0_50px_rgba(251,191,36,0.35)] animate-in fade-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              {editingSignalId ? 'Edit Institutional Signal' : 'Publish Institutional Signal'}
            </h3>

            <form onSubmit={handleSaveSignal} className="space-y-3">
              {/* Market Selection Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Target Market *</label>
                <select
                  value={signalForm.marketId}
                  onChange={(e) => setSignalForm({ ...signalForm, marketId: e.target.value })}
                  className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="forex">Forex & Gold</option>
                  <option value="psx">PSX Equity Stocks</option>
                  <option value="pmex">PMEX Commodities</option>
                </select>
              </div>

              {/* Pair & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Pair / Stock *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. XAU/USD or MEBL"
                    value={signalForm.pair}
                    onChange={(e) => setSignalForm({ ...signalForm, pair: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Signal Type *</label>
                  <select
                    value={signalForm.type}
                    onChange={(e) => setSignalForm({ ...signalForm, type: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="BUY / LONG">BUY / LONG</option>
                    <option value="SELL / SHORT">SELL / SHORT</option>
                    <option value="BUY / ACCUMULATE">BUY / ACCUMULATE</option>
                  </select>
                </div>
              </div>

              {/* Entry & Stop-Loss */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Entry Price *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $2,720.50"
                    value={signalForm.entry}
                    onChange={(e) => setSignalForm({ ...signalForm, entry: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Stop-Loss (SL) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $2,708.00"
                    value={signalForm.sl}
                    onChange={(e) => setSignalForm({ ...signalForm, sl: e.target.value })}
                    className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* TPs */}
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="TP 1"
                  value={signalForm.tp1}
                  onChange={(e) => setSignalForm({ ...signalForm, tp1: e.target.value })}
                  className="bg-[#121003] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
                <input
                  type="text"
                  placeholder="TP 2"
                  value={signalForm.tp2}
                  onChange={(e) => setSignalForm({ ...signalForm, tp2: e.target.value })}
                  className="bg-[#121003] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
                <input
                  type="text"
                  placeholder="TP 3"
                  value={signalForm.tp3}
                  onChange={(e) => setSignalForm({ ...signalForm, tp3: e.target.value })}
                  className="bg-[#121003] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Analyst Technical Note</label>
                <input
                  type="text"
                  placeholder="e.g. 4H Order block reaction..."
                  value={signalForm.notes}
                  onChange={(e) => setSignalForm({ ...signalForm, notes: e.target.value })}
                  className="w-full bg-[#121003] border border-amber-400/30 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer flex items-center justify-center gap-2 mt-3 shadow-[0_0_20px_rgba(251,191,36,0.4)]"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>{editingSignalId ? 'Save Signal Changes' : 'Publish Signal Now'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSignals;