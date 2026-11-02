import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  PlayCircle,
  Lock,
  Unlock,
  CreditCard,
  QrCode,
  X,
  Upload,
  Heart,
  MessageSquare,
  Send,
  BookOpen,
  ArrowLeft,
  Video
} from 'lucide-react';



import { useAppContext } from '../../../context/AppContext.jsx';

const CourseDetail = () => {
  const { id } = useParams();
  const { academyCourses } = useAppContext();
  const course = academyCourses.find((item) => item.id === id);
  
  // Interactive States
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProofStep, setIsProofStep] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => course?.likesCount || 0);

  // Comments Engine State
  const [comments, setComments] = useState(() => course?.comments || []);
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!course) return null;

  const openPaymentModal = () => {
    setIsProofStep(false);
    setPaymentProof(null);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'qr' && !paymentProof) {
      toast.error('Please upload your payment screenshot or slip to continue.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaymentModalOpen(false);
      setIsPurchased(true);
      setCardDetails({ name: '', cardNumber: '', expiry: '', cvv: '' });
      setPaymentProof(null);
      setIsProofStep(false);
      toast.success(`Payment successful! You are enrolled in ${course.title}.`);
    }, 2000);
  };

  // Like Toggle Handler
  const handleLikeToggle = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  // Add Comment Handler
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim() || !commentText.trim()) return;

    const newComment = {
      id: `c_${Date.now()}`,
      userName: userName,
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      date: 'Just now',
      comment: commentText
    };

    setComments([newComment, ...comments]);
    setUserName('');
    setCommentText('');
  };

  // Helper function to render embed frame for YouTube, Drive, Instagram, TikTok
  const renderVideoEmbed = (url) => {
    if (!url) return null;

    // Google Drive Conversion
    let embedSrc = url;
    if (url.includes('drive.google.com') && !url.includes('/preview')) {
      embedSrc = url.replace(/\/view.*$/, '/preview');
    }

    return (
      <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden border border-[#a3e635]/30 shadow-2xl relative z-10">
        <iframe
          src={embedSrc}
          title={course.title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const currentModule = course.modules[activeModuleIndex] || course.modules[0];

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-10">
          
          {/* Back Navigation */}
          <Link
            to="/academy"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#040e04] border border-[#a3e635]/20 text-xs font-bold text-gray-300 hover:text-white hover:border-[#a3e635]/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#a3e635]" />
            <span>Back to Academy Catalog</span>
          </Link>

          {/* ---------------- 1. COURSE HEADER & PURCHASE STATE BAR ---------------- */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-black uppercase">
                  {course.category}
                </span>
                <span className="text-xs text-gray-400 font-bold">{course.level}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                {course.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {course.shortDesc}
              </p>
            </div>

            {/* Price & Purchase Action Box */}
            <div className="p-6 rounded-2xl bg-[#081806] border border-[#a3e635]/30 text-center space-y-4 shrink-0">
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Course Price</div>
                <div className="text-2xl font-black text-[#a3e635]">{course.pricePKR}</div>
                <div className="text-xs text-gray-400 font-bold">({course.priceUSD})</div>
              </div>

              {isPurchased ? (
                <div className="px-6 py-3 rounded-xl bg-[#a3e635]/20 text-[#a3e635] border border-[#a3e635]/40 text-xs font-extrabold flex items-center gap-2">
                  <Unlock className="w-4 h-4" />
                  <span>UNLOCKED & ENROLLED</span>
                </div>
              ) : (
                <button
                  onClick={openPaymentModal}
                  className="w-full px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(163,230,53,0.5)] hover:scale-105 transition-all cursor-pointer"
                >
                  ENROLL & UNLOCK COURSE
                </button>
              )}
            </div>
          </div>

          {/* ---------------- 2. VIDEO PLAYER & LECTURES LIST ---------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Video Player */}
            <div className="lg:col-span-8 space-y-4">
              {isPurchased ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#040e04] border border-[#a3e635]/30 flex items-center justify-between text-xs font-extrabold text-white">
                    <span className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#a3e635]" />
                      Currently Playing: {currentModule?.title}
                    </span>
                    <span className="text-[10px] font-bold text-[#a3e635] uppercase">
                      HD Stream Active
                    </span>
                  </div>

                  {renderVideoEmbed(currentModule?.videoUrl)}
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border border-[#a3e635]/30 shadow-2xl group">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-[380px] object-cover filter blur-sm brightness-50"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3 z-10">
                    <Lock className="w-12 h-12 text-[#a3e635] animate-bounce" />
                    <h3 className="text-xl font-black text-white">Lectures Are Locked</h3>
                    <p className="text-xs text-gray-300 max-w-sm">
                      Please enroll in the course to unlock HD video streams, source codes, and direct instructor Q&A.
                    </p>
                    <button
                      onClick={openPaymentModal}
                      className="px-6 py-2.5 rounded-xl bg-[#a3e635] text-black font-extrabold text-xs shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    >
                      Enroll Now To Watch
                    </button>
                  </div>
                </div>
              )}

              {/* Like Button & Interactive Counter */}
              <div className="p-4 rounded-2xl bg-[#040e04] border border-[#a3e635]/20 flex items-center justify-between">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                    liked
                      ? 'bg-[#a3e635] text-black border-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.5)]'
                      : 'bg-[#081806] text-gray-300 border-[#a3e635]/30 hover:border-[#a3e635] hover:text-[#a3e635]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-black' : ''}`} />
                  <span>{likeCount} Likes</span>
                </button>

                <div className="text-xs text-gray-400 font-bold">
                  {comments.length} Discussion Comments
                </div>
              </div>
            </div>

            {/* Right: Modules & Playlist */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-3xl bg-[#040e04] border border-[#a3e635]/30 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#a3e635]" />
                  Course Content ({course.modules.length} Modules)
                </h3>

                <div className="space-y-2">
                  {course.modules.map((mod, idx) => (
                    <button
                      key={idx}
                      onClick={() => isPurchased && setActiveModuleIndex(idx)}
                      disabled={!isPurchased}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeModuleIndex === idx && isPurchased
                          ? 'bg-[#a3e635]/20 border-[#a3e635] text-white shadow-md'
                          : 'bg-[#081806] border-[#a3e635]/20 text-gray-300 hover:border-[#a3e635]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <PlayCircle className={`w-4 h-4 ${activeModuleIndex === idx && isPurchased ? 'text-[#a3e635]' : 'text-gray-500'}`} />
                        <span className="text-xs font-extrabold line-clamp-1">{mod.title}</span>
                      </div>

                      {isPurchased ? (
                        <Unlock className="w-3.5 h-3.5 text-[#a3e635] shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ---------------- 3. LIKE & COMMENT DISCUSSION SECTION ---------------- */}
          <div className="space-y-8 bg-[#040e04]/90 border border-[#a3e635]/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#a3e635]" />
              Student Feedback & Discussion ({comments.length})
            </h3>

            {/* Comment Post Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-4 bg-[#020602] p-5 rounded-2xl border border-[#a3e635]/20">
              <input
                type="text"
                required
                placeholder="Your Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]"
              />

              <textarea
                rows="3"
                required
                placeholder="Ask a question or leave your course review..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]"
              ></textarea>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(163,230,53,0.4)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#081806]/60 border border-[#a3e635]/15 flex items-start gap-3">
                  <img
                    src={c.userAvatar}
                    alt={c.userName}
                    className="w-10 h-10 rounded-xl object-cover border border-[#a3e635]/30 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-extrabold text-white">{c.userName}</h5>
                      <span className="text-[10px] text-gray-500 font-bold">{c.date}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{c.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#040e04] border border-[#a3e635]/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(163,230,53,0.3)] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#a3e635]/20 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-[10px] font-black uppercase">
                  Course Checkout
                </span>
                <h3 className="text-xl font-black text-white mt-1">{course.title}</h3>
                <p className="text-sm font-bold text-[#a3e635] mt-1">{course.pricePKR}</p>
              </div>
              <button
                type="button"
                aria-label="Close checkout"
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-2 rounded-xl bg-[#081806] text-gray-400 hover:text-white border border-[#a3e635]/30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

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
                onClick={() => {
                  setPaymentMethod('qr');
                  setIsProofStep(false);
                }}
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

            {paymentMethod === 'card' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Cardholder Name *</label>
                  <input
                    type="text"
                    required
                    autoComplete="cc-name"
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
                    autoComplete="cc-number"
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
                      autoComplete="cc-exp"
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
                      autoComplete="cc-csc"
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
                  className="w-full py-3.5 rounded-xl bg-[#a3e635] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(163,230,53,0.5)] hover:bg-[#84cc16] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Payment...' : `Pay ${course.pricePKR} Securely`}</span>
                </button>
              </form>
            )}

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
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Investrade_Academy_${course.id}_${course.pricePKR}`}
                      alt="Course payment QR code"
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

export default CourseDetail;