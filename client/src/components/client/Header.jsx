import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react';
import {
  Search,
  Globe,
  TrendingUp,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  UserRound,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

import logo from '../../assets/logo2.png';
import { useAppContext } from '../../context/AppContext';

const Header = () => {
  const { siteContent } = useAppContext();
  const headerData = siteContent.headerData || {};
  const navigation = (siteContent.navigation || []).filter((item) => (
    item.href !== '/dashboard/products'
    && item.name?.trim().toLowerCase() !== 'my products'
  ));
  const logoSource = headerData.logoUrl || logo;
  const { isLoaded, isSignedIn, user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [failedLogoSource, setFailedLogoSource] = useState('');
  const logoError = failedLogoSource === logoSource;

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="w-full bg-[#030706] text-white font-sans fixed top-0 left-0 z-50 transition-all duration-300 select-none border-b border-emerald-950/40">
      
      {/* ---------------- MAIN HEADER NAVIGATION ---------------- */}
      <nav
        className={`w-full px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-[#030706]/90 backdrop-blur-xl shadow-lg shadow-emerald-950/20'
            : 'py-4 bg-[#030706]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* 1. LOGO SECTION */}
          <div className="flex items-center gap-8">
            <Link
              to="/home"
              aria-label="Investrade home"
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveDropdown(null);
              }}
              className="flex items-center gap-3 group relative"
            >
              {/* Green Theme Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600/30 to-green-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {!logoError ? (
                <img
                  src={logoSource}
                  alt={headerData.logoAlt || 'Investrade Logo'}
                  className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 relative z-10"
                  onError={() => setFailedLogoSource(logoSource)}
                />
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-2xl tracking-wide relative z-10">
                  <div className="bg-[#a3e635]/20 p-2 rounded-xl border border-emerald-500/40 text-emerald-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span>{headerData.fallbackBrandName || 'Investrade'}</span>
                </div>
              )}
            </Link>

            {/* 2. DESKTOP NAVIGATION LINKS */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((nav, idx) => (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(nav.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {nav.type === 'link' ? (
                    nav.href?.startsWith('/') ? (
                      <Link
                        to={nav.href}
                        className="flex items-center gap-1.5 border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#a3e635] hover:border-[#a3e635] rounded-lg transition-all duration-200"
                      >
                        {nav.name}
                      </Link>
                    ) : (
                      <a
                        href={nav.href || '#'}
                        className="flex items-center gap-1.5 border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#a3e635] hover:border-[#a3e635] rounded-lg transition-all duration-200"
                      >
                        {nav.name}
                      </a>
                    )
                  ) : (
                    <button className="flex items-center gap-1.5 border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#a3e635] hover:border-[#a3e635] rounded-lg transition-all duration-200">
                      {nav.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === nav.name ? 'rotate-180 text-emerald-400' : 'text-gray-500'
                        }`}
                      />
                    </button>
                  )}

                  {/* SIMPLE DROPDOWN MENU */}
                  {nav.type === 'dropdown' && activeDropdown === nav.name && (
                    <div className="absolute top-full left-0 w-64 bg-[#06110a] border border-emerald-900/40 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                      {nav.items.map((item, i) => {
                        const ItemLink = item.href?.startsWith('/') ? Link : 'a';
                        const linkProps = item.href?.startsWith('/')
                          ? { to: item.href }
                          : { href: item.href || '#' };
                        return (
                          <ItemLink
                            key={i}
                            {...linkProps}
                            onClick={() => setActiveDropdown(null)}
                            className="flex flex-col rounded-lg p-2.5 transition-transform duration-200 hover:translate-x-1 group/item"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-200 group-hover/item:text-emerald-400 transition-colors">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#a3e635]/20 text-emerald-400 border border-emerald-500/30">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                          </ItemLink>
                        );
                      })}
                    </div>
                  )}

                  {/* MEGA MENU */}
                  {nav.type === 'mega' && activeDropdown === nav.name && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[600px] bg-[#06110a] border border-emerald-900/40 rounded-2xl shadow-2xl p-5 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 grid grid-cols-2 gap-2">
                          {nav.items.map((item, i) => (
                            <a
                              key={i}
                              href="#"
                              className="p-3 rounded-xl border border-transparent hover:border-[#a3e635]/40 hover:-translate-y-0.5 transition-all group/mega"
                            >
                              <div className="text-sm font-semibold text-gray-200 group-hover/mega:text-emerald-400 transition-colors">
                                {item.title}
                              </div>
                              <div className="text-xs text-gray-400 mt-1 leading-snug">
                                {item.desc}
                              </div>
                            </a>
                          ))}
                        </div>

                        {/* Mega Menu Featured Card */}
                        {nav.featured && (
                          <div className="bg-gradient-to-br from-emerald-950/60 to-black p-4 rounded-xl border border-emerald-800/40 flex flex-col justify-between">
                            <div>
                              <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#a3e635]/20 text-emerald-400 border border-emerald-500/30 mb-2">
                                <Sparkles className="w-3 h-3 text-amber-300" /> FEATURED
                              </div>
                              <h4 className="text-sm font-bold text-white mb-1">
                                {nav.featured.title}
                              </h4>
                              <p className="text-xs text-gray-400 leading-relaxed">
                                {nav.featured.desc}
                              </p>
                            </div>
                            <a
                              href="#"
                              className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 gap-1 group/btn"
                            >
                              Explore Now
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. RIGHT CONTROLS & CTA */}
          <div className="flex items-center gap-3">
            {/* Command Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#0b1a11] border border-emerald-900/50 hover:border-[#a3e635]/60 hover:text-white hover:shadow-[0_0_16px_rgba(163,230,53,0.12)] text-gray-400 rounded-lg transition-all text-xs"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span>Search market...</span>
              <kbd className="bg-black/60 text-[10px] text-emerald-500/80 px-1.5 py-0.5 rounded border border-emerald-900/60">
                Ctrl K
              </kbd>
            </button>

            {/* Language Selector */}
            <button className="hidden sm:flex items-center p-2 text-gray-400 hover:text-[#a3e635] hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(163,230,53,0.55)] rounded-lg transition-all">
              <Globe className="w-4 h-4 text-sky-400" />
            </button>

            {isLoaded && (isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-10 w-10 border border-[#a3e635]/30',
                    userButtonPopoverCard: 'border border-emerald-900/50 bg-[#07100b]'
                  }
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal" fallbackRedirectUrl="/home">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-900/50 px-3 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-[#a3e635]/60 hover:text-[#a3e635]"
                  >
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/home">
                  <button
                    type="button"
                    className="rounded-lg bg-gradient-to-r from-[#a3e635] to-[#bef264] px-3 py-2 text-xs font-bold text-black transition-transform hover:-translate-y-0.5"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            ))}

            {isSignedIn && ['admin', 'client'].includes(user?.publicMetadata?.role) && (
              <Link
                to={user.publicMetadata.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                aria-label={user.publicMetadata.role === 'admin' ? 'Open Admin Panel' : 'Open Dashboard'}
                className="relative inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-black rounded-lg bg-gradient-to-r from-[#a3e635] to-[#bef264] transition-all duration-300 shadow-md shadow-emerald-500/20 hover:shadow-[0_0_22px_rgba(163,230,53,0.45)] hover:-translate-y-0.5"
              >
                {user.publicMetadata.role === 'admin'
                  ? <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  : <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />}
                {user.publicMetadata.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-[#a3e635] hover:scale-110 transition-transform"
            >
              {mobileMenuOpen
                ? <X className="w-6 h-6 text-rose-400" />
                : <Menu className="w-6 h-6 text-sky-300" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ---------------- MOBILE RESPONSIVE DRAWER ---------------- */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#030706] border-b border-emerald-900/40 px-4 pt-2 pb-6 space-y-3 animate-in fade-in duration-200">
          {/* Mobile Search Button */}
          <button
            onClick={() => {
              setSearchOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#0a1710] border border-emerald-900/50 rounded-xl text-gray-400 text-xs"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-sky-400" /> Search assets or items...
            </span>
            <kbd className="bg-black text-[10px] text-emerald-400 px-1.5 py-0.5 rounded">Ctrl K</kbd>
          </button>

          {/* Navigation Accordion */}
          <div className="space-y-1">
            {navigation.map((nav, idx) => (
              <div key={idx} className="border-b border-emerald-950/60 pb-1">
                {nav.type === 'link' ? (
                  nav.href?.startsWith('/') ? (
                    <Link
                      to={nav.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 text-sm font-semibold text-gray-300 hover:text-emerald-400"
                    >
                      {nav.name}
                    </Link>
                  ) : (
                    <a
                      href={nav.href || '#'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 text-sm font-semibold text-gray-300 hover:text-emerald-400"
                    >
                      {nav.name}
                    </a>
                  )
                ) : (
                  <div>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === nav.name ? null : nav.name)}
                      className="w-full flex items-center justify-between py-2 px-3 text-sm font-semibold text-gray-300 hover:text-emerald-400"
                    >
                      {nav.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === nav.name ? 'rotate-180 text-emerald-400' : 'text-gray-500'
                        }`}
                      />
                    </button>

                    {activeDropdown === nav.name && (
                      <div className="pl-4 pr-2 py-2 space-y-2 bg-[#06110a] rounded-lg my-1">
                        {nav.items.map((item, i) => {
                          const ItemLink = item.href?.startsWith('/') ? Link : 'a';
                          const linkProps = item.href?.startsWith('/')
                            ? { to: item.href }
                            : { href: item.href || '#' };
                          return (
                            <ItemLink
                              key={i}
                              {...linkProps}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setActiveDropdown(null);
                              }}
                              className="block py-1.5 text-xs text-gray-300 hover:text-emerald-400"
                            >
                              <div className="font-semibold">{item.title}</div>
                              {item.desc && <div className="text-[10px] text-gray-500">{item.desc}</div>}
                            </ItemLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- COMMAND SEARCH MODAL OVERLAY ---------------- */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl bg-[#06110a] border border-emerald-800/50 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-emerald-900/40">
              <Search className="w-5 h-5 text-sky-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search coins, indices, features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestions / Results */}
            <div className="p-4 space-y-3">
              <div className="text-[11px] font-semibold text-emerald-500/80 uppercase tracking-wider">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {['Bitcoin Spot', 'Ethereum Futures', 'NVDA Stock', 'Gold Spot', '100x Leverage'].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1.5 rounded-lg bg-[#a3e635]/40 border border-emerald-900/40 hover:border-[#a3e635] hover:text-[#a3e635] hover:-translate-y-0.5 text-xs text-gray-300 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-[#030805] px-4 py-2.5 border-t border-emerald-950 text-[11px] text-gray-500 flex justify-between items-center">
              <span>Press ESC to close</span>
              <span className="text-emerald-500/80">Investrade Market Engine</span>
            </div>
          </div>
        </div>
      )}

      {/* Marquee Animation Dynamic Style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;