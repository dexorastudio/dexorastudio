import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { NAV_LINKS } from '../config/agency';
import { DexoraLogo } from './DexoraLogo';
import { CustomButton } from './CustomButton';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'pt-2.5 sm:pt-3 px-2.5 sm:px-6 lg:px-10'
            : 'pt-3 sm:pt-4 lg:pt-5 px-2.5 sm:px-6 lg:px-10'
        }`}
      >
        <div
          className={`relative mx-auto w-full max-w-[1260px] min-w-0 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 pl-3.5 pr-2 min-[390px]:pl-4 min-[390px]:pr-2.5 sm:pl-6 sm:pr-3 lg:pl-7 lg:pr-3 py-1.5 sm:py-2 rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-[#08080A]/86 backdrop-blur-xl border border-[#D4D4D8]/22 shadow-[inset_0_1px_0_rgba(245,241,232,0.08),0_16px_44px_rgba(0,0,0,0.78),0_0_32px_rgba(201,169,110,0.1)]'
              : 'bg-[#08080A]/68 backdrop-blur-lg border border-[#D4D4D8]/16 shadow-[inset_0_1px_0_rgba(245,241,232,0.06),0_12px_34px_rgba(0,0,0,0.62),0_0_26px_rgba(201,169,110,0.07)]'
          }`}
        >
          {/* Subtle top champagne-gold hairline shimmer inside the glass pill */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 -top-[1px] h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/45 to-transparent"
          />

          {/* Zone 1: Brand Lockup (original cutout logo + wordmark) */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#home');
            }}
            className="min-w-0 flex items-center py-0.5 focus-visible:outline-2 focus-visible:outline-[#C9A96E] rounded-full"
            aria-label="DEXORA STUDIO Home"
          >
            <DexoraLogo size="nav" showWordmark />
          </a>

          {/* Zone 2: Desktop single-line navigation links (1024px+) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 xl:gap-9 shrink-0"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="group relative py-1.5 text-sm font-medium text-[#D4D4D8] hover:text-[#F5F1E8] transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0.5 left-0 h-[1px] w-0 bg-[#C9A96E] transition-all duration-200 group-hover:w-full"
                />
              </a>
            ))}
          </nav>

          {/* Zone 3: Champagne-Gold Pill CTA + Circular Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Visible from 390px+ and inside the mobile drawer for narrower screens (320px-389px) */}
            <CustomButton
              variant="primary"
              size="sm"
              rounded="full"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#contact');
              }}
              className="hidden min-[390px]:inline-flex px-3! min-[420px]:px-3.5! sm:px-5! py-1.5! sm:py-2! min-h-[36px]! sm:min-h-[40px]! text-[11px]! sm:text-xs! shadow-[0_4px_20px_rgba(201,169,110,0.26)] hover:shadow-[0_8px_26px_rgba(232,213,172,0.36)] hover:-translate-y-0.5"
            >
              <span>Start a Project</span>
              <ArrowRight
                aria-hidden="true"
                className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </CustomButton>

            {/* Circular Luxury Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`group lg:hidden relative inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full border bg-[#0B0B0D]/95 transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C9A96E] ${
                mobileOpen
                  ? 'border-[#C9A96E]/75 shadow-[0_0_18px_rgba(201,169,110,0.22)]'
                  : 'border-[#D4D4D8]/22 hover:border-[#C9A96E]/65 hover:shadow-[0_0_16px_rgba(201,169,110,0.16)]'
              }`}
            >
              <span className="relative flex h-3.5 w-4 flex-col items-center justify-center">
                <span
                  aria-hidden="true"
                  className={`absolute h-[1.5px] w-4 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    mobileOpen
                      ? 'translate-y-0 rotate-45 bg-[#E8D5AC]'
                      : '-translate-y-[5px] bg-[#D4D4D8] group-hover:bg-[#E8D5AC]'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute h-[1.5px] w-3 rounded-full transition-all duration-200 ${
                    mobileOpen
                      ? 'opacity-0 scale-x-0 bg-[#E8D5AC]'
                      : 'opacity-100 scale-x-100 bg-[#D4D4D8] group-hover:w-4 group-hover:bg-[#E8D5AC]'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute h-[1.5px] w-4 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    mobileOpen
                      ? 'translate-y-0 -rotate-45 bg-[#E8D5AC]'
                      : 'translate-y-[5px] bg-[#D4D4D8] group-hover:bg-[#E8D5AC]'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Navigation Drawer (below 1024px) */}
      <div
        id="mobile-navigation-drawer"
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-30 lg:hidden transition-all duration-300 ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl"
          onClick={() => setMobileOpen(false)}
        />
        <nav
          aria-label="Mobile Navigation"
          className={`relative z-10 flex flex-col justify-between h-full pt-24 sm:pt-28 pb-10 px-6 max-w-md mx-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
          <div className="flex flex-col divide-y divide-[#D4D4D8]/10 border-y border-[#D4D4D8]/10">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                tabIndex={mobileOpen ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="flex items-center justify-between py-5 text-xl font-display font-medium text-[#F5F1E8] hover:text-[#E8D5AC] transition-colors min-h-[48px]"
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs tabular-nums text-[#C9A96E]">
                  0{index + 1}
                </span>
              </a>
            ))}
          </div>

          <div className="pt-8">
            <CustomButton
              variant="primary"
              size="lg"
              rounded="full"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#contact');
              }}
              className="w-full shadow-[0_8px_28px_rgba(201,169,110,0.28)]"
            >
              <span>Start a Project</span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </CustomButton>
          </div>
        </nav>
      </div>
    </>
  );
};
