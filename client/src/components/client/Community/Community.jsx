import { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  Send,
  CheckCircle2,
  PlusCircle,
  Check
} from 'lucide-react';

import { useAppContext } from '../../../context/AppContext.jsx';

const Community = () => {
  const { siteContent } = useAppContext();
  const data = siteContent.communityPage;
  const [posts, setPosts] = useState(() => data.initialPosts || []);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // New Post Form State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Technical Analysis');
  const [newPostImage, setNewPostImage] = useState('');
  const [authorName, setAuthorName] = useState('');

  // Comment Input States (keyed by postId)
  const [commentInputs, setCommentInputs] = useState({});
  const [commentNameInputs, setCommentNameInputs] = useState({});

  // Active Comment Box Toggle (keyed by postId)
  const [openCommentBox, setOpenCommentBox] = useState({});

  // Share Toast Notification State
  const [copiedPostId, setCopiedPostId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  const categories = ['All', 'Technical Analysis', 'PSX Discussion', 'Forex Signals', 'General Market'];

  // Handle New Post Creation
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || !authorName.trim()) return;

    const createdPost = {
      id: `post_${Date.now()}`,
      author: {
        name: authorName,
        role: 'Verified Trader',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        isVerified: false
      },
      category: newPostCategory,
      time: 'Just now',
      content: newPostContent,
      image: newPostImage.trim() || null,
      likesCount: 0,
      isLiked: false,
      comments: []
    };

    setPosts([createdPost, ...posts]);
    setNewPostContent('');
    setNewPostImage('');
    setAuthorName('');
  };

  // Toggle Like Handler
  const handleToggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked: isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1
          };
        }
        return post;
      })
    );
  };

  // Add Comment Handler
  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    const cName = commentNameInputs[postId] || 'Anonymous Trader';

    if (!commentText || !commentText.trim()) return;

    const newCommentObj = {
      id: `c_${Date.now()}`,
      userName: cName,
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      time: 'Just now',
      text: commentText
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj]
          };
        }
        return post;
      })
    );

    // Clear Inputs for this specific post
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setCommentNameInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  // Handle Share Post (Copy Link to Clipboard)
  const handleSharePost = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/community#${postId}`);
    setCopiedPostId(postId);
    setTimeout(() => {
      setCopiedPostId(null);
    }, 3000);
  };

  // Filtered Posts
  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-12">
          
          {/* ---------------- 1. PAGE HEADER ---------------- */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(163,230,53,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Investrade <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.5)]">Community</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {data.subheading}
            </p>
          </div>

          {/* ---------------- 2. CREATE NEW POST BOX ---------------- */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#a3e635]/20 pb-3">
              <PlusCircle className="w-5 h-5 text-[#a3e635]" />
              <h3 className="text-base font-black text-white">Share Your Trade Setup or Question</h3>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name / Trader Handle *"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]"
                />

                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635] cursor-pointer"
                >
                  <option value="Technical Analysis">Technical Analysis</option>
                  <option value="PSX Discussion">PSX Discussion</option>
                  <option value="Forex Signals">Forex Signals</option>
                  <option value="General Market">General Market</option>
                </select>
              </div>

              <textarea
                rows="3"
                required
                placeholder="What is your market bias today? Share entry levels, stop loss, or market news..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]"
              ></textarea>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <input
                  type="url"
                  placeholder="Chart / Image URL (Optional)"
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                  className="w-full sm:w-2/3 bg-[#081806] border border-[#a3e635]/20 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]"
                />

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(163,230,53,0.4)] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Post</span>
                </button>
              </div>
            </form>
          </div>

          {/* ---------------- 3. CATEGORY FILTERS ---------------- */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.5)] scale-105'
                    : 'bg-[#040e04] text-gray-400 hover:text-white border border-[#a3e635]/20 hover:border-[#a3e635]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ---------------- 4. COMMUNITY POSTS FEED ---------------- */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                id={post.id}
                className="p-6 sm:p-8 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/25 shadow-xl backdrop-blur-xl space-y-5 hover:border-[#a3e635]/50 transition-all"
              >
                {/* Author Info Bar */}
                <div className="flex items-center justify-between border-b border-[#a3e635]/15 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-11 h-11 rounded-2xl object-cover border-2 border-[#a3e635]/40 shadow-md"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                        {post.author.name}
                        {post.author.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#a3e635] fill-black" />
                        )}
                      </h4>
                      <p className="text-[11px] text-[#a3e635] font-semibold">{post.author.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-[10px] font-black uppercase">
                      {post.category}
                    </span>
                    <div className="text-[10px] text-gray-500 font-bold mt-1">{post.time}</div>
                  </div>
                </div>

                {/* Content Text */}
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                  {post.content}
                </p>

                {/* Optional Chart Image */}
                {post.image && (
                  <div className="rounded-2xl overflow-hidden border border-[#a3e635]/20 shadow-lg max-h-96">
                    <img
                      src={post.image}
                      alt="Trade Chart"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Actions Bar (Like, Comment, Share) */}
                <div className="pt-4 border-t border-[#a3e635]/15 flex items-center justify-between text-xs font-bold text-gray-300">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                        post.isLiked
                          ? 'bg-[#a3e635] text-black border-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.5)]'
                          : 'bg-[#081806] border-[#a3e635]/30 hover:border-[#a3e635] hover:text-[#a3e635]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-black' : ''}`} />
                      <span>{post.likesCount} Likes</span>
                    </button>

                    {/* Toggle Comment Section */}
                    <button
                      onClick={() =>
                        setOpenCommentBox((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id]
                        }))
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#081806] border border-[#a3e635]/30 hover:border-[#a3e635] hover:text-[#a3e635] transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#a3e635]" />
                      <span>{post.comments.length} Comments</span>
                    </button>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={() => handleSharePost(post.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#081806] border border-[#a3e635]/30 hover:border-[#a3e635] hover:text-[#a3e635] transition-all cursor-pointer"
                  >
                    {copiedPostId === post.id ? (
                      <>
                        <Check className="w-4 h-4 text-[#a3e635]" />
                        <span className="text-[#a3e635]">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-[#a3e635]" />
                        <span className="hidden sm:inline">Share</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Expandable Comments Section */}
                {openCommentBox[post.id] && (
                  <div className="pt-4 space-y-4 border-t border-[#a3e635]/10 animate-in fade-in duration-300">
                    
                    {/* Add Comment Form */}
                    <form
                      onSubmit={(e) => handleAddComment(post.id, e)}
                      className="space-y-3 bg-[#020602] p-4 rounded-2xl border border-[#a3e635]/20"
                    >
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Ali)"
                        value={commentNameInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentNameInputs({
                            ...commentNameInputs,
                            [post.id]: e.target.value
                          })
                        }
                        className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]"
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Write a comment..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs({
                              ...commentInputs,
                              [post.id]: e.target.value
                            })
                          }
                          className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]"
                        />

                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#a3e635] text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-[#84cc16] transition-colors cursor-pointer shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3.5 rounded-2xl bg-[#081806]/80 border border-[#a3e635]/15 flex items-start gap-3"
                        >
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="w-8 h-8 rounded-xl object-cover border border-[#a3e635]/30 shrink-0"
                          />
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-black text-white">{comment.userName}</h5>
                              <span className="text-[10px] text-gray-500">{comment.time}</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
};

export default Community;