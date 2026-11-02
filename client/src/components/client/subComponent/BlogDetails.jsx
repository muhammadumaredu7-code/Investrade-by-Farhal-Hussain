import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Share2,
  Clock,
  Calendar,
  User,
  Sparkles,
  ArrowRight,
  Send,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';

import { useAppContext } from '../../../context/AppContext.jsx';

const BlogDetail = () => {
  const { id } = useParams(); // URL parameter se ID milegi, warna default blog 1 select hoga
  const { siteContent } = useAppContext();
  const allBlogs = siteContent.blogs;
  const blog = allBlogs.find((item) => item.id === id) || allBlogs[0];
  
  // Interactive States
  const [blogInteractions, setBlogInteractions] = useState({});
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const interaction = blogInteractions[blog?.id] || {};
  const liked = interaction.liked || false;
  const likeCount = interaction.likeCount ?? blog?.likesCount ?? 0;
  const comments = interaction.comments ?? blog?.comments ?? [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!blog) return null;

  // Like Toggle Handler
  const handleLike = () => {
    const nextLiked = !liked;
    setBlogInteractions((current) => ({
      ...current,
      [blog.id]: {
        ...current[blog.id],
        liked: nextLiked,
        likeCount: likeCount + (nextLiked ? 1 : -1)
      }
    }));
  };

  // Add Comment Handler
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const commentObj = {
      id: `c_${Date.now()}`,
      userName: newCommentName,
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      date: 'Just now',
      comment: newCommentText
    };

    setBlogInteractions((current) => ({
      ...current,
      [blog.id]: {
        ...current[blog.id],
        comments: [commentObj, ...comments]
      }
    }));
    setNewCommentName('');
    setNewCommentText('');
  };

  // Filter Related Blogs (Exclude current blog)
  const relatedBlogs = allBlogs.filter((b) => b.id !== blog.id).slice(0, 6);

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">
    

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Background Glowing Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-12">
          
          {/* ---------------- 1. BLOG HEADER / METADATA ---------------- */}
          <div className="space-y-6">
            
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                {blog.category}
              </span>
              {blog.badge && (
                <span className="px-3 py-1 rounded-full bg-[#081b08] border border-[#a3e635]/40 text-white text-[10px] font-black uppercase">
                  <Sparkles className="w-3 h-3 text-[#a3e635] inline mr-1" />
                  {blog.badge}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.2]">
              {blog.title}
            </h1>

            {/* Author Profile Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#040e04] border border-[#a3e635]/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <img
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#a3e635]/40 shadow-lg"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    {blog.author.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#a3e635] fill-black" />
                  </h4>
                  <p className="text-xs text-[#a3e635] font-semibold">{blog.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-[#a3e635]" /> {blog.publishDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#a3e635]" /> {blog.readTime}
                </span>
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2 rounded-xl border transition-colors ${
                    bookmarked
                      ? 'bg-[#a3e635] text-black border-[#a3e635]'
                      : 'bg-[#081806] text-gray-300 border-[#a3e635]/30 hover:border-[#a3e635]'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* ---------------- 2. MEDIA SECTION (IMAGE / VIDEO) ---------------- */}
          <div className="relative rounded-3xl overflow-hidden border border-[#a3e635]/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#a3e635]/30 to-[#84cc16]/20 blur-xl opacity-50 pointer-events-none"></div>

            {blog.mediaType === 'video' ? (
              <div className="aspect-video w-full bg-black relative z-10">
                <iframe
                  src={blog.mediaUrl}
                  title={blog.title}
                  className="w-full h-full rounded-3xl border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img
                src={blog.mediaUrl}
                alt={blog.title}
                className="w-full h-[380px] sm:h-[480px] object-cover relative z-10 group-hover:scale-105 transition-transform duration-700"
              />
            )}
          </div>

          {/* ---------------- 3. BLOG MAIN CONTENT ---------------- */}
          <div className="bg-[#040e04]/90 border border-[#a3e635]/25 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed text-justify">
            <p className="text-base sm:text-lg font-bold text-white border-l-4 border-[#a3e635] pl-4 italic bg-[#a3e635]/5 py-2 rounded-r-xl">
              "{blog.shortDesc}"
            </p>

            <div className="whitespace-pre-line space-y-4 font-normal">
              {blog.content}
            </div>

            {/* Interactive Like & Share Bar */}
            <div className="pt-6 border-t border-[#a3e635]/20 flex items-center justify-between">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border text-xs font-extrabold transition-all duration-300 shadow-lg ${
                  liked
                    ? 'bg-[#a3e635] text-black border-[#a3e635] shadow-[0_0_20px_rgba(163,230,53,0.5)]'
                    : 'bg-[#081806] text-gray-300 border-[#a3e635]/30 hover:border-[#a3e635] hover:text-[#a3e635]'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-black' : ''}`} />
                <span>{likeCount} Likes</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-bold hidden sm:inline">Share Article:</span>
                <button className="p-2.5 rounded-xl bg-[#081806] hover:bg-[#a3e635] text-gray-300 hover:text-black border border-[#a3e635]/30 hover:border-[#a3e635] transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- 4. COMMENTS SECTION ---------------- */}
          <div className="space-y-8 bg-[#040e04]/80 border border-[#a3e635]/20 rounded-3xl p-6 sm:p-8">
            <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#a3e635]" />
              Discussion ({comments.length})
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-4 bg-[#020602] p-5 rounded-2xl border border-[#a3e635]/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]"
                />
              </div>

              <textarea
                rows="3"
                placeholder="Share your thoughts or technical analysis..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]"
              ></textarea>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(163,230,53,0.4)]"
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
                    className="w-10 h-10 rounded-xl object-cover border border-[#a3e635]/30"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-white">{c.userName}</h5>
                      <span className="text-[10px] text-gray-500">{c.date}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{c.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- 5. RELATED BLOGS GRID ---------------- */}
          <div className="space-y-8 pt-8 border-t border-[#a3e635]/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Related <span className="text-[#a3e635]">Market Insights</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Explore 10+ research articles and market breakdowns.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((item) => (
                <Link
                  key={item.id}
                  to={`/blog/${item.id}`}
                  className="rounded-3xl bg-[#040e04] border border-[#a3e635]/20 overflow-hidden hover:border-[#a3e635]/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail Image */}
                    <div className="h-44 w-full overflow-hidden relative">
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#a3e635] text-[10px] font-extrabold border border-[#a3e635]/30">
                        {item.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold">
                        <span>{item.publishDate}</span>
                        <span>•</span>
                        <span>{item.readTime}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-white group-hover:text-[#a3e635] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {item.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="px-5 py-3 border-t border-[#a3e635]/15 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1.5 font-bold text-gray-300">
                      <User className="w-3.5 h-3.5 text-[#a3e635]" />
                      {item.author.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#a3e635] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>

      
    </div>
  );
};

export default BlogDetail;