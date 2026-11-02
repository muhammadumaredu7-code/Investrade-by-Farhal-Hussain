
import { useState } from 'react';

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaWhatsapp,
  FaTelegramPlane,
  FaComments,
  FaExternalLinkAlt,
  FaChevronRight,
  FaChartLine,
  FaShieldAlt
} from 'react-icons/fa';

import logo from '../../assets/logo2.png';
import { useAppContext } from '../../context/AppContext';

const Footer = () => {
  const { siteContent } = useAppContext();
  const footerData = siteContent.footerData;
  const headerData = siteContent.headerData || {};
  const logoSource = headerData.logoUrl || logo;
  const [failedLogoSource, setFailedLogoSource] = useState('');
  const logoError = failedLogoSource === logoSource;

  if (!footerData) return null;

  // Social icons: react-icons only
  const getSocialIcon = (name = '') => {
    const socialName = name.toLowerCase().trim();

    switch (socialName) {
      case 'facebook':
        return FaFacebookF;

      case 'instagram':
        return FaInstagram;

      case 'youtube':
      case 'you tube':
        return FaYoutube;

      case 'whatsapp':
        return FaWhatsapp;

      case 'telegram':
        return FaTelegramPlane;

      case 'community':
      case 'discord':
        return FaComments;

      default:
        return FaEnvelope;
    }
  };

  const getSocialIconStyle = (name = '') => {
    const socialName = name.toLowerCase().trim();

    switch (socialName) {
      case 'facebook':
        return 'border-[#0866ff]/40 bg-[#0866ff] text-white';
      case 'instagram':
        return 'border-[#e1306c]/40 bg-gradient-to-br from-[#feda75] via-[#fa7e1e] to-[#d62976] text-white';
      case 'youtube':
      case 'you tube':
        return 'border-[#ff0000]/40 bg-[#ff0000] text-white';
      case 'whatsapp':
        return 'border-[#25d366]/40 bg-[#25d366] text-white';
      case 'telegram':
        return 'border-[#229ed9]/40 bg-[#229ed9] text-white';
      case 'community':
      case 'discord':
        return 'border-[#5865f2]/40 bg-[#5865f2] text-white';
      default:
        return 'border-sky-400/40 bg-sky-500 text-white';
    }
  };

  const isExternalUrl = (url) =>
    typeof url === 'string' && /^https?:\/\//i.test(url);

  return (
    <footer className="relative w-full overflow-hidden select-none border-t border-emerald-950/80 bg-[#020503] font-sans text-white">

      {/* Background ambient glows */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[#a3e635]/5 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-green-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">

        {/* Main footer grid */}
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* COLUMN 1: ABOUT US & LOGO */}
          <div className="space-y-4 lg:col-span-5">

            <a
              href="/"
              aria-label="Investrade home"
              className="group relative inline-flex items-center gap-3"
            >
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-emerald-500/20 via-green-500/10 to-transparent opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />

              {!logoError ? (
                <img
                  src={logoSource}
                  alt={headerData.logoAlt || footerData.brandName || 'Investrade'}
                  className="relative z-10 h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-11"
                  onError={() => setFailedLogoSource(logoSource)}
                />
              ) : (
                <div className="relative z-10 flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 p-2 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <FaChartLine className="h-6 w-6" />
                  </div>

                  <span>
                    {footerData.brandName || 'Investrade'}
                  </span>
                </div>
              )}
            </a>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-wide text-white">
                {footerData.aboutTitle || 'About Us'}

                <span className="inline-block h-1 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-transparent" />
              </h3>

              <p className="pr-2 text-xs leading-relaxed text-gray-400 sm:pr-6 sm:text-sm">
                {footerData.aboutText}
              </p>

              <a
                href={footerData.aboutLinkHref || '/about'}
                className="group inline-flex items-center gap-1 pt-1 text-xs font-bold text-emerald-400 transition-colors hover:text-emerald-300"
              >
                {footerData.aboutLinkText || 'Read More'}

                <FaChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* COLUMN 2: USEFUL LINKS */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="inline-block border-b border-emerald-900/40 pb-2 text-base font-extrabold tracking-wide text-white">
              {footerData.usefulLinksTitle || 'Useful Links'}
            </h3>

            <ul className="space-y-2.5">
              {(footerData.usefulLinks || []).map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <a
                    href={link.href || '#'}
                    className="group flex items-center gap-1.5 text-xs text-gray-400 transition-all duration-200 hover:text-emerald-400 sm:text-sm"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#a3e635]/0 transition-all duration-200 group-hover:w-2 group-hover:bg-[#a3e635]" />

                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: CONNECT WITH US */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="inline-block border-b border-emerald-900/40 pb-2 text-base font-extrabold tracking-wide text-white">
              {footerData.socialLinksTitle || 'Connect with us'}
            </h3>

            <ul className="space-y-3">
              {(footerData.socialLinks || []).map((social, index) => {
                const Icon = getSocialIcon(social.name);
                const href = social.href || '#';
                const external = isExternalUrl(href);

                return (
                  <li key={`${social.name}-${index}`}>
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      aria-label={social.name || 'Social link'}
                      className="group flex items-center gap-2.5 text-xs text-gray-400 transition-all duration-200 hover:text-emerald-400 sm:text-sm"
                    >
                      <span className={`rounded-lg border p-1.5 shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-transform group-hover:scale-110 ${getSocialIconStyle(social.name)}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>

                      <span className="truncate">
                        {social.handle || social.name}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMN 4: JOIN OUR GROUPS */}
          <div className="space-y-4 lg:col-span-3">
            <h3 className="inline-block border-b border-emerald-900/40 pb-2 text-base font-extrabold tracking-wide text-white">
              {footerData.communityGroupsTitle || 'Join Our Groups'}
            </h3>

            <div className="space-y-2.5">
              {(footerData.communityGroups || []).map((group, index) => {
                const href = group.href || '#';
                const external = isExternalUrl(href);

                return (
                  <a
                    key={`${group.name}-${index}`}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center justify-between rounded-xl border border-emerald-900/40 bg-[#051209] p-2.5 shadow-md transition-all duration-300 hover:border-emerald-600/50 hover:bg-[#a3e635]/40"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="rounded-lg border border-emerald-500/20 bg-[#a3e635]/10 p-1.5 text-emerald-400 transition-transform group-hover:scale-110">
                        <FaComments className="h-4 w-4" />
                      </span>

                      <span className="truncate text-xs font-bold text-gray-300 transition-colors group-hover:text-emerald-400">
                        {group.name}
                      </span>
                    </span>

                    <FaExternalLinkAlt className="ml-2 h-3.5 w-3.5 shrink-0 text-gray-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* DISCLAIMER */}
        <div className="group relative mb-10 rounded-2xl border border-emerald-900/50 bg-[#040e08]/90 p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-emerald-700/60 sm:p-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-emerald-400">
            <FaShieldAlt className="h-4 w-4" />

            <span>{footerData.disclaimerTitle || 'Disclaimer'}</span>
          </div>

          <p className="text-justify text-xs leading-relaxed text-gray-400 sm:text-[13px]">
            <strong className="text-gray-300">{footerData.disclaimerTitle || 'Disclaimer'}: </strong>

            {footerData.disclaimer}
          </p>
        </div>

        {/* COPYRIGHT */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-emerald-950/80 pt-6 text-xs text-gray-500 sm:flex-row">
          <div className="text-center sm:text-left">
            {new Date().getFullYear()} ©{' '}

            <span className="font-bold text-emerald-400">
              {footerData.brandName || 'Investrade'}
            </span>

            {footerData.copyrightSuffix || '. All Rights Reserved.'}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-gray-400 sm:gap-4">
            {(footerData.legalLinks || []).map((link, index) => (
              <span key={`${link.label}-${index}`} className="inline-flex items-center gap-3">
                {index > 0 && <span>•</span>}
                <a href={link.href || '#'} className="transition-colors hover:text-emerald-400">
                  {link.label}
                </a>
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
