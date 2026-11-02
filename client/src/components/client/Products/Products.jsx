import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Package
} from 'lucide-react';

import dummyData from '../../../assets/dummyData.json';
import { useAppContext } from '../../../context/AppContext.jsx';

const Products = () => {
  const data = dummyData.productsPage;
  const [activeCategory, setActiveCategory] = useState('All');
  const { products } = useAppContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return null;

  const categories = ['All', 'Bots & Signals', 'Copy Trading', 'Staking & Earn'];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-14">
          
          {/* ---------------- 1. PAGE HEADER ---------------- */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(163,230,53,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{data.badge}</span>
            </div>

            <div className="flex justify-center">
              <Link
                to="/dashboard/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08] px-5 py-3 text-xs font-extrabold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15 sm:text-sm"
              >
                <Package className="h-4 w-4" />
                View my subscribed products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Investrade <span className="bg-gradient-to-r from-[#a3e635] via-[#bef264] to-[#84cc16] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(163,230,53,0.5)]">FinTech Products</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {data.subheading}
            </p>
          </div>

          {/* ---------------- 2. CATEGORY FILTERS ---------------- */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.5)] scale-105'
                    : 'bg-[#040e04] text-gray-400 hover:text-white border border-[#a3e635]/20 hover:border-[#a3e635]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ---------------- 3. PRODUCTS GRID ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/25 overflow-hidden hover:border-[#a3e635]/60 transition-all duration-500 group hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Media Thumbnail & Badges */}
                  <div className="h-60 w-full overflow-hidden relative">
                    <img
                      src={product.mediaUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040e04] via-transparent to-transparent opacity-90"></div>

                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#a3e635] text-[10px] font-extrabold border border-[#a3e635]/30">
                      {product.category}
                    </span>

                    {product.badge && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#a3e635] text-black text-[10px] font-black uppercase shadow-lg">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-6 sm:p-8 space-y-4 relative z-10 -mt-6">
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#a3e635] transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2">
                      {product.shortDesc}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 pt-2 border-t border-[#a3e635]/15">
                      {product.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#a3e635] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Price & Details Trigger */}
                <div className="px-6 sm:px-8 py-4 border-t border-[#a3e635]/15 bg-[#020802]/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Pricing Model</div>
                    <div className="text-sm font-extrabold text-[#a3e635]">
                      {product.pricingPlans?.[0]?.pricePKR || product.pricePKR}
                      {product.pricingPlans?.[0]?.duration ? ` / ${product.pricingPlans[0].duration}` : ''}
                    </div>
                    {product.pricingPlans?.length > 1 && (
                      <div className="mt-1 text-[10px] text-gray-400">
                        {product.pricingPlans.length} duration options
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-[#a3e635] transition-colors">
                    <span>View Product Details</span>
                    <ArrowRight className="w-4 h-4 text-[#a3e635] group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
};

export default Products;